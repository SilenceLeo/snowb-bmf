/**
 * WebGL-based SDF/MSDF renderer for the preview canvas.
 *
 * Uses an offscreen WebGL canvas to render distance field textures
 * through appropriate shaders, producing crisp anti-aliased glyphs.
 * Results are copied to the main Canvas 2D context via drawImage.
 *
 * KEY DESIGN: The shader runs at the TARGET resolution (dw × dh × renderScale),
 * not the source texture resolution. This is critical — SDF quality comes
 * from evaluating the distance-to-alpha conversion per target pixel.
 * The renderScale factor accounts for preview zoom and devicePixelRatio
 * so the shader evaluates at the actual display resolution.
 */
import type { RenderMode, SdfChannel } from 'src/store/legend/stores/styleStore'

import {
  MSDF_FRAGMENT_SHADER,
  SDF_FRAGMENT_SHADER,
  VERTEX_SHADER,
} from './shaders'

// Channel mode int mapping for SDF shader uniform
const CHANNEL_MODE_MAP: Record<SdfChannel, number> = {
  rgb: 0,
  'rgb-inv': 1,
  alpha: 2,
  'alpha-inv': 3,
}

/** Normalized RGB color [0-1, 0-1, 0-1]. Default black. */
export type NormalizedRgb = [number, number, number]

export interface SdfRenderConfig {
  mode: RenderMode
  distanceRange: number
  sdfChannel: SdfChannel
  /** Text color as normalized RGB. Defaults to black [0, 0, 0]. */
  color?: NormalizedRgb
  /** Render resolution multiplier (previewScale × devicePixelRatio). Defaults to 1. */
  renderScale?: number
}

/** Default text color: black (visible on light preview background). */
const DEFAULT_COLOR: NormalizedRgb = [0, 0, 0]

/**
 * Convert a hex color string (e.g. #FF0000 or #F00) to normalized RGB [0-1].
 * Alpha channel in 8-digit hex (e.g. #FF000080) is ignored — only RGB used.
 * Returns DEFAULT_COLOR (black) for invalid input.
 */
export function hexToNormalizedRgb(hex: string): NormalizedRgb {
  const clean = hex.replace('#', '')
  let r: number, g: number, b: number

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else if (clean.length >= 6) {
    r = parseInt(clean.slice(0, 2), 16)
    g = parseInt(clean.slice(2, 4), 16)
    b = parseInt(clean.slice(4, 6), 16)
  } else {
    return DEFAULT_COLOR
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return DEFAULT_COLOR
  return [r / 255, g / 255, b / 255]
}

export interface GlyphRenderItem {
  /** Source pack canvas containing SDF texture */
  sourceCanvas: HTMLCanvasElement
  /** Source region coordinates (in pack canvas) */
  sx: number
  sy: number
  sw: number
  sh: number
  /** Destination coordinates (in target canvas, logical units) */
  dx: number
  dy: number
  dw: number
  dh: number
}

/**
 * Compile a WebGL shader from source.
 */
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(
      '[SdfShaderRenderer] Shader compile error:',
      gl.getShaderInfoLog(shader),
    )
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/**
 * Link a WebGL program from vertex and fragment shaders.
 */
function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vs || !fs) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  // Shaders can be deleted after linking
  gl.deleteShader(vs)
  gl.deleteShader(fs)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(
      '[SdfShaderRenderer] Program link error:',
      gl.getProgramInfoLog(program),
    )
    gl.deleteProgram(program)
    return null
  }
  return program
}

interface ProgramInfo {
  program: WebGLProgram
  aPosition: number
  uUvRect: WebGLUniformLocation | null
  uTexture: WebGLUniformLocation | null
  uColor: WebGLUniformLocation | null
  uDistanceRange: WebGLUniformLocation | null
  uTextureSize: WebGLUniformLocation | null
  // SDF-specific
  uChannelMode?: WebGLUniformLocation | null
  // MSDF-specific
  uIsMtsdf?: WebGLUniformLocation | null
}

const MIN_CANVAS_SIZE = 256

export class SdfShaderRenderer {
  private gl: WebGLRenderingContext | null = null
  private canvas: HTMLCanvasElement
  private sdfProgram: ProgramInfo | null = null
  private msdfProgram: ProgramInfo | null = null
  private quadBuffer: WebGLBuffer | null = null
  private textureCache = new Map<HTMLCanvasElement, WebGLTexture>()
  private available = false
  private maxTextureSize = 0

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = MIN_CANVAS_SIZE
    this.canvas.height = MIN_CANVAS_SIZE

    // premultipliedAlpha: true — shaders output premultiplied RGBA
    // (vec4(color * alpha, alpha)), matching the blend equation output.
    // This avoids dark-edge fringing when drawImage composites onto Canvas 2D.
    // preserveDrawingBuffer: true — required for drawImage to read the WebGL canvas.
    const gl = this.canvas.getContext('webgl', {
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      antialias: false,
      alpha: true,
    })

    if (!gl) {
      console.warn(
        '[SdfShaderRenderer] WebGL not available, falling back to Canvas 2D',
      )
      return
    }

    // Enable OES_standard_derivatives for fwidth() in fragment shaders.
    // This extension is widely supported (>98% of WebGL 1 implementations).
    const derivativesExt = gl.getExtension('OES_standard_derivatives')
    if (!derivativesExt) {
      console.warn('[SdfShaderRenderer] OES_standard_derivatives not available')
    }

    this.gl = gl
    this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)

    // Handle context loss
    this.canvas.addEventListener('webglcontextlost', this.handleContextLost)
    this.canvas.addEventListener(
      'webglcontextrestored',
      this.handleContextRestored,
    )

    this.initPrograms()
    this.initQuadBuffer()

    if (this.sdfProgram && this.msdfProgram && this.quadBuffer) {
      this.available = true
    }
  }

  isAvailable(): boolean {
    return this.available
  }

  dispose(): void {
    this.clearTextureCache()

    const { gl } = this
    if (!gl) return

    if (this.quadBuffer) gl.deleteBuffer(this.quadBuffer)
    if (this.sdfProgram) gl.deleteProgram(this.sdfProgram.program)
    if (this.msdfProgram) gl.deleteProgram(this.msdfProgram.program)

    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost)
    this.canvas.removeEventListener(
      'webglcontextrestored',
      this.handleContextRestored,
    )

    this.gl = null
    this.available = false
  }

  /**
   * Pre-size the offscreen canvas for the largest glyph in the current frame.
   * Shrinks when current size is >2× the target to reclaim memory.
   */
  beginFrame(maxW: number, maxH: number): void {
    const targetW = Math.max(Math.ceil(maxW), MIN_CANVAS_SIZE)
    const targetH = Math.max(Math.ceil(maxH), MIN_CANVAS_SIZE)
    const needsGrow =
      this.canvas.width < targetW || this.canvas.height < targetH
    const overUse =
      this.canvas.width > targetW * 2 || this.canvas.height > targetH * 2
    if (needsGrow || overUse) {
      this.canvas.width = needsGrow
        ? Math.max(targetW, this.canvas.width * 2)
        : targetW
      this.canvas.height = needsGrow
        ? Math.max(targetH, this.canvas.height * 2)
        : targetH
    }
  }

  /**
   * Render a single SDF glyph through the shader and draw it onto the target Canvas 2D.
   *
   * The shader runs at dw × dh × renderScale resolution so that each
   * display pixel gets its own distance-to-alpha evaluation from the SDF texture.
   * The result is drawn at logical coordinates (dw × dh); the caller's
   * ctx.setTransform(renderScale) maps them to physical pixels 1:1.
   */
  renderGlyph(
    targetCtx: CanvasRenderingContext2D,
    item: GlyphRenderItem,
    config: SdfRenderConfig,
  ): void {
    const { gl } = this
    if (!gl || !this.available) return

    const { sourceCanvas, sx, sy, sw, sh, dx, dy, dw, dh } = item
    if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0) return

    // Check texture size limits
    if (
      sourceCanvas.width > this.maxTextureSize ||
      sourceCanvas.height > this.maxTextureSize
    ) {
      return
    }

    const renderScale = config.renderScale ?? 1

    // Render at display resolution: logical size × renderScale
    const renderW = Math.max(Math.round(dw * renderScale), 1)
    const renderH = Math.max(Math.round(dh * renderScale), 1)

    // Ensure canvas is large enough (defensive grow-only fallback)
    this.ensureCanvasSize(renderW, renderH)

    // Upload source canvas as texture (with caching)
    const texture = this.getOrUploadTexture(sourceCanvas)
    if (!texture) return

    // Select shader program based on render mode
    const isMsdf = config.mode === 'msdf' || config.mode === 'mtsdf'
    const programInfo = isMsdf ? this.msdfProgram : this.sdfProgram
    if (!programInfo) return

    gl.useProgram(programInfo.program)

    // Compute UV coordinates for the glyph region within the full texture
    const texW = sourceCanvas.width
    const texH = sourceCanvas.height
    const u0 = sx / texW
    const v0 = sy / texH
    const u1 = (sx + sw) / texW
    const v1 = (sy + sh) / texH

    // Set UV rect uniform — V flipped: (u0, v1) → (u1, v0) for WebGL Y-axis
    gl.uniform4f(programInfo.uUvRect, u0, v1, u1, v0)

    // Bind static quad buffer and set vertex attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    gl.enableVertexAttribArray(programInfo.aPosition)
    gl.vertexAttribPointer(programInfo.aPosition, 2, gl.FLOAT, false, 0, 0)

    // Bind texture
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1i(programInfo.uTexture, 0)

    // SDF distance range and texture size for msdfgen screenPxRange AA
    gl.uniform1f(programInfo.uDistanceRange, config.distanceRange)
    gl.uniform2f(programInfo.uTextureSize, texW, texH)

    // Set text color
    const color = config.color ?? DEFAULT_COLOR
    gl.uniform3fv(programInfo.uColor, color)

    // Set mode-specific uniforms
    if (isMsdf) {
      gl.uniform1i(programInfo.uIsMtsdf!, config.mode === 'mtsdf' ? 1 : 0)
    } else {
      gl.uniform1i(
        programInfo.uChannelMode!,
        CHANNEL_MODE_MAP[config.sdfChannel] ?? 0,
      )
    }

    // Set viewport at render resolution (display pixels).
    // WebGL framebuffer origin is bottom-left; drawImage reads top-left.
    // Render to the top of the framebuffer so after Y-flip it appears at (0,0).
    const glY = this.canvas.height - renderH
    gl.viewport(0, glY, renderW, renderH)
    gl.scissor(0, glY, renderW, renderH)
    gl.enable(gl.SCISSOR_TEST)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Enable blending for proper alpha compositing
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.drawArrays(gl.TRIANGLES, 0, 6)

    gl.disable(gl.SCISSOR_TEST)
    gl.disable(gl.BLEND)

    // Copy result to target Canvas 2D at logical coordinates.
    // Source: high-res WebGL render (renderW × renderH pixels).
    // Dest: logical size (dw × dh); ctx.setTransform(renderScale) maps to
    // the same physical pixel count → 1:1, no Canvas 2D interpolation.
    try {
      const prevSmoothing = targetCtx.imageSmoothingEnabled
      targetCtx.imageSmoothingEnabled = false
      targetCtx.drawImage(
        this.canvas,
        0,
        0,
        renderW,
        renderH,
        Math.round(dx),
        Math.round(dy),
        renderW / renderScale,
        renderH / renderScale,
      )
      targetCtx.imageSmoothingEnabled = prevSmoothing
    } catch (error) {
      console.warn('[SdfShaderRenderer] drawImage failed:', error)
    }
  }

  /**
   * Clear cached textures. Call when packCanvases are updated.
   */
  clearTextureCache(): void {
    const { gl } = this
    if (!gl) return

    for (const texture of this.textureCache.values()) {
      gl.deleteTexture(texture)
    }
    this.textureCache.clear()
  }

  private initPrograms(): void {
    const { gl } = this
    if (!gl) return

    // SDF program
    const sdfProg = createProgram(gl, VERTEX_SHADER, SDF_FRAGMENT_SHADER)
    if (sdfProg) {
      this.sdfProgram = {
        program: sdfProg,
        aPosition: gl.getAttribLocation(sdfProg, 'a_position'),
        uUvRect: gl.getUniformLocation(sdfProg, 'u_uvRect'),
        uTexture: gl.getUniformLocation(sdfProg, 'u_texture'),
        uColor: gl.getUniformLocation(sdfProg, 'u_color'),
        uDistanceRange: gl.getUniformLocation(sdfProg, 'u_distanceRange'),
        uTextureSize: gl.getUniformLocation(sdfProg, 'u_textureSize'),
        uChannelMode: gl.getUniformLocation(sdfProg, 'u_channelMode'),
      }
    }

    // MSDF program
    const msdfProg = createProgram(gl, VERTEX_SHADER, MSDF_FRAGMENT_SHADER)
    if (msdfProg) {
      this.msdfProgram = {
        program: msdfProg,
        aPosition: gl.getAttribLocation(msdfProg, 'a_position'),
        uUvRect: gl.getUniformLocation(msdfProg, 'u_uvRect'),
        uTexture: gl.getUniformLocation(msdfProg, 'u_texture'),
        uColor: gl.getUniformLocation(msdfProg, 'u_color'),
        uDistanceRange: gl.getUniformLocation(msdfProg, 'u_distanceRange'),
        uTextureSize: gl.getUniformLocation(msdfProg, 'u_textureSize'),
        uIsMtsdf: gl.getUniformLocation(msdfProg, 'u_isMtsdf'),
      }
    }
  }

  private initQuadBuffer(): void {
    const { gl } = this
    if (!gl) return

    this.quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    // Static unit quad: two triangles covering [0,1]×[0,1].
    // Vertex shader maps to clip space via a_position * 2.0 - 1.0.
    // UV mapping handled by u_uvRect uniform — no per-glyph buffer upload.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW,
    )
  }

  /**
   * Ensure the offscreen canvas is at least as large as the render target.
   * Grow-only fallback; prefer beginFrame() for frame-level sizing.
   */
  private ensureCanvasSize(width: number, height: number): void {
    if (width > this.canvas.width) {
      this.canvas.width = Math.max(width, this.canvas.width * 2)
    }
    if (height > this.canvas.height) {
      this.canvas.height = Math.max(height, this.canvas.height * 2)
    }
  }

  /**
   * Get or create a WebGL texture from a source canvas.
   * Textures are cached by canvas reference until clearTextureCache is called.
   */
  private getOrUploadTexture(source: HTMLCanvasElement): WebGLTexture | null {
    const { gl } = this
    if (!gl) return null

    const cached = this.textureCache.get(source)
    if (cached) return cached

    const texture = gl.createTexture()
    if (!texture) return null

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    try {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source,
      )
    } catch (error) {
      console.warn('[SdfShaderRenderer] texImage2D failed:', error)
      gl.deleteTexture(texture)
      return null
    }

    this.textureCache.set(source, texture)
    return texture
  }

  private handleContextLost = (event: Event): void => {
    event.preventDefault()
    this.available = false
    this.textureCache.clear()
    console.warn('[SdfShaderRenderer] WebGL context lost')
  }

  private handleContextRestored = (): void => {
    console.info('[SdfShaderRenderer] WebGL context restored, reinitializing')
    this.initPrograms()
    this.initQuadBuffer()

    if (this.sdfProgram && this.msdfProgram && this.quadBuffer) {
      this.available = true
    }
  }
}

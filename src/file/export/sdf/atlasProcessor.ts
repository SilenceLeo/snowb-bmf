/**
 * Atlas post-processor for SDF/MSDF generation.
 * Converts packed texture atlas canvases into distance field textures
 * by processing each glyph region independently.
 *
 * SDF mode: uses EDT on rasterized alpha channel.
 * MSDF/MTSDF mode: uses official msdfgen WASM for multi-channel output.
 *
 * Expects pack canvases to contain clean white-on-transparent glyphs
 * (distance field modes render with solid white fill, no stroke/shadow).
 */

import type {
  ColoringStrategy,
  ErrorCorrectionMode,
  FillRule,
} from 'src/store/legend/stores/styleStore'

import type { DistanceFieldType, FontHandle } from './msdfgenWasm'
import {
  ensureMsdfgenLoaded,
  freeFont,
  generateMsdfWasm,
  getGlyphInfo,
  loadFont,
} from './msdfgenWasm'
import {
  extractAlphaChannel,
  generateSdfFromAlpha,
  sdfToImageData,
} from './sdfGenerator'

/**
 * Minimal glyph rectangle data required for SDF processing.
 * ExportGlyphData satisfies this interface structurally.
 */
export interface SdfGlyphRect {
  x: number
  y: number
  page: number
  width: number
  height: number
  letter?: string
  type?: 'text' | 'image'
}

export interface SdfProcessConfig {
  radius: number  // distanceRange (spread in pixels)
  cutoff: number  // inside/outside balance (typically 0.25)
  channel?: 'rgb' | 'rgb-inv' | 'alpha' | 'alpha-inv'  // output pixel format (default: 'rgb')
}

/**
 * Convert packed texture atlas canvases to SDF textures.
 *
 * For each page canvas, iterates over all glyphs on that page,
 * extracts each glyph region's alpha channel, generates SDF,
 * and writes it back to a new canvas. Empty glyphs are skipped.
 *
 * @param packCanvases - Original packed atlas canvases
 * @param glyphList - Glyph position/size data (any object with x/y/page/width/height)
 * @param padding - Layout padding (pixels around each glyph)
 * @param config - SDF generation parameters
 * @returns New canvas array with SDF textures
 */
/**
 * Pre-group glyphs by page index to avoid O(N×M) per-page filtering.
 */
function groupByPage<T extends { page?: number }>(glyphs: T[]): Map<number, T[]> {
  const map = new Map<number, T[]>()
  for (const g of glyphs) {
    const page = g.page ?? 0
    let arr = map.get(page)
    if (!arr) {
      arr = []
      map.set(page, arr)
    }
    arr.push(g)
  }
  return map
}

export function processAtlasForSdf(
  packCanvases: HTMLCanvasElement[],
  glyphList: SdfGlyphRect[],
  padding: number,
  config: SdfProcessConfig,
): HTMLCanvasElement[] {
  const { radius, cutoff, channel = 'rgb' } = config
  const glyphsByPage = groupByPage(glyphList)

  return packCanvases.map((sourceCanvas, pageIndex) => {
    const { width, height } = sourceCanvas
    const resultCanvas = document.createElement('canvas')
    resultCanvas.width = width
    resultCanvas.height = height

    const sourceCtx = sourceCanvas.getContext('2d')
    const resultCtx = resultCanvas.getContext('2d')
    if (!sourceCtx || !resultCtx) return resultCanvas

    // Pre-fill canvas background based on channel mode
    if (channel === 'rgb') {
      // Opaque black background — non-glyph areas = SDF outer value (0)
      resultCtx.fillStyle = '#000000'
      resultCtx.fillRect(0, 0, width, height)
    } else if (channel === 'rgb-inv') {
      // Opaque white background — non-glyph areas = inverted outer value (255)
      resultCtx.fillStyle = '#ffffff'
      resultCtx.fillRect(0, 0, width, height)
    }
    // 'alpha' / 'alpha-inv' mode: canvas default (0,0,0,0) is correct — transparent

    // Process each glyph on this page
    const pageGlyphs = glyphsByPage.get(pageIndex) ?? []

    for (const glyph of pageGlyphs) {
      // Skip empty glyphs
      if (glyph.width === 0 || glyph.height === 0) continue

      // Glyph region includes padding
      const regionW = glyph.width + padding * 2
      const regionH = glyph.height + padding * 2
      const regionX = glyph.x
      const regionY = glyph.y

      // Bounds check
      if (regionX + regionW > width || regionY + regionH > height) continue

      // Extract alpha from pack canvas (clean white-on-transparent glyphs)
      const regionData = sourceCtx.getImageData(regionX, regionY, regionW, regionH)
      const alpha = extractAlphaChannel(regionData)

      // Generate SDF from alpha channel
      const sdf = generateSdfFromAlpha(alpha, regionW, regionH, radius, cutoff)
      const sdfImageData = sdfToImageData(sdf, regionW, regionH, channel)

      // Write SDF data back to result canvas
      resultCtx.putImageData(sdfImageData, regionX, regionY)
    }

    return resultCanvas
  })
}

// ============================================================================
// MSDF/MTSDF Atlas Processing
// ============================================================================

/**
 * Extended glyph data for MSDF processing.
 * Carries font buffer for WASM-based vector outline access.
 */
export interface MsdfGlyphData extends SdfGlyphRect {
  fontBuffer?: ArrayBuffer
  fontSize?: number
}

export interface MsdfProcessConfig {
  type: DistanceFieldType // 'sdf' | 'psdf' | 'msdf' | 'mtsdf'
  radius: number // distanceRange
  angleThreshold?: number // default 3.0
  overlapSupport?: boolean // default true
  edgeColoringSeed?: number // default 0
  scanlinePass?: boolean // default false
  fillRule?: FillRule // default 'nonzero'
  coloringStrategy?: ColoringStrategy // default 'simple'
  errorCorrection?: ErrorCorrectionMode // default 'edge-priority'
  sdfChannel?: 'rgb' | 'rgb-inv' | 'alpha' | 'alpha-inv' // SDF channel mode (only for type='sdf')
}

/**
 * Convert packed texture atlas canvases to MSDF/MTSDF textures.
 *
 * For text glyphs with font buffer: generates true multi-channel
 * distance field from vector outlines via msdfgen WASM.
 * For image glyphs or glyphs without font data: falls back to
 * single-channel SDF duplicated across RGB for format compatibility.
 *
 * @param packCanvases - Original packed atlas canvases
 * @param glyphList - Glyph data with optional font buffer
 * @param padding - Layout padding (pixels around each glyph)
 * @param config - MSDF generation parameters
 * @returns Promise resolving to new canvas array with MSDF/MTSDF textures
 */
export async function processAtlasForMsdf(
  packCanvases: HTMLCanvasElement[],
  glyphList: MsdfGlyphData[],
  padding: number,
  config: MsdfProcessConfig,
): Promise<HTMLCanvasElement[]> {
  const {
    type,
    radius,
    sdfChannel = 'rgb',
  } = config

  // Load WASM module and font once for all glyphs
  await ensureMsdfgenLoaded()

  // NOTE: Currently assumes all text glyphs use the same font.
  // If multi-font support is added, this should use a Map<ArrayBuffer, FontHandle>.
  const firstTextGlyph = glyphList.find(
    (g) => g.fontBuffer && g.type !== 'image' && g.letter,
  )
  let fontHandle: FontHandle | null = null
  if (firstTextGlyph?.fontBuffer) {
    fontHandle = loadFont(firstTextGlyph.fontBuffer)
  }

  const glyphsByPage = groupByPage(glyphList)

  try {
    const results: HTMLCanvasElement[] = []

    for (let pageIndex = 0; pageIndex < packCanvases.length; pageIndex++) {
      const sourceCanvas = packCanvases[pageIndex]
      const { width, height } = sourceCanvas
      const resultCanvas = document.createElement('canvas')
      resultCanvas.width = width
      resultCanvas.height = height

      const sourceCtx = sourceCanvas.getContext('2d')
      const resultCtx = resultCanvas.getContext('2d')
      if (!sourceCtx || !resultCtx) {
        results.push(resultCanvas)
        continue
      }

      // Choose background based on type and SDF channel mode
      if (type === 'sdf') {
        // SDF: background depends on channel mode (same logic as processAtlasForSdf)
        if (sdfChannel === 'rgb') {
          resultCtx.fillStyle = '#000000'
          resultCtx.fillRect(0, 0, width, height)
        } else if (sdfChannel === 'rgb-inv') {
          resultCtx.fillStyle = '#ffffff'
          resultCtx.fillRect(0, 0, width, height)
        }
        // 'alpha' / 'alpha-inv': canvas default (0,0,0,0) is correct
      } else if (type !== 'mtsdf') {
        // MSDF/PSDF: opaque black background — alpha=255 is correct (not a distance channel)
        resultCtx.fillStyle = '#000000'
        resultCtx.fillRect(0, 0, width, height)
      }
      // MTSDF: transparent background (0,0,0,0) — alpha=0 means "far outside" in true SDF

      // Process each glyph on this page
      const pageGlyphs = glyphsByPage.get(pageIndex) ?? []

      for (const glyph of pageGlyphs) {
        // Skip empty glyphs
        if (glyph.width === 0 || glyph.height === 0) continue

        const regionW = glyph.width + padding * 2
        const regionH = glyph.height + padding * 2
        const regionX = glyph.x
        const regionY = glyph.y

        // Bounds check
        if (regionX + regionW > width || regionY + regionH > height) continue

        if (fontHandle && glyph.type !== 'image' && glyph.letter) {
          // Vector outline via WASM: generate true MSDF/MTSDF
          const msdfData = generateMsdfForGlyph(
            fontHandle,
            glyph,
            regionW,
            regionH,
            padding,
            config,
          )
          if (msdfData) {
            // SDF WASM output is R=G=B=dist, A=255 (equivalent to 'rgb').
            // Remap channels if a different sdfChannel mode is requested.
            if (type === 'sdf' && sdfChannel !== 'rgb') {
              remapSdfChannels(msdfData, sdfChannel)
            }
            resultCtx.putImageData(msdfData, regionX, regionY)
            continue
          }
        }

        // Fallback: SDF from rasterized alpha, duplicated to RGB
        const regionData = sourceCtx.getImageData(
          regionX,
          regionY,
          regionW,
          regionH,
        )
        const alpha = extractAlphaChannel(regionData)
        const sdf = generateSdfFromAlpha(alpha, regionW, regionH, radius, 0.25)

        if (type === 'sdf') {
          // SDF fallback: use requested sdfChannel mode
          const sdfImageData = sdfToImageData(sdf, regionW, regionH, sdfChannel)
          resultCtx.putImageData(sdfImageData, regionX, regionY)
        } else if (type === 'mtsdf') {
          // MTSDF fallback: R=G=B=A=sdf (alpha carries true SDF value)
          const imageData = new ImageData(regionW, regionH)
          for (let i = 0; i < sdf.length; i++) {
            const v = sdf[i]
            const off = i * 4
            imageData.data[off] = v
            imageData.data[off + 1] = v
            imageData.data[off + 2] = v
            imageData.data[off + 3] = v
          }
          resultCtx.putImageData(imageData, regionX, regionY)
        } else {
          // PSDF/MSDF fallback: RGB distance, opaque alpha
          const sdfImageData = sdfToImageData(sdf, regionW, regionH, 'rgb')
          resultCtx.putImageData(sdfImageData, regionX, regionY)
        }
      }

      // Yield to main thread periodically for large glyph sets (batch C: H2)
      if (pageGlyphs.length > 50) {
        await new Promise<void>((resolve) => setTimeout(resolve, 0))
      }

      results.push(resultCanvas)
    }

    return results
  } finally {
    if (fontHandle) freeFont(fontHandle)
  }
}

/**
 * Generate MSDF/MTSDF ImageData for a single glyph using msdfgen WASM.
 *
 * Coordinates:
 *   msdfgen loads glyphs in em-normalized units (1.0 = 1 em).
 *   The projection scales by fontSize to map em → pixels, and
 *   translates so the glyph is centered in the output region
 *   with padding on all sides.
 */
function generateMsdfForGlyph(
  fontHandle: FontHandle,
  glyph: MsdfGlyphData,
  regionW: number,
  regionH: number,
  padding: number,
  config: MsdfProcessConfig,
): ImageData | null {
  const {
    type,
    radius: range,
    angleThreshold = 3.0,
    overlapSupport = true,
    edgeColoringSeed = 0,
    scanlinePass = false,
    fillRule = 'nonzero',
    coloringStrategy = 'simple',
    errorCorrection = 'edge-priority',
  } = config
  if (!glyph.letter) return null

  const unicode = glyph.letter.codePointAt(0)
  if (unicode === undefined) return null

  const fontSize = glyph.fontSize ?? 72

  // Get glyph bounds in em-normalized coordinates
  const info = getGlyphInfo(fontHandle, unicode)
  if (!info) return null

  const { bounds } = info
  const emW = bounds.right - bounds.left
  const emH = bounds.top - bounds.bottom

  // Skip empty glyphs (e.g., space)
  if (emW < 0.001 && emH < 0.001) return null

  // Projection: em-normalized → pixel coordinates
  // scale maps 1 em-unit to fontSize pixels
  const scale = fontSize

  // Translate: position the glyph so its bottom-left corner is at (padding, padding)
  // in msdfgen's bottom-up bitmap coordinate system.
  // msdfgen Projection: pixel = scale * (shape + translate)
  // We want: scale * (bounds.left + translate) = padding
  // Therefore: translate = padding / scale - bounds.left
  const translateX = padding / scale - bounds.left
  const translateY = padding / scale - bounds.bottom

  // Distance range in em-normalized units
  // msdfgen Range(-r, +r) has total width = 2*r.
  // distanceRange is the desired total width in pixels,
  // so half-width in em = distanceRange / (2 * scale).
  const rangeEm = range / (2 * scale)

  // Compute bitmap dimensions from FreeType vector bounds (like msdf-atlas-gen).
  // ceil(scale * emSpan) + 1 accounts for sub-pixel coverage, plus 2*padding for border.
  // Clamp to packer-allocated region to prevent overflow.
  const bitmapW = Math.min(Math.ceil(scale * emW) + 1 + 2 * padding, regionW)
  const bitmapH = Math.min(Math.ceil(scale * emH) + 1 + 2 * padding, regionH)

  return generateMsdfWasm(fontHandle, unicode, {
    type,
    width: bitmapW,
    height: bitmapH,
    range: rangeEm,
    scale: { x: scale, y: scale },
    translate: { x: translateX, y: translateY },
    angleThreshold,
    overlapSupport,
    seed: edgeColoringSeed,
    scanlinePass,
    fillRule,
    coloringStrategy,
    errorCorrection,
  })
}

/**
 * Remap WASM SDF output (R=G=B=dist, A=255) to the requested channel mode.
 * Modifies ImageData pixels in-place.
 */
function remapSdfChannels(
  imageData: ImageData,
  channel: 'rgb-inv' | 'alpha' | 'alpha-inv',
): void {
  const { data } = imageData
  for (let i = 0; i < data.length; i += 4) {
    const dist = data[i] // R channel holds the distance value
    if (channel === 'rgb-inv') {
      const inv = 255 - dist
      data[i] = inv
      data[i + 1] = inv
      data[i + 2] = inv
      // A stays 255
    } else if (channel === 'alpha') {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
      data[i + 3] = dist
    } else {
      // 'alpha-inv'
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
      data[i + 3] = dist
    }
  }
}

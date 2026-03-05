/**
 * TypeScript binding layer for msdfgen WASM module.
 *
 * Lazily loads the WASM binary on first use, then provides a typed API
 * for loading fonts, extracting glyph shapes, and generating MSDF/MTSDF
 * distance-field bitmaps via the official Chlumsky msdfgen C++ library.
 *
 * Memory management:
 *   - Font handles are reference-counted per ArrayBuffer identity.
 *   - Glyph shapes are allocated per call and freed after generation.
 *   - Pixel buffers are copied into ImageData, then freed immediately.
 */

// ============================================================================
// Type definitions (migrated from msdfGenerator.ts)
// ============================================================================

export type DistanceFieldType = 'sdf' | 'psdf' | 'msdf' | 'mtsdf'

// Re-export types already defined in styleStore for convenience
export type { FillRule, ColoringStrategy, ErrorCorrectionMode } from 'src/store/legend/stores/styleStore'

// ============================================================================
// Internal WASM module types
// ============================================================================

interface MsdfgenWasmModule {
  _msdfgen_init(): number
  _msdfgen_deinit(ftHandle: number): void
  _msdfgen_loadFontData(ftHandle: number, dataPtr: number, length: number): number
  _msdfgen_destroyFont(fontHandle: number): void
  _msdfgen_getFontMetrics(fontHandle: number, outPtr: number): number
  _msdfgen_loadGlyph(
    fontHandle: number,
    unicode: number,
    outAdvancePtr: number,
    outBoundsPtr: number,
  ): number
  _msdfgen_destroyGlyph(shapePtr: number): void
  _msdfgen_generate(
    shapePtr: number,
    type: number,
    width: number,
    height: number,
    range: number,
    scaleX: number,
    scaleY: number,
    translateX: number,
    translateY: number,
    angleThreshold: number,
    coloringStrategy: number,
    seed: number,
    overlapSupport: number,
    errorCorrectionMode: number,
    scanlinePass: number,
    fillRule: number,
  ): number
  _msdfgen_freePixels(ptr: number): void
  _malloc(size: number): number
  _free(ptr: number): void
  HEAPU8: Uint8Array
  HEAPF64: Float64Array
}

// ============================================================================
// Lazy WASM loading
// ============================================================================

let wasmModule: MsdfgenWasmModule | null = null
let loadingPromise: Promise<void> | null = null
let ftHandle = 0

/**
 * Ensure the msdfgen WASM module is loaded and FreeType is initialized.
 * Safe to call multiple times — subsequent calls return immediately.
 */
export async function ensureMsdfgenLoaded(): Promise<void> {
  if (wasmModule) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      // Load Emscripten ES6 module from public/wasm/ via dynamic import.
      // Use import.meta.env.BASE_URL to support deployments with base path.
      const base = import.meta.env.BASE_URL || '/'
      const moduleUrl = new URL(`${base}wasm/msdfgen.js`, window.location.origin).href
      const mod = await import(/* @vite-ignore */ moduleUrl)
      const factory = mod.default as (arg?: Record<string, unknown>) => Promise<MsdfgenWasmModule>
      wasmModule = await factory()
      ftHandle = wasmModule._msdfgen_init()
      if (!ftHandle) {
        throw new Error('msdfgen: FreeType initialization failed')
      }
    } catch (e) {
      // Reset so subsequent calls can retry instead of returning a rejected Promise
      loadingPromise = null
      wasmModule = null
      ftHandle = 0
      throw e
    }
  })()

  return loadingPromise
}

/**
 * Release WASM module resources (FreeType handle + module reference).
 * After calling this, ensureMsdfgenLoaded() will re-initialize on next use.
 */
export function deinitMsdfgen(): void {
  if (wasmModule && ftHandle) {
    wasmModule._msdfgen_deinit(ftHandle)
    ftHandle = 0
  }
  wasmModule = null
  loadingPromise = null
}

// ============================================================================
// Font handle management
// ============================================================================

/** Opaque font handle for WASM-side FreeType font instance. */
export interface FontHandle {
  /** WASM pointer to FontHandle */
  ptr: number
  /** WASM pointer to font data copy (must stay alive while font is in use) */
  dataPtr: number
}

/**
 * Load a font into WASM memory from an ArrayBuffer.
 *
 * The font data is copied into WASM linear memory and kept alive
 * until `freeFont()` is called.  Callers MUST pair every `loadFont()`
 * with a corresponding `freeFont()`.
 */
export function loadFont(buffer: ArrayBuffer): FontHandle {
  if (!wasmModule || !ftHandle) {
    throw new Error('msdfgen: WASM module not loaded — call ensureMsdfgenLoaded() first')
  }

  const data = new Uint8Array(buffer)
  const dataPtr = wasmModule._malloc(data.length)
  if (!dataPtr) throw new Error('msdfgen: malloc failed for font data')

  wasmModule.HEAPU8.set(data, dataPtr)
  const fontPtr = wasmModule._msdfgen_loadFontData(ftHandle, dataPtr, data.length)

  if (!fontPtr) {
    wasmModule._free(dataPtr)
    throw new Error('msdfgen: failed to load font')
  }

  return { ptr: fontPtr, dataPtr }
}

/**
 * Free a previously loaded font and its data buffer.
 */
export function freeFont(handle: FontHandle): void {
  if (!wasmModule) return
  if (handle.ptr) wasmModule._msdfgen_destroyFont(handle.ptr)
  if (handle.dataPtr) wasmModule._free(handle.dataPtr)
  handle.ptr = 0
  handle.dataPtr = 0
}

// ============================================================================
// Font metrics
// ============================================================================

export interface FontMetrics {
  emSize: number
  ascender: number
  descender: number
  lineHeight: number
  underlineY: number
  underlineThickness: number
}

/**
 * Retrieve font-level metrics via FreeType (em-normalized).
 * Returns null if the font handle is invalid or metrics cannot be read.
 */
export function getFontMetrics(fontHandle: FontHandle): FontMetrics | null {
  if (!wasmModule) {
    throw new Error('msdfgen: WASM module not loaded')
  }

  const mod = wasmModule
  const SIZEOF_DOUBLE = 8
  const METRICS_COUNT = 6
  const outPtr = mod._malloc(METRICS_COUNT * SIZEOF_DOUBLE)
  if (!outPtr) return null

  const ok = mod._msdfgen_getFontMetrics(fontHandle.ptr, outPtr)
  if (!ok) {
    mod._free(outPtr)
    return null
  }

  // Use DataView for safe unaligned double reads (no alignment assumption)
  const view = new DataView(mod.HEAPU8.buffer, outPtr, METRICS_COUNT * SIZEOF_DOUBLE)
  const metrics: FontMetrics = {
    emSize: view.getFloat64(0, true),
    ascender: view.getFloat64(8, true),
    descender: view.getFloat64(16, true),
    lineHeight: view.getFloat64(24, true),
    underlineY: view.getFloat64(32, true),
    underlineThickness: view.getFloat64(40, true),
  }

  mod._free(outPtr)
  return metrics
}

// ============================================================================
// Glyph shape + MSDF generation
// ============================================================================

export interface GlyphBounds {
  left: number
  bottom: number
  right: number
  top: number
}

export interface GlyphInfo {
  advance: number
  bounds: GlyphBounds
}

/**
 * Load a glyph shape and immediately generate its MSDF/MTSDF bitmap.
 *
 * Handles the full pipeline:
 *   1. Load glyph shape from font via FreeType
 *   2. Apply edge coloring
 *   3. Generate distance field
 *   4. Convert float pixels to RGBA uint8
 *   5. Free WASM resources
 *
 * @returns ImageData with RGBA pixels, or null if the glyph has no outline.
 */
export function generateMsdfWasm(
  fontHandle: FontHandle,
  unicode: number,
  config: {
    type: DistanceFieldType
    width: number
    height: number
    range: number
    scale: { x: number; y: number }
    translate: { x: number; y: number }
    angleThreshold?: number
    overlapSupport?: boolean
    seed?: number
    scanlinePass?: boolean
    fillRule?: 'nonzero' | 'evenodd'
    coloringStrategy?: 'simple' | 'inktrap' | 'distance'
    errorCorrection?: 'edge-priority' | 'disabled' | 'indiscriminate'
  },
): ImageData | null {
  if (!wasmModule) {
    throw new Error('msdfgen: WASM module not loaded')
  }

  const mod = wasmModule

  // Reject unreasonably large dimensions to prevent overflow
  if (config.width <= 0 || config.height <= 0 || config.width > 8192 || config.height > 8192) {
    return null
  }

  // Load glyph shape (pass 0 for advance/bounds — not needed here, see getGlyphInfo)
  const shapePtr = mod._msdfgen_loadGlyph(fontHandle.ptr, unicode, 0, 0)

  if (!shapePtr) {
    return null
  }

  // Map config enums to numeric values for WASM API
  const TYPE_MAP: Record<DistanceFieldType, number> = { sdf: 0, psdf: 1, msdf: 2, mtsdf: 3 }
  const COLORING_MAP: Record<string, number> = { simple: 0, inktrap: 1, distance: 2 }
  const EC_MAP: Record<string, number> = { disabled: 0, indiscriminate: 1, 'edge-priority': 2 }

  const typeNum = TYPE_MAP[config.type]
  const coloringNum = COLORING_MAP[config.coloringStrategy ?? 'simple']
  const fillRuleNum = config.fillRule === 'evenodd' ? 1 : 0
  const ecMode = EC_MAP[config.errorCorrection ?? 'edge-priority']

  // Generate MSDF pixels
  const pixelsPtr = mod._msdfgen_generate(
    shapePtr,
    typeNum,
    config.width,
    config.height,
    config.range,
    config.scale.x,
    config.scale.y,
    config.translate.x,
    config.translate.y,
    config.angleThreshold ?? 3.0,
    coloringNum,
    config.seed ?? 0,
    (config.overlapSupport ?? true) ? 1 : 0,
    ecMode,
    (config.scanlinePass ?? false) ? 1 : 0,
    fillRuleNum,
  )

  // Clean up glyph shape
  mod._msdfgen_destroyGlyph(shapePtr)

  if (!pixelsPtr) return null

  // Copy RGBA pixels from WASM memory to ImageData (single copy via subarray view)
  const pixelCount = config.width * config.height * 4
  const imageData = new ImageData(config.width, config.height)
  imageData.data.set(mod.HEAPU8.subarray(pixelsPtr, pixelsPtr + pixelCount))
  mod._msdfgen_freePixels(pixelsPtr)

  return imageData
}

/**
 * Load glyph info (advance + bounds) without generating the bitmap.
 * Useful for computing layout before rendering.
 */
export function getGlyphInfo(
  fontHandle: FontHandle,
  unicode: number,
): GlyphInfo | null {
  if (!wasmModule) {
    throw new Error('msdfgen: WASM module not loaded')
  }

  const mod = wasmModule
  const SIZEOF_DOUBLE = 8
  const outPtr = mod._malloc(5 * SIZEOF_DOUBLE)
  if (!outPtr) return null

  const advancePtr = outPtr
  const boundsPtr = outPtr + SIZEOF_DOUBLE

  const shapePtr = mod._msdfgen_loadGlyph(fontHandle.ptr, unicode, advancePtr, boundsPtr)
  if (!shapePtr) {
    mod._free(outPtr)
    return null
  }

  // Use DataView for safe unaligned double reads
  const view = new DataView(mod.HEAPU8.buffer, outPtr, 5 * SIZEOF_DOUBLE)
  const info: GlyphInfo = {
    advance: view.getFloat64(0, true),
    bounds: {
      left: view.getFloat64(SIZEOF_DOUBLE, true),
      bottom: view.getFloat64(2 * SIZEOF_DOUBLE, true),
      right: view.getFloat64(3 * SIZEOF_DOUBLE, true),
      top: view.getFloat64(4 * SIZEOF_DOUBLE, true),
    },
  }

  mod._msdfgen_destroyGlyph(shapePtr)
  mod._free(outPtr)

  return info
}

/**
 * Atlas post-processor for SDF generation.
 * Converts packed texture atlas canvases into SDF grayscale textures
 * by processing each glyph region independently.
 *
 * Expects pack canvases to contain clean white-on-transparent glyphs
 * (SDF mode renders with solid white fill, no stroke/shadow).
 */

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
export function processAtlasForSdf(
  packCanvases: HTMLCanvasElement[],
  glyphList: SdfGlyphRect[],
  padding: number,
  config: SdfProcessConfig,
): HTMLCanvasElement[] {
  const { radius, cutoff, channel = 'rgb' } = config

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
    const pageGlyphs = glyphList.filter((g) => (g.page ?? 0) === pageIndex)

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

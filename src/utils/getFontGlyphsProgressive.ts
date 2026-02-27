import {
  type GlyphInfo,
  type GlyphItem,
  type GlyphRenderConfig,
  type LayoutInfo,
  applyShadow,
  applyStrokeType2,
  computeLayout,
  createCanvas2D,
  renderSingleGlyph,
  setupStrokeContext,
  trimGlyphs,
} from './glyphRenderHelper'

export type { GlyphItem, GlyphInfo }
export type Config = GlyphRenderConfig

export interface ProgressiveOptions {
  batchSize?: number
  onProgress?: (completed: number, total: number) => void
  signal?: AbortSignal
}

/**
 * Progressive glyph rendering with cancellation support
 * Renders glyphs in batches to avoid blocking the main thread
 */
export default async function getFontGlyphsProgressive(
  text: string[],
  config: Config,
  options: ProgressiveOptions = {},
): Promise<GlyphInfo> {
  const { stroke, shadow } = config
  const { batchSize = 50, onProgress, signal } = options

  if (signal?.aborted) {
    throw new Error('Rendering cancelled')
  }

  const layout = computeLayout(text.length, config)
  const { lineWidth, itemWidth, itemHeight, padding, columnNum, lineNum } =
    layout

  const { canvas, ctx } = createCanvas2D()
  const { canvas: strokeCanvas, ctx: strokeCtx } = createCanvas2D()

  canvas.width = (itemWidth + padding * 2) * columnNum
  canvas.height = (itemHeight + padding * 2) * lineNum
  strokeCanvas.width = canvas.width
  strokeCanvas.height = canvas.height

  const map = new Map<string, GlyphItem>()

  setupStrokeContext(ctx, strokeCtx, stroke, lineWidth)

  let completedCount = 0

  for (let batchStart = 0; batchStart < text.length; batchStart += batchSize) {
    if (signal?.aborted) {
      throw new Error('Rendering cancelled')
    }

    const batchEnd = Math.min(batchStart + batchSize, text.length)

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        for (let i = batchStart; i < batchEnd; i++) {
          renderSingleGlyph(i, text[i], ctx, strokeCtx, map, config, layout)
        }

        completedCount = batchEnd
        onProgress?.(completedCount, text.length)
        resolve()
      })
    })

    if (batchEnd < text.length) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  applyStrokeType2(ctx, strokeCanvas, stroke, lineWidth)

  if (shadow) {
    const result = applyShadow(canvas, strokeCanvas, strokeCtx, shadow)

    await processTrimmingBatched(text, map, result.ctx, layout, {
      batchSize,
      onProgress,
      signal,
    })

    return { canvas: copyToCleanCanvas(result.canvas), glyphs: map }
  }

  await processTrimmingBatched(text, map, ctx, layout, {
    batchSize,
    onProgress,
    signal,
  })

  return { canvas: copyToCleanCanvas(canvas), glyphs: map }
}

/**
 * Copy to a clean canvas without willReadFrequently
 * to ensure Safari compatibility when used as drawImage source
 */
function copyToCleanCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const clean = document.createElement('canvas')
  clean.width = source.width
  clean.height = source.height
  const ctx = clean.getContext('2d')
  if (ctx) {
    ctx.drawImage(source, 0, 0)
  }
  return clean
}

async function processTrimmingBatched(
  text: string[],
  map: Map<string, GlyphItem>,
  ctx: CanvasRenderingContext2D,
  layout: LayoutInfo,
  options: ProgressiveOptions,
): Promise<void> {
  const { batchSize = 50, signal } = options

  for (let batchStart = 0; batchStart < text.length; batchStart += batchSize) {
    if (signal?.aborted) {
      throw new Error('Trimming cancelled')
    }

    const batchEnd = Math.min(batchStart + batchSize, text.length)

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        trimGlyphs(text, map, ctx, layout, batchStart, batchEnd)
        resolve()
      })
    })

    if (batchEnd < text.length) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }
}

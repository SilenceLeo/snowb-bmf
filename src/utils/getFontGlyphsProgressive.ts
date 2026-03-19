import {
  type GlyphInfo,
  type GlyphItem,
  type GlyphRenderConfig,
  type LayoutInfo,
  applyInnerShadow,
  applyShadow,
  applyStrokeType2,
  computeLayout,
  createCanvas2D,
  finalizeTwoPassRender,
  prepareTwoPassRender,
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
  const { stroke, shadow, innerShadow } = config
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
  const hasStroke = !!(stroke && lineWidth)

  setupStrokeContext(ctx, strokeCtx, stroke, lineWidth)

  let completedCount = 0
  const needsTwoPass = !!(innerShadow && hasStroke)
  const totalSteps = needsTwoPass ? text.length * 2 : text.length
  const renderConfig = needsTwoPass ? { ...config, stroke: undefined } : config

  for (let batchStart = 0; batchStart < text.length; batchStart += batchSize) {
    if (signal?.aborted) {
      throw new Error('Rendering cancelled')
    }

    const batchEnd = Math.min(batchStart + batchSize, text.length)

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        for (let i = batchStart; i < batchEnd; i++) {
          renderSingleGlyph(
            i,
            text[i],
            ctx,
            strokeCtx,
            map,
            renderConfig,
            layout,
          )
        }

        completedCount = batchEnd
        onProgress?.(completedCount, totalSteps)
        resolve()
      })
    })

    if (batchEnd < text.length) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  if (needsTwoPass) {
    // Two-pass: fill-only rendered above → inner shadow → stroke on top
    const twoPass = prepareTwoPassRender(
      canvas,
      innerShadow,
      stroke!,
      lineWidth,
    )

    // Second pass: render fill+stroke in batches (matches first pass pattern)
    for (
      let batchStart = 0;
      batchStart < text.length;
      batchStart += batchSize
    ) {
      if (signal?.aborted) {
        throw new Error('Rendering cancelled')
      }

      const batchEnd = Math.min(batchStart + batchSize, text.length)

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          for (let i = batchStart; i < batchEnd; i++) {
            renderSingleGlyph(
              i,
              text[i],
              twoPass.fullCtx,
              twoPass.fullStrokeCtx,
              twoPass.tempMap,
              config,
              layout,
            )
          }
          onProgress?.(text.length + batchEnd, totalSteps)
          resolve()
        })
      })

      if (batchEnd < text.length) {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    }

    finalizeTwoPassRender(ctx, twoPass, stroke!, lineWidth)
  } else {
    applyStrokeType2(ctx, strokeCanvas, stroke, lineWidth)
    if (innerShadow) {
      applyInnerShadow(canvas, innerShadow)
    }
  }

  let finalCanvas = canvas
  let finalCtx = ctx

  if (shadow) {
    const result = applyShadow(finalCanvas, strokeCanvas, strokeCtx, shadow)
    finalCanvas = result.canvas
    finalCtx = result.ctx
  }

  await processTrimmingBatched(text, map, finalCtx, layout, {
    batchSize,
    onProgress,
    signal,
  })

  return { canvas: copyToCleanCanvas(finalCanvas), glyphs: map }
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

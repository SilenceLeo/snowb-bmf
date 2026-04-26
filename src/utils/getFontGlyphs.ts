import {
  type GlyphInfo,
  type GlyphItem,
  type GlyphRenderConfig,
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

export default function getFontGlyphs(text: string[], config: Config) {
  const { stroke, shadow, innerShadow } = config
  const layout = computeLayout(text.length, config)
  const { lineWidth, itemWidth, itemHeight, padding, columnNum, lineNum } =
    layout

  let { canvas, ctx } = createCanvas2D()
  const { canvas: strokeCanvas, ctx: strokeCtx } = createCanvas2D()

  canvas.width = (itemWidth + padding * 2) * columnNum
  canvas.height = (itemHeight + padding * 2) * lineNum
  strokeCanvas.width = canvas.width
  strokeCanvas.height = canvas.height

  const map = new Map<string, GlyphItem>()

  setupStrokeContext(ctx, strokeCtx, stroke, lineWidth)

  const hasStroke = !!(stroke && lineWidth)

  if (innerShadow && hasStroke) {
    // Two-pass rendering so stroke appears above inner shadow:
    // 1. Render fill-only → apply inner shadow
    // 2. Render fill+stroke → extract stroke-only → draw on top
    const fillOnlyConfig: Config = { ...config, stroke: undefined }
    for (let i = 0; i < text.length; i++) {
      renderSingleGlyph(i, text[i], ctx, strokeCtx, map, fillOnlyConfig, layout)
    }

    const twoPass = prepareTwoPassRender(
      canvas,
      innerShadow,
      stroke!,
      lineWidth,
    )
    for (let i = 0; i < text.length; i++) {
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
    finalizeTwoPassRender(ctx, twoPass, stroke!, lineWidth)
  } else {
    for (let i = 0; i < text.length; i++) {
      renderSingleGlyph(i, text[i], ctx, strokeCtx, map, config, layout)
    }
    applyStrokeType2(ctx, strokeCanvas, stroke, lineWidth)
    if (innerShadow) {
      applyInnerShadow(canvas, innerShadow)
    }
  }

  if (shadow) {
    const result = applyShadow(canvas, strokeCanvas, strokeCtx, shadow)
    canvas = result.canvas
    ctx = result.ctx
  }

  trimGlyphs(text, map, ctx, layout, 0, undefined, !config.noTrim)

  // Copy to a clean canvas without willReadFrequently
  // to ensure Safari compatibility when used as drawImage source
  const cleanCanvas = document.createElement('canvas')
  cleanCanvas.width = canvas.width
  cleanCanvas.height = canvas.height
  const cleanCtx = cleanCanvas.getContext('2d')
  if (cleanCtx) {
    cleanCtx.drawImage(canvas, 0, 0)
  }

  return {
    canvas: cleanCanvas,
    glyphs: map,
  }
}

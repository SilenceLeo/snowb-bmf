import {
  type GlyphInfo,
  type GlyphItem,
  type GlyphRenderConfig,
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

export default function getFontGlyphs(text: string[], config: Config) {
  const { stroke, shadow } = config
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

  for (let i = 0; i < text.length; i++) {
    renderSingleGlyph(i, text[i], ctx, strokeCtx, map, config, layout)
  }

  applyStrokeType2(ctx, strokeCanvas, stroke, lineWidth)

  if (shadow) {
    const result = applyShadow(canvas, strokeCanvas, strokeCtx, shadow)
    canvas = result.canvas
    ctx = result.ctx
  }

  trimGlyphs(text, map, ctx, layout)

  return {
    canvas,
    glyphs: map,
  }
}

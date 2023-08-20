import { GlyphFont, GlyphImage } from 'src/store/base'

export default function drawPackCanvas(
  canvas: HTMLCanvasElement,
  styledImage: HTMLImageElement | HTMLCanvasElement | null,
  list: (GlyphImage | GlyphFont)[],
  padding: number,
) {
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  list.forEach((glyph) => {
    if (
      glyph instanceof GlyphImage &&
      glyph.source &&
      glyph.source.width !== 0 &&
      glyph.source.height !== 0
    ) {
      ctx.drawImage(
        glyph.source as HTMLCanvasElement,
        glyph.x + (padding || 0),
        glyph.y + (padding || 0),
      )
    } else if (styledImage && glyph instanceof GlyphFont) {
      ctx.drawImage(
        styledImage,
        glyph.canvasX,
        glyph.canvasY,
        glyph.width,
        glyph.height,
        glyph.x + (padding || 0),
        glyph.y + (padding || 0),
        glyph.width,
        glyph.height,
      )
    }
  })
}

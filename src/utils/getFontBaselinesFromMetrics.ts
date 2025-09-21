import { Font } from 'opentype.js'

interface Baselines {
  middle: number
  hanging: number
  top: number
  alphabetic: number
  ideographic: number
  bottom: number
  lineHeight: number
}

export default function getFontBaselinesFromMetrics(
  font: Font,
  fontSize: number,
): Baselines {
  const scale = fontSize / font.unitsPerEm

  // Get key font metrics
  const ascender = font.ascender * scale
  const descender = font.descender * scale
  // const capHeight = (font.tables.os2?.sCapHeight || font.ascender * 0.7) * scale
  // const xHeight = (font.tables.os2?.sxHeight || font.ascender * 0.5) * scale
  const lineGap = (font.tables.hhea?.lineGap || 0) * scale

  // Calculate total height and middle baseline position
  const totalHeight = ascender - descender
  const middleY = totalHeight / 2 // middle baseline position relative to alphabetic

  // Calculate baseline offsets relative to middle based on Canvas coordinate system
  // Upward is negative, downward is positive
  const baselines = {
    // middle baseline: vertical center of the font, used as reference point
    middle: 0,

    // hanging baseline: offset upward, negative value
    hanging: -(ascender - middleY),

    // top baseline: offset upward, negative value
    top: -(ascender - middleY),

    // alphabetic baseline: below middle, positive value
    alphabetic: middleY,

    // ideographic baseline: offset downward, positive value
    ideographic: middleY - descender,

    // bottom baseline: offset downward, positive value
    bottom: middleY - descender,

    // line height: total height including line spacing
    lineHeight: Math.max(1, (totalHeight + lineGap) / fontSize),
  }

  return baselines
}

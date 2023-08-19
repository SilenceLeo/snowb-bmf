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

export default function getBaselinesFromOpentypeFont(
  font: Font,
  fontSize: number,
): Baselines {
  const scale = fontSize / font.unitsPerEm
  const height = font.ascender - font.descender
  const fontHeight = height * scale
  const alphabetic = font.ascender * scale

  return {
    middle: 0,
    hanging: 0,
    top: fontHeight / -2,
    alphabetic: alphabetic - fontHeight / 2,
    ideographic: 0,
    bottom: fontHeight / 2,
    lineHeight: height / font.unitsPerEm,
  }
}

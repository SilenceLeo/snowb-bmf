import { Font } from '../../store'

export const findFontSourceRobust = (font: Font, text: string) => {
  const fontResource = font.fonts.find(({ opentype }) => {
    if (!opentype) return false

    const glyph = opentype.charToGlyph(text)
    return !!glyph.unicode
  })

  if (!fontResource) throw new Error('Not Find Font.')

  return fontResource
}

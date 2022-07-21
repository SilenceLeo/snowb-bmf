import { findFontSourceRobust } from '../glyphFont/findFontSource'
import pathDoSharp from '../glyphFont/pathDoSharp'
import { TrimInfo } from './getTrimInfo'
import { Path } from 'opentype.js'
import Font from 'src/store/base/font'

export interface FontTrimInfo extends TrimInfo {
  path: Path
}

export const getTrimInfoFromFont = (font: Font, text: string): FontTrimInfo => {
  const fontResource = findFontSourceRobust(font, text)
  const opentype = fontResource.opentype

  const glyph = opentype.charToGlyph(text)
  const scale = font.size / opentype.unitsPerEm
  const baseline = Math.ceil(opentype.ascender * scale)

  let path = glyph.getPath(0, baseline, font.size)
  pathDoSharp(path, font.sharp)
  let boundingBox = path.getBoundingBox()

  const fontWidth = opentype.getAdvanceWidth(text, font.size)
  const fontHeight = (opentype.ascender - opentype.descender) * scale

  return {
    path,
    text,
    font: font.family,
    width: Math.ceil(boundingBox.x2) - Math.floor(boundingBox.x1),
    height: Math.ceil(boundingBox.y2) - Math.floor(boundingBox.y1),
    fontWidth,
    fontHeight,
    trimOffsetTop: boundingBox.y1 * -1,
    trimOffsetLeft: boundingBox.x1 * -1,
    trimOffsetRight: (fontWidth - boundingBox.x1) * -1,
    trimOffsetBottom: (fontHeight - boundingBox.y2) * -1,
  }
}

import { Project } from 'src/store'
import {
  BMFont,
  BMFontInfo,
  BMFontPage,
  BMFontChars,
  BMFontCommon,
  BMFontKernings,
} from './type'

// http://www.angelcode.com/products/bmfont/doc/file_format.html
export default function toBmfInfo(project: Project, fontFamily = ''): BMFont {
  const {
    name,
    style,
    layout,
    globalAdjustMetric,
    glyphList,
    ui: { width, height },
  } = project
  const { opentype, size } = style.font
  let fontScale = 1
  if (opentype) {
    fontScale = (1 / opentype.unitsPerEm) * size
  }
  const info: BMFontInfo = {
    face: fontFamily || style.font.mainFamily,
    size: style.font.size,
    bold: 0,
    italic: 0,
    charset: '',
    unicode: 1,
    stretchH: 100,
    smooth: 1,
    aa: 1,
    padding: new Array(4).fill(layout.padding),
    spacing: new Array(2).fill(layout.spacing),
  }

  const common: BMFontCommon = {
    lineHeight: style.font.size,
    base: Math.round(style.font.alphabetic - style.font.top),
    scaleW: width,
    scaleH: height,
    pages: 1,
    packed: 0,
  }

  const pages: BMFontPage[] = [
    {
      id: 0,
      file: `${name}.png`,
    },
  ]

  const chars: BMFontChars = {
    count: glyphList.length,
    list: [],
  }

  const kernings: BMFontKernings = {
    count: 0,
    list: [],
  }

  glyphList.forEach((glyph) => {
    const isUnEmpty = !!(glyph.width && glyph.height)
    const info = {
      letter: glyph.letter,
      id: glyph.letter.charCodeAt(0),
      source: glyph.source,
      x: glyph.x,
      y: glyph.y,
      width: isUnEmpty ? glyph.width + layout.padding * 2 : 0,
      height: isUnEmpty ? glyph.height + layout.padding * 2 : 0,
      xoffset:
        globalAdjustMetric.xOffset +
        glyph.adjustMetric.xOffset -
        (isUnEmpty ? glyph.trimOffsetLeft : 0) -
        (isUnEmpty ? layout.padding : 0),
      yoffset:
        globalAdjustMetric.yOffset +
        glyph.adjustMetric.yOffset -
        (isUnEmpty ? glyph.trimOffsetTop : 0) -
        (isUnEmpty ? layout.padding : 0),
      xadvance:
        Math.ceil(glyph.fontWidth) +
        globalAdjustMetric.xAdvance +
        glyph.adjustMetric.xAdvance,
      page: 0,
      chnl: 15,
    }

    chars.list.push(info)

    if (opentype) {
      glyphList.forEach(({ letter }) => {
        const amount = Math.round(
          opentype.getKerningValue(
            opentype.charToGlyphIndex(glyph.letter),
            opentype.charToGlyphIndex(letter),
          ) *
            fontScale +
            (glyph.kerning.get(letter) || 0),
        )
        if (amount) {
          kernings.list.push({
            first: glyph.letter.charCodeAt(0),
            second: letter.charCodeAt(0),
            amount,
          })
        }
      })
    } else {
      glyph.kerning.forEach((amount, letter) => {
        if (amount)
          kernings.list.push({
            first: glyph.letter.charCodeAt(0),
            second: letter.charCodeAt(0),
            amount,
          })
      })
    }
  })
  kernings.count = kernings.list.length

  chars.list.sort((a, b) => a.id - b.id)

  return {
    info,
    common,
    pages,
    chars,
    kernings,
  }
}

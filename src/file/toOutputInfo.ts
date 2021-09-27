import { Project } from 'src/store'

interface BMFontInfo extends Record<string, unknown> {
  face: string
  size: number
  bold: number
  italic: number
  charset: string
  unicode: number
  stretchH: number
  smooth: number
  aa: number
  padding: number[]
  spacing: number[]
}

interface BMFontCommon extends Record<string, unknown> {
  lineHeight: number
  base: number
  scaleW: number
  scaleH: number
  pages: number
  packed: number
}

interface BMFontPage extends Record<string, unknown> {
  id: number
  file: string
}

export interface BMFontChar extends Record<string, unknown> {
  letter: string
  id: number
  source: HTMLImageElement | HTMLCanvasElement | null
  x: number
  y: number
  width: number
  height: number
  xoffset: number
  yoffset: number
  xadvance: number
  page: number
  chnl: number
}

interface BMFontChars extends Record<string, unknown> {
  count: number
  list: BMFontChar[]
}

export interface BMFontKerning extends Record<string, unknown> {
  first: number
  second: number
  amount: number
}

interface BMFontKernings extends Record<string, unknown> {
  count: number
  list: BMFontKerning[]
}

export interface BMFont {
  info: BMFontInfo
  common: BMFontCommon
  pages: BMFontPage[]
  chars: BMFontChars
  kernings: BMFontKernings
}

// http://www.angelcode.com/products/bmfont/doc/file_format.html
export default function toOutputInfo(project: Project): BMFont {
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
    face: style.font.mainFamily,
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
    base: style.font.size,
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
    chars.list.push({
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
        (isUnEmpty ? glyph.trimOffsetLeft : 0),
      yoffset:
        globalAdjustMetric.yOffset +
        glyph.adjustMetric.yOffset -
        (isUnEmpty ? glyph.trimOffsetTop : 0),
      xadvance:
        Math.ceil(glyph.fontWidth) +
        globalAdjustMetric.xAdvance +
        glyph.adjustMetric.xAdvance,
      page: 0,
      chnl: 15,
    })
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

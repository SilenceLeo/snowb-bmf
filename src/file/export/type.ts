export interface BMFontInfo extends Record<string, unknown> {
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

export interface BMFontCommon extends Record<string, unknown> {
  lineHeight: number
  base: number
  scaleW: number
  scaleH: number
  pages: number
  packed: number
}

export interface BMFontPage extends Record<string, unknown> {
  id: number
  file: string
}

export interface BMFontChar extends Record<string, unknown> {
  letter: string
  id: number
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

export interface BMFontChars extends Record<string, unknown> {
  count: number
  list: BMFontChar[]
}

export interface BMFontKerning extends Record<string, unknown> {
  first: number
  second: number
  amount: number
}

export interface BMFontKernings extends Record<string, unknown> {
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

export type OutputType = string

export type OutputExt = string

export type OutputExts = OutputExt[]

export type FontToString = (fontInfo: BMFont) => string

export interface Output {
  type: OutputType
  exts: OutputExts
  getString: FontToString
}

export interface ConfigItem extends Omit<Output, 'exts'> {
  id: string
  ext: string
}

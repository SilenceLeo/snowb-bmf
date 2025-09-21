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
  outline?: number // BMFont v2+ outline thickness
}

export interface BMFontCommon extends Record<string, unknown> {
  lineHeight: number
  base: number
  scaleW: number
  scaleH: number
  pages: number
  packed: number
  alphaChnl?: number // BMFont v3+ alpha channel info
  redChnl?: number // BMFont v3+ red channel info
  greenChnl?: number // BMFont v3+ green channel info
  blueChnl?: number // BMFont v3+ blue channel info
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

export interface BMFontMetadata {
  generatorName: string
  generatorVersion: string
  generatorUrl: string
  generatedAt: string
  formatVersion: number
  characterCount: number
  kerningPairCount: number
  fontFamily: string
  fontSize: number
  padding: number
  spacing: number
}

export interface BMFont {
  version?: number
  metadata?: BMFontMetadata
  info: BMFontInfo
  common: BMFontCommon
  pages: BMFontPage[]
  chars: BMFontChars
  kernings: BMFontKernings
}

export type OutputType = string

export type OutputExt = string

export type OutputExts = OutputExt[]

export type FontToContent = (fontInfo: BMFont) => string | Uint8Array

export interface Output {
  type: OutputType
  exts: OutputExts
  getContent: FontToContent
}

export interface ConfigItem extends Omit<Output, 'exts'> {
  id: string
  ext: string
}

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
  xFpBits?: number
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

export interface ExportOptions {
  pixelFormat?: string
  blur?: boolean
  includeTextures?: boolean
  extended?: boolean
}

export type FontToContent = (
  fontInfo: BMFont,
  options?: ExportOptions,
) => string | Uint8Array

export interface ExportFile {
  name: string
  content: string | Uint8Array
}

export interface ExportContext {
  project: import('src/store').Project
  bmfont: BMFont
  fontName: string
  fileName: string
  options?: ExportOptions
}

export interface ExportFilesResult {
  files: ExportFile[]
  includePng?: boolean
}

export type FontToFiles = (context: ExportContext) => ExportFilesResult

export interface Output {
  type: OutputType
  exts: OutputExts
  getContent?: FontToContent
  getFiles?: FontToFiles
  includePng?: boolean
  supportsPixelFormat?: boolean
  supportsBlur?: boolean
  supportsTextures?: boolean
  supportsExtended?: boolean
}

export interface ConfigItem extends Omit<Output, 'exts'> {
  id: string
  ext: string
}

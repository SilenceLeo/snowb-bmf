// ============================================================================
// Export Data Types (for Legend State migration)
// ============================================================================
import type { Font as OpenType } from 'opentype.js'
import type { LayoutData } from 'src/store/legend/stores/layoutStore'
import type { FontData } from 'src/store/legend/stores/styleStore'
import type { MetricData } from 'src/types/style'

export interface BMFontInfo {
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

export interface BMFontCommon {
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

export interface BMFontPage {
  id: number
  file: string
}

export interface BMFontChar {
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

export interface BMFontChars {
  count: number
  list: BMFontChar[]
}

export interface BMFontKerning {
  first: number
  second: number
  amount: number
}

export interface BMFontKernings {
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

/**
 * Glyph data for export (unified type for both font and image glyphs)
 */
export interface ExportGlyphData {
  letter: string
  x: number
  y: number
  page: number
  width: number
  height: number
  fontWidth: number
  trimOffsetTop: number
  trimOffsetLeft: number
  adjustMetric: MetricData
  kerning: Record<string, number>
}

/**
 * Project data structure for export functions (toBmfInfo and exportFile)
 */
export interface ExportProjectData {
  name: string
  style: {
    font: FontData & {
      mainFamily: string
      opentype: OpenType | null
    }
  }
  layout: LayoutData
  globalAdjustMetric: MetricData
  glyphList: ExportGlyphData[]
  ui: {
    width: number
    height: number
  }
  packCanvases: HTMLCanvasElement[]
}

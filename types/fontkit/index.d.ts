/**
 * Type declarations for fontkit v2
 *
 * fontkit is an advanced font engine for Node and the browser.
 * These declarations cover the subset of the API used by this project.
 */
declare module 'fontkit' {
  interface FontkitPathCommand {
    command:
      | 'moveTo'
      | 'lineTo'
      | 'quadraticCurveTo'
      | 'bezierCurveTo'
      | 'closePath'
    args: number[]
  }

  interface FontkitPath {
    commands: FontkitPathCommand[]
    bbox: { minX: number; minY: number; maxX: number; maxY: number }
    toSVG(): string
  }

  interface FontkitGlyph {
    id: number
    codePoints: number[]
    path: FontkitPath
    advanceWidth: number
    bbox: { minX: number; minY: number; maxX: number; maxY: number }
    name: string
  }

  interface FontkitGlyphPosition {
    xAdvance: number
    yAdvance: number
    xOffset: number
    yOffset: number
  }

  interface FontkitGlyphRun {
    glyphs: FontkitGlyph[]
    positions: FontkitGlyphPosition[]
  }

  interface FontkitVariationAxis {
    name: string
    min: number
    default: number
    max: number
  }

  interface FontkitNameRecord {
    [languageID: string]: string
  }

  interface FontkitNameTable {
    records: {
      postScriptName?: FontkitNameRecord
      fontFamily?: FontkitNameRecord
      fontSubfamily?: FontkitNameRecord
      fullName?: FontkitNameRecord
      [key: string]: FontkitNameRecord | undefined
    }
  }

  interface FontkitHheaTable {
    ascent: number
    descent: number
    lineGap: number
  }

  interface FontkitOS2Table {
    usWeightClass: number
    fsSelection: number
    sCapHeight?: number
    sxHeight?: number
  }

  interface FontkitPostTable {
    underlinePosition: number
    underlineThickness: number
  }

  interface FontkitFont {
    unitsPerEm: number
    ascent: number
    descent: number
    lineGap: number

    // Tables (may be absent in certain font formats or corrupted fonts)
    hhea?: FontkitHheaTable
    'OS/2'?: FontkitOS2Table
    post?: FontkitPostTable
    name?: FontkitNameTable

    // Variable font (absent for non-variable fonts)
    variationAxes?: Record<string, FontkitVariationAxis>
    namedVariations?: Record<string, Record<string, number>>
    getVariation(settings: Record<string, number> | string): FontkitFont

    // Glyph access
    glyphForCodePoint(codePoint: number): FontkitGlyph
    hasGlyphForCodePoint(codePoint: number): boolean
    getGlyph(glyphId: number, codePoints?: number[]): FontkitGlyph
    glyphsForString(string: string): FontkitGlyph[]

    // Layout
    layout(
      string: string,
      features?: string[] | Record<string, boolean>,
    ): FontkitGlyphRun
    widthOfGlyph(glyphId: number): number

    // Subsetting
    createSubset(): any

    // Number of glyphs
    numGlyphs: number
  }

  export function create(
    buffer: Uint8Array | Buffer,
    postscriptName?: string,
  ): FontkitFont
  export function open(
    filename: string,
    postscriptName?: string,
    callback?: (err: Error | null, font?: FontkitFont) => void,
  ): void
  export function openSync(
    filename: string,
    postscriptName?: string,
  ): FontkitFont

  export let logErrors: boolean
  export let defaultLanguage: string
  export function setDefaultLanguage(lang: string): void
  export function registerFormat(format: any): void
}

import { Project } from 'src/store'

import packageInfo from '../../../package.json'
import {
  BMFont,
  BMFontChars,
  BMFontCommon,
  BMFontInfo,
  BMFontKernings,
  BMFontMetadata,
  BMFontPage,
} from './type'

// http://www.angelcode.com/products/bmfont/doc/file_format.html
export default function toBmfInfo(
  project: Project,
  fontFamily = '',
  outputFileName?: string,
): BMFont {
  const {
    name,
    style,
    layout,
    globalAdjustMetric,
    glyphList,
    ui: { width, height, xFractional },
  } = project
  const fractionalBits = Math.max(0, Math.min(7, Math.round(xFractional || 0)))
  const fractionalScale = 1 << fractionalBits
  const { opentype, size } = style.font
  let fontScale = 1
  if (opentype) {
    fontScale = (1 / opentype.unitsPerEm) * size
  }

  // Extract bold/italic information from OpenType font
  let bold = 0
  let italic = 0
  if (opentype) {
    // Check OS/2 table for weight and style
    const os2Table = opentype.tables.os2
    if (os2Table) {
      // Weight classification: 400 = normal, 700+ = bold
      bold = os2Table.usWeightClass >= 700 ? 1 : 0
      // Style selection: check for italic bit
      italic = os2Table.fsSelection & 0x01 ? 1 : 0
    }

    // Fallback: check font names for style indicators
    if (!bold && !italic && opentype.names) {
      const familyName =
        opentype.names.fontFamily?.en || opentype.names.fullName?.en || ''
      const subfamilyName = opentype.names.fontSubfamily?.en || ''
      const fullName = `${familyName} ${subfamilyName}`.toLowerCase()

      bold = /bold|black|heavy|extra/.test(fullName) ? 1 : 0
      italic = /italic|oblique|slant/.test(fullName) ? 1 : 0
    }
  }

  const info: BMFontInfo = {
    face: fontFamily || style.font.mainFamily,
    size: style.font.size,
    bold,
    italic,
    charset: '',
    unicode: 1,
    stretchH: 100,
    smooth: 1,
    aa: 1,
    // BMFont standard: padding=[up, right, down, left]
    padding: [layout.padding, layout.padding, layout.padding, layout.padding],
    // BMFont standard: spacing=[horizontal, vertical]
    spacing: [layout.spacing, layout.spacing],
    outline: 0, // No outline by default
  }

  // Calculate base value with improved precision
  // Base is the distance from the absolute top of the line to the base of the characters
  const calculateBase = (): number => {
    // Use the font's baseline measurements for accurate base calculation
    const baselineDistance = style.font.alphabetic - style.font.top

    // Ensure base is never negative and has proper precision
    const base = Math.max(0, Math.round(baselineDistance))

    // Validate base value is reasonable (should be less than line height)
    const lineHeight = Math.round(style.font.size * style.font.lineHeight)
    return Math.min(base, lineHeight)
  }

  const common: BMFontCommon = {
    lineHeight: Math.round(style.font.size * style.font.lineHeight),
    base: calculateBase(),
    scaleW: width,
    scaleH: height,
    pages: layout.page,
    packed: 0,
    xFpBits: fractionalBits,
    alphaChnl: 0, // Alpha channel contains glyph data
    redChnl: 4, // Red channel set to one (full color)
    greenChnl: 4, // Green channel set to one (full color)
    blueChnl: 4, // Blue channel set to one (full color)
  }

  const finalFileName = outputFileName || name
  const pages: BMFontPage[] = Array.from(
    { length: layout.page },
    (_, index) => {
      if (layout.page === 1) {
        return {
          id: index,
          file: `${finalFileName}.png`,
        }
      } else {
        // For multi-page, use zero-padded numbering to ensure consistent filename lengths
        // Calculate the number of digits needed for the highest page number
        const maxPageIndex = layout.page - 1
        const digits = maxPageIndex.toString().length
        const paddedIndex = index.toString().padStart(digits, '0')

        return {
          id: index,
          file: `${finalFileName}_${paddedIndex}.png`,
        }
      }
    },
  )

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
      id: glyph.letter.codePointAt(0) || 0,
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
      xadvance: Math.ceil(
        (glyph.fontWidth +
          globalAdjustMetric.xAdvance +
          glyph.adjustMetric.xAdvance) *
          fractionalScale,
      ),
      page: glyph.page || 0,
      chnl: 15,
    }

    chars.list.push(info)
  })

  // High-performance kerning processing with caching and optimizations
  const kerningMap = new Map<string, number>()

  if (opentype) {
    // Build optimized glyph info array with pre-computed values (single pass)
    const validGlyphs: Array<{
      glyph: (typeof glyphList)[0]
      index: number
      id: number
    }> = []

    glyphList.forEach((glyph) => {
      const glyphIndex = opentype.charToGlyphIndex(glyph.letter)
      // Only include glyphs with valid indices to reduce loop iterations
      if (glyphIndex !== 0) {
        validGlyphs.push({
          glyph,
          index: glyphIndex,
          id: glyph.letter.codePointAt(0) || 0,
        })
      }
    })

    // Process kerning with pre-computed data (no Map lookups in hot path)
    for (let i = 0; i < validGlyphs.length; i++) {
      const first = validGlyphs[i]

      for (let j = 0; j < validGlyphs.length; j++) {
        const second = validGlyphs[j]

        // Direct access to cached values (much faster than Map.get())
        const opentypeKerning = opentype.getKerningValue(
          first.index,
          second.index,
        )
        const manualKerning = first.glyph.kerning.get(second.glyph.letter) || 0

        // Early termination for zero kerning
        if (opentypeKerning === 0 && manualKerning === 0) continue

        const amount = Math.round(
          (opentypeKerning * fontScale + manualKerning) * fractionalScale,
        )

        if (amount) {
          const key = `${first.id}-${second.id}`
          kerningMap.set(key, amount)
        }
      }
    }
  } else {
    // Process manual kerning settings (already optimal for this case)
    glyphList.forEach((glyph) => {
      glyph.kerning.forEach((amount, letter) => {
        if (amount) {
          const firstId = glyph.letter.codePointAt(0) || 0
          const secondId = letter.codePointAt(0) || 0
          const key = `${firstId}-${secondId}`
          kerningMap.set(key, Math.round(amount * fractionalScale))
        }
      })
    })
  }

  // Convert kerning map to sorted list
  kerningMap.forEach((amount, key) => {
    const [first, second] = key.split('-').map(Number)
    kernings.list.push({ first, second, amount })
  })
  kernings.count = kernings.list.length

  // Sort chars by ID and kernings by first, then second ID as per BMFont standard
  chars.list.sort((a, b) => a.id - b.id)
  kernings.list.sort((a, b) => a.first - b.first || a.second - b.second)

  // Generate comprehensive metadata for better file tracking and debugging
  const metadata: BMFontMetadata = {
    generatorName: 'SnowBamboo BMF',
    generatorVersion: packageInfo.version,
    generatorUrl: packageInfo.homepage || 'https://snowb.org/',
    generatedAt: new Date().toISOString(),
    formatVersion: 3,
    characterCount: chars.count,
    kerningPairCount: kernings.count,
    fontFamily: fontFamily || style.font.mainFamily,
    fontSize: style.font.size,
    padding: layout.padding,
    spacing: layout.spacing,
  }

  return {
    version: 3, // BMFont v3 format (supports full Unicode)
    metadata,
    info,
    common,
    pages,
    chars,
    kernings,
  }
}

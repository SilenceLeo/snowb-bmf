import packageInfo from '../../../package.json'
import getPageFileName from './getPageFileName'
import {
  BMFont,
  BMFontChars,
  BMFontCommon,
  BMFontDistanceField,
  BMFontInfo,
  BMFontKernings,
  BMFontMetadata,
  BMFontPage,
  ExportProjectData,
} from './type'

/**
 * Determine BMFont channel flags based on SDF mode and channel format.
 * Values: glyph=0, outline=1, glyph+outline=2, zero=3, one=4
 */
function getSdfChannelFlags(
  distanceField?: BMFontDistanceField,
  sdfChannel?: string,
): { alphaChnl: number; redChnl: number; greenChnl: number; blueChnl: number } {
  if (distanceField) {
    if (sdfChannel === 'alpha' || sdfChannel === 'alpha-inv') {
      // Distance in Alpha channel: RGB=one(4), A=glyph(0)
      return { alphaChnl: 0, redChnl: 4, greenChnl: 4, blueChnl: 4 }
    }
    // Distance in RGB channels (rgb / rgb-inv): RGB=glyph(0), A=one(4)
    return { alphaChnl: 4, redChnl: 0, greenChnl: 0, blueChnl: 0 }
  }
  // Normal mode: A=glyph(0), RGB=one(4)
  return { alphaChnl: 0, redChnl: 4, greenChnl: 4, blueChnl: 4 }
}

// http://www.angelcode.com/products/bmfont/doc/file_format.html
export default function toBmfInfo(
  projectData: ExportProjectData,
  fontFamily = '',
  outputFileName?: string,
  distanceField?: BMFontDistanceField,
): BMFont {
  const {
    name,
    style,
    layout,
    globalAdjustMetric,
    glyphList,
    xFractional,
    ui: { width, height },
  } = projectData
  const fractionalBits = Math.max(0, Math.min(7, Math.round(xFractional || 0)))
  const fractionalScale = 1 << fractionalBits
  const { opentype, size } = style.font
  let fontScale = 1
  if (opentype) {
    fontScale = size / opentype.unitsPerEm
  }

  // Extract bold/italic information from OpenType font
  let bold = 0
  let italic = 0
  if (opentype) {
    // Check OS/2 table for weight and style
    const os2Table = opentype.tables.os2
    if (os2Table) {
      // Heuristic: weight >= 700 implies bold. More accurate would be checking
      // fsSelection bit 5, but OS/2 table data may not be available from canvas API.
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
    scaleW: layout.packWidth ?? width,
    scaleH: layout.packHeight ?? height,
    pages: layout.page,
    packed: 0,
    xFpBits: fractionalBits,
    // Channel info: glyph=0, outline=1, glyph+outline=2, zero=3, one=4
    // Set based on where distance/glyph data is stored
    ...getSdfChannelFlags(distanceField, projectData.sdfChannel),
  }

  const finalFileName = outputFileName || name
  const pages: BMFontPage[] = Array.from(
    { length: layout.page },
    (_, index) => ({
      id: index,
      file: getPageFileName(finalFileName, index, layout.page),
    }),
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
    const charInfo = {
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

    chars.list.push(charInfo)
  })

  const kerningMap = new Map<string, number>()

  // Step 1: Manual kerning — always O(n * k_avg), typically sparse
  glyphList.forEach((glyph) => {
    const firstId = glyph.letter.codePointAt(0) || 0
    Object.entries(glyph.kerning).forEach(([letter, amount]) => {
      if (amount) {
        const secondId = letter.codePointAt(0) || 0
        kerningMap.set(
          `${firstId}-${secondId}`,
          Math.round(amount * fractionalScale),
        )
      }
    })
  })

  if (opentype) {
    // Build glyph-index → codePoint lookup for our glyph set
    const glyphIndexToId = new Map<number, number>()
    glyphList.forEach((glyph) => {
      const glyphIndex = opentype.charToGlyphIndex(glyph.letter)
      if (glyphIndex !== 0) {
        glyphIndexToId.set(glyphIndex, glyph.letter.codePointAt(0) || 0)
      }
    })

    // Step 2: Try direct kern table access — O(k) where k = total kern pairs
    // Uses opentype.js internal `kerningPairs` property (undocumented API).
    // If unavailable (e.g. API change), this step is silently skipped and
    // Step 3 (GPOS fallback) handles kerning extraction.
    // Note: Steps 2 and 3 are both additive to manual kerning (Step 1).
    // Most fonts use either kern table OR GPOS, not both, so overlap is rare.
    const opentypeAny = opentype as unknown as Record<string, unknown>
    const kernPairs: Record<string, number> | undefined =
      opentypeAny.kerningPairs as Record<string, number> | undefined

    if (kernPairs && typeof kernPairs === 'object') {
      Object.entries(kernPairs).forEach(([key, value]) => {
        if (value === 0) return
        const commaIdx = key.indexOf(',')
        const leftIdx = Number(key.slice(0, commaIdx))
        const rightIdx = Number(key.slice(commaIdx + 1))
        const leftId = glyphIndexToId.get(leftIdx)
        const rightId = glyphIndexToId.get(rightIdx)
        if (leftId !== undefined && rightId !== undefined) {
          const amount = Math.round(value * fontScale * fractionalScale)
          if (amount) {
            const mapKey = `${leftId}-${rightId}`
            // Manual kerning takes priority (already set in Step 1),
            // opentype value is additive
            const existing = kerningMap.get(mapKey)
            if (existing !== undefined) {
              const combined = existing + amount
              if (combined) kerningMap.set(mapKey, combined)
              else kerningMap.delete(mapKey)
            } else {
              kerningMap.set(mapKey, amount)
            }
          }
        }
      })
    }

    // Step 3: GPOS kerning fallback — O(n²) via position.getKerningValue.
    // Uses opentype.js internal `position.defaultKerningTables` (undocumented).
    // Values are additive with Steps 1-2. For fonts with both kern and GPOS
    // tables containing identical pairs, values accumulate (uncommon in practice).
    const position = opentypeAny.position as
      | { defaultKerningTables: unknown; getKerningValue: (tables: unknown, left: number, right: number) => number }
      | undefined
    const hasGPOS = !!position?.defaultKerningTables
    if (hasGPOS && position) {
      const validGlyphs: Array<{ index: number; id: number; letter: string }> =
        []
      glyphList.forEach((glyph) => {
        const glyphIndex = opentype.charToGlyphIndex(glyph.letter)
        if (glyphIndex !== 0) {
          validGlyphs.push({
            index: glyphIndex,
            id: glyph.letter.codePointAt(0) || 0,
            letter: glyph.letter,
          })
        }
      })

      for (let i = 0; i < validGlyphs.length; i++) {
        const first = validGlyphs[i]
        for (let j = 0; j < validGlyphs.length; j++) {
          const second = validGlyphs[j]
          const gposKerning = position.getKerningValue(
            position.defaultKerningTables,
            first.index,
            second.index,
          )
          if (gposKerning === 0) continue
          const amount = Math.round(gposKerning * fontScale * fractionalScale)
          if (amount) {
            const key = `${first.id}-${second.id}`
            const existing = kerningMap.get(key)
            if (existing !== undefined) {
              const combined = existing + amount
              if (combined) kerningMap.set(key, combined)
              else kerningMap.delete(key)
            } else {
              kerningMap.set(key, amount)
            }
          }
        }
      }
    }
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
    distanceField,
    pages,
    chars,
    kernings,
  }
}

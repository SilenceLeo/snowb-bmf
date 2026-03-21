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
    if (distanceField.fieldType === 'mtsdf') {
      // MTSDF: all 4 channels carry glyph/distance data
      return { alphaChnl: 0, redChnl: 0, greenChnl: 0, blueChnl: 0 }
    }
    if (distanceField.fieldType === 'psdf') {
      // PSDF: single-channel distance in RGB, A=one (opaque)
      return { alphaChnl: 4, redChnl: 0, greenChnl: 0, blueChnl: 0 }
    }
    if (distanceField.fieldType === 'msdf') {
      // MSDF: RGB carry per-channel distance, A=one (opaque)
      return { alphaChnl: 4, redChnl: 0, greenChnl: 0, blueChnl: 0 }
    }
    // SDF channel modes
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

  // Derive bold/italic from variationSettings or font OS/2 table
  let bold = 0
  let italic = 0
  const vs = style.font.variationSettings
  const os2 = opentype?.tables.os2

  // Bold: prefer wght axis, fallback to OS/2 usWeightClass
  if (vs?.wght !== undefined) {
    if (vs.wght >= 700) bold = 1
  } else if (os2 && os2.usWeightClass >= 700) {
    bold = 1
  }

  // Italic: prefer ital axis, fallback to OS/2 fsSelection
  if (vs?.ital !== undefined) {
    if (vs.ital > 0) italic = 1
  } else if (os2 && (os2.fsSelection & 0x01) !== 0) {
    italic = 1
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
      id: glyph.letter.codePointAt(0) ?? 0,
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
    const firstId = glyph.letter.codePointAt(0) ?? 0
    Object.entries(glyph.kerning).forEach(([letter, amount]) => {
      if (amount) {
        const secondId = letter.codePointAt(0) ?? 0
        kerningMap.set(
          `${firstId}-${secondId}`,
          Math.round(amount * fractionalScale),
        )
      }
    })
  })

  if (opentype) {
    // Apply variation settings for accurate kerning values
    const vs = style.font.variationSettings
    const activeFont =
      vs && Object.keys(vs).length > 0 ? opentype.getVariation(vs) : opentype

    // Step 2: Extract kerning via fontkit's layout engine (handles both kern and GPOS).
    // Uses AdaptedFont.getKerningValue() which internally uses fontkit's layout()
    // to compute the kerning adjustment between glyph pairs. O(n²).
    const validGlyphs: Array<{ index: number; id: number }> = []
    glyphList.forEach((glyph) => {
      const glyphIndex = activeFont.charToGlyphIndex(glyph.letter)
      if (glyphIndex !== 0) {
        validGlyphs.push({
          index: glyphIndex,
          id: glyph.letter.codePointAt(0) ?? 0,
        })
      }
    })

    for (let i = 0; i < validGlyphs.length; i++) {
      const first = validGlyphs[i]
      for (let j = 0; j < validGlyphs.length; j++) {
        const second = validGlyphs[j]
        const kerningValue = activeFont.getKerningValue(
          first.index,
          second.index,
        )
        if (kerningValue === 0) continue
        const amount = Math.round(kerningValue * fontScale * fractionalScale)
        if (amount) {
          const key = `${first.id}-${second.id}`
          // Manual kerning (Step 1) is additive with font kerning
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

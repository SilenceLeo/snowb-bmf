/**
 * Font Adapter — wraps fontkit to provide an opentype.js-compatible interface.
 *
 * This adapter allows the rest of the codebase to consume fonts through
 * the same API shape that opentype.js exposed, while gaining fontkit's
 * variable-font interpolation (gvar table support).
 */
import { create as fontkitCreate } from 'fontkit'
import type { FontkitFont, FontkitGlyph, FontkitPathCommand } from 'fontkit'

// ============================================================================
// Public Types (compatible with former opentype.js types)
// ============================================================================

export type PathCommand =
  | { type: 'M'; x: number; y: number }
  | { type: 'L'; x: number; y: number }
  | { type: 'Q'; x1: number; y1: number; x: number; y: number }
  | {
      type: 'C'
      x1: number
      y1: number
      x2: number
      y2: number
      x: number
      y: number
    }
  | { type: 'Z' }

export interface AdaptedPath {
  commands: PathCommand[]
  getBoundingBox(): { x1: number; y1: number; x2: number; y2: number }
  strokeWidth: number
}

export interface AdaptedGlyph {
  unicode: number | undefined
  getPath(x: number, y: number, fontSize: number): AdaptedPath
}

export interface AdaptedFont {
  unitsPerEm: number
  ascender: number
  descender: number
  tables: {
    // hhea is always populated by wrapFont (falls back to font.ascent/descent)
    hhea: { ascent: number; descent: number; lineGap: number }
    // os2/post may be absent if the font lacks these tables
    os2: { usWeightClass: number; fsSelection: number } | undefined
    post: { underlinePosition: number; underlineThickness: number } | undefined
  }
  names: {
    postScriptName: Record<string, string> | undefined
    fontFamily: Record<string, string> | undefined
    fullName: Record<string, string> | undefined
    fontSubfamily: Record<string, string> | undefined
  }

  charToGlyph(letter: string): AdaptedGlyph
  charToGlyphIndex(letter: string): number
  getAdvanceWidth(letter: string, fontSize: number): number
  getKerningValue(leftIndex: number, rightIndex: number): number

  // Variable font
  getVariation(coordinates: Record<string, number>): AdaptedFont
  variationAxes: {
    tag: string
    name: string
    minValue: number
    defaultValue: number
    maxValue: number
  }[]
  variationInstances: { name: string; coordinates: Record<string, number> }[]
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Convert fontkit path commands (font-unit, Y-up) to opentype.js-style
 * PathCommands (pixel-scaled, Y-down) given an origin (x, y) and fontSize.
 *
 * opentype.js convention:
 *   scaledX = x + cmd.x * scale
 *   scaledY = y - cmd.y * scale   (Y flipped)
 */
function convertAndScaleCommands(
  fkCommands: FontkitPathCommand[],
  originX: number,
  originY: number,
  scale: number,
): PathCommand[] {
  const sx = (v: number) => originX + v * scale
  const sy = (v: number) => originY - v * scale

  return fkCommands.map((cmd) => {
    switch (cmd.command) {
      case 'moveTo':
        return { type: 'M' as const, x: sx(cmd.args[0]), y: sy(cmd.args[1]) }
      case 'lineTo':
        return { type: 'L' as const, x: sx(cmd.args[0]), y: sy(cmd.args[1]) }
      case 'quadraticCurveTo':
        return {
          type: 'Q' as const,
          x1: sx(cmd.args[0]),
          y1: sy(cmd.args[1]),
          x: sx(cmd.args[2]),
          y: sy(cmd.args[3]),
        }
      case 'bezierCurveTo':
        return {
          type: 'C' as const,
          x1: sx(cmd.args[0]),
          y1: sy(cmd.args[1]),
          x2: sx(cmd.args[2]),
          y2: sy(cmd.args[3]),
          x: sx(cmd.args[4]),
          y: sy(cmd.args[5]),
        }
      case 'closePath':
        return { type: 'Z' as const }
      default:
        return { type: 'Z' as const }
    }
  })
}

/**
 * Wrap a fontkit Glyph into the AdaptedGlyph interface.
 */
function wrapGlyph(glyph: FontkitGlyph, font: FontkitFont): AdaptedGlyph {
  return {
    unicode:
      glyph.codePoints && glyph.codePoints.length > 0
        ? glyph.codePoints[0]
        : undefined,
    getPath(x: number, y: number, fontSize: number): AdaptedPath {
      const scale = fontSize / font.unitsPerEm
      const commands = convertAndScaleCommands(glyph.path.commands, x, y, scale)

      // Compute bounding box from the glyph's bbox (font-units) scaled
      const bbox = glyph.bbox
      const x1 = x + bbox.minX * scale
      const y1 = y - bbox.maxY * scale // maxY in font-units → minY on screen
      const x2 = x + bbox.maxX * scale
      const y2 = y - bbox.minY * scale // minY in font-units → maxY on screen

      return {
        commands,
        getBoundingBox: () => ({ x1, y1, x2, y2 }),
        strokeWidth: 0,
      }
    },
  }
}

/**
 * Wrap a FontkitFont into the AdaptedFont interface.
 */
function wrapFont(fk: FontkitFont): AdaptedFont {
  // Cache for glyph codePoint → glyph lookups
  const glyphCache = new Map<number, FontkitGlyph>()
  // Cache for getVariation() — keyed by JSON-serialized coordinates
  const variationCache = new Map<string, AdaptedFont>()

  function getFkGlyph(codePoint: number): FontkitGlyph {
    let g = glyphCache.get(codePoint)
    if (!g) {
      g = fk.glyphForCodePoint(codePoint)
      glyphCache.set(codePoint, g)
    }
    return g
  }

  // Build variation axes / instances from fontkit's native data
  // fontkit may crash on fonts with missing name table entries (axis.name.en)
  let variationAxes: AdaptedFont['variationAxes'] = []
  try {
    variationAxes = Object.entries(fk.variationAxes ?? {}).map(
      ([tag, axis]) => ({
        tag,
        name: axis.name || tag,
        minValue: axis.min,
        defaultValue: axis.default,
        maxValue: axis.max,
      }),
    )
  } catch {
    variationAxes = []
  }

  // fontkit may crash on fonts with missing name table entries (instance.name.en)
  let variationInstances: AdaptedFont['variationInstances'] = []
  try {
    variationInstances = Object.entries(fk.namedVariations ?? {}).map(
      ([name, coordinates]) => ({ name, coordinates }),
    )
  } catch {
    variationInstances = []
  }

  // Map fontkit tables to the opentype.js-compatible shape
  const os2 = fk['OS/2']
  const post = fk.post

  const adapted: AdaptedFont = {
    unitsPerEm: fk.unitsPerEm,
    ascender: fk.ascent,
    descender: fk.descent,
    tables: {
      hhea: {
        ascent: fk.hhea?.ascent ?? fk.ascent,
        descent: fk.hhea?.descent ?? fk.descent,
        lineGap: fk.hhea?.lineGap ?? fk.lineGap ?? 0,
      },
      os2: os2
        ? { usWeightClass: os2.usWeightClass, fsSelection: os2.fsSelection }
        : undefined,
      post: post
        ? {
            underlinePosition: post.underlinePosition ?? 0,
            underlineThickness: post.underlineThickness ?? 0,
          }
        : undefined,
    },
    names: {
      postScriptName: fk.name?.records?.postScriptName,
      fontFamily: fk.name?.records?.fontFamily,
      fullName: fk.name?.records?.fullName,
      fontSubfamily: fk.name?.records?.fontSubfamily,
    },

    charToGlyph(letter: string): AdaptedGlyph {
      const cp = letter.codePointAt(0) ?? 0
      return wrapGlyph(cp === 0 ? fk.getGlyph(0) : getFkGlyph(cp), fk)
    },

    charToGlyphIndex(letter: string): number {
      const cp = letter.codePointAt(0)
      if (cp === undefined) return 0
      return getFkGlyph(cp).id
    },

    getAdvanceWidth(letter: string, fontSize: number): number {
      const cp = letter.codePointAt(0)
      if (cp === undefined) return 0
      const g = getFkGlyph(cp)
      return g.advanceWidth * (fontSize / fk.unitsPerEm)
    },

    getKerningValue(leftIndex: number, rightIndex: number): number {
      // Use fontkit's layout engine to extract kerning between two glyph indices.
      // Layout the two characters and compare the first position's xAdvance
      // with the glyph's default advanceWidth.
      //
      // Note: Unlike opentype.js which only reads kern/GPOS PairPos tables,
      // fontkit's layout() runs the full GSUB+GPOS shaping pipeline. For
      // most Latin/CJK fonts this produces identical results, but complex
      // scripts (Arabic, Devanagari) may include additional GPOS adjustments
      // beyond pure kerning. This is acceptable for bitmap font generation.
      try {
        const leftGlyph = fk.getGlyph(leftIndex)
        const rightGlyph = fk.getGlyph(rightIndex)
        if (
          !leftGlyph ||
          !rightGlyph ||
          !leftGlyph.codePoints?.length ||
          !rightGlyph.codePoints?.length
        ) {
          return 0
        }
        const leftChar = String.fromCodePoint(leftGlyph.codePoints[0])
        const rightChar = String.fromCodePoint(rightGlyph.codePoints[0])
        const run = fk.layout(leftChar + rightChar)
        if (!run.positions || run.positions.length < 1) return 0
        const actualAdvance = run.positions[0].xAdvance
        const defaultAdvance = leftGlyph.advanceWidth
        return actualAdvance - defaultAdvance
      } catch {
        return 0
      }
    },

    getVariation(coordinates: Record<string, number>): AdaptedFont {
      // Sorted key ensures cache hits regardless of property insertion order
      const key = Object.keys(coordinates)
        .sort()
        .map((k) => `${k}:${coordinates[k]}`)
        .join(',')
      let cached = variationCache.get(key)
      if (!cached) {
        const varFont = fk.getVariation(coordinates)
        cached = wrapFont(varFont)
        variationCache.set(key, cached)
      }
      return cached
    },

    variationAxes,
    variationInstances,
  }

  return adapted
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Create an AdaptedFont from a raw font buffer (ArrayBuffer or Uint8Array).
 * Drop-in replacement for `opentype.parse(buffer, { lowMemory: true })`.
 */
export function createAdaptedFont(
  buffer: ArrayBuffer | Uint8Array,
): AdaptedFont {
  // fontkit.create() requires Uint8Array; wrapping ArrayBuffer creates a zero-copy view
  const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  const fk = fontkitCreate(uint8)
  return wrapFont(fk)
}

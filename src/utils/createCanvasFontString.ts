import is from './is'

/**
 * Font style configuration interface
 * Based on CSS font property specification: https://developer.mozilla.org/en-US/docs/Web/CSS/font
 */
export interface FontStyleConfig {
  /** Font style - default: 'normal' */
  fontStyle?: 'normal' | 'italic' | 'oblique'
  /** Font variant - default: 'normal' */
  fontVariant?: 'normal' | 'small-caps'
  /** Font weight - default: 'normal' */
  fontWeight?:
    | 'normal'
    | 'bold'
    | 'lighter'
    | 'bolder'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
  /** Font size - required, supports number (px) or CSS length string */
  fontSize?: string | number
  /** Line height - optional, used in combination with fontSize */
  lineHeight?: string | number
  /** Font family - required */
  fontFamily?: string
}

/** Default font configuration */
const DEFAULT_CONFIG: Required<
  Pick<FontStyleConfig, 'fontSize' | 'fontFamily'>
> = {
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
} as const

/** Valid CSS length units */
const CSS_UNITS = [
  'px',
  'em',
  'rem',
  'pt',
  'pc',
  'in',
  'cm',
  'mm',
  'ex',
  'ch',
  'vw',
  'vh',
  'vmin',
  'vmax',
  '%',
] as const

/**
 * Validate and normalize font size
 * @param fontSize Input font size
 * @returns Normalized font size string
 */
function normalizeFontSize(fontSize: string | number | undefined): string {
  // If it's a number, convert to px units
  if (is.num(fontSize)) {
    return fontSize <= 0 ? `${DEFAULT_CONFIG.fontSize}px` : `${fontSize}px`
  }

  // If it's a string, validate format
  if (typeof fontSize === 'string') {
    const trimmed = fontSize.trim()
    if (!trimmed) {
      return `${DEFAULT_CONFIG.fontSize}px`
    }

    // Check if it contains valid CSS units
    const hasValidUnit = CSS_UNITS.some((unit) => trimmed.endsWith(unit))
    if (hasValidUnit) {
      const numericPart = parseFloat(trimmed)
      if (!isNaN(numericPart) && numericPart > 0) {
        return trimmed
      }
    }
  }

  // Fallback to default value
  return `${DEFAULT_CONFIG.fontSize}px`
}

/**
 * Normalize font family name
 * @param fontFamily Font family
 * @returns Normalized font family string
 */
function normalizeFontFamily(fontFamily: string | undefined): string {
  if (!fontFamily || typeof fontFamily !== 'string') {
    return DEFAULT_CONFIG.fontFamily
  }

  const trimmed = fontFamily.trim()
  return trimmed || DEFAULT_CONFIG.fontFamily
}

/**
 * Normalize line height
 * @param lineHeight Line height value
 * @returns Normalized line height string or null
 */
function normalizeLineHeight(
  lineHeight: string | number | undefined,
): string | null {
  if (lineHeight === undefined || lineHeight === null) {
    return null
  }

  if (is.num(lineHeight)) {
    return lineHeight > 0 ? String(lineHeight) : null
  }

  if (typeof lineHeight === 'string') {
    const trimmed = lineHeight.trim()
    if (!trimmed) {
      return null
    }

    // Support numeric values or values with units
    if (/^(\d*\.?\d+)(px|em|rem|%)?$/.test(trimmed)) {
      return trimmed
    }
  }

  return null
}

/**
 * Generate Canvas-compatible font style string
 *
 * CSS font property syntax: [font-style] [font-variant] [font-weight] font-size[/line-height] font-family
 *
 * @param config Font style configuration
 * @returns Canvas-compatible font style string
 *
 * @example
 * ```typescript
 * createCanvasFontString({ fontSize: 16, fontFamily: 'Arial' })
 * // => "16px Arial"
 *
 * createCanvasFontString({
 *   fontStyle: 'italic',
 *   fontWeight: 'bold',
 *   fontSize: '1.2em',
 *   lineHeight: 1.4,
 *   fontFamily: 'Helvetica, sans-serif'
 * })
 * // => "italic bold 1.2em/1.4 Helvetica, sans-serif"
 * ```
 */
export default function createCanvasFontString(
  config: FontStyleConfig = {},
): string {
  const parts: string[] = []

  // 1. font-style (optional)
  if (config.fontStyle && config.fontStyle !== 'normal') {
    parts.push(config.fontStyle)
  }

  // 2. font-variant (optional)
  if (config.fontVariant && config.fontVariant !== 'normal') {
    parts.push(config.fontVariant)
  }

  // 3. font-weight (optional)
  if (config.fontWeight && config.fontWeight !== 'normal') {
    parts.push(String(config.fontWeight))
  }

  // 4. font-size (required) and line-height (optional)
  const fontSize = normalizeFontSize(config.fontSize)
  const lineHeight = normalizeLineHeight(config.lineHeight)

  if (lineHeight) {
    parts.push(`${fontSize}/${lineHeight}`)
  } else {
    parts.push(fontSize)
  }

  // 5. font-family (required)
  const fontFamily = normalizeFontFamily(config.fontFamily)
  parts.push(fontFamily)

  return parts.join(' ')
}

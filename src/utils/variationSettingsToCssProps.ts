export interface VariationCssProps {
  fontWeight?: number
  fontStyle?: 'normal' | 'italic' | 'oblique'
  fontStretch?: string
  remainingSettings: Record<string, number>
}

/**
 * Extract CSS font properties from variation settings.
 * Maps registered axes (wght, ital, slnt, wdth) to standard CSS properties,
 * which work reliably in ctx.font across all browsers supporting variable fonts.
 * Non-registered axes are returned in remainingSettings for ctx.fontVariationSettings.
 */
export default function variationSettingsToCssProps(
  settings: Record<string, number> | undefined,
): VariationCssProps {
  if (!settings || Object.keys(settings).length === 0) {
    return { remainingSettings: {} }
  }

  const result: VariationCssProps = { remainingSettings: {} }

  for (const [tag, value] of Object.entries(settings)) {
    switch (tag) {
      case 'wght':
        result.fontWeight = Math.round(value)
        break
      case 'ital':
        if (value === 1) {
          result.fontStyle = 'italic'
        }
        break
      case 'slnt':
        // slnt only applies if ital didn't already set fontStyle, and only when non-zero
        if (!result.fontStyle && value !== 0) {
          result.fontStyle = 'oblique'
        }
        break
      case 'wdth':
        result.fontStretch = `${value}%`
        break
      default:
        result.remainingSettings[tag] = value
        break
    }
  }

  return result
}

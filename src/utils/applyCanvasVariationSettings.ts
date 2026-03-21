/**
 * Apply font variation settings and fontStretch to a canvas context.
 * - fontStretch: Chrome 99+ (for wdth axis via CSS property)
 * - fontVariationSettings: Chrome 117+ (all axes including wdth, wght etc.)
 *
 * Registered axes (wght, ital) are ALSO handled via ctx.font shorthand
 * for cross-browser compatibility. This function provides additional
 * coverage on Chrome 117+ and handles non-registered custom axes.
 */
export default function applyCanvasVariationSettings(
  ctx: CanvasRenderingContext2D,
  settings: Record<string, number>,
  fontStretch?: string,
): void {
  // fontStretch (Chrome 99+)
  if (fontStretch && 'fontStretch' in ctx) {
    ;(ctx as any).fontStretch = fontStretch
  }

  // fontVariationSettings (Chrome 117+), all variation axes
  if ('fontVariationSettings' in ctx) {
    const cssValue = Object.entries(settings)
      .map(([tag, val]) => `"${tag}" ${val}`)
      .join(', ')
    ;(ctx as any).fontVariationSettings = cssValue || 'normal'
  }
}

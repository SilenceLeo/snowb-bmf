/**
 * Style Setter Factory - DRY helper for Fill/Stroke setters
 *
 * Fill and Stroke share identical setter patterns (setType, setColor,
 * gradient operations, pattern operations). This factory generates
 * type-safe setters for any FillData-compatible observable path.
 */
import { type Observable, batch, opaqueObject } from '@legendapp/state'
import type {
  FillData,
  FillType,
  GradientPaletteItem,
  GradientType,
  Repetition,
} from 'src/types/style'

// ============================================================================
// Module-level pattern image storage
// HTMLImageElement is kept outside the observable to avoid Legend State warnings.
// The observable's patternTexture.src field provides reactivity triggers.
// ============================================================================

const _patternImages: { fill: HTMLImageElement | null; stroke: HTMLImageElement | null } = {
  fill: null,
  stroke: null,
}

/**
 * Get the pattern image for a given fill type (fill or stroke).
 * The image is stored outside Legend State observables to avoid
 * "[legend-state] Set an HTMLElement into state" warnings.
 */
export function getPatternImage(type: 'fill' | 'stroke'): HTMLImageElement | null {
  return _patternImages[type]
}

/**
 * Reset all pattern images. Called during store reset.
 */
export function resetPatternImages(): void {
  _patternImages.fill = null
  _patternImages.stroke = null
}

/**
 * Generated fill-style setters for a given observable path
 */
export interface FillSetters {
  setType: (type: FillType) => void
  setColor: (color: string) => void
  setGradientType: (type: GradientType) => void
  setGradientAngle: (angle: number) => void
  addGradientColor: (offset?: number, color?: string) => void
  updateGradientPalette: (palette: GradientPaletteItem[]) => void
  setPatternImage: (buffer: ArrayBuffer) => void
  setPatternRepetition: (repetition: Repetition) => void
  setPatternScale: (scale: number) => void
}

/**
 * Create fill-style setters for a given observable FillData path.
 *
 * @param fill$ - Observable pointing to a FillData node
 * @param label - Label for error logging (e.g. 'fill', 'stroke')
 */
export function createFillSetters(
  fill$: Observable<FillData>,
  label: 'fill' | 'stroke',
): FillSetters {
  // Monotonically increasing counter to handle race conditions when
  // setPatternImage is called rapidly in succession. Only the most
  // recent load applies its result.
  let patternLoadVersion = 0

  return {
    setType(type: FillType) {
      fill$.type.set(type)
    },

    setColor(color: string) {
      fill$.color.set(color)
    },

    setGradientType(type: GradientType) {
      fill$.gradient.type.set(type)
    },

    setGradientAngle(angle: number) {
      fill$.gradient.angle.set(angle)
    },

    addGradientColor(offset = 0, color = 'rgba(0,0,0,1)') {
      const palette = fill$.gradient.palette.get()
      const ids = palette.map((c) => c.id)
      const nextId = ids.length === 0 ? 1 : Math.max(...ids) + 1

      fill$.gradient.palette.set([...palette, { offset, color, id: nextId }])
    },

    updateGradientPalette(palette: GradientPaletteItem[]) {
      fill$.gradient.palette.set(palette)
    },

    setPatternImage(buffer: ArrayBuffer) {
      const currentVersion = ++patternLoadVersion
      const src = URL.createObjectURL(new Blob([buffer]))
      const img = new Image()
      img.onload = () => {
        // Only apply if this is still the most recent load
        if (currentVersion !== patternLoadVersion) {
          URL.revokeObjectURL(src)
          img.onload = null
          img.onerror = null
          return
        }
        const oldSrc = fill$.patternTexture.src.get()
        if (oldSrc) {
          URL.revokeObjectURL(oldSrc)
        }
        _patternImages[label] = img
        batch(() => {
          fill$.patternTexture.buffer.set(opaqueObject(buffer))
          fill$.patternTexture.src.set(src)
        })
        img.onload = null
        img.onerror = null
      }
      img.onerror = () => {
        // Release the new URL on failure, keep old URL intact in store
        URL.revokeObjectURL(src)
        img.onload = null
        img.onerror = null
        console.error(`[StyleStore] Failed to load ${label} pattern image`)
      }
      img.src = src
    },

    setPatternRepetition(repetition: Repetition) {
      fill$.patternTexture.repetition.set(repetition)
    },

    setPatternScale(scale: number) {
      fill$.patternTexture.scale.set(scale)
    },
  }
}

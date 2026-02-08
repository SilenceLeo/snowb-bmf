/**
 * Style Setter Factory - DRY helper for Fill/Stroke setters
 *
 * Fill and Stroke share identical setter patterns (setType, setColor,
 * gradient operations, pattern operations). This factory generates
 * type-safe setters for any FillData-compatible observable path.
 */
import { type Observable, batch } from '@legendapp/state'
import type {
  FillData,
  FillType,
  GradientPaletteItem,
  GradientType,
  Repetition,
} from 'src/types/style'

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
  label: string,
): FillSetters {
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
      const src = URL.createObjectURL(new Blob([buffer]))
      const img = new Image()
      img.onload = () => {
        // Read oldSrc at load time (not at call time) to avoid race condition
        // when setPatternImage is called rapidly in succession
        const oldSrc = fill$.patternTexture.src.get()
        if (oldSrc) {
          URL.revokeObjectURL(oldSrc)
        }
        batch(() => {
          fill$.patternTexture.buffer.set(buffer)
          fill$.patternTexture.image.set(img)
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

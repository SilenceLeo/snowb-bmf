/**
 * Glyph Store - Legend State implementation
 *
 * Provides fine-grained reactive state management for glyphs,
 * optimized for high-frequency batch updates during packing operations.
 *
 * Key optimizations:
 * 1. batch() for grouping multiple updates into single notification
 * 2. Observable objects with direct property access via get()/set()
 * 3. Memo/For components for fine-grained DOM updates
 */
import { batch, observable, observe, opaqueObject } from '@legendapp/state'

import { DEBUG_CONFIG, PERFORMANCE_THRESHOLDS } from './config'
import type {
  FontGlyphData,
  GlyphInfoUpdate,
  GlyphPositionUpdate,
  GlyphType,
  ImageGlyphData,
} from './types'

// ============================================================================
// Module-level DOM element storage
// HTMLCanvasElement is kept outside the observable to avoid Legend State
// "[legend-state] Set an HTMLElement into state" warnings.
// The observable uses a version counter to trigger reactivity.
// ============================================================================

let _sourceCanvas: HTMLCanvasElement | null = null

/**
 * Get the source canvas (stored outside observable).
 */
export function getSourceCanvas(): HTMLCanvasElement | null {
  return _sourceCanvas
}

// ============================================================================
// Store State
// ============================================================================

/**
 * Main glyph store - observable state
 */
export const glyphStore$ = observable({
  // Font glyphs indexed by letter
  glyphs: {} as Record<string, FontGlyphData>,

  // Image glyphs array
  imageGlyphs: [] as ImageGlyphData[],

  // Packing state
  packing: {
    isPacking: false,
    isRenderingGlyphs: false,
    sourceCanvasVersion: 0,
    packCanvases: opaqueObject([] as HTMLCanvasElement[]),
  },

  // Version counter: increments on glyph data changes (dimensions/style),
  // but NOT on position-only changes (x, y, page from packing).
  glyphDataVersion: 0,
})

// ============================================================================
// Glyph Creation
// ============================================================================

/**
 * Create a new font glyph with default values
 */
export function createFontGlyph(letter: string): FontGlyphData {
  return {
    type: 'text' as const,
    letter,
    x: 0,
    y: 0,
    page: -1,
    width: 0,
    height: 0,
    fontWidth: 0,
    fontHeight: 0,
    trimOffsetTop: 0,
    trimOffsetLeft: 0,
    canvasX: 0,
    canvasY: 0,
    kerning: {},
    adjustMetric: { xAdvance: 0, xOffset: 0, yOffset: 0 },
  }
}

/**
 * Generate a unique ID for image glyphs (used as stable React key).
 * Combines Date.now() with an incrementing counter to guarantee uniqueness
 * even when multiple glyphs are created within the same millisecond.
 */
let imageGlyphUidCounter = 0
export function generateImageGlyphUid(): string {
  return `img-${Date.now()}-${++imageGlyphUidCounter}`
}

/**
 * Create a new image glyph with default values
 */
export function createImageGlyph(
  letter: string,
  fileInfo?: { fileName?: string; filePath?: string; fileType?: string },
): ImageGlyphData {
  return {
    type: 'image' as const,
    letter,
    uid: generateImageGlyphUid(),
    selected: false,
    source: null,
    x: 0,
    y: 0,
    page: -1,
    width: 0,
    height: 0,
    fontWidth: 0,
    fontHeight: 0,
    trimOffsetTop: 0,
    trimOffsetLeft: 0,
    canvasX: 0,
    canvasY: 0,
    kerning: {},
    adjustMetric: { xAdvance: 0, xOffset: 0, yOffset: 0 },
    ...fileInfo,
  }
}

// ============================================================================
// Glyph Management
// ============================================================================

/**
 * Add a font glyph to the store
 */
export function addGlyph(letter: string): FontGlyphData {
  const existing = glyphStore$.glyphs[letter].get()
  if (existing) {
    return existing
  }

  const glyph = createFontGlyph(letter)
  glyphStore$.glyphs[letter].set(glyph)
  return glyph
}

/**
 * Remove a font glyph from the store
 */
export function removeGlyph(letter: string): void {
  glyphStore$.glyphs[letter].delete()
}

/**
 * Get a font glyph by letter
 */
export function getGlyph(letter: string): FontGlyphData | undefined {
  return glyphStore$.glyphs[letter].get()
}

/**
 * Add multiple glyphs in batch
 */
export function addGlyphsBatch(letters: string[]): void {
  batch(() => {
    letters.forEach((letter) => {
      if (!glyphStore$.glyphs[letter].get()) {
        glyphStore$.glyphs[letter].set(createFontGlyph(letter))
      }
    })
  })
}

// ============================================================================
// Image Glyph Management
// ============================================================================

/**
 * Add an image glyph
 */
export function addImageGlyph(imageGlyph: ImageGlyphData): void {
  glyphStore$.imageGlyphs.push(imageGlyph)
}

/**
 * Remove an image glyph
 */
export function removeImageGlyph(index: number): void {
  const imageGlyphs = glyphStore$.imageGlyphs.get()
  if (index >= 0 && index < imageGlyphs.length) {
    glyphStore$.imageGlyphs.set(imageGlyphs.filter((_, i) => i !== index))
  }
}

/**
 * Find image glyph by letter
 */
export function findImageGlyph(letter: string): ImageGlyphData | undefined {
  return glyphStore$.imageGlyphs
    .get()
    .find((img) => img.letter === letter && img.selected)
}

// ============================================================================
// Batch Position Updates (Core Performance Optimization)
// ============================================================================

/**
 * Batch update glyph positions
 *
 * This is the CRITICAL performance optimization function.
 * Uses Legend State batch() to group all position updates into a single
 * notification, avoiding hundreds/thousands of individual React re-renders.
 *
 * @param updates - Array of position updates
 */
export function batchUpdateGlyphPositions(
  updates: GlyphPositionUpdate[],
): void {
  const startTime = DEBUG_CONFIG.logBatchUpdates ? performance.now() : 0

  batch(() => {
    // Pre-build index map for O(1) image glyph lookups using uid as key
    // to correctly handle multiple image glyphs with the same letter
    const imageGlyphs = glyphStore$.imageGlyphs.get()
    const imageIndexMap = new Map<string, number>()
    imageGlyphs.forEach((img, i) => {
      if (img.selected) imageIndexMap.set(img.uid, i)
    })

    updates.forEach(({ letter, x, y, page, type, uid }) => {
      if (type === 'image' && uid) {
        const index = imageIndexMap.get(uid)
        if (index !== undefined) {
          glyphStore$.imageGlyphs[index].x.set(x)
          glyphStore$.imageGlyphs[index].y.set(y)
          glyphStore$.imageGlyphs[index].page.set(page)
        }
      } else {
        // Update font glyph position
        const glyph = glyphStore$.glyphs[letter]
        if (glyph.get()) {
          glyph.x.set(x)
          glyph.y.set(y)
          glyph.page.set(page)
        }
      }
    })
  })

  if (DEBUG_CONFIG.logBatchUpdates) {
    const duration = performance.now() - startTime
    if (duration > PERFORMANCE_THRESHOLDS.BATCH_UPDATE_WARN) {
      console.warn(
        `[GlyphStore] Batch position update took ${duration.toFixed(2)}ms for ${updates.length} glyphs`,
      )
    } else {
      console.log(
        `[GlyphStore] Batch position update: ${updates.length} glyphs in ${duration.toFixed(2)}ms`,
      )
    }
  }
}

/**
 * Reset all glyph page assignments to unassigned (-1)
 */
export function resetGlyphPages(): void {
  batch(() => {
    // Reset font glyphs
    const glyphs = glyphStore$.glyphs.get()
    Object.keys(glyphs).forEach((letter) => {
      glyphStore$.glyphs[letter].page.set(-1)
    })

    // Reset image glyphs
    const imageGlyphs = glyphStore$.imageGlyphs.get()
    imageGlyphs.forEach((_, index) => {
      glyphStore$.imageGlyphs[index].page.set(-1)
    })
  })
}

/**
 * Reset failed glyph positions (glyphs not in packed set)
 */
export function resetFailedGlyphPositions(packedLetters: Set<string>): void {
  batch(() => {
    // Reset unpacked font glyphs (page=-1 means unassigned, consistent with createFontGlyph)
    const glyphs = glyphStore$.glyphs.get()
    Object.keys(glyphs).forEach((letter) => {
      if (!packedLetters.has(letter)) {
        glyphStore$.glyphs[letter].x.set(0)
        glyphStore$.glyphs[letter].y.set(0)
        glyphStore$.glyphs[letter].page.set(-1)
      }
    })

    // Reset unpacked image glyphs
    const imageGlyphs = glyphStore$.imageGlyphs.get()
    imageGlyphs.forEach((img, index) => {
      if (!packedLetters.has(img.letter)) {
        glyphStore$.imageGlyphs[index].x.set(0)
        glyphStore$.imageGlyphs[index].y.set(0)
        glyphStore$.imageGlyphs[index].page.set(-1)
      }
    })
  })
}

// ============================================================================
// Batch Glyph Info Updates
// ============================================================================

/**
 * Batch update glyph rendering info
 * Used after font glyph generation completes
 */
export function batchUpdateGlyphInfo(updates: GlyphInfoUpdate[]): void {
  const startTime = DEBUG_CONFIG.logBatchUpdates ? performance.now() : 0

  batch(() => {
    updates.forEach((update) => {
      const glyph = glyphStore$.glyphs[update.letter]
      if (glyph.get()) {
        glyph.width.set(update.width)
        glyph.height.set(update.height)
        glyph.fontWidth.set(update.fontWidth)
        glyph.fontHeight.set(update.fontHeight)
        glyph.trimOffsetTop.set(update.trimOffsetTop)
        glyph.trimOffsetLeft.set(update.trimOffsetLeft)
        glyph.canvasX.set(update.canvasX)
        glyph.canvasY.set(update.canvasY)
      }
    })
    // Increment inside batch for single notification
    glyphStore$.glyphDataVersion.set(glyphStore$.glyphDataVersion.get() + 1)
  })

  if (DEBUG_CONFIG.logBatchUpdates) {
    const duration = performance.now() - startTime
    if (duration > PERFORMANCE_THRESHOLDS.BATCH_UPDATE_WARN) {
      console.warn(
        `[GlyphStore] Batch glyph info update took ${duration.toFixed(2)}ms for ${updates.length} glyphs`,
      )
    } else {
      console.log(
        `[GlyphStore] Batch glyph info update: ${updates.length} glyphs in ${duration.toFixed(2)}ms`,
      )
    }
  }
}

/**
 * Release GPU memory held by a canvas by zeroing its dimensions.
 * Browsers release the backing GPU texture when width/height become 0.
 */
function releaseCanvas(canvas: HTMLCanvasElement | null): void {
  if (canvas) {
    canvas.width = 0
    canvas.height = 0
  }
}

// ============================================================================
// Packing State Management
// ============================================================================

/**
 * Set packing state
 */
export function setPackingState(isPacking: boolean): void {
  glyphStore$.packing.isPacking.set(isPacking)
}

/**
 * Set glyph rendering state
 */
export function setRenderingState(isRendering: boolean): void {
  glyphStore$.packing.isRenderingGlyphs.set(isRendering)
}

/**
 * Set source canvas (stored in module-level variable, not in observable)
 */
export function setSourceCanvas(canvas: HTMLCanvasElement | null): void {
  if (_sourceCanvas && _sourceCanvas !== canvas) {
    releaseCanvas(_sourceCanvas)
  }
  _sourceCanvas = canvas
  glyphStore$.packing.sourceCanvasVersion.set(
    glyphStore$.packing.sourceCanvasVersion.get() + 1,
  )
}

/**
 * Set pack canvases
 */
export function setPackCanvases(canvases: HTMLCanvasElement[]): void {
  const oldCanvases = glyphStore$.packing.packCanvases.get()
  if (oldCanvases && oldCanvases.length > 0) {
    const newSet = new Set(canvases)
    oldCanvases.forEach((c) => {
      if (!newSet.has(c)) releaseCanvas(c)
    })
  }
  glyphStore$.packing.packCanvases.set(opaqueObject(canvases))
}

// ============================================================================
// Computed Values / Selectors
// ============================================================================

/**
 * Get all glyph letters
 */
export function getGlyphLetters(): string[] {
  return Object.keys(glyphStore$.glyphs.get())
}

/**
 * Get glyph count
 */
export function getGlyphCount(): number {
  return getGlyphLetters().length
}

/**
 * Get glyph for rendering (font or image)
 */
export function getGlyphForLetter(
  letter: string,
): FontGlyphData | ImageGlyphData | undefined {
  // Check image glyphs first (priority)
  const imageGlyph = findImageGlyph(letter)
  if (imageGlyph) {
    return imageGlyph
  }

  // Fall back to font glyph
  return getGlyph(letter)
}

/**
 * Get list of all glyphs (font + selected images)
 */
export function getGlyphList(
  text: string,
): Array<FontGlyphData | ImageGlyphData> {
  // Prepend space to ensure space glyph is always included in bitmap font
  // Deduplicate characters to avoid processing the same glyph multiple times
  const uniqueChars = [...new Set(Array.from(` ${text}`))]
  return uniqueChars
    .map((letter) => getGlyphForLetter(letter))
    .filter((g): g is FontGlyphData | ImageGlyphData => g !== undefined)
}

/**
 * Get rectangle list for packing
 */
export function getRectangleList(
  text: string,
  padding: number,
  spacing: number,
): Array<{
  letter: string
  type: GlyphType
  width: number
  height: number
  x: number
  y: number
  uid?: string
}> {
  const glyphList = getGlyphList(text)

  return glyphList.map((glyph) => {
    const isNotEmpty = !!(glyph.width && glyph.height)
    return {
      letter: glyph.letter,
      type: glyph.type,
      width: isNotEmpty ? glyph.width + padding * 2 + spacing : 0,
      height: isNotEmpty ? glyph.height + padding * 2 + spacing : 0,
      x: 0,
      y: 0,
      ...(glyph.type === 'image' && 'uid' in glyph ? { uid: glyph.uid } : {}),
    }
  })
}

// ============================================================================
// Observers / Reactions
// ============================================================================

/**
 * Observe glyph count changes
 */
export function observeGlyphCount(
  callback: (count: number) => void,
): () => void {
  return observe(() => {
    const count = Object.keys(glyphStore$.glyphs.get()).length
    callback(count)
  })
}

/**
 * Observe packing state changes
 */
export function observePackingState(
  callback: (isPacking: boolean) => void,
): () => void {
  return observe(() => {
    callback(glyphStore$.packing.isPacking.get())
  })
}

// ============================================================================
// Store Reset / Cleanup
// ============================================================================

/**
 * Reset glyph store to initial state
 */
export function resetGlyphStore(): void {
  // Release GPU memory before clearing references
  releaseCanvas(_sourceCanvas)
  _sourceCanvas = null
  const packCanvases = glyphStore$.packing.packCanvases.get()
  if (packCanvases) packCanvases.forEach(releaseCanvas)

  batch(() => {
    glyphStore$.glyphs.set({})
    glyphStore$.imageGlyphs.set([])
    glyphStore$.packing.isPacking.set(false)
    glyphStore$.packing.isRenderingGlyphs.set(false)
    glyphStore$.packing.sourceCanvasVersion.set(
      glyphStore$.packing.sourceCanvasVersion.get() + 1,
    )
    glyphStore$.packing.packCanvases.set(opaqueObject([]))
    glyphStore$.glyphDataVersion.set(0)
  })
}

/**
 * Increment glyph data version counter.
 * Call this when glyph data (dimensions, style) changes outside of batchUpdateGlyphInfo.
 */
export function incrementGlyphDataVersion(): void {
  glyphStore$.glyphDataVersion.set(glyphStore$.glyphDataVersion.get() + 1)
}

/**
 * UI Store - Legend State implementation
 *
 * Manages UI-related state for the bitmap font editor:
 * - Canvas transform (scale, offset)
 * - Canvas dimensions
 * - Preview mode settings
 * - Letter selection state
 * - Packing failure state
 */
import { batch, observable } from '@legendapp/state'

// ============================================================================
// Type Definitions
// ============================================================================

export interface UiData {
  // Main canvas transform
  scale: number
  offsetX: number
  offsetY: number

  // Canvas dimensions
  width: number
  height: number

  // Preview mode
  previewText: string
  showPreview: boolean
  previewScale: number
  previewOffsetX: number
  previewOffsetY: number

  // Selection state
  selectLetter: string
  selectNextLetter: string

  // Packing state
  packFailed: boolean
}

export interface UiStoreState {
  ui: UiData
}

// ============================================================================
// Default Values
// ============================================================================

function createDefaultUi(): UiData {
  return {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    width: 512,
    height: 512,
    previewText: 'Hello World!\nHello Snow Bamboo!',
    showPreview: false,
    previewScale: 1,
    previewOffsetX: 0,
    previewOffsetY: 0,
    selectLetter: '',
    selectNextLetter: '',
    packFailed: false,
  }
}

// ============================================================================
// Store State
// ============================================================================

export const uiStore$ = observable<UiStoreState>({
  ui: createDefaultUi(),
})

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Constrain offset values within valid bounds
 */
function constrainOffset(
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  scale: number,
): { offsetX: number; offsetY: number; scale: number } {
  return {
    offsetX: Math.min(Math.max(width / -2, offsetX), width / 2),
    offsetY: Math.min(Math.max(height / -2, offsetY), height / 2),
    scale: Math.max(scale, 0.01),
  }
}

// ============================================================================
// Transform Actions
// ============================================================================

/**
 * Set canvas transform (scale and offset)
 */
export function setTransform(trans: {
  scale?: number
  offsetX?: number
  offsetY?: number
}): void {
  const current = uiStore$.ui.get()

  const newScale = trans.scale ?? current.scale
  const newOffsetX = trans.offsetX ?? current.offsetX
  const newOffsetY = trans.offsetY ?? current.offsetY

  const constrained = constrainOffset(
    newOffsetX,
    newOffsetY,
    current.width,
    current.height,
    newScale,
  )

  batch(() => {
    uiStore$.ui.scale.set(constrained.scale)
    uiStore$.ui.offsetX.set(constrained.offsetX)
    uiStore$.ui.offsetY.set(constrained.offsetY)
  })
}

/**
 * Set canvas size
 */
export function setSize(width: number, height: number): void {
  const current = uiStore$.ui.get()

  const constrained = constrainOffset(
    current.offsetX,
    current.offsetY,
    width,
    height,
    current.scale,
  )

  batch(() => {
    uiStore$.ui.width.set(width)
    uiStore$.ui.height.set(height)
    uiStore$.ui.scale.set(constrained.scale)
    uiStore$.ui.offsetX.set(constrained.offsetX)
    uiStore$.ui.offsetY.set(constrained.offsetY)
  })
}

/**
 * Set scale only
 */
export function setScale(scale: number): void {
  uiStore$.ui.scale.set(Math.max(scale, 0.01))
}

/**
 * Set offset only
 */
export function setOffset(offsetX: number, offsetY: number): void {
  const current = uiStore$.ui.get()

  const constrained = constrainOffset(
    offsetX,
    offsetY,
    current.width,
    current.height,
    current.scale,
  )

  batch(() => {
    uiStore$.ui.offsetX.set(constrained.offsetX)
    uiStore$.ui.offsetY.set(constrained.offsetY)
  })
}

// ============================================================================
// Preview Actions
// ============================================================================

/**
 * Set preview text
 */
export function setPreviewText(text: string): void {
  uiStore$.ui.previewText.set(text)
}

/**
 * Set show preview mode
 */
export function setShowPreview(showPreview: boolean): void {
  uiStore$.ui.showPreview.set(showPreview)
}

/**
 * Set preview transform
 */
export function setPreviewTransform(trans: {
  previewScale?: number
  previewOffsetX?: number
  previewOffsetY?: number
}): void {
  batch(() => {
    if (trans.previewScale !== undefined) {
      uiStore$.ui.previewScale.set(Math.max(trans.previewScale, 0.01))
    }
    if (trans.previewOffsetX !== undefined) {
      uiStore$.ui.previewOffsetX.set(trans.previewOffsetX)
    }
    if (trans.previewOffsetY !== undefined) {
      uiStore$.ui.previewOffsetY.set(trans.previewOffsetY)
    }
  })
}

/**
 * Set preview scale
 */
export function setPreviewScale(scale: number): void {
  uiStore$.ui.previewScale.set(Math.max(scale, 0.01))
}

/**
 * Set preview offset
 */
export function setPreviewOffset(offsetX: number, offsetY: number): void {
  batch(() => {
    uiStore$.ui.previewOffsetX.set(offsetX)
    uiStore$.ui.previewOffsetY.set(offsetY)
  })
}

// ============================================================================
// Selection Actions
// ============================================================================

/**
 * Set selected letter and optionally next letter for kerning
 */
export function setSelectLetter(letter = '', next = ''): void {
  batch(() => {
    uiStore$.ui.selectLetter.set(letter)
    uiStore$.ui.selectNextLetter.set(next)
  })
}

/**
 * Clear letter selection
 */
export function clearSelection(): void {
  batch(() => {
    uiStore$.ui.selectLetter.set('')
    uiStore$.ui.selectNextLetter.set('')
  })
}

// ============================================================================
// Packing State Actions
// ============================================================================

/**
 * Set pack failed state
 */
export function setPackFailed(packFailed: boolean): void {
  uiStore$.ui.packFailed.set(packFailed)
}

// ============================================================================
// Selectors
// ============================================================================

/**
 * Get current UI state
 */
export function getUi(): UiData {
  return uiStore$.ui.get()
}

/**
 * Get canvas transform
 */
export function getTransform(): {
  scale: number
  offsetX: number
  offsetY: number
} {
  const ui = uiStore$.ui.get()
  return {
    scale: ui.scale,
    offsetX: ui.offsetX,
    offsetY: ui.offsetY,
  }
}

/**
 * Get canvas dimensions
 */
export function getDimensions(): { width: number; height: number } {
  return {
    width: uiStore$.ui.width.get(),
    height: uiStore$.ui.height.get(),
  }
}

/**
 * Get preview state
 */
export function getPreviewState(): {
  previewText: string
  showPreview: boolean
  previewScale: number
  previewOffsetX: number
  previewOffsetY: number
} {
  const ui = uiStore$.ui.get()
  return {
    previewText: ui.previewText,
    showPreview: ui.showPreview,
    previewScale: ui.previewScale,
    previewOffsetX: ui.previewOffsetX,
    previewOffsetY: ui.previewOffsetY,
  }
}

/**
 * Get selection state
 */
export function getSelection(): {
  selectLetter: string
  selectNextLetter: string
} {
  return {
    selectLetter: uiStore$.ui.selectLetter.get(),
    selectNextLetter: uiStore$.ui.selectNextLetter.get(),
  }
}

/**
 * Check if a letter is selected
 */
export function hasSelection(): boolean {
  return uiStore$.ui.selectLetter.get() !== ''
}

/**
 * Check if packing failed
 */
export function isPackFailed(): boolean {
  return uiStore$.ui.packFailed.get()
}

// ============================================================================
// Store Initialization / Reset
// ============================================================================

/**
 * Initialize UI store with data
 */
export function initializeUiStore(data: Partial<UiData>): void {
  const currentUi = uiStore$.ui.get()
  uiStore$.ui.set({
    ...currentUi,
    ...data,
  })
}

/**
 * Reset UI store to default values
 */
export function resetUiStore(): void {
  uiStore$.ui.set(createDefaultUi())
}

/**
 * Get UI store snapshot for serialization
 * Note: Only persistent data should be serialized (previewText)
 */
export function getUiSnapshot(): Partial<UiData> {
  const ui = uiStore$.ui.get()
  return {
    previewText: ui.previewText,
  }
}

/**
 * Get full UI store state (for debugging/inspection)
 */
export function getUiStoreState(): UiStoreState {
  return uiStore$.get()
}

/**
 * Layout Store - Legend State implementation
 *
 * Manages layout configuration for bitmap font packing:
 * - Padding and spacing between glyphs
 * - Canvas dimensions (width, height)
 * - Packing mode (auto, fixed size, adaptive)
 * - Page count and computed pack dimensions
 */
import { batch, observable } from '@legendapp/state'

// ============================================================================
// Type Definitions
// ============================================================================

export interface LayoutData {
  // Glyph spacing configuration
  padding: number
  spacing: number

  // Target dimensions
  width: number
  height: number

  // Packing mode settings
  auto: boolean
  fixedSize: boolean

  // Multi-page support
  page: number

  // Computed pack dimensions (result of packing)
  packWidth: number
  packHeight: number
}

export interface LayoutStoreState {
  layout: LayoutData
}

// ============================================================================
// Default Values
// ============================================================================

function createDefaultLayout(): LayoutData {
  return {
    padding: 1,
    spacing: 1,
    width: 512,
    height: 512,
    auto: true,
    fixedSize: false,
    page: 1,
    packWidth: 512,
    packHeight: 512,
  }
}

// ============================================================================
// Store State
// ============================================================================

export const layoutStore$ = observable<LayoutStoreState>({
  layout: createDefaultLayout(),
})

// ============================================================================
// Layout Configuration Actions
// ============================================================================

/**
 * Set padding (space between glyph content and its bounding box)
 */
export function setPadding(padding: number): void {
  layoutStore$.layout.padding.set(padding)
}

/**
 * Set spacing (space between glyph bounding boxes)
 */
export function setSpacing(spacing: number): void {
  layoutStore$.layout.spacing.set(spacing)
}

/**
 * Set target width
 */
export function setWidth(width: number): void {
  layoutStore$.layout.width.set(width)
}

/**
 * Set target height
 */
export function setHeight(height: number): void {
  layoutStore$.layout.height.set(height)
}

/**
 * Set auto mode
 * When true, the packer automatically determines optimal canvas size
 */
export function setAuto(auto: boolean): void {
  layoutStore$.layout.auto.set(auto)
}

/**
 * Set fixed size mode
 * When true (and auto=false), canvas uses exact width/height
 * When false (and auto=false), canvas adapts to content within width/height limits
 */
export function setFixedSize(fixedSize: boolean): void {
  layoutStore$.layout.fixedSize.set(fixedSize)
}

/**
 * Set page count
 */
export function setPage(page: number): void {
  layoutStore$.layout.page.set(Math.max(1, Math.floor(page)))
}

/**
 * Set pack dimensions (computed after packing)
 */
export function setPackSize(width: number, height: number): void {
  const currentWidth = layoutStore$.layout.packWidth.get()
  const currentHeight = layoutStore$.layout.packHeight.get()

  if (currentWidth === width && currentHeight === height) {
    return
  }

  batch(() => {
    layoutStore$.layout.packWidth.set(width)
    layoutStore$.layout.packHeight.set(height)
  })
}

// ============================================================================
// Batch Updates
// ============================================================================

/**
 * Update multiple layout properties at once
 */
export function updateLayout(updates: Partial<LayoutData>): void {
  batch(() => {
    if (updates.padding !== undefined) {
      layoutStore$.layout.padding.set(updates.padding)
    }
    if (updates.spacing !== undefined) {
      layoutStore$.layout.spacing.set(updates.spacing)
    }
    if (updates.width !== undefined) {
      layoutStore$.layout.width.set(updates.width)
    }
    if (updates.height !== undefined) {
      layoutStore$.layout.height.set(updates.height)
    }
    if (updates.auto !== undefined) {
      layoutStore$.layout.auto.set(updates.auto)
    }
    if (updates.fixedSize !== undefined) {
      layoutStore$.layout.fixedSize.set(updates.fixedSize)
    }
    if (updates.page !== undefined) {
      layoutStore$.layout.page.set(Math.max(1, Math.floor(updates.page)))
    }
    if (updates.packWidth !== undefined) {
      layoutStore$.layout.packWidth.set(updates.packWidth)
    }
    if (updates.packHeight !== undefined) {
      layoutStore$.layout.packHeight.set(updates.packHeight)
    }
  })
}

// ============================================================================
// Selectors
// ============================================================================

/**
 * Get current layout configuration
 */
export function getLayout(): LayoutData {
  return layoutStore$.layout.get()
}

/**
 * Get packing parameters for the packing algorithm
 */
export function getPackingParams(): {
  padding: number
  spacing: number
  width: number
  height: number
  auto: boolean
  fixedSize: boolean
  page: number
} {
  const layout = layoutStore$.layout.get()
  return {
    padding: layout.padding,
    spacing: layout.spacing,
    width: layout.width,
    height: layout.height,
    auto: layout.auto,
    fixedSize: layout.fixedSize,
    page: layout.page,
  }
}

/**
 * Get computed pack dimensions
 */
export function getPackDimensions(): { width: number; height: number } {
  return {
    width: layoutStore$.layout.packWidth.get(),
    height: layoutStore$.layout.packHeight.get(),
  }
}

/**
 * Check if using auto packing mode
 */
export function isAutoPacking(): boolean {
  return layoutStore$.layout.auto.get()
}

/**
 * Check if using fixed size mode
 */
export function isFixedSizePacking(): boolean {
  const layout = layoutStore$.layout.get()
  return !layout.auto && layout.fixedSize
}

/**
 * Check if using adaptive size mode
 */
export function isAdaptivePacking(): boolean {
  const layout = layoutStore$.layout.get()
  return !layout.auto && !layout.fixedSize
}

// ============================================================================
// Store Initialization / Reset
// ============================================================================

/**
 * Initialize layout store with data
 */
export function initializeLayoutStore(data: Partial<LayoutData>): void {
  const currentLayout = layoutStore$.layout.get()
  layoutStore$.layout.set({
    ...currentLayout,
    ...data,
    // Ensure page is at least 1
    page: Math.max(1, Math.floor(data.page ?? currentLayout.page)),
  })
}

/**
 * Reset layout store to default values
 */
export function resetLayoutStore(): void {
  layoutStore$.layout.set(createDefaultLayout())
}

/**
 * Get layout store snapshot for serialization
 */
export function getLayoutSnapshot(): LayoutStoreState {
  return layoutStore$.get()
}

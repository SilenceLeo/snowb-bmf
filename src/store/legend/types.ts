/**
 * Legend State types for glyph and project management
 */
import type { MetricData } from 'src/types/style'

export type GlyphType = 'text' | 'image'

/**
 * Core glyph data structure
 * Optimized for Legend State fine-grained reactivity
 */
export interface GlyphData {
  // Identity
  letter: string
  type: GlyphType

  // Position (high-frequency updates during packing)
  x: number
  y: number
  page: number

  // Dimensions
  width: number
  height: number
  fontWidth: number
  fontHeight: number

  // Trim offsets
  trimOffsetTop: number
  trimOffsetLeft: number

  // Canvas position for font glyphs
  canvasX: number
  canvasY: number

  // Kerning data (Record instead of Map for Legend State proxy compatibility)
  kerning: Record<string, number>

  // Metric adjustments
  adjustMetric: MetricData
}

/**
 * Image glyph specific data
 */
export interface ImageGlyphData extends GlyphData {
  type: 'image'
  selected: boolean
  source: HTMLCanvasElement | null

  // Stable unique ID for React key (assigned at creation time)
  uid: string

  // File info
  fileName?: string
  filePath?: string
  fileType?: string

  // Image data
  src?: string // Object URL for the image
  buffer?: ArrayBuffer // Original file buffer
}

/**
 * Font glyph specific data
 */
export interface FontGlyphData extends GlyphData {
  type: 'text'
}

/**
 * Glyph position update payload
 * Used for batch position updates during packing
 */
export interface GlyphPositionUpdate {
  letter: string
  x: number
  y: number
  page: number
  type?: GlyphType
  uid?: string
}

/**
 * Glyph info update payload
 * Used when glyph rendering completes
 */
export interface GlyphInfoUpdate {
  letter: string
  width: number
  height: number
  fontWidth: number
  fontHeight: number
  trimOffsetTop: number
  trimOffsetLeft: number
  canvasX: number
  canvasY: number
}

/**
 * Packing state
 */
export interface PackingState {
  isPacking: boolean
  isRenderingGlyphs: boolean
  packCanvases: HTMLCanvasElement[]
  sourceCanvasVersion: number
}

/**
 * Project state - a composite snapshot type used for serialization.
 * This is NOT a 1:1 mapping to any single store; it aggregates fields
 * from projectStore$ and glyphStore$.packing for persistence purposes.
 */
export interface ProjectState {
  id: number
  name: string
  text: string
  packing: PackingState
}

/**
 * Rectangle data for packing algorithm
 */
export interface TextRectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
  type: GlyphType
  uid?: string
}

/**
 * Glyph store state
 *
 * Matches the shape of glyphStore$ observable.
 * glyphCount and glyphLetters are derived via standalone functions
 * (getGlyphCount, getGlyphLetters) rather than stored in the observable.
 */
export interface GlyphStoreState {
  // Font glyphs indexed by letter
  glyphs: Record<string, FontGlyphData>

  // Image glyphs array
  imageGlyphs: ImageGlyphData[]

  // Packing state (managed within glyphStore$)
  packing: PackingState

  // Version counter for batch update tracking
  glyphDataVersion: number
}

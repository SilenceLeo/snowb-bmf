/**
 * Project type for file conversion compatibility
 *
 * This is a plain data interface matching the protobuf IProject structure.
 * Used by encode/decode/conversion code. NOT an observable store type.
 */
import type { LayoutData } from 'src/store/legend/stores/layoutStore'
// Re-import store-specific types that Project depends on
import type { StyleData } from 'src/store/legend/stores/styleStore'
import type { FontGlyphData } from 'src/store/legend/types'

import type { MetricData } from './style'

export interface Project {
  id: number
  name: string
  text: string
  glyphs: Record<string, FontGlyphData>
  glyphImages: Array<{
    letter: string
    adjustMetric?: MetricData
    kerning?: Record<string, number>
    buffer?: Uint8Array | ArrayBuffer
    fileName?: string
    fileType?: string
    selected?: boolean
    page?: number
  }>
  style: StyleData
  layout: LayoutData
  globalAdjustMetric?: MetricData
  ui?: { previewText?: string }
}

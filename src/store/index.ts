/**
 * Store entry point - Legend State
 *
 * All state management is now handled by Legend State.
 * This file re-exports types and utilities for backward compatibility
 * with file conversion code that references these types.
 */

// Re-export Legend State types for backward compatibility
// These are used by file conversion (encode/decode) as type annotations
export type {
  FillData as FontStyleConfig,
  StrokeData as StrokeStyleConfig,
  ShadowData as ShadowStyleConfig,
  FontData as Font,
  FontResource,
  StyleData as Style,
  GradientData as Gradient,
  PatternTextureData as PatternTexture,
} from './legend/stores/styleStore'

export type { LayoutData as Layout } from './legend/stores/layoutStore'

export { FillType, GradientType } from './legend/stores/styleStore'

export type { FontGlyphData as GlyphFont } from './legend/types'

// Project type — canonical definition in src/types/project.ts
export type { Project } from 'src/types/project'

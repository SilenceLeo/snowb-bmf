/**
 * Shared style type definitions
 *
 * These are the canonical type definitions used across the codebase:
 * - Store layer (styleStore) uses these directly or extends them
 * - Render layer (glyphRenderHelper, getFontGlyphs) uses these for config params
 * - File layer (encode/decode) maps to these via store re-exports
 */

// ============================================================================
// Enums
// ============================================================================

export enum FillType {
  SOLID = 0,
  GRADIENT = 1,
  IMAGE = 2,
}

export enum GradientType {
  LINEAR = 0,
  RADIAL = 1,
}

// ============================================================================
// Gradient
// ============================================================================

export interface GradientColor {
  offset: number
  color: string
}

export interface GradientPaletteItem extends GradientColor {
  id: number
}

// ============================================================================
// Pattern Texture
// ============================================================================

export type Repetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'

/** Pattern texture data for rendering (subset needed by canvas operations) */
export interface PatternTextureRenderData {
  image: HTMLImageElement | null
  repetition: Repetition | string
  scale: number
}

/** Full pattern texture data including storage fields */
export interface PatternTextureData extends PatternTextureRenderData {
  buffer: ArrayBuffer
  src: string
  repetition: Repetition
}

// ============================================================================
// Gradient Data
// ============================================================================

export interface GradientData {
  type: GradientType
  angle: number
  palette: GradientPaletteItem[]
}

/** Loose gradient data accepted by rendering functions */
export interface GradientRenderData {
  type: GradientType | number
  angle: number
  palette: Array<{ offset: number; color: string }>
}

// ============================================================================
// Fill
// ============================================================================

/** Full fill data for store/persistence */
export interface FillData {
  type: FillType
  color: string
  gradient: GradientData
  patternTexture: PatternTextureData
}

/** Fill configuration accepted by rendering functions */
export interface FillRenderConfig {
  type: FillType | number
  color: string
  gradient: GradientRenderData
  patternTexture: PatternTextureRenderData
}

// ============================================================================
// Stroke
// ============================================================================

/** Stroke configuration for rendering */
export interface StrokeRenderConfig extends FillRenderConfig {
  width: number
  lineCap: CanvasLineCap
  lineJoin: CanvasLineJoin
  strokeType: 0 | 1 | 2
}

/** Full stroke data including storage fields */
export interface StrokeData extends FillData {
  width: number
  lineCap: CanvasLineCap
  lineJoin: CanvasLineJoin
  strokeType: 0 | 1 | 2
}

// ============================================================================
// Shadow
// ============================================================================

export interface ShadowData {
  color: string
  blur: number
  offsetX: number
  offsetY: number
}

// ============================================================================
// Font
// ============================================================================

/** Font resource with opentype instance */
export interface FontResourceBase {
  family: string
  opentype: any
}

/** Font configuration for rendering */
export interface FontRenderConfig {
  fonts: FontResourceBase[]
  size: number
  lineHeight: number
  sharp: number
  family?: string
  [key: string]: unknown
}

// ============================================================================
// Metric
// ============================================================================

export interface MetricData {
  xAdvance: number
  xOffset: number
  yOffset: number
}

// ============================================================================
// Composite Render Config
// ============================================================================

/** Config passed to glyph rendering functions */
export interface GlyphRenderConfig {
  font: FontRenderConfig
  fill: FillRenderConfig
  stroke?: StrokeRenderConfig
  shadow?: ShadowData
}

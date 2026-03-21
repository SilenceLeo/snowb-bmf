/**
 * Legend State Serialization Module
 *
 * Converts Legend State store data to Protocol Buffer compatible format.
 * Legend State .get() returns plain JS objects, so no deep conversion needed.
 */
import type {
  IFill,
  IFont,
  IGlyphFont,
  IGlyphImage,
  ILayout,
  IMetric,
  IProject,
  IShadow,
  IStyle,
  IUi,
} from 'src/file/conversion/fileTypes/sbf/proto/1.3.0/project'

import { glyphStore$ } from '../glyphStore'
import { projectStore$ } from '../projectStore'
import { layoutStore$ } from '../stores/layoutStore'
import {
  type ColoringStrategy,
  type ErrorCorrectionMode,
  type FillData,
  type FillRule,
  type FontData,
  type FontResource,
  type GradientPaletteItem,
  type MetricData,
  type PatternTextureData,
  type RenderMode,
  type SdfChannel,
  type ShadowData,
  type StrokeData,
  styleStore$,
} from '../stores/styleStore'
import { uiStore$ } from '../stores/uiStore'
import type { FontGlyphData, ImageGlyphData } from '../types'

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Serializable project data (Protocol Buffer compatible)
 */
export interface SerializableProject extends IProject {
  id: number
  name: string
  text: string
  glyphs: Record<string, IGlyphFont>
  glyphImages: IGlyphImage[]
  style: IStyle
  layout: ILayout
  globalAdjustMetric: IMetric
  ui: IUi
  extensions: {
    xFractional: number
  }
}

// ============================================================================
// Metric Serialization
// ============================================================================

/**
 * Convert MetricData to plain object for serialization
 */
function serializeMetric(metric: MetricData | null | undefined): IMetric {
  if (!metric) {
    return { xAdvance: 0, xOffset: 0, yOffset: 0 }
  }

  return {
    xAdvance: metric.xAdvance ?? 0,
    xOffset: metric.xOffset ?? 0,
    yOffset: metric.yOffset ?? 0,
  }
}

// ============================================================================
// Font Glyph Serialization
// ============================================================================

/**
 * Serialize a single font glyph
 */
function serializeFontGlyph(glyph: FontGlyphData): IGlyphFont {
  return {
    letter: glyph.letter,
    adjustMetric: serializeMetric(glyph.adjustMetric),
    kerning: glyph.kerning ?? {},
    page: glyph.page,
  }
}

/**
 * Serialize all font glyphs
 */
function serializeGlyphs(
  glyphs: Record<string, FontGlyphData>,
): Record<string, IGlyphFont> {
  const result: Record<string, IGlyphFont> = {}

  Object.entries(glyphs).forEach(([letter, glyph]) => {
    result[letter] = serializeFontGlyph(glyph)
  })

  return result
}

// ============================================================================
// Image Glyph Serialization
// ============================================================================

/**
 * Serialize a single image glyph
 */
function serializeImageGlyph(imageGlyph: ImageGlyphData): IGlyphImage {
  return {
    letter: imageGlyph.letter,
    adjustMetric: serializeMetric(imageGlyph.adjustMetric),
    buffer: imageGlyph.buffer
      ? new Uint8Array(imageGlyph.buffer)
      : new Uint8Array(0),
    fileName: imageGlyph.fileName ?? '',
    fileType: imageGlyph.fileType ?? '',
    selected: imageGlyph.selected,
    kerning: imageGlyph.kerning ?? {},
    page: imageGlyph.page,
  }
}

/**
 * Serialize all image glyphs
 */
function serializeImageGlyphs(imageGlyphs: ImageGlyphData[]): IGlyphImage[] {
  return imageGlyphs.map(serializeImageGlyph)
}

// ============================================================================
// Style Serialization
// ============================================================================

/**
 * Serialize gradient palette
 */
function serializeGradientPalette(
  palette: GradientPaletteItem[],
): Array<{ id: number; offset: number; color: string }> {
  return palette.map((item) => ({
    id: item.id,
    offset: item.offset,
    color: item.color,
  }))
}

/**
 * Serialize pattern texture
 */
function serializePatternTexture(texture: PatternTextureData): {
  buffer: Uint8Array
  scale: number
  repetition: string
} {
  return {
    buffer: texture.buffer ? new Uint8Array(texture.buffer) : new Uint8Array(0),
    scale: texture.scale,
    repetition: texture.repetition,
  }
}

/**
 * Serialize fill data
 */
function serializeFill(fill: FillData): IFill {
  return {
    type: fill.type,
    color: fill.color,
    gradient: {
      type: fill.gradient.type,
      angle: fill.gradient.angle,
      palette: serializeGradientPalette(fill.gradient.palette),
    },
    patternTexture: serializePatternTexture(fill.patternTexture),
  }
}

/**
 * Serialize stroke data (extends fill with stroke-specific properties).
 * Returns IFill because the protobuf schema stores stroke as Fill message
 * with additional fields (width, lineCap, lineJoin, strokeType).
 */
function serializeStroke(stroke: StrokeData): IFill {
  return {
    ...serializeFill(stroke),
    width: stroke.width,
    lineCap: stroke.lineCap,
    lineJoin: stroke.lineJoin,
    strokeType: stroke.strokeType,
  }
}

/**
 * Serialize shadow data
 */
function serializeShadow(shadow: ShadowData): IShadow {
  return {
    color: shadow.color,
    blur: shadow.blur,
    offsetX: shadow.offsetX,
    offsetY: shadow.offsetY,
  }
}

/**
 * Serialize font resources
 */
function serializeFontResources(
  fonts: FontResource[],
): Array<{ font: Uint8Array }> {
  return fonts.map((fontResource) => ({
    font: fontResource.font
      ? new Uint8Array(fontResource.font)
      : new Uint8Array(0),
  }))
}

/**
 * Serialize font data
 */
function serializeFont(font: FontData): IFont {
  return {
    fonts: serializeFontResources(font.fonts),
    size: font.size,
    lineHeight: font.lineHeight,
    sharp: font.sharp,
    variationSettings: font.variationSettings,
  }
}

/**
 * Convert RenderMode string to proto int32
 */
function renderModeToInt(mode: RenderMode): number {
  switch (mode) {
    case 'sdf':
      return 1
    case 'msdf':
      return 2
    case 'mtsdf':
      return 3
    case 'psdf':
      return 4
    default:
      return 0
  }
}

/**
 * Convert SdfChannel string to proto int32
 */
function sdfChannelToInt(channel: SdfChannel): number {
  switch (channel) {
    case 'alpha':
      return 1
    case 'rgb-inv':
      return 2
    case 'alpha-inv':
      return 3
    default:
      return 0 // 'rgb'
  }
}

/**
 * Convert FillRule string to proto int32
 */
function fillRuleToInt(rule: FillRule): number {
  switch (rule) {
    case 'evenodd':
      return 1
    default:
      return 0 // 'nonzero'
  }
}

/**
 * Convert ColoringStrategy string to proto int32
 */
function coloringStrategyToInt(strategy: ColoringStrategy): number {
  switch (strategy) {
    case 'inktrap':
      return 1
    case 'distance':
      return 2
    default:
      return 0 // 'simple'
  }
}

/**
 * Convert ErrorCorrectionMode string to proto int32
 */
function errorCorrectionToInt(mode: ErrorCorrectionMode): number {
  switch (mode) {
    case 'disabled':
      return 1
    case 'indiscriminate':
      return 2
    default:
      return 0 // 'edge-priority'
  }
}

/**
 * Serialize complete style data
 */
function serializeStyle(): IStyle {
  const style = styleStore$.style.get()

  return {
    font: serializeFont(style.font),
    fill: serializeFill(style.fill),
    useStroke: style.useStroke,
    stroke: serializeStroke(style.stroke),
    useShadow: style.useShadow,
    shadow: serializeShadow(style.shadow),
    useInnerShadow: style.useInnerShadow,
    innerShadow: serializeShadow(style.innerShadow),
    bgColor: style.bgColor,
    render: {
      mode: renderModeToInt(style.render.mode),
      distanceRange: style.render.distanceRange,
      sdfChannel: sdfChannelToInt(style.render.sdfChannel),
      angleThreshold: style.render.angleThreshold,
      overlapSupport: style.render.overlapSupport,
      edgeColoringSeed: style.render.edgeColoringSeed,
      scanlinePass: style.render.scanlinePass,
      fillRule: fillRuleToInt(style.render.fillRule),
      coloringStrategy: coloringStrategyToInt(style.render.coloringStrategy),
      errorCorrection: errorCorrectionToInt(style.render.errorCorrection),
    },
  }
}

// ============================================================================
// Layout Serialization
// ============================================================================

/**
 * Serialize layout data
 */
function serializeLayout(): ILayout {
  const layout = layoutStore$.layout.get()

  return {
    padding: layout.padding,
    spacing: layout.spacing,
    width: layout.width,
    height: layout.height,
    auto: layout.auto,
    fixedSize: layout.fixedSize,
    page: layout.page,
    orderedGrid: layout.orderedGrid,
    columns: layout.columns,
  }
}

// ============================================================================
// UI Serialization
// ============================================================================

/**
 * Serialize UI data (only persistent fields)
 */
function serializeUi(): IUi {
  const ui = uiStore$.ui.get()

  return {
    previewText: ui.previewText,
  }
}

// ============================================================================
// Project Serialization
// ============================================================================

/**
 * Serialize the current project state from Legend State stores
 *
 * This is the main entry point for serialization.
 * Gathers data from all Legend State stores and converts to Protocol Buffer format.
 */
export function serializeProject(): SerializableProject {
  const current = projectStore$.current.get()
  const glyphs = glyphStore$.glyphs.get()
  const imageGlyphs = glyphStore$.imageGlyphs.get()
  const globalAdjustMetric = styleStore$.globalAdjustMetric.get()

  return {
    id: current.id,
    name: current.name,
    text: current.text,
    glyphs: serializeGlyphs(glyphs),
    glyphImages: serializeImageGlyphs(imageGlyphs),
    style: serializeStyle(),
    layout: serializeLayout(),
    globalAdjustMetric: serializeMetric(globalAdjustMetric),
    ui: serializeUi(),
    extensions: {
      xFractional: styleStore$.xFractional.get(),
    },
  }
}

/**
 * Serialize a specific project by ID (for multi-project support)
 *
 * @param projectId - The ID of the project to serialize
 * @returns Serialized project data or null if project not found
 */
export function serializeProjectById(
  projectId: number,
): SerializableProject | null {
  const current = projectStore$.current.get()

  // TODO: Support serializing non-active projects by storing per-project
  // snapshots in workspaceStore. Currently all style/layout/glyph state is
  // global, so only the active project can be serialized. To support
  // multi-project serialization, each project's state would need to be
  // saved/restored when switching projects (project swapping).
  if (current.id !== projectId) {
    console.warn(
      `[Persistence] Project ${projectId} not found (current: ${current.id})`,
    )
    return null
  }

  return serializeProject()
}

/**
 * Get project metadata for workspace serialization
 */
export function getProjectMeta(): { id: number; name: string } {
  const current = projectStore$.current.get()
  return {
    id: current.id,
    name: current.name,
  }
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate serialized project data
 */
export function validateSerializedProject(
  project: SerializableProject,
): boolean {
  if (!project) {
    return false
  }

  // Check required fields
  if (typeof project.id !== 'number' || project.id <= 0) {
    console.error('[Serialize] Invalid project ID')
    return false
  }

  if (typeof project.name !== 'string') {
    console.error('[Serialize] Invalid project name')
    return false
  }

  if (typeof project.text !== 'string') {
    console.error('[Serialize] Invalid project text')
    return false
  }

  // Check style
  if (!project.style?.font || !project.style?.fill) {
    console.error('[Serialize] Invalid style data')
    return false
  }

  // Check layout
  if (
    typeof project.layout?.width !== 'number' ||
    typeof project.layout?.height !== 'number'
  ) {
    console.error('[Serialize] Invalid layout data')
    return false
  }

  return true
}

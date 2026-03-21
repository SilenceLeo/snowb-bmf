/**
 * Style Store - Legend State implementation
 *
 * Manages all style-related state including:
 * - Font configuration (family, size, baselines)
 * - Fill configuration (solid, gradient, pattern)
 * - Stroke configuration
 * - Shadow configuration
 * - Background color
 */
import { batch, observable, opaqueObject } from '@legendapp/state'
import {
  type FillData,
  FillType,
  type GradientData,
  GradientType,
  type MetricData,
  type PatternTextureData,
  type ShadowData,
  type StrokeData,
} from 'src/types/style'
import type { VariationAxis, VariationInstance } from 'src/types/variableFont'
import base64ToArrayBuffer from 'src/utils/base64ToArrayBuffer'
import type { AdaptedFont } from 'src/utils/fontAdapter'
import { createAdaptedFont } from 'src/utils/fontAdapter'
import getFontBaselinesFromCanvas from 'src/utils/getFontBaselinesFromCanvas'
import getFontBaselinesFromMetrics from 'src/utils/getFontBaselinesFromMetrics'
import updateFontFace from 'src/utils/updateFontFace'

import { createFillSetters, resetPatternImages } from './styleSetterFactory'

// ============================================================================
// Re-export shared types for backward compatibility
// ============================================================================

export {
  FillType,
  GradientType,
  type FillData,
  type GradientData,
  type GradientPaletteItem,
  type MetricData,
  type PatternTextureData,
  type Repetition,
  type ShadowData,
  type StrokeData,
} from 'src/types/style'
export type { GradientColor } from 'src/types/style'
export type { VariationAxis, VariationInstance } from 'src/types/variableFont'

// ============================================================================
// Store-specific Type Definitions
// ============================================================================

export type RenderMode = 'default' | 'sdf' | 'psdf' | 'msdf' | 'mtsdf'

export type SdfChannel = 'rgb' | 'rgb-inv' | 'alpha' | 'alpha-inv'

export interface FontResource {
  font: ArrayBuffer
  family: string
  opentype: AdaptedFont
  variationAxes?: VariationAxis[]
  variationInstances?: VariationInstance[]
}

export interface FontData {
  fonts: FontResource[]
  size: number
  lineHeight: number
  middle: number
  hanging: number
  top: number
  alphabetic: number
  ideographic: number
  bottom: number
  sharp: number
  variationSettings: Record<string, number>
}

export type FillRule = 'nonzero' | 'evenodd'

export type ColoringStrategy = 'simple' | 'inktrap' | 'distance'

export type ErrorCorrectionMode =
  | 'edge-priority'
  | 'disabled'
  | 'indiscriminate'

export interface RenderData {
  mode: RenderMode
  distanceRange: number
  sdfChannel: SdfChannel
  // MSDF/MTSDF parameters
  angleThreshold: number // edge coloring angle threshold (radians, default 3.0)
  overlapSupport: boolean // overlap contour combiner (default true)
  edgeColoringSeed: number // coloring seed (default 0)
  scanlinePass: boolean // scanline sign correction (default false)
  fillRule: FillRule // winding rule (default 'nonzero')
  coloringStrategy: ColoringStrategy // edge coloring algorithm (default 'simple')
  errorCorrection: ErrorCorrectionMode // error correction mode (default 'edge-priority')
}

export interface StyleData {
  font: FontData
  fill: FillData
  useStroke: boolean
  stroke: StrokeData
  useShadow: boolean
  shadow: ShadowData
  useInnerShadow: boolean
  innerShadow: ShadowData
  bgColor: string
  render: RenderData
}

export interface StyleStoreState {
  style: StyleData
  globalAdjustMetric: MetricData
  xFractional: number
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_FAMILY = 'sans-serif'

const DEFAULT_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX////MzMw46qqDAAAADklEQVQI12Pgh8IPEAgAEeAD/Xk4HBcAAAAASUVORK5CYII='

function createDefaultGradient(): GradientData {
  return {
    type: GradientType.LINEAR,
    angle: 0,
    palette: [
      { offset: 0, color: 'rgba(255,255,255,1)', id: 1 },
      { offset: 1, color: 'rgba(0,0,0,1)', id: 2 },
    ],
  }
}

function createDefaultPatternTexture(): PatternTextureData {
  return {
    buffer: base64ToArrayBuffer(DEFAULT_IMAGE_BASE64),
    src: '',
    repetition: 'repeat',
    scale: 1,
  }
}

function createDefaultFill(): FillData {
  return {
    type: FillType.SOLID,
    color: '#000000',
    gradient: createDefaultGradient(),
    patternTexture: createDefaultPatternTexture(),
  }
}

function createDefaultStroke(): StrokeData {
  return {
    ...createDefaultFill(),
    width: 1,
    lineCap: 'round',
    lineJoin: 'round',
    strokeType: 0,
  }
}

function createDefaultShadow(): ShadowData {
  return {
    color: '#000000',
    blur: 1,
    offsetX: 1,
    offsetY: 1,
  }
}

function createDefaultFont(): FontData {
  return {
    fonts: [],
    size: 72,
    lineHeight: 1.25,
    middle: 0,
    hanging: 0,
    top: 0,
    alphabetic: 0,
    ideographic: 0,
    bottom: 0,
    sharp: 80,
    variationSettings: {},
  }
}

function createDefaultMetric(): MetricData {
  return {
    xAdvance: 0,
    xOffset: 0,
    yOffset: 0,
  }
}

function createDefaultRender(): RenderData {
  return {
    mode: 'default',
    distanceRange: 16,
    sdfChannel: 'rgb',
    angleThreshold: 3.0,
    overlapSupport: true,
    edgeColoringSeed: 0,
    scanlinePass: false,
    fillRule: 'nonzero',
    coloringStrategy: 'simple',
    errorCorrection: 'edge-priority',
  }
}

function createDefaultStyle(): StyleData {
  return {
    font: createDefaultFont(),
    fill: createDefaultFill(),
    useStroke: false,
    stroke: createDefaultStroke(),
    useShadow: false,
    shadow: createDefaultShadow(),
    useInnerShadow: false,
    innerShadow: createDefaultShadow(),
    bgColor: 'rgba(0,0,0,0)',
    render: createDefaultRender(),
  }
}

// ============================================================================
// Store State
// ============================================================================

export const styleStore$ = observable<StyleStoreState>({
  style: createDefaultStyle(),
  globalAdjustMetric: createDefaultMetric(),
  xFractional: 0,
})

// Track whether lineHeight has been manually set by the user.
// When false, updateBaselines() will auto-update lineHeight from font metrics.
let lineHeightManuallySet = false

// ============================================================================
// Font Management
// ============================================================================

/**
 * Get main font resource
 */
export function getMainFont(): FontResource | null {
  const fonts = styleStore$.style.font.fonts.get()
  return fonts.length > 0 ? fonts[0] : null
}

/**
 * Get main font family
 */
export function getMainFamily(): string {
  const mainFont = getMainFont()
  return mainFont ? mainFont.family : DEFAULT_FAMILY
}

/**
 * Get combined font family string
 */
export function getFontFamily(): string {
  const fonts = styleStore$.style.font.fonts.get()
  return (
    fonts.map((fontResource) => `"${fontResource.family}"`).join(',') ||
    DEFAULT_FAMILY
  )
}

/**
 * Get adapted font instance
 */
export function getOpentype(): AdaptedFont | null {
  const mainFont = getMainFont()
  return mainFont ? mainFont.opentype : null
}

/**
 * Get min baseline
 */
export function getMinBaseLine(): number {
  const font = styleStore$.style.font.get()
  const min = Math.min(
    font.middle,
    font.hanging,
    font.top,
    font.alphabetic,
    font.ideographic,
    font.bottom,
  )
  return Number.isNaN(Number(min)) ? 0 : min
}

/**
 * Get max baseline
 */
export function getMaxBaseLine(): number {
  const font = styleStore$.style.font.get()
  const max = Math.max(
    font.middle,
    font.hanging,
    font.top,
    font.alphabetic,
    font.ideographic,
    font.bottom,
  )
  return Number.isNaN(Number(max)) ? font.size : max
}

/**
 * Update font baselines
 */
export function updateBaselines(): void {
  const mainFont = getMainFont()
  const size = styleStore$.style.font.size.get()
  const family = getFontFamily()

  let bls
  if (mainFont?.opentype) {
    bls = getFontBaselinesFromMetrics(mainFont.opentype, size)
  } else {
    bls = getFontBaselinesFromCanvas('Ag', {
      fontFamily: family,
      fontSize: size,
    })
  }

  batch(() => {
    // Only auto-update lineHeight if the user hasn't manually set it
    if (!lineHeightManuallySet) {
      styleStore$.style.font.lineHeight.set(bls.lineHeight)
    }
    styleStore$.style.font.middle.set(bls.middle)
    styleStore$.style.font.hanging.set(bls.hanging)
    styleStore$.style.font.top.set(bls.top)
    styleStore$.style.font.alphabetic.set(bls.alphabetic)
    styleStore$.style.font.ideographic.set(bls.ideographic)
    styleStore$.style.font.bottom.set(bls.bottom)
  })
}

/**
 * Add a font
 */
export async function addFont(fontBuffer: ArrayBuffer): Promise<void> {
  const opentype: AdaptedFont = createAdaptedFont(fontBuffer)

  const { names } = opentype
  const family =
    names.fullName?.[Object.keys(names.fullName ?? {})[0]] ||
    names.postScriptName?.[Object.keys(names.postScriptName ?? {})[0]] ||
    names.fontFamily?.[Object.keys(names.fontFamily ?? {})[0]]

  if (!family) {
    throw new Error('Font has no identifiable name.')
  }

  const fonts = styleStore$.style.font.fonts.get()
  const hasFont = fonts.some((fontResource) => fontResource.family === family)

  if (hasFont) {
    throw new Error('Font already exists.')
  }

  // Variable font axes and instances are natively available from the adapter
  const variationAxes =
    opentype.variationAxes.length > 0 ? opentype.variationAxes : undefined
  const variationInstances =
    opentype.variationInstances.length > 0
      ? opentype.variationInstances
      : undefined

  // Build default variation settings from axis defaults
  const defaultVariationSettings: Record<string, number> = {}
  if (variationAxes) {
    for (const axis of variationAxes) {
      defaultVariationSettings[axis.tag] = axis.defaultValue
    }
  }

  // Note: Do NOT revoke the Object URL here. The CSS @font-face rule
  // references it via src: url(...), and the browser needs it valid for
  // the entire font lifetime. The URL is cleaned up on page unload.
  const isVariable = !!variationAxes
  const url = URL.createObjectURL(new Blob([fontBuffer]))
  await updateFontFace(family, url, isVariable)

  // Re-check after async operation to prevent concurrent duplicates.
  const currentFonts = styleStore$.style.font.fonts.get()
  if (currentFonts.find((f) => f.family === family)) {
    URL.revokeObjectURL(url)
    throw new Error('Font already exists.')
  }

  styleStore$.style.font.fonts.set([
    ...currentFonts,
    {
      font: opaqueObject(fontBuffer),
      family,
      opentype: opaqueObject(opentype),
      variationAxes,
      variationInstances,
    },
  ])

  // Only set variation settings for the first font; fallback fonts don't change variation
  if (currentFonts.length === 0) {
    styleStore$.style.font.variationSettings.set(defaultVariationSettings)
  }

  updateBaselines()
}

/**
 * Remove a font
 */
export function removeFont(fontResource: FontResource): void {
  const fonts = styleStore$.style.font.fonts.get()
  const idx = fonts.findIndex((f) => f.family === fontResource.family)

  if (idx === -1) {
    return
  }

  const remaining = fonts.filter((_, i) => i !== idx)
  styleStore$.style.font.fonts.set(remaining)

  if (remaining.length === 0) {
    // Clear variationSettings when all fonts are removed
    styleStore$.style.font.variationSettings.set({})
  } else if (idx === 0) {
    // Primary font removed — rebuild variation settings from new primary
    const newPrimary = remaining[0]
    const newDefaults: Record<string, number> = {}
    if (newPrimary.variationAxes) {
      for (const axis of newPrimary.variationAxes) {
        newDefaults[axis.tag] = axis.defaultValue
      }
    }
    styleStore$.style.font.variationSettings.set(newDefaults)
  }

  if (idx === 0) {
    updateBaselines()
  }
}

/**
 * Set font size
 */
export function setFontSize(size: number): void {
  styleStore$.style.font.size.set(size)
  updateBaselines()
}

/**
 * Set line height
 */
export function setLineHeight(lineHeight: number): void {
  lineHeightManuallySet = true
  styleStore$.style.font.lineHeight.set(lineHeight)
}

/**
 * Set sharp (font rendering sharpness)
 */
export function setSharp(sharp: number): void {
  styleStore$.style.font.sharp.set(sharp)
}

/**
 * Set variation settings for variable fonts
 */
export function setVariationSettings(settings: Record<string, number>): void {
  styleStore$.style.font.variationSettings.set(settings)
}

/**
 * Set a single variation axis value
 */
export function setVariationAxisValue(tag: string, value: number): void {
  styleStore$.style.font.variationSettings[tag].set(value)
}

// ============================================================================
// Render Mode Management
// ============================================================================

/**
 * Set render mode (default / sdf / msdf)
 */
export function setRenderMode(mode: RenderMode): void {
  styleStore$.style.render.mode.set(mode)
}

/**
 * Set SDF distance range
 */
export function setDistanceRange(range: number): void {
  styleStore$.style.render.distanceRange.set(Math.max(range, 1))
}

/**
 * Set SDF output channel format
 */
export function setSdfChannel(channel: SdfChannel): void {
  styleStore$.style.render.sdfChannel.set(channel)
}

/**
 * Set MSDF edge coloring angle threshold (radians)
 */
export function setAngleThreshold(value: number): void {
  styleStore$.style.render.angleThreshold.set(
    Math.max(0.5, Math.min(Math.PI, value)),
  )
}

/**
 * Set MSDF overlap contour support
 */
export function setOverlapSupport(value: boolean): void {
  styleStore$.style.render.overlapSupport.set(value)
}

/**
 * Set MSDF edge coloring seed
 */
export function setEdgeColoringSeed(value: number): void {
  styleStore$.style.render.edgeColoringSeed.set(Math.max(0, Math.round(value)))
}

/**
 * Set MSDF scanline sign correction pass
 */
export function setScanlinePass(value: boolean): void {
  styleStore$.style.render.scanlinePass.set(value)
}

/**
 * Set MSDF fill rule for winding detection
 */
export function setFillRule(value: FillRule): void {
  styleStore$.style.render.fillRule.set(value)
}

/**
 * Set MSDF edge coloring strategy
 */
export function setColoringStrategy(value: ColoringStrategy): void {
  styleStore$.style.render.coloringStrategy.set(value)
}

/**
 * Set MSDF error correction mode
 */
export function setErrorCorrection(value: ErrorCorrectionMode): void {
  styleStore$.style.render.errorCorrection.set(value)
}

// ============================================================================
// Fill & Stroke Management (via factory — DRY)
// ============================================================================

const fillSetters = createFillSetters(styleStore$.style.fill, 'fill')
const strokeFillSetters = createFillSetters(styleStore$.style.stroke, 'stroke')

// Fill setters
export const setFillType = fillSetters.setType
export const setFillColor = fillSetters.setColor
export const setGradientType = fillSetters.setGradientType
export const setGradientAngle = fillSetters.setGradientAngle
export const addGradientColor = fillSetters.addGradientColor
export const updateGradientPalette = fillSetters.updateGradientPalette
export const setPatternImage = fillSetters.setPatternImage
export const setPatternRepetition = fillSetters.setPatternRepetition
export const setPatternScale = fillSetters.setPatternScale

// Stroke-specific setters
export function setUseStroke(useStroke: boolean): void {
  styleStore$.style.useStroke.set(useStroke)
}

export function setStrokeWidth(width: number): void {
  styleStore$.style.stroke.width.set(width)
}

export function setStrokeLineCap(lineCap: CanvasLineCap): void {
  styleStore$.style.stroke.lineCap.set(lineCap)
}

export function setStrokeLineJoin(lineJoin: CanvasLineJoin): void {
  styleStore$.style.stroke.lineJoin.set(lineJoin)
}

export function setStrokeType(strokeType: 0 | 1 | 2): void {
  styleStore$.style.stroke.strokeType.set(strokeType)
}

// Stroke fill setters (delegate to factory)
export const setStrokeFillType = strokeFillSetters.setType
export const setStrokeColor = strokeFillSetters.setColor
export const setStrokeGradientType = strokeFillSetters.setGradientType
export const setStrokeGradientAngle = strokeFillSetters.setGradientAngle
export const addStrokeGradientColor = strokeFillSetters.addGradientColor
export const updateStrokeGradientPalette =
  strokeFillSetters.updateGradientPalette
export const setStrokePatternImage = strokeFillSetters.setPatternImage
export const setStrokePatternRepetition = strokeFillSetters.setPatternRepetition
export const setStrokePatternScale = strokeFillSetters.setPatternScale

// ============================================================================
// Shadow Management
// ============================================================================

/**
 * Set use shadow
 */
export function setUseShadow(useShadow: boolean): void {
  styleStore$.style.useShadow.set(useShadow)
}

/**
 * Set shadow color
 */
export function setShadowColor(color: string): void {
  styleStore$.style.shadow.color.set(color)
}

/**
 * Set shadow blur
 */
export function setShadowBlur(blur: number): void {
  styleStore$.style.shadow.blur.set(blur)
}

/**
 * Set shadow offset X
 */
export function setShadowOffsetX(offsetX: number): void {
  styleStore$.style.shadow.offsetX.set(offsetX)
}

/**
 * Set shadow offset Y
 */
export function setShadowOffsetY(offsetY: number): void {
  styleStore$.style.shadow.offsetY.set(offsetY)
}

/**
 * Set shadow offset
 */
export function setShadowOffset(offsetX: number, offsetY: number): void {
  batch(() => {
    styleStore$.style.shadow.offsetX.set(offsetX)
    styleStore$.style.shadow.offsetY.set(offsetY)
  })
}

// ============================================================================
// Inner Shadow Management
// ============================================================================

export function setUseInnerShadow(useInnerShadow: boolean): void {
  styleStore$.style.useInnerShadow.set(useInnerShadow)
}

export function setInnerShadowColor(color: string): void {
  styleStore$.style.innerShadow.color.set(color)
}

export function setInnerShadowBlur(blur: number): void {
  styleStore$.style.innerShadow.blur.set(blur)
}

export function setInnerShadowOffsetX(offsetX: number): void {
  styleStore$.style.innerShadow.offsetX.set(offsetX)
}

export function setInnerShadowOffsetY(offsetY: number): void {
  styleStore$.style.innerShadow.offsetY.set(offsetY)
}

export function setInnerShadowOffset(offsetX: number, offsetY: number): void {
  batch(() => {
    styleStore$.style.innerShadow.offsetX.set(offsetX)
    styleStore$.style.innerShadow.offsetY.set(offsetY)
  })
}

// ============================================================================
// Background Color Management
// ============================================================================

/**
 * Set background color
 */
export function setBgColor(bgColor: string): void {
  styleStore$.style.bgColor.set(bgColor)
}

// ============================================================================
// Global Adjust Metric Management
// ============================================================================

/**
 * Set global adjust metric xAdvance
 */
export function setGlobalXAdvance(xAdvance: number): void {
  styleStore$.globalAdjustMetric.xAdvance.set(xAdvance)
}

/**
 * Set global adjust metric xOffset
 */
export function setGlobalXOffset(xOffset: number): void {
  styleStore$.globalAdjustMetric.xOffset.set(xOffset)
}

/**
 * Set global adjust metric yOffset
 */
export function setGlobalYOffset(yOffset: number): void {
  styleStore$.globalAdjustMetric.yOffset.set(yOffset)
}

// ============================================================================
// Fractional Precision Actions
// ============================================================================

/**
 * Set xFractional bits for BMFont export (0-7)
 */
export function setXFractional(value: number): void {
  const intValue = Math.round(value)
  styleStore$.xFractional.set(Math.max(0, Math.min(7, intValue)))
}

// ============================================================================
// Store Initialization / Reset
// ============================================================================

/**
 * Initialize style store with data
 */
export function initializeStyleStore(data: Partial<StyleStoreState>): void {
  // Reset lineHeight manual flag; if saved data has a lineHeight value,
  // treat it as a user-set value to preserve it across baseline updates
  lineHeightManuallySet = data.style?.font?.lineHeight !== undefined

  batch(() => {
    if (data.style) {
      // Deep merge style data
      const currentStyle = styleStore$.style.get()
      const newStyle = { ...currentStyle, ...data.style }

      // Merge nested objects
      if (data.style.font) {
        newStyle.font = { ...currentStyle.font, ...data.style.font }
      }
      if (data.style.fill) {
        newStyle.fill = { ...currentStyle.fill, ...data.style.fill }
        if (data.style.fill.gradient) {
          newStyle.fill.gradient = {
            ...currentStyle.fill.gradient,
            ...data.style.fill.gradient,
          }
        }
        if (data.style.fill.patternTexture) {
          newStyle.fill.patternTexture = {
            ...currentStyle.fill.patternTexture,
            ...data.style.fill.patternTexture,
          }
        }
      }
      if (data.style.stroke) {
        newStyle.stroke = { ...currentStyle.stroke, ...data.style.stroke }
        if (data.style.stroke.gradient) {
          newStyle.stroke.gradient = {
            ...currentStyle.stroke.gradient,
            ...data.style.stroke.gradient,
          }
        }
        if (data.style.stroke.patternTexture) {
          newStyle.stroke.patternTexture = {
            ...currentStyle.stroke.patternTexture,
            ...data.style.stroke.patternTexture,
          }
        }
      }
      if (data.style.shadow) {
        newStyle.shadow = { ...currentStyle.shadow, ...data.style.shadow }
      }
      if (data.style.innerShadow) {
        newStyle.innerShadow = {
          ...currentStyle.innerShadow,
          ...data.style.innerShadow,
        }
      }
      if (data.style.render) {
        newStyle.render = { ...currentStyle.render, ...data.style.render }
      }

      styleStore$.style.set(newStyle)
    }

    if (data.globalAdjustMetric) {
      styleStore$.globalAdjustMetric.set({
        ...styleStore$.globalAdjustMetric.get(),
        ...data.globalAdjustMetric,
      })
    }

    if (data.xFractional !== undefined) {
      styleStore$.xFractional.set(data.xFractional)
    }
  })

  // Load pattern texture image if buffer exists
  const buffer = styleStore$.style.fill.patternTexture.buffer.get()
  if (buffer && buffer.byteLength > 0) {
    setPatternImage(buffer)
  }
}

/**
 * Reset style store to default values
 */
export function resetStyleStore(): void {
  // Release Object URLs before resetting to prevent memory leaks
  const fillSrc = styleStore$.style.fill.patternTexture.src.get()
  if (fillSrc) URL.revokeObjectURL(fillSrc)
  const strokeSrc = styleStore$.style.stroke.patternTexture.src.get()
  if (strokeSrc) URL.revokeObjectURL(strokeSrc)

  lineHeightManuallySet = false
  resetPatternImages()

  batch(() => {
    styleStore$.style.set(createDefaultStyle())
    styleStore$.globalAdjustMetric.set(createDefaultMetric())
    styleStore$.xFractional.set(0)
  })
}

/**
 * Get style store snapshot for serialization
 */
export function getStyleSnapshot(): StyleStoreState {
  return styleStore$.get()
}

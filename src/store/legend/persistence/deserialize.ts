/**
 * Legend State Deserialization Module
 *
 * Converts Protocol Buffer decoded data back to Legend State store format.
 * This handles loading saved projects and initializing Legend State stores.
 *
 * Key responsibilities:
 * - Convert plain objects from Protocol Buffer to Legend State observables
 * - Restore Map objects from Record format
 * - Handle font resources with opentype.js parsing
 * - Initialize pattern texture images
 */
import { batch, opaqueObject } from '@legendapp/state'
import type { Font as OpenType } from 'opentype.js'
import { parse } from 'opentype.js'
import type { IProject } from 'src/file/conversion/fileTypes/sbf/proto/1.2.2/project'
import getTrimImageInfo from 'src/utils/getTrimImageInfo'
import updateFontFace from 'src/utils/updateFontFace'

import {
  createFontGlyph,
  generateImageGlyphUid,
  glyphStore$,
} from '../glyphStore'
import { setCurrentProject } from '../projectStore'
import { initializeLayoutStore } from '../stores/layoutStore'
import type { MetricData } from '../stores/styleStore'
import {
  type FillData,
  FillType,
  type FontData,
  type FontResource,
  type GradientPaletteItem,
  GradientType,
  type PatternTextureData,
  type RenderMode,
  type SdfChannel,
  type ShadowData,
  type StrokeData,
  type StyleData,
  initializeStyleStore,
  updateBaselines,
} from '../stores/styleStore'
import { DEFAULT_PREVIEW_TEXT, initializeUiStore } from '../stores/uiStore'
import type { FontGlyphData, ImageGlyphData } from '../types'

// ============================================================================
// Buffer Utilities
// ============================================================================

/**
 * Normalize a buffer to ArrayBuffer.
 * Handles both Uint8Array (from raw protobuf) and ArrayBuffer (from toOriginBuffer conversion).
 */
function normalizeToArrayBuffer(
  input: Uint8Array | ArrayBuffer,
): ArrayBuffer {
  if (input instanceof ArrayBuffer) return input
  return input.buffer.slice(
    input.byteOffset,
    input.byteOffset + input.byteLength,
  ) as ArrayBuffer
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Decoded project data from Protocol Buffer
 */
export interface DecodedProject extends Partial<IProject> {
  id?: number
  name?: string
  text?: string
}

// ============================================================================
// Metric Deserialization
// ============================================================================

/**
 * Create MetricData from plain object
 */
function deserializeMetric(
  data:
    | { xAdvance?: number; xOffset?: number; yOffset?: number }
    | null
    | undefined,
): MetricData {
  return {
    xAdvance: data?.xAdvance ?? 0,
    xOffset: data?.xOffset ?? 0,
    yOffset: data?.yOffset ?? 0,
  }
}

// ============================================================================
// Kerning Deserialization
// ============================================================================

/**
 * Convert plain object to kerning Record
 */
function deserializeKerning(
  data: Record<string, number> | null | undefined,
): Record<string, number> {
  if (!data) return {}
  const result: Record<string, number> = {}
  Object.entries(data).forEach(([key, value]) => {
    if (value !== 0) {
      result[key] = value
    }
  })
  return result
}

// ============================================================================
// Font Glyph Deserialization
// ============================================================================

/**
 * Deserialize a single font glyph
 */
function deserializeFontGlyph(
  letter: string,
  data:
    | {
        adjustMetric?: { xAdvance?: number; xOffset?: number; yOffset?: number }
        kerning?: Record<string, number>
        page?: number
      }
    | null
    | undefined,
): FontGlyphData {
  const glyph = createFontGlyph(letter)

  if (data) {
    glyph.adjustMetric = deserializeMetric(data.adjustMetric)
    glyph.kerning = deserializeKerning(data.kerning)
    glyph.page = data.page ?? -1
  }

  return glyph
}

/**
 * Deserialize all font glyphs
 */
function deserializeGlyphs(
  data:
    | Record<
        string,
        {
          adjustMetric?: {
            xAdvance?: number
            xOffset?: number
            yOffset?: number
          }
          kerning?: Record<string, number>
          page?: number
        }
      >
    | null
    | undefined,
): Record<string, FontGlyphData> {
  const result: Record<string, FontGlyphData> = {}

  if (data) {
    Object.entries(data).forEach(([letter, glyphData]) => {
      result[letter] = deserializeFontGlyph(letter, glyphData)
    })
  }

  return result
}

// ============================================================================
// Image Glyph Deserialization
// ============================================================================

/**
 * Deserialize a single image glyph
 */
function deserializeImageGlyph(data: {
  letter?: string
  adjustMetric?: { xAdvance?: number; xOffset?: number; yOffset?: number }
  buffer?: Uint8Array | ArrayBuffer
  fileName?: string
  fileType?: string
  selected?: boolean
  kerning?: Record<string, number>
  page?: number
}): ImageGlyphData {
  const buffer = data.buffer
    ? normalizeToArrayBuffer(data.buffer)
    : undefined

  return {
    type: 'image' as const,
    letter: data.letter ?? '',
    uid: generateImageGlyphUid(),
    selected: data.selected ?? false,
    source: null,
    x: 0,
    y: 0,
    page: data.page ?? -1,
    width: 0,
    height: 0,
    fontWidth: 0,
    fontHeight: 0,
    trimOffsetTop: 0,
    trimOffsetLeft: 0,
    canvasX: 0,
    canvasY: 0,
    kerning: deserializeKerning(data.kerning),
    adjustMetric: deserializeMetric(data.adjustMetric),
    fileName: data.fileName ?? '',
    fileType: data.fileType ?? '',
    buffer: buffer ? opaqueObject(buffer) : undefined,
    src: buffer ? URL.createObjectURL(new Blob([buffer])) : '',
  }
}

/**
 * Deserialize all image glyphs
 */
function deserializeImageGlyphs(
  data:
    | Array<{
        letter?: string
        adjustMetric?: { xAdvance?: number; xOffset?: number; yOffset?: number }
        buffer?: Uint8Array | ArrayBuffer
        fileName?: string
        fileType?: string
        selected?: boolean
        kerning?: Record<string, number>
        page?: number
      }>
    | null
    | undefined,
): ImageGlyphData[] {
  if (!data) {
    return []
  }
  return data.map(deserializeImageGlyph)
}

// ============================================================================
// Style Deserialization
// ============================================================================

/**
 * Deserialize gradient palette
 */
function deserializeGradientPalette(
  data:
    | Array<{ id?: number; offset?: number; color?: string }>
    | null
    | undefined,
): GradientPaletteItem[] {
  if (!data || data.length === 0) {
    return [
      { offset: 0, color: 'rgba(255,255,255,1)', id: 1 },
      { offset: 1, color: 'rgba(0,0,0,1)', id: 2 },
    ]
  }
  return data.map((item, index) => ({
    id: item.id ?? index + 1,
    offset: item.offset ?? 0,
    color: item.color ?? 'rgba(0,0,0,1)',
  }))
}

/**
 * Deserialize pattern texture
 */
function deserializePatternTexture(
  data:
    | { buffer?: Uint8Array | ArrayBuffer; scale?: number; repetition?: string }
    | null
    | undefined,
): PatternTextureData {
  const buffer = data?.buffer
    ? normalizeToArrayBuffer(data.buffer)
    : new ArrayBuffer(0)

  return {
    buffer,
    src: '',
    repetition:
      (data?.repetition as PatternTextureData['repetition']) ?? 'repeat',
    scale: data?.scale ?? 1,
  }
}

/**
 * Deserialize fill data
 */
function deserializeFill(
  data:
    | {
        type?: number
        color?: string
        gradient?: {
          type?: number
          angle?: number
          palette?: Array<{ id?: number; offset?: number; color?: string }>
        }
        patternTexture?: {
          buffer?: Uint8Array | ArrayBuffer
          scale?: number
          repetition?: string
        }
      }
    | null
    | undefined,
): FillData {
  return {
    type: (data?.type as FillType) ?? FillType.SOLID,
    color: data?.color ?? '#000000',
    gradient: {
      type: (data?.gradient?.type as GradientType) ?? GradientType.LINEAR,
      angle: data?.gradient?.angle ?? 0,
      palette: deserializeGradientPalette(data?.gradient?.palette),
    },
    patternTexture: deserializePatternTexture(data?.patternTexture),
  }
}

/**
 * Deserialize stroke data
 */
function deserializeStroke(
  data:
    | {
        type?: number
        color?: string
        gradient?: {
          type?: number
          angle?: number
          palette?: Array<{ id?: number; offset?: number; color?: string }>
        }
        patternTexture?: {
          buffer?: Uint8Array | ArrayBuffer
          scale?: number
          repetition?: string
        }
        width?: number
        lineCap?: string
        lineJoin?: string
        strokeType?: number
      }
    | null
    | undefined,
): StrokeData {
  const fill = deserializeFill(data)
  return {
    ...fill,
    width: data?.width ?? 1,
    lineCap: (data?.lineCap as CanvasLineCap) ?? 'round',
    lineJoin: (data?.lineJoin as CanvasLineJoin) ?? 'round',
    strokeType: (data?.strokeType as 0 | 1 | 2) ?? 0,
  }
}

/**
 * Deserialize shadow data
 */
function deserializeShadow(
  data:
    | { color?: string; blur?: number; offsetX?: number; offsetY?: number }
    | null
    | undefined,
): ShadowData {
  return {
    color: data?.color ?? '#000000',
    blur: data?.blur ?? 1,
    offsetX: data?.offsetX ?? 1,
    offsetY: data?.offsetY ?? 1,
  }
}

/**
 * Deserialize font resources
 */
async function deserializeFontResources(
  data: Array<{ font?: Uint8Array | ArrayBuffer }> | null | undefined,
): Promise<FontResource[]> {
  if (!data || data.length === 0) {
    return []
  }

  const fontPromises = data.map(async (fontData) => {
    if (!fontData.font || fontData.font.byteLength === 0) {
      return null
    }

    try {
      const buffer = normalizeToArrayBuffer(fontData.font)

      const opentype: OpenType = parse(buffer, { lowMemory: true })
      const { names } = opentype
      const family =
        names.postScriptName?.[Object.keys(names.postScriptName ?? {})[0]] ||
        names.fontFamily?.[Object.keys(names.fontFamily ?? {})[0]] ||
        'UnknownFont'

      // Register font face
      // Note: Do NOT revoke the Object URL here. The CSS @font-face rule
      // references it via src: url(...), and the browser needs it valid for
      // the entire font lifetime. The URL is cleaned up on page unload.
      const url = URL.createObjectURL(new Blob([buffer]))
      await updateFontFace(family, url)

      return {
        font: opaqueObject(buffer),
        family,
        opentype: opaqueObject(opentype),
      } as FontResource
    } catch (error) {
      console.error('[Deserialize] Failed to parse font:', error)
      return null
    }
  })

  const fonts = await Promise.all(fontPromises)
  return fonts.filter((f): f is FontResource => f !== null)
}

/**
 * Deserialize font data
 */
async function deserializeFont(
  data:
    | {
        fonts?: Array<{ font?: Uint8Array | ArrayBuffer }>
        size?: number
        lineHeight?: number
        sharp?: number
      }
    | null
    | undefined,
): Promise<FontData> {
  const fonts = await deserializeFontResources(data?.fonts)

  return {
    fonts,
    size: data?.size ?? 72,
    lineHeight: data?.lineHeight ?? 1.25,
    middle: 0,
    hanging: 0,
    top: 0,
    alphabetic: 0,
    ideographic: 0,
    bottom: 0,
    sharp: data?.sharp ?? 80,
  }
}

/**
 * Convert proto int32 to RenderMode string
 */
function intToRenderMode(value: number | null | undefined): RenderMode {
  switch (value) {
    case 1:
      return 'sdf'
    case 2:
      return 'msdf'
    default:
      return 'default'
  }
}

/**
 * Convert proto int32 to SdfChannel string
 */
function intToSdfChannel(value: number | null | undefined): SdfChannel {
  switch (value) {
    case 1:
      return 'alpha'
    case 2:
      return 'rgb-inv'
    case 3:
      return 'alpha-inv'
    default:
      return 'rgb'
  }
}

/**
 * Deserialize complete style data
 */
async function deserializeStyle(
  data:
    | {
        font?: {
          fonts?: Array<{ font?: Uint8Array | ArrayBuffer }>
          size?: number
          lineHeight?: number
          sharp?: number
        }
        fill?: {
          type?: number
          color?: string
          gradient?: {
            type?: number
            angle?: number
            palette?: Array<{ id?: number; offset?: number; color?: string }>
          }
          patternTexture?: {
            buffer?: Uint8Array
            scale?: number
            repetition?: string
          }
        }
        useStroke?: boolean
        stroke?: {
          type?: number
          color?: string
          gradient?: {
            type?: number
            angle?: number
            palette?: Array<{ id?: number; offset?: number; color?: string }>
          }
          patternTexture?: {
            buffer?: Uint8Array
            scale?: number
            repetition?: string
          }
          width?: number
          lineCap?: string
          lineJoin?: string
          strokeType?: number
        }
        useShadow?: boolean
        shadow?: {
          color?: string
          blur?: number
          offsetX?: number
          offsetY?: number
        }
        bgColor?: string
        render?: {
          mode?: number
          distanceRange?: number
          sdfChannel?: number
        }
      }
    | null
    | undefined,
): Promise<StyleData> {
  const font = await deserializeFont(data?.font)

  return {
    font,
    fill: deserializeFill(data?.fill),
    useStroke: data?.useStroke ?? false,
    stroke: deserializeStroke(data?.stroke),
    useShadow: data?.useShadow ?? false,
    shadow: deserializeShadow(data?.shadow),
    bgColor: data?.bgColor ?? 'rgba(0,0,0,0)',
    render: {
      mode: intToRenderMode(data?.render?.mode),
      distanceRange: data?.render?.distanceRange || 16,
      sdfChannel: intToSdfChannel(data?.render?.sdfChannel),
    },
  }
}

// ============================================================================
// Main Deserialization
// ============================================================================

/**
 * Deserialize project data and initialize Legend State stores
 *
 * This is the main entry point for deserialization.
 * Takes decoded Protocol Buffer data and initializes all Legend State stores.
 *
 * @param data - Decoded project data from Protocol Buffer
 */
export async function deserializeProject(data: DecodedProject): Promise<void> {
  console.log(`[Deserialize] Processing: ${data.name ?? 'Unnamed'}`)

  try {
    // Deserialize style (async due to font loading)
    // Note: Protocol Buffer types use `| null` while our helpers use `| undefined`
    // Type assertions are safe here as the structure is compatible
    const style = await deserializeStyle(
      data.style as Parameters<typeof deserializeStyle>[0],
    )

    // Deserialize glyphs
    const glyphs = deserializeGlyphs(
      data.glyphs as Parameters<typeof deserializeGlyphs>[0],
    )
    const imageGlyphs = deserializeImageGlyphs(
      data.glyphImages as Parameters<typeof deserializeImageGlyphs>[0],
    )

    // Deserialize global metric
    const globalAdjustMetric = deserializeMetric(
      data.globalAdjustMetric as Parameters<typeof deserializeMetric>[0],
    )

    // Update stores in batch
    batch(() => {
      // Set project info
      setCurrentProject({
        id: data.id ?? Date.now(),
        name: data.name ?? 'Unnamed',
        text: data.text ?? '',
      })

      // Set style store
      initializeStyleStore({
        style,
        globalAdjustMetric,
        xFractional: data.extensions?.xFractional ?? 0,
      })

      // Set layout store
      initializeLayoutStore({
        padding: data.layout?.padding ?? 1,
        spacing: data.layout?.spacing ?? 1,
        width: data.layout?.width ?? 512,
        height: data.layout?.height ?? 512,
        auto: data.layout?.auto ?? true,
        fixedSize: data.layout?.fixedSize ?? false,
        page: data.layout?.page ?? 1,
      })

      // Set UI store
      initializeUiStore({
        previewText: data.ui?.previewText ?? DEFAULT_PREVIEW_TEXT,
      })

      // Revoke old image glyph Object URLs before replacing (I9)
      const existingImageGlyphs = glyphStore$.imageGlyphs.get()
      existingImageGlyphs.forEach((img) => {
        if (img.src) {
          URL.revokeObjectURL(img.src)
        }
      })

      // Set glyph store
      glyphStore$.glyphs.set(glyphs)
      glyphStore$.imageGlyphs.set(imageGlyphs)
    })

    // Always update baselines — for CSS fonts, this uses Canvas measureText API;
    // for OpenType fonts, this uses font metrics. Matches MobX Font constructor behavior.
    updateBaselines()

    console.log(`[Deserialize] Project loaded: ${data.name ?? 'Unnamed'}`)
  } catch (error) {
    console.error('[Deserialize] Failed to deserialize project:', error)
    throw error
  }
}

/**
 * Initialize image glyph sources after deserialization
 *
 * This should be called after deserializeProject to load image glyph images
 * and calculate their dimensions.
 */
export async function initializeImageGlyphSources(): Promise<void> {
  const imageGlyphs = glyphStore$.imageGlyphs.get()

  const loadPromises = imageGlyphs.map(async (imageGlyph, index) => {
    if (!imageGlyph.buffer || imageGlyph.buffer.byteLength === 0) {
      return
    }

    return new Promise<void>((resolve) => {
      const src =
        imageGlyph.src || URL.createObjectURL(new Blob([imageGlyph.buffer!]))
      const img = new Image()

      img.onload = () => {
        // Apply trim to match glyphActions.initializeImageGlyph behavior
        const trimInfo = getTrimImageInfo(img)
        const hasContent = trimInfo.width > 0 && trimInfo.height > 0

        batch(() => {
          glyphStore$.imageGlyphs[index].source.set(
            hasContent ? opaqueObject(trimInfo.canvas) : null,
          )
          glyphStore$.imageGlyphs[index].fontWidth.set(img.naturalWidth)
          glyphStore$.imageGlyphs[index].fontHeight.set(img.naturalHeight)
          glyphStore$.imageGlyphs[index].width.set(trimInfo.width)
          glyphStore$.imageGlyphs[index].height.set(trimInfo.height)
          glyphStore$.imageGlyphs[index].trimOffsetLeft.set(
            trimInfo.trimOffsetLeft,
          )
          glyphStore$.imageGlyphs[index].trimOffsetTop.set(
            trimInfo.trimOffsetTop,
          )
          glyphStore$.imageGlyphs[index].src.set(src)
        })
        resolve()
      }

      img.onerror = () => {
        console.error(
          `[Deserialize] Failed to load image: ${imageGlyph.fileName}`,
        )
        resolve()
      }

      img.src = src
    })
  })

  await Promise.all(loadPromises)
}

/**
 * Validate decoded project data
 */
export function validateDecodedProject(data: DecodedProject): boolean {
  if (!data) {
    return false
  }

  // ID is required
  if (typeof data.id !== 'number' || data.id <= 0) {
    console.error('[Deserialize] Invalid project ID')
    return false
  }

  return true
}

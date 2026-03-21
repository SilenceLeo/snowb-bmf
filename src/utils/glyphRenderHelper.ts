import type {
  FillRenderConfig,
  FontRenderConfig,
  GlyphRenderConfig,
  ShadowData,
  StrokeRenderConfig,
} from 'src/types/style'

import applyCanvasVariationSettings from './applyCanvasVariationSettings'
import createCanvasFontString from './createCanvasFontString'
import ctxDoPath from './ctxDoPath'
import type { AdaptedFont } from './fontAdapter'
import getCanvasStyle from './getCanvasStyle'
import measureTextSize, { LetterSize } from './measureTextSize'
import pathDoSharp from './pathDoSharp'
import { trimTransparentPixelsFromRegion } from './trimTransparentPixels'
import variationSettingsToCssProps from './variationSettingsToCssProps'

export interface GlyphItem extends LetterSize {
  canvasX: number
  canvasY: number
}

export interface GlyphInfo {
  canvas: HTMLCanvasElement
  glyphs: Map<string, GlyphItem>
}

// Re-export shared types for consumers (getFontGlyphs, getFontGlyphsProgressive)
export type { GlyphRenderConfig }
export type FillConfig = FillRenderConfig
export type StrokeConfig = StrokeRenderConfig
export type ShadowConfig = ShadowData
export type FontConfig = FontRenderConfig

const CANVAS_2D_OPTIONS: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
  alpha: true,
}

export function createCanvas2D(): {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
} {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', CANVAS_2D_OPTIONS)
  if (!ctx) {
    throw new Error('Failed to create CanvasRenderingContext2D')
  }
  return { canvas, ctx }
}

export interface LayoutInfo {
  columnNum: number
  lineNum: number
  lineWidth: number
  addX: number
  addY: number
  itemWidth: number
  itemHeight: number
  padding: number
}

export function computeLayout(
  textLength: number,
  config: GlyphRenderConfig,
): LayoutInfo {
  const { font, stroke, shadow } = config
  const columnNum = Math.ceil(Math.sqrt(textLength))
  const lineNum = Math.ceil(textLength / columnNum)
  const lineWidth = stroke ? stroke.width * 2 : 0
  let addX = lineWidth
  let addY = lineWidth

  if (shadow) {
    const blur = Math.ceil(shadow.blur * 1.5)
    addX += Math.abs(shadow.offsetX) + blur
    addY += Math.abs(shadow.offsetY) + blur
  }

  const itemWidth = font.size + addX * 2
  const itemHeight = font.size + addY * 2
  const padding = font.size

  return {
    columnNum,
    lineNum,
    lineWidth,
    addX,
    addY,
    itemWidth,
    itemHeight,
    padding,
  }
}

export function glyphStartPosition(
  index: number,
  layout: LayoutInfo,
): { startX: number; startY: number } {
  const { columnNum, itemWidth, itemHeight, padding } = layout
  const startX = (index % columnNum) * (itemWidth + padding * 2) + padding
  const startY =
    Math.floor(index / columnNum) * (itemHeight + padding * 2) + padding
  return { startX, startY }
}

export function renderSingleGlyph(
  index: number,
  letter: string,
  ctx: CanvasRenderingContext2D,
  strokeCtx: CanvasRenderingContext2D,
  map: Map<string, GlyphItem>,
  config: GlyphRenderConfig,
  layout: LayoutInfo,
): void {
  const { font, stroke, fill } = config
  const { lineWidth, addX, addY, itemWidth, itemHeight, padding } = layout
  const { startX, startY } = glyphStartPosition(index, layout)

  let letterSize: GlyphItem

  // Find a font resource that has the glyph.
  // For variable fonts with non-default variation, apply getVariation()
  // to get interpolated outlines (fontkit gvar support).
  const variationSettings = font.variationSettings
  const mainFontResource = font.fonts?.[0]
  const hasNonDefaultVariation =
    variationSettings &&
    Object.keys(variationSettings).length > 0 &&
    mainFontResource?.variationAxes?.some(
      (axis: { tag: string; defaultValue: number }) =>
        variationSettings[axis.tag] !== undefined &&
        variationSettings[axis.tag] !== axis.defaultValue,
    )

  let fontResource: { opentype: AdaptedFont } | undefined
  if (mainFontResource?.opentype) {
    // Apply variation if needed, then check if the glyph exists
    let activeOpentype = mainFontResource.opentype
    if (hasNonDefaultVariation && variationSettings) {
      activeOpentype = activeOpentype.getVariation(variationSettings)
    }
    const glyphIndex = activeOpentype.charToGlyphIndex(letter)
    if (glyphIndex !== 0) {
      fontResource = { opentype: activeOpentype }
    } else {
      // Try other font resources (fallback fonts)
      for (let i = 1; i < (font.fonts?.length ?? 0); i++) {
        const fb = font.fonts![i]
        if (!fb.opentype) continue
        let fbOpentype = fb.opentype
        // Apply variation to fallback fonts that support it
        if (
          hasNonDefaultVariation &&
          variationSettings &&
          fb.variationAxes?.length
        ) {
          fbOpentype = fbOpentype.getVariation(variationSettings)
        }
        const fbGlyphIndex = fbOpentype.charToGlyphIndex(letter)
        if (fbGlyphIndex !== 0) {
          fontResource = { opentype: fbOpentype }
          break
        }
      }
    }
  }

  if (fontResource) {
    letterSize = renderOpentypeGlyph(
      letter,
      fontResource,
      font,
      fill,
      stroke,
      lineWidth,
      ctx,
      startX,
      startY,
      addX,
      addY,
      itemWidth,
      itemHeight,
      padding,
    )
  } else {
    letterSize = renderFallbackGlyph(
      letter,
      font,
      fill,
      stroke,
      lineWidth,
      ctx,
      strokeCtx,
      startX,
      startY,
      addX,
      addY,
      itemWidth,
      itemHeight,
      padding,
    )
  }

  map.set(letter, letterSize)
}

function renderOpentypeGlyph(
  letter: string,
  fontResource: { opentype: AdaptedFont },
  font: FontConfig,
  fill: FillConfig,
  stroke: StrokeConfig | undefined,
  lineWidth: number,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  addX: number,
  addY: number,
  itemWidth: number,
  itemHeight: number,
  padding: number,
): GlyphItem {
  const opentype = fontResource.opentype
  const glyph = opentype.charToGlyph(letter)
  const scale = font.size / opentype.unitsPerEm
  const baseline = Math.ceil(opentype.ascender * scale)

  const path = glyph.getPath(0, baseline, font.size)
  pathDoSharp(path, font.sharp)
  const boundingBox = path.getBoundingBox()

  const fontWidth = opentype.getAdvanceWidth(letter, font.size)
  const fontHeight = (opentype.ascender - opentype.descender) * scale

  const letterSize: GlyphItem = {
    letter,
    width: Math.ceil(boundingBox.x2) - Math.floor(boundingBox.x1),
    height: Math.ceil(boundingBox.y2) - Math.floor(boundingBox.y1),
    fontWidth,
    fontHeight,
    trimOffsetTop: Math.round(boundingBox.y1) * -1,
    trimOffsetLeft: Math.round(boundingBox.x1) * -1,
    canvasX: 0,
    canvasY: 0,
  }

  if (letterSize.width === 0 || letterSize.height === 0) {
    return letterSize
  }

  const translateX = startX + addX + letterSize.trimOffsetLeft
  const translateY = startY + addY + letterSize.trimOffsetTop

  ctx.translate(translateX, translateY)
  ctxDoPath(ctx, path.commands)
  ctx.fillStyle = getCanvasStyle(
    ctx,
    0,
    0,
    fontWidth,
    fontHeight,
    fill,
    fill.patternImage,
  )

  const hasStroke = !!(stroke && lineWidth)

  if (hasStroke) {
    ctx.strokeStyle = getCanvasStyle(
      ctx,
      0,
      0,
      fontWidth,
      fontHeight,
      stroke,
      stroke.patternImage,
    )
    ctx.lineWidth = path.strokeWidth =
      stroke.strokeType === 1 ? stroke.width : lineWidth
  }

  if (hasStroke && stroke.strokeType === 0) {
    ctx.stroke()
    ctx.save()
    ctx.clip()
    ctx.clearRect(
      -translateX + startX - padding,
      -translateY + startY - padding,
      itemWidth + padding * 2,
      itemHeight + padding * 2,
    )
    ctx.restore()
  }

  ctx.fill()

  if (hasStroke && stroke.strokeType === 1) {
    ctx.stroke()
  } else if (hasStroke && stroke.strokeType === 2) {
    ctx.save()
    ctx.clip()
    ctx.stroke()
    ctx.restore()
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)

  return letterSize
}

function renderFallbackGlyph(
  letter: string,
  font: FontConfig,
  fill: FillConfig,
  stroke: StrokeConfig | undefined,
  lineWidth: number,
  ctx: CanvasRenderingContext2D,
  strokeCtx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  addX: number,
  addY: number,
  itemWidth: number,
  itemHeight: number,
  padding: number,
): GlyphItem {
  const variationSettings = font.variationSettings
  const cssProps = variationSettingsToCssProps(variationSettings)
  const hasVariation =
    variationSettings && Object.keys(variationSettings).length > 0

  const letterSize: GlyphItem = {
    ...measureTextSize(letter, {
      fontSize: font.size,
      fontFamily: font.family,
      fontWeight: cssProps.fontWeight,
      fontStyle: cssProps.fontStyle,
      variationSettings,
      fontStretch: cssProps.fontStretch,
    }),
    canvasX: 0,
    canvasY: 0,
  }

  const { width, height, trimOffsetLeft, trimOffsetTop } = letterSize
  if (width === 0 || height === 0) {
    return letterSize
  }

  const styleX = startX + addX + (width - font.size) / 2
  const drawX = startX + addX + trimOffsetLeft
  const drawY = startY + addY + trimOffsetTop

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = createCanvasFontString({
    fontSize: font.size,
    fontFamily: font.family,
    fontWeight: cssProps.fontWeight,
    fontStyle: cssProps.fontStyle,
  })

  // Apply all variation axes + fontStretch AFTER ctx.font (which resets them)
  if (hasVariation) {
    applyCanvasVariationSettings(ctx, variationSettings, cssProps.fontStretch)
  }

  const hasStroke = !!(stroke && lineWidth)

  if (hasStroke && stroke.strokeType === 0) {
    ctx.fillStyle = '#000000'
    ctx.strokeStyle = getCanvasStyle(
      ctx,
      styleX,
      drawY,
      font.size,
      font.size,
      stroke,
      stroke.patternImage,
    )
    ctx.lineWidth = lineWidth
    ctx.strokeText(letter, drawX, drawY)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillText(letter, drawX, drawY)
    ctx.globalCompositeOperation = 'source-over'
  }

  ctx.fillStyle = getCanvasStyle(
    ctx,
    styleX,
    drawY,
    font.size,
    font.size,
    fill,
    fill.patternImage,
  )
  ctx.fillText(letter, drawX, drawY)

  if (hasStroke && stroke.strokeType === 1) {
    ctx.strokeStyle = getCanvasStyle(
      ctx,
      styleX,
      drawY,
      font.size,
      font.size,
      stroke,
      stroke.patternImage,
    )
    ctx.lineWidth = stroke.width
    ctx.strokeText(letter, drawX, drawY)
  } else if (hasStroke && stroke.strokeType === 2) {
    strokeCtx.save()
    strokeCtx.beginPath()
    strokeCtx.rect(
      startX - padding,
      startY - padding,
      itemWidth + padding * 2,
      itemHeight + padding * 2,
    )
    strokeCtx.clip()
    strokeCtx.font = ctx.font
    if (hasVariation) {
      applyCanvasVariationSettings(
        strokeCtx,
        variationSettings,
        cssProps.fontStretch,
      )
    }
    strokeCtx.fillStyle = '#000000'
    strokeCtx.strokeStyle = getCanvasStyle(
      strokeCtx,
      styleX,
      drawY,
      font.size,
      font.size,
      stroke,
      stroke.patternImage,
    )
    strokeCtx.lineWidth = lineWidth
    strokeCtx.fillText(letter, drawX, drawY)
    strokeCtx.globalCompositeOperation = 'source-in'
    strokeCtx.strokeText(letter, drawX, drawY)
    strokeCtx.globalCompositeOperation = 'source-over'
    strokeCtx.restore()
  }

  // Reset variation settings to avoid polluting subsequent glyphs
  if (hasVariation) {
    applyCanvasVariationSettings(ctx, {})
  }

  return letterSize
}

export function applyStrokeType2(
  ctx: CanvasRenderingContext2D,
  strokeCanvas: HTMLCanvasElement,
  stroke: StrokeConfig | undefined,
  lineWidth: number,
): void {
  if (stroke && lineWidth && stroke.strokeType === 2) {
    ctx.drawImage(strokeCanvas, 0, 0)
  }
}

export function applyShadow(
  canvas: HTMLCanvasElement,
  strokeCanvas: HTMLCanvasElement,
  strokeCtx: CanvasRenderingContext2D,
  shadow: ShadowConfig,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  strokeCanvas.width = canvas.width
  strokeCanvas.height = canvas.height
  strokeCtx.shadowBlur = shadow.blur
  strokeCtx.shadowColor = shadow.color
  strokeCtx.shadowOffsetX = shadow.offsetX
  strokeCtx.shadowOffsetY = shadow.offsetY
  strokeCtx.drawImage(canvas, 0, 0)
  return { canvas: strokeCanvas, ctx: strokeCtx }
}

export function applyInnerShadow(
  canvas: HTMLCanvasElement,
  shadow: ShadowConfig,
): void {
  const { width, height } = canvas
  if (width === 0 || height === 0) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1. Create inverted mask: opaque everywhere except where glyphs are
  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = width
  maskCanvas.height = height
  const maskCtx = maskCanvas.getContext('2d')
  if (!maskCtx) return

  maskCtx.fillStyle = '#ffffff'
  maskCtx.fillRect(0, 0, width, height)
  maskCtx.globalCompositeOperation = 'destination-out'
  maskCtx.drawImage(canvas, 0, 0)
  maskCtx.globalCompositeOperation = 'source-over'

  // 2. Draw the inverted mask with shadow onto a new canvas
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = width
  shadowCanvas.height = height
  const shadowCtx = shadowCanvas.getContext('2d')
  if (!shadowCtx) return

  shadowCtx.shadowBlur = shadow.blur
  shadowCtx.shadowColor = shadow.color
  shadowCtx.shadowOffsetX = shadow.offsetX
  shadowCtx.shadowOffsetY = shadow.offsetY
  shadowCtx.drawImage(maskCanvas, 0, 0)

  // 3. Remove the opaque border, keep only the inward-bleeding shadow
  shadowCtx.shadowBlur = 0
  shadowCtx.shadowColor = 'transparent'
  shadowCtx.shadowOffsetX = 0
  shadowCtx.shadowOffsetY = 0
  shadowCtx.globalCompositeOperation = 'destination-out'
  shadowCtx.drawImage(maskCanvas, 0, 0)

  // 4. Clip inner shadow to the glyph shape
  shadowCtx.globalCompositeOperation = 'destination-in'
  shadowCtx.drawImage(canvas, 0, 0)
  shadowCtx.globalCompositeOperation = 'source-over'

  // 5. Composite inner shadow over the original canvas
  ctx.drawImage(shadowCanvas, 0, 0)

  // Release temporary canvases
  maskCanvas.width = 0
  maskCanvas.height = 0
  shadowCanvas.width = 0
  shadowCanvas.height = 0
}

// ---------------------------------------------------------------------------
// Two-pass rendering helpers (inner shadow + stroke)
// ---------------------------------------------------------------------------

/**
 * Context object returned by `prepareTwoPassRender`.
 * Callers render glyphs into `fullCtx` / `fullStrokeCtx` between the
 * prepare and finalize steps.
 */
export interface TwoPassContext {
  fillOnlyCanvas: HTMLCanvasElement
  fullCanvas: HTMLCanvasElement
  fullCtx: CanvasRenderingContext2D
  fullStrokeCanvas: HTMLCanvasElement
  fullStrokeCtx: CanvasRenderingContext2D
  tempMap: Map<string, GlyphItem>
}

/**
 * Prepare the two-pass stroke overlay:
 * 1. Snapshot the current (fill-only) canvas
 * 2. Apply inner shadow to the main canvas
 * 3. Create auxiliary canvases for the full (fill+stroke) render
 */
export function prepareTwoPassRender(
  canvas: HTMLCanvasElement,
  innerShadow: ShadowConfig,
  stroke: StrokeConfig,
  lineWidth: number,
): TwoPassContext {
  const fillOnlyCanvas = document.createElement('canvas')
  fillOnlyCanvas.width = canvas.width
  fillOnlyCanvas.height = canvas.height
  const fillOnlyCtx = fillOnlyCanvas.getContext('2d')
  if (!fillOnlyCtx) {
    throw new Error('Failed to get 2d context for fillOnlyCanvas')
  }
  fillOnlyCtx.drawImage(canvas, 0, 0)

  applyInnerShadow(canvas, innerShadow)

  const { canvas: fullCanvas, ctx: fullCtx } = createCanvas2D()
  const { canvas: fullStrokeCanvas, ctx: fullStrokeCtx } = createCanvas2D()
  fullCanvas.width = canvas.width
  fullCanvas.height = canvas.height
  fullStrokeCanvas.width = canvas.width
  fullStrokeCanvas.height = canvas.height
  setupStrokeContext(fullCtx, fullStrokeCtx, stroke, lineWidth)

  return {
    fillOnlyCanvas,
    fullCanvas,
    fullCtx,
    fullStrokeCanvas,
    fullStrokeCtx,
    tempMap: new Map<string, GlyphItem>(),
  }
}

/**
 * Finalize the two-pass stroke overlay:
 * 1. Apply stroke type 2
 * 2. Extract stroke-only pixels (remove fill)
 * 3. Composite stroke-only on top of the main canvas
 * 4. Release temporary canvases
 */
export function finalizeTwoPassRender(
  ctx: CanvasRenderingContext2D,
  twoPass: TwoPassContext,
  stroke: StrokeConfig,
  lineWidth: number,
): void {
  const { fillOnlyCanvas, fullCanvas, fullCtx, fullStrokeCanvas } = twoPass

  applyStrokeType2(fullCtx, fullStrokeCanvas, stroke, lineWidth)

  // Extract stroke-only: remove fill pixels
  fullCtx.globalCompositeOperation = 'destination-out'
  fullCtx.drawImage(fillOnlyCanvas, 0, 0)
  fullCtx.globalCompositeOperation = 'source-over'

  // Draw stroke-only on top
  ctx.drawImage(fullCanvas, 0, 0)

  // Release temporary canvases
  fillOnlyCanvas.width = 0
  fillOnlyCanvas.height = 0
  fullCanvas.width = 0
  fullCanvas.height = 0
  fullStrokeCanvas.width = 0
  fullStrokeCanvas.height = 0
}

export function trimGlyphs(
  text: string[],
  map: Map<string, GlyphItem>,
  ctx: CanvasRenderingContext2D,
  layout: LayoutInfo,
  startIndex = 0,
  endIndex?: number,
): void {
  const { columnNum, itemWidth, itemHeight, padding, addX, addY } = layout
  const end = endIndex ?? text.length
  if (startIndex >= end) return

  const cellWidth = itemWidth + padding * 2
  const cellHeight = itemHeight + padding * 2

  // Calculate bounding region for all cells in [startIndex, end)
  const startRow = Math.floor(startIndex / columnNum)
  const endRow = Math.floor((end - 1) / columnNum)
  const startCol = startIndex % columnNum
  const endCol = (end - 1) % columnNum

  // For single row, use exact column range; for multi-row, full width
  const regionMinCol = startRow === endRow ? startCol : 0
  const regionMaxCol = startRow === endRow ? endCol : columnNum - 1

  const regionX = regionMinCol * cellWidth
  const regionY = startRow * cellHeight
  const regionW = (regionMaxCol - regionMinCol + 1) * cellWidth
  const regionH = (endRow - startRow + 1) * cellHeight

  // Single getImageData for the entire region
  const imageData = ctx.getImageData(regionX, regionY, regionW, regionH)
  const { data } = imageData
  const fullWidth = regionW

  for (let i = startIndex; i < end; i++) {
    const cellX = (i % columnNum) * cellWidth
    const cellY = Math.floor(i / columnNum) * cellHeight
    const letter = text[i]
    const letterSize = map.get(letter)
    if (!letterSize) continue
    const { width, height } = letterSize
    if (width === 0 || height === 0) continue

    // Cell position relative to the ImageData region
    const localX = cellX - regionX
    const localY = cellY - regionY

    const styleTrimInfo = trimTransparentPixelsFromRegion(
      data,
      fullWidth,
      localX,
      localY,
      cellWidth,
      cellHeight,
    )

    letterSize.width = styleTrimInfo.width
    letterSize.height = styleTrimInfo.height
    letterSize.trimOffsetLeft += addX + styleTrimInfo.trimOffsetLeft + padding
    letterSize.trimOffsetTop += addY + styleTrimInfo.trimOffsetTop + padding
    letterSize.canvasX = cellX - styleTrimInfo.trimOffsetLeft
    letterSize.canvasY = cellY - styleTrimInfo.trimOffsetTop
  }
}

export function setupStrokeContext(
  ctx: CanvasRenderingContext2D,
  strokeCtx: CanvasRenderingContext2D,
  stroke: StrokeConfig | undefined,
  lineWidth: number,
): void {
  if (stroke && lineWidth) {
    strokeCtx.textAlign = 'left'
    strokeCtx.textBaseline = 'top'
    strokeCtx.lineCap = stroke.lineCap
    strokeCtx.lineJoin = stroke.lineJoin
    strokeCtx.lineWidth = stroke.width
    ctx.lineCap = stroke.lineCap
    ctx.lineJoin = stroke.lineJoin
    ctx.lineWidth = stroke.width
    strokeCtx.fillStyle = '#000000'
  }
}

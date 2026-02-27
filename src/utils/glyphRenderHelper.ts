import type {
  FillRenderConfig,
  FontRenderConfig,
  GlyphRenderConfig,
  ShadowData,
  StrokeRenderConfig,
} from 'src/types/style'

import createCanvasFontString from './createCanvasFontString'
import ctxDoPath from './ctxDoPath'
import getCanvasStyle from './getCanvasStyle'
import measureTextSize, { LetterSize } from './measureTextSize'
import pathDoSharp from './pathDoSharp'
import { trimTransparentPixelsFromRegion } from './trimTransparentPixels'

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

  const fontResource = font.fonts?.find(({ opentype }: { opentype?: any }) => {
    if (!opentype) return false
    const glyph = opentype.charToGlyph(letter)
    return !!glyph.unicode
  })

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
  fontResource: { opentype: any },
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
  ctx.fillStyle = getCanvasStyle(ctx, 0, 0, fontWidth, fontHeight, fill, fill.patternImage)

  const hasStroke = !!(stroke && lineWidth)

  if (hasStroke) {
    ctx.strokeStyle = getCanvasStyle(ctx, 0, 0, fontWidth, fontHeight, stroke, stroke.patternImage)
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
  const letterSize: GlyphItem = {
    ...measureTextSize(letter, {
      fontSize: font.size,
      fontFamily: font.family,
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
  })

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

  ctx.fillStyle = getCanvasStyle(ctx, styleX, drawY, font.size, font.size, fill, fill.patternImage)
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

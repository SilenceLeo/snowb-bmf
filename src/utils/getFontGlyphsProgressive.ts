import { toJS } from 'mobx'
import {
  Font,
  FontStyleConfig,
  ShadowStyleConfig,
  StrokeStyleConfig,
} from 'src/store'

import createCanvasFontString from './createCanvasFontString'
import ctxDoPath from './ctxDoPath'
import getCanvasStyle from './getCanvasStyle'
import measureTextSize, { LetterSize } from './measureTextSize'
import pathDoSharp from './pathDoSharp'
import trimTransparentPixels from './trimTransparentPixels'

export interface GlyphItem extends LetterSize {
  canvasX: number
  canvasY: number
}

export interface GlyphInfo {
  canvas: HTMLCanvasElement
  glyphs: Map<string, GlyphItem>
}

export interface Config {
  font: Font
  fill: FontStyleConfig
  stroke?: StrokeStyleConfig
  shadow?: ShadowStyleConfig
}

export interface ProgressiveOptions {
  batchSize?: number
  onProgress?: (completed: number, total: number) => void
  signal?: AbortSignal
}

/**
 * Progressive glyph rendering with cancellation support
 * Renders glyphs in batches to avoid blocking the main thread
 */
export default async function getFontGlyphsProgressive(
  text: string[],
  config: Config,
  options: ProgressiveOptions = {},
): Promise<GlyphInfo> {
  // Convert MobX observables to plain objects to avoid reactive context warnings
  const plainConfig = {
    font: toJS(config.font),
    stroke: config.stroke ? toJS(config.stroke) : undefined,
    shadow: config.shadow ? toJS(config.shadow) : undefined,
    fill: toJS(config.fill),
  }

  const { font, stroke, shadow, fill } = plainConfig
  const { batchSize = 50, onProgress, signal } = options

  // Check for early cancellation
  if (signal?.aborted) {
    throw new Error('Rendering cancelled')
  }

  const columnNum = Math.ceil(Math.sqrt(text.length))
  const lineNum = Math.ceil(text.length / columnNum)
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

  // Create canvases
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
    desynchronized: true,
    alpha: true,
    colorSpace: 'srgb',
  }) as CanvasRenderingContext2D

  const strokeCanvas = document.createElement('canvas')
  const strokeCtx = strokeCanvas.getContext('2d', {
    willReadFrequently: true,
    desynchronized: true,
    alpha: true,
    colorSpace: 'srgb',
  }) as CanvasRenderingContext2D

  canvas.width = (itemWidth + padding * 2) * columnNum
  canvas.height = (itemHeight + padding * 2) * lineNum
  strokeCanvas.width = canvas.width
  strokeCanvas.height = canvas.height

  const map = new Map<string, GlyphItem>()

  // Setup stroke context if needed
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

  // Process glyphs in batches
  let completedCount = 0

  for (let batchStart = 0; batchStart < text.length; batchStart += batchSize) {
    // Check for cancellation
    if (signal?.aborted) {
      throw new Error('Rendering cancelled')
    }

    const batchEnd = Math.min(batchStart + batchSize, text.length)

    // Process batch
    await new Promise<void>((resolve) => {
      // Use requestAnimationFrame to avoid blocking
      requestAnimationFrame(() => {
        for (let i = batchStart; i < batchEnd; i++) {
          renderGlyph(i, text[i], ctx, strokeCtx, map, {
            font,
            stroke,
            fill,
            lineWidth,
            columnNum,
            itemWidth,
            itemHeight,
            padding,
            addX,
            addY,
          })
        }

        completedCount = batchEnd
        onProgress?.(completedCount, text.length)
        resolve()
      })
    })

    // Small delay between batches to keep UI responsive
    if (batchEnd < text.length) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  // Apply stroke type 2 if needed
  if (stroke && lineWidth && stroke.strokeType === 2) {
    ctx.drawImage(strokeCanvas, 0, 0)
  }

  // Apply shadow if needed
  if (shadow) {
    const cvs = strokeCanvas
    const newCtx = strokeCtx
    cvs.width = canvas.width
    cvs.height = canvas.height
    newCtx.shadowBlur = shadow.blur
    newCtx.shadowColor = shadow.color
    newCtx.shadowOffsetX = shadow.offsetX
    newCtx.shadowOffsetY = shadow.offsetY
    newCtx.drawImage(canvas, 0, 0)

    // Process trimming in batches
    await processTrimming(
      text,
      map,
      newCtx,
      { columnNum, itemWidth, itemHeight, padding, addX, addY },
      { batchSize, onProgress, signal },
    )

    return { canvas: cvs, glyphs: map }
  }

  // Process trimming
  await processTrimming(
    text,
    map,
    ctx,
    { columnNum, itemWidth, itemHeight, padding, addX, addY },
    { batchSize, onProgress, signal },
  )

  return { canvas, glyphs: map }
}

/**
 * Render a single glyph
 */
function renderGlyph(
  index: number,
  letter: string,
  ctx: CanvasRenderingContext2D,
  strokeCtx: CanvasRenderingContext2D,
  map: Map<string, GlyphItem>,
  config: any,
): void {
  const {
    font,
    stroke,
    fill,
    lineWidth,
    columnNum,
    itemWidth,
    itemHeight,
    padding,
    addX,
    addY,
  } = config

  const startX = (index % columnNum) * (itemWidth + padding * 2) + padding
  const startY =
    Math.floor(index / columnNum) * (itemHeight + padding * 2) + padding

  let letterSize: GlyphItem

  // Check for OpenType font
  const fontResource = font.fonts?.find(({ opentype }: any) => {
    if (!opentype) return false
    const glyph = opentype.charToGlyph(letter)
    return !!glyph.unicode
  })

  if (fontResource) {
    // OpenType font rendering (same as original)
    const opentype = fontResource.opentype
    const glyph = opentype.charToGlyph(letter)
    const scale = font.size / opentype.unitsPerEm
    const baseline = Math.ceil(opentype.ascender * scale)

    const path = glyph.getPath(0, baseline, font.size)
    pathDoSharp(path, font.sharp)
    const boundingBox = path.getBoundingBox()

    const fontWidth = opentype.getAdvanceWidth(letter, font.size)
    const fontHeight = (opentype.ascender - opentype.descender) * scale

    letterSize = {
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
      map.set(letter, letterSize)
      return
    }

    const translateX = startX + addX + letterSize.trimOffsetLeft
    const translateY = startY + addY + letterSize.trimOffsetTop

    ctx.translate(translateX, translateY)
    ctxDoPath(ctx, path.commands)
    ctx.fillStyle = getCanvasStyle(ctx, 0, 0, fontWidth, fontHeight, fill)

    if (stroke && lineWidth) {
      ctx.strokeStyle = getCanvasStyle(ctx, 0, 0, fontWidth, fontHeight, stroke)
      ctx.lineWidth = stroke.strokeType === 1 ? stroke.width : lineWidth
    }

    // Apply stroke based on type
    if (stroke && lineWidth && stroke.strokeType === 0) {
      ctx.stroke()
      ctx.save()
      ctx.clip()
      ctx.clearRect(
        startX - padding,
        startY - padding,
        itemWidth + padding * 2,
        itemHeight + padding * 2,
      )
      ctx.restore()
    }

    ctx.fill()

    if (stroke && lineWidth && stroke.strokeType === 1) {
      ctx.stroke()
    } else if (stroke && lineWidth && stroke.strokeType === 2) {
      ctx.save()
      ctx.clip()
      ctx.stroke()
      ctx.restore()
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0)
  } else {
    // Regular font rendering (same as original)
    letterSize = {
      ...measureTextSize(letter, {
        fontSize: font.size,
        fontFamily: font.family,
      }),
      canvasX: 0,
      canvasY: 0,
    }

    const { width, height, trimOffsetLeft, trimOffsetTop } = letterSize

    if (width === 0 || height === 0) {
      map.set(letter, letterSize)
      return
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

    // Apply stroke type 0, 1, or 2
    if (stroke && lineWidth && stroke.strokeType === 0) {
      ctx.fillStyle = '#000000'
      ctx.strokeStyle = getCanvasStyle(
        ctx,
        styleX,
        drawY,
        font.size,
        font.size,
        stroke,
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
    )
    ctx.fillText(letter, drawX, drawY)

    if (stroke && lineWidth && stroke.strokeType === 1) {
      ctx.strokeStyle = getCanvasStyle(
        ctx,
        styleX,
        drawY,
        font.size,
        font.size,
        stroke,
      )
      ctx.lineWidth = stroke.width
      ctx.strokeText(letter, drawX, drawY)
    } else if (stroke && lineWidth && stroke.strokeType === 2) {
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
      )
      strokeCtx.lineWidth = lineWidth
      strokeCtx.fillText(letter, drawX, drawY)
      strokeCtx.globalCompositeOperation = 'source-in'
      strokeCtx.strokeText(letter, drawX, drawY)
      strokeCtx.globalCompositeOperation = 'source-over'
      strokeCtx.restore()
    }
  }

  map.set(letter, letterSize)
}

/**
 * Process trimming in batches
 */
async function processTrimming(
  text: string[],
  map: Map<string, GlyphItem>,
  ctx: CanvasRenderingContext2D,
  dimensions: any,
  options: ProgressiveOptions,
): Promise<void> {
  const { columnNum, itemWidth, itemHeight, padding, addX, addY } = dimensions
  const { batchSize = 50, signal } = options

  for (let batchStart = 0; batchStart < text.length; batchStart += batchSize) {
    // Check for cancellation
    if (signal?.aborted) {
      throw new Error('Trimming cancelled')
    }

    const batchEnd = Math.min(batchStart + batchSize, text.length)

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        for (let i = batchStart; i < batchEnd; i++) {
          const startX = (i % columnNum) * (itemWidth + padding * 2)
          const startY = Math.floor(i / columnNum) * (itemHeight + padding * 2)
          const letter = text[i]
          const letterSize = map.get(letter)

          if (
            !letterSize ||
            letterSize.width === 0 ||
            letterSize.height === 0
          ) {
            continue
          }

          const imgData = ctx.getImageData(
            startX,
            startY,
            itemWidth + padding * 2,
            itemHeight + padding * 2,
          )

          const styleTrimInfo = trimTransparentPixels(imgData)

          letterSize.width = styleTrimInfo.width
          letterSize.height = styleTrimInfo.height
          letterSize.trimOffsetLeft +=
            addX + styleTrimInfo.trimOffsetLeft + padding
          letterSize.trimOffsetTop +=
            addY + styleTrimInfo.trimOffsetTop + padding
          letterSize.canvasX = startX - styleTrimInfo.trimOffsetLeft
          letterSize.canvasY = startY - styleTrimInfo.trimOffsetTop
        }

        resolve()
      })
    })

    // Small delay between batches
    if (batchEnd < text.length) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }
}

import {
  Font,
  FontStyleConfig,
  ShadowStyleConfig,
  StrokeStyleConfig,
} from 'src/store'

import ctxDoPath from './ctxDoPath'
import fontStyleStringify from './fontStyleStringify'
import getCanvasStyle from './getCanvasStyle'
import getLetterSizeFromCssText, {
  LetterSize,
} from './getLetterSizeFromCssText'
import pathDoSharp from './pathDoSharp'
import trimImageData from './trimImageData'

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

export default function getFontGlyphs(text: string, config: Config) {
  const { font, stroke, shadow, fill } = config
  const columnNum = Math.ceil(Math.sqrt(text.length))
  const lineNum = Math.ceil(text.length / columnNum)
  const lineWidth = stroke ? stroke.width * 2 : 0 // canvas is center stroke
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

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d', {
    willReadFrequently: true,
    desynchronized: true,
    alpha: true,
    colorSpace: 'srgb',
  }) as CanvasRenderingContext2D
  const strokCanvas = document.createElement('canvas')
  const strokCtx = strokCanvas.getContext('2d', {
    willReadFrequently: true,
    desynchronized: true,
    alpha: true,
    colorSpace: 'srgb',
  }) as CanvasRenderingContext2D
  canvas.width = (itemWidth + padding * 2) * columnNum
  canvas.height = (itemHeight + padding * 2) * lineNum
  strokCanvas.width = canvas.width
  strokCanvas.height = canvas.height

  const map = new Map<string, GlyphItem>()

  if (stroke && lineWidth) {
    strokCtx.textAlign = 'left'
    strokCtx.textBaseline = 'top'
    strokCtx.lineCap = stroke.lineCap
    strokCtx.lineJoin = stroke.lineJoin
    strokCtx.lineWidth = stroke.width
    ctx.lineCap = stroke.lineCap
    ctx.lineJoin = stroke.lineJoin
    ctx.lineWidth = stroke.width
    strokCtx.fillStyle = '#000000'
  }

  for (let i = 0; i < text.length; i++) {
    const startX = (i % columnNum) * (itemWidth + padding * 2) + padding
    const startY =
      Math.floor(i / columnNum) * (itemHeight + padding * 2) + padding
    const letter = text[i]
    let letterSize: GlyphItem
    const fontResource = font.fonts.find(({ opentype }) => {
      if (!opentype) return false

      const glyph = opentype.charToGlyph(letter)
      if (glyph.unicode) {
        return true
      }
      return false
    })

    if (fontResource) {
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
        text: letter,
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
        continue
      }
      const translateX = startX + addX + letterSize.trimOffsetLeft
      const translateY = startY + addY + letterSize.trimOffsetTop

      ctx.translate(translateX, translateY)
      ctxDoPath(ctx, path.commands)
      ctx.fillStyle = getCanvasStyle(ctx, 0, 0, fontWidth, fontHeight, fill)
      if (stroke && lineWidth) {
        ctx.strokeStyle = getCanvasStyle(
          ctx,
          0,
          0,
          fontWidth,
          fontHeight,
          stroke,
        )
        if (stroke.strokeType === 1) {
          ctx.lineWidth = path.strokeWidth = stroke.width
        } else {
          ctx.lineWidth = path.strokeWidth = lineWidth
        }
      }
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
      letterSize = {
        ...getLetterSizeFromCssText(letter, {
          fontSize: font.size,
          fontFamily: font.family,
        }),
        canvasX: 0,
        canvasY: 0,
      }
      const { width, height, trimOffsetLeft, trimOffsetTop } = letterSize
      if (width === 0 || height === 0) {
        map.set(letter, letterSize)
        continue
      }
      const styleX = startX + addX + (width - font.size) / 2
      const drawX = startX + addX + trimOffsetLeft
      const drawY = startY + addY + trimOffsetTop

      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      ctx.font = fontStyleStringify({
        fontSize: font.size,
        fontFamily: font.family,
      })

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
        strokCtx.save()
        strokCtx.beginPath()
        strokCtx.rect(
          startX - padding,
          startY - padding,
          itemWidth + padding * 2,
          itemHeight + padding * 2,
        )

        strokCtx.clip()

        strokCtx.font = ctx.font
        strokCtx.fillStyle = '#000000'
        strokCtx.strokeStyle = getCanvasStyle(
          strokCtx,
          styleX,
          drawY,
          font.size,
          font.size,
          stroke,
        )
        strokCtx.lineWidth = lineWidth

        strokCtx.fillText(letter, drawX, drawY)
        strokCtx.globalCompositeOperation = 'source-in'
        strokCtx.strokeText(letter, drawX, drawY)
        strokCtx.globalCompositeOperation = 'source-over'
        strokCtx.restore()
      }
    }

    map.set(letter, letterSize)
  }

  if (stroke && lineWidth && stroke.strokeType === 2) {
    ctx.drawImage(strokCanvas, 0, 0)
  }

  if (shadow) {
    const cvs = strokCanvas
    const newCtx = strokCtx
    cvs.width = canvas.width
    cvs.height = canvas.height
    newCtx.shadowBlur = shadow.blur
    newCtx.shadowColor = shadow.color
    newCtx.shadowOffsetX = shadow.offsetX
    newCtx.shadowOffsetY = shadow.offsetY
    newCtx.drawImage(canvas, 0, 0)
    canvas = cvs
    ctx = newCtx
  }

  for (let i = 0; i < text.length; i++) {
    const startX = (i % columnNum) * (itemWidth + padding * 2)
    const startY = Math.floor(i / columnNum) * (itemHeight + padding * 2)
    const letter = text[i]
    const letterSize = map.get(letter)
    if (!letterSize) continue
    const { width, height } = letterSize
    if (width === 0 || height === 0) continue
    const imgData = ctx.getImageData(
      startX,
      startY,
      itemWidth + padding * 2,
      itemHeight + padding * 2,
    )
    const styleTrimInfo = trimImageData(imgData)

    letterSize.width = styleTrimInfo.width
    letterSize.height = styleTrimInfo.height
    letterSize.trimOffsetLeft += addX + styleTrimInfo.trimOffsetLeft + padding
    letterSize.trimOffsetTop += addY + styleTrimInfo.trimOffsetTop + padding
    letterSize.canvasX = startX - styleTrimInfo.trimOffsetLeft
    letterSize.canvasY = startY - styleTrimInfo.trimOffsetTop
  }
  console.log(canvas.toDataURL())
  return {
    canvas,
    glyphs: map,
  }
}

import trimImageData from './trimImageData'
import { TextSize } from './getTextSize'
import getCanvasStyle from './getCanvasStyle'
import { Style } from 'src/store'
import pathDoSharp from './pathDoSharp'
import ctxDoPath from './ctxDoPath'

export interface GlyphInfo extends TextSize {
  canvas: HTMLCanvasElement | null
}

interface ParentColor {
  offset: number
  color: string
}

interface Gradient {
  type: 0 | 1
  palette: ParentColor[]
  angle: number
}

interface PatternTexture {
  image: HTMLImageElement | null
  repetition: string
  scale: number
}

interface Fill {
  type: number
  color: string
  gradient: Gradient
  patternTexture: PatternTexture
}

interface Stroke extends Fill {
  width: number
  lineJoin: CanvasLineJoin
  lineCap: CanvasLineCap
}

interface Font {
  family: string
  size: number
}

interface Shadow {
  color: string
  blur: number
  offsetX: number
  offsetY: number
}

export interface Config {
  font: Font
  fill: Fill
  stroke?: Stroke
  shadow?: Shadow
}

export default function getFontGlyphInfo(
  text: string,
  config: Style,
): GlyphInfo {
  const { font, stroke, shadow, fill } = config

  const fontResource = font.fonts.find(({ opentype }) => {
    if (!opentype) return false

    const glyph = opentype.charToGlyph(text)
    if (glyph.unicode) {
      return true
    }
    return false
  })

  if (!fontResource) {
    throw new Error('Not Find Font.')
  }

  const opentype = fontResource.opentype

  const glyph = opentype.charToGlyph(text)
  const scale = font.size / opentype.unitsPerEm
  const baseline = Math.ceil(opentype.ascender * scale)

  let path = glyph.getPath(0, baseline, font.size)
  pathDoSharp(path, font.sharp)
  let boundingBox = path.getBoundingBox()

  const fontWidth = opentype.getAdvanceWidth(text, font.size)
  const fontHeight = (opentype.ascender - opentype.descender) * scale
  const trimInfo = {
    text,
    font: font.family,
    width: Math.ceil(boundingBox.x2) - Math.floor(boundingBox.x1),
    height: Math.ceil(boundingBox.y2) - Math.floor(boundingBox.y1),
    fontWidth,
    fontHeight,
    trimOffsetTop: Math.round(boundingBox.y1) * -1,
    trimOffsetLeft: Math.round(boundingBox.x1) * -1,
    trimOffsetRight: Math.round(fontWidth - boundingBox.x1) * -1,
    trimOffsetBottom: Math.round(fontHeight - boundingBox.y2) * -1,
  }

  const { width, height, trimOffsetLeft, trimOffsetTop } = trimInfo
  if (width === 0 || height === 0) return { canvas: null, ...trimInfo }

  const lineWidth = stroke ? stroke.width * 2 : 0 // canvas is center stroke
  let addX = lineWidth
  let addY = lineWidth

  if (shadow) {
    const blur = Math.ceil(shadow.blur * 1.5)
    addX += Math.abs(shadow.offsetX) + blur
    addY += Math.abs(shadow.offsetY) + blur
  }

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = width + addX * 2
  canvas.height = height + addY * 2

  ctx.translate(addX + trimOffsetLeft, addY + trimOffsetTop)
  ctxDoPath(ctx, path.commands)
  ctx.fillStyle = getCanvasStyle(ctx, 0, 0, fontWidth, fontHeight, fill)
  ctx.fill()

  if (stroke && lineWidth) {
    const strokCanvas = document.createElement('canvas')
    strokCanvas.width = canvas.width
    strokCanvas.height = canvas.height
    const strokCtx = strokCanvas.getContext('2d') as CanvasRenderingContext2D
    strokCtx.translate(addX + trimOffsetLeft, addY + trimOffsetTop)
    strokCtx.lineCap = stroke.lineCap
    strokCtx.lineJoin = stroke.lineJoin
    strokCtx.strokeStyle = path.stroke = getCanvasStyle(
      strokCtx,
      0,
      0,
      fontWidth,
      fontHeight,
      stroke,
    ) as string
    strokCtx.fillStyle = '#000000'

    if (stroke.strokeType === 1) {
      strokCtx.lineWidth = path.strokeWidth = stroke.width
    } else {
      strokCtx.lineWidth = path.strokeWidth = lineWidth
    }

    ctxDoPath(strokCtx, path.commands)

    if (stroke.strokeType === 2) {
      strokCtx.fill()
      strokCtx.globalCompositeOperation = 'source-in'
      strokCtx.stroke()
    } else if (stroke.strokeType === 1) {
      strokCtx.stroke()
    } else {
      strokCtx.stroke()
      strokCtx.globalCompositeOperation = 'destination-out'
      strokCtx.fill()
    }
    strokCtx.globalCompositeOperation = 'source-over'
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(strokCanvas, 0, 0)
  }

  if (shadow) {
    const cvs = document.createElement('canvas')
    cvs.width = width + addX * 2
    cvs.height = height + addY * 2
    const newCtx = cvs.getContext('2d') as CanvasRenderingContext2D

    newCtx.shadowColor = shadow.color
    newCtx.shadowBlur = shadow.blur
    newCtx.shadowOffsetX = shadow.offsetX
    newCtx.shadowOffsetY = shadow.offsetY
    newCtx.drawImage(canvas, 0, 0)

    canvas = cvs
    ctx = newCtx
  }

  if (canvas.width === 0 || canvas.height === 0) {
    return {
      canvas,
      ...trimInfo,
    }
  }

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const styleTrimInfo = trimImageData(imgData)
  canvas.width = trimInfo.width = styleTrimInfo.width
  canvas.height = trimInfo.height = styleTrimInfo.height

  ctx.putImageData(
    imgData,
    styleTrimInfo.trimOffsetLeft,
    styleTrimInfo.trimOffsetTop,
  )

  trimInfo.trimOffsetLeft += addX + styleTrimInfo.trimOffsetLeft
  trimInfo.trimOffsetTop += addY + styleTrimInfo.trimOffsetTop
  trimInfo.trimOffsetBottom +=
    addY +
    (height + addY * 2 + styleTrimInfo.trimOffsetTop - styleTrimInfo.height)

  return {
    canvas,
    ...trimInfo,
  }
}

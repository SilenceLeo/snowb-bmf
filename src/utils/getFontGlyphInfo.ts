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

  if (shadow) {
    ctx.shadowColor = shadow.color
    ctx.shadowBlur = shadow.blur
    ctx.shadowOffsetX = shadow.offsetX
    ctx.shadowOffsetY = shadow.offsetY
  }

  if (stroke && lineWidth) {
    const strokCanvas = document.createElement('canvas')
    strokCanvas.width = canvas.width
    strokCanvas.height = canvas.height
    const sctx = strokCanvas.getContext('2d') as CanvasRenderingContext2D
    sctx.translate(addX + trimOffsetLeft, addY + trimOffsetTop)

    sctx.lineCap = stroke.lineCap
    sctx.lineJoin = stroke.lineJoin
    sctx.lineWidth = path.strokeWidth = lineWidth
    sctx.strokeStyle = path.stroke = getCanvasStyle(
      sctx,
      0,
      0,
      fontWidth,
      fontHeight,
      stroke,
    ) as string

    ctxDoPath(sctx, path.commands)
    sctx.stroke()
    sctx.globalCompositeOperation = 'destination-out'
    sctx.fill()
    sctx.globalCompositeOperation = 'source-over'
    sctx.fillStyle = getCanvasStyle(sctx, 0, 0, fontWidth, fontHeight, fill)
    sctx.fill()
    ctx.drawImage(strokCanvas, 0, 0)
  } else {
    ctx.translate(addX + trimOffsetLeft, addY + trimOffsetTop)
    ctxDoPath(ctx, path.commands)
    ctx.fillStyle = getCanvasStyle(ctx, 0, 0, fontWidth, fontHeight, fill)
    ctx.fill()
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

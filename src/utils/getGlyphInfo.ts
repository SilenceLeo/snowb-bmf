import trimImageData from './trimImageData'
import getTextSize, { TextSize } from './getTextSize'
import fontStyleStringify from './fontStyleStringify'
import getCanvasStyle from './getCanvasStyle'

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

export default function getGlyphInfo(text: string, config: Config): GlyphInfo {
  const { font, stroke, shadow, fill } = config

  const styleConig = {
    fontSize: font.size,
    fontFamily: font.family,
  }

  const trimInfo = getTextSize(text, styleConig)
  const { width, height, trimOffsetLeft, trimOffsetTop } = trimInfo
  if (width === 0 || height === 0) return { canvas: null, ...trimInfo }

  const lineWidth = stroke ? stroke.width * 2 : 0 // canvas is center stroke
  let addX = lineWidth
  let addY = lineWidth
  let styleX = (width - font.size) / 2
  let styleY = trimOffsetTop

  if (shadow) {
    const blur = Math.ceil(shadow.blur * 1.5)
    addX += Math.abs(shadow.offsetX) + blur
    addY += Math.abs(shadow.offsetY) + blur
  }

  styleX += addX
  styleY += addY

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = width + addX * 2
  canvas.height = height + addY * 2

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  ctx.font = fontStyleStringify({
    fontSize: font.size,
    fontFamily: font.family,
  })

  if (stroke && lineWidth) {
    ctx.lineWidth = lineWidth
    ctx.lineCap = stroke.lineCap
    ctx.lineJoin = stroke.lineJoin
    ctx.strokeStyle = getCanvasStyle(
      ctx,
      styleX,
      styleY,
      font.size,
      font.size,
      stroke,
    )
    ctx.strokeText(text, addX + trimOffsetLeft, addY + trimOffsetTop)
  }

  ctx.fillStyle = getCanvasStyle(
    ctx,
    styleX,
    styleY,
    font.size,
    font.size,
    fill,
  )
  ctx.fillText(text, addX + trimOffsetLeft, addY + trimOffsetTop)

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
  canvas.width = styleTrimInfo.width
  canvas.height = styleTrimInfo.height
  trimInfo.width = styleTrimInfo.width
  trimInfo.height = styleTrimInfo.height
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

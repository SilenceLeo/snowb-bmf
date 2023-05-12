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
  strokeType: 0 | 1 | 2
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

  ctx.fillStyle = getCanvasStyle(
    ctx,
    styleX,
    styleY,
    font.size,
    font.size,
    fill,
  )
  ctx.fillText(text, addX + trimOffsetLeft, addY + trimOffsetTop)

  if (stroke && lineWidth) {
    const strokCanvas = document.createElement('canvas')
    strokCanvas.width = canvas.width
    strokCanvas.height = canvas.height
    const strokCtx = strokCanvas.getContext('2d') as CanvasRenderingContext2D

    strokCtx.textAlign = 'left'
    strokCtx.textBaseline = 'top'

    strokCtx.font = fontStyleStringify({
      fontSize: font.size,
      fontFamily: font.family,
    })

    strokCtx.lineCap = stroke.lineCap
    strokCtx.lineJoin = stroke.lineJoin
    strokCtx.strokeStyle = getCanvasStyle(
      strokCtx,
      styleX,
      styleY,
      font.size,
      font.size,
      stroke,
    )

    strokCtx.fillStyle = '#000000'

    if (stroke.strokeType === 1) {
      strokCtx.lineWidth = stroke.width
    } else {
      strokCtx.lineWidth = lineWidth
    }

    if (stroke.strokeType === 2) {
      strokCtx.fillText(text, addX + trimOffsetLeft, addY + trimOffsetTop)
      strokCtx.globalCompositeOperation = 'source-in'
      strokCtx.strokeText(text, addX + trimOffsetLeft, addY + trimOffsetTop)
    } else if (stroke.strokeType === 1) {
      strokCtx.strokeText(text, addX + trimOffsetLeft, addY + trimOffsetTop)
    } else {
      strokCtx.strokeText(text, addX + trimOffsetLeft, addY + trimOffsetTop)
      strokCtx.globalCompositeOperation = 'destination-out'
      strokCtx.fillText(text, addX + trimOffsetLeft, addY + trimOffsetTop)
    }
    strokCtx.globalCompositeOperation = 'source-over'
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

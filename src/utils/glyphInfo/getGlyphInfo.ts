import getTrimImageData from '../glyphTrim/getTrimImageData'
import getTrimInfo from '../glyphTrim/getTrimInfo'
import fontStyleStringify from '../glyphFont/fontStyleStringify'
import getCanvasStyle from '../glyphCanvas/getCanvasStyle'
import { GlyphConfig, GlyphInfo } from './ds'

export default function getGlyphInfo(
  text: string,
  config: GlyphConfig,
): GlyphInfo {
  const { font, stroke, shadow, fill, bgFill, fullHeight } = config

  const trimInfo = getTrimInfo(text, {
    fontSize: font.size,
    fontFamily: font.family,
  })
  const {
    width,
    height,
    fontWidth,
    fontHeight,
    trimOffsetLeft,
    trimOffsetTop,
  } = trimInfo
  const { trimOffsetBottom } = trimInfo
  console.log({ height, fontHeight, trimOffsetTop, trimOffsetBottom })
  // 在有背景色场合，需要为空格加上背景色，因此要放开
  // if (width === 0 || height === 0)  return {canvas: null, ...trimInfo}

  const lineWidth = stroke ? stroke.width * 2 : 0 // canvas is center stroke
  // noinspection JSSuspiciousNameCombination // 这里jb会提示错误，因为横向和纵向一般不赋同值，但stroke是四向的，所以可以赋同值
  let addL = lineWidth,
    addR = lineWidth,
    addY = lineWidth
  let styleX = (width - font.size) / 2
  let styleY = trimOffsetTop

  if (shadow) {
    const blur = Math.ceil(shadow.blur * 1.5)
    addL += Math.abs(shadow.offsetX) + blur
    addR += Math.abs(shadow.offsetX) + blur
    addY += Math.abs(shadow.offsetY) + blur
  }

  if (bgFill) {
    addL += bgFill.lPadding
    addR += bgFill.rPadding
    addY += bgFill.vPadding
  }

  styleX += addL
  styleY += addY

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = (fullHeight ? fontWidth : width) + addL + addR
  canvas.height = (fullHeight ? fontHeight : height) + addY * 2

  // 背景色需要先画
  if (bgFill) {
    ctx.fillStyle = getCanvasStyle(
      ctx,
      styleX,
      styleY,
      font.size,
      font.size,
      bgFill,
    )
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

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
    ctx.strokeText(text, addL + trimOffsetLeft, addY + trimOffsetTop)
  }

  ctx.fillStyle = getCanvasStyle(
    ctx,
    styleX,
    styleY,
    font.size,
    font.size,
    fill,
  )
  const fillTextX = addL + (fullHeight ? 0 : trimOffsetLeft)
  const fillTextY = addY + (fullHeight ? 0 : trimOffsetTop)
  ctx.fillText(text, fillTextX, fillTextY)

  if (shadow) {
    const cvs = document.createElement('canvas')
    cvs.width = width + addL + addR
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

  if (fullHeight) {
    trimInfo.height = trimInfo.fontHeight
    trimInfo.trimOffsetLeft = 0
    trimInfo.trimOffsetRight = 0
    trimInfo.trimOffsetTop = 0
    trimInfo.trimOffsetBottom = 0
  }

  if (canvas.width === 0 || canvas.height === 0) {
    return {
      canvas,
      ...trimInfo,
    }
  }

  /**
   * === image part ===
   */

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const styleTrimInfo = getTrimImageData(imgData)
  canvas.width = trimInfo.width = styleTrimInfo.width
  canvas.height = trimInfo.height = styleTrimInfo.height

  ctx.putImageData(
    imgData,
    styleTrimInfo.trimOffsetLeft,
    styleTrimInfo.trimOffsetTop,
  )

  trimInfo.trimOffsetLeft += addL + styleTrimInfo.trimOffsetLeft
  trimInfo.trimOffsetTop += addY + styleTrimInfo.trimOffsetTop
  trimInfo.trimOffsetBottom +=
    addY +
    (height + addY * 2 + styleTrimInfo.trimOffsetTop - styleTrimInfo.height)

  return {
    canvas,
    ...trimInfo,
  }
}

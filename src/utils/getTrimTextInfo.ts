// TODO: 废弃
import trimImageData from './trimImageData'
import fontStyleStringify, { FontStyleConfig } from './fontStyleStringify'
import getTextSize, { TextSize } from './getTextSize'

export default function getTrimTextInfo(
  text: string,
  styleConig: FontStyleConfig,
  threshold = 0,
): TextSize {
  const size = getTextSize(text, styleConig)
  if (size.width === 0 || size.height === 0)
    return {
      ...size,
      width: 0,
      height: 0,
      trimOffsetTop: 0,
      trimOffsetLeft: 0,
      trimOffsetRight: 0,
      trimOffsetBottom: 0,
    }
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.font = fontStyleStringify(styleConig)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#000000'

  ctx.fillText(text, size.trimOffsetLeft, size.trimOffsetTop)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const trimInfo = trimImageData(imageData, threshold)
  size.trimOffsetLeft += trimInfo.trimOffsetLeft
  size.trimOffsetTop += trimInfo.trimOffsetTop
  size.trimOffsetRight = trimInfo.width - (size.width + trimInfo.trimOffsetLeft)
  size.trimOffsetBottom =
    trimInfo.height - (size.height + trimInfo.trimOffsetTop)
  size.width = trimInfo.width
  size.height = trimInfo.height

  return size
}

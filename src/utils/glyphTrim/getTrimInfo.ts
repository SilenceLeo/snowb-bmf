import fontStyleStringify, {
  FontStyleConfig,
} from '../glyphFont/fontStyleStringify'

export interface TrimInfo {
  text: string
  font: string
  width: number
  height: number
  fontWidth: number
  fontHeight: number
  trimOffsetTop: number
  trimOffsetLeft: number
  trimOffsetRight: number
  trimOffsetBottom: number
}

let canvas: HTMLCanvasElement

export default function getTrimInfo(
  text: string,
  config: FontStyleConfig,
): TrimInfo {
  if (!canvas) canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Get context 2d failed.')

  // clear before settings
  canvas.width = 1
  canvas.height = 1

  const font = fontStyleStringify(config)

  ctx.font = font

  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'

  const testA = ctx.measureText(text)

  if (typeof testA.actualBoundingBoxLeft === 'undefined') {
    return {
      text,
      font,
      width: testA.width,
      height: parseInt(`${config.fontSize ?? '14'}`, 10),
      fontWidth: testA.width,
      fontHeight: parseInt(`${config.fontSize ?? '14'}`, 10),
      trimOffsetTop: 0,
      trimOffsetLeft: 0,
      trimOffsetRight: 0,
      trimOffsetBottom: 0,
    }
  }

  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'

  const testB = ctx.measureText(text)

  const trimOffsetLeft = Math.ceil(testA.actualBoundingBoxLeft)
  const trimOffsetRight = Math.ceil(testB.actualBoundingBoxRight)
  const trimOffsetTop = Math.ceil(testB.actualBoundingBoxAscent)
  const trimOffsetBottom = Math.ceil(testA.actualBoundingBoxDescent)
  const width = trimOffsetLeft + Math.ceil(testA.actualBoundingBoxRight)
  const height = trimOffsetBottom + Math.ceil(testA.actualBoundingBoxAscent)
  const fontWidth = Math.ceil(testA.width)
  const fontHeight = Math.ceil(
    testA.actualBoundingBoxAscent - testB.actualBoundingBoxAscent,
  )

  return {
    text,
    font,
    width,
    height,
    fontWidth,
    fontHeight,
    trimOffsetTop,
    trimOffsetLeft,
    trimOffsetRight,
    trimOffsetBottom,
  }
}

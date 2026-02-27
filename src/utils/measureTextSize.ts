import createCanvasFontString, {
  FontStyleConfig,
} from './createCanvasFontString'

export interface LetterSize {
  letter: string
  width: number
  height: number
  fontWidth: number
  fontHeight: number
  trimOffsetTop: number
  trimOffsetLeft: number
}

let canvas: HTMLCanvasElement
const CANVAS_SIZE = 256

export default function measureTextSize(
  letter: string,
  config: FontStyleConfig,
): LetterSize {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Get context 2d failed.')
  }

  const font = createCanvasFontString(config)
  ctx.font = font
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  const primaryMetrics = ctx.measureText(letter)

  if (typeof primaryMetrics.actualBoundingBoxLeft === 'undefined') {
    const fallbackSize =
      typeof config.fontSize === 'number'
        ? config.fontSize
        : parseInt(String(config.fontSize || 14), 10)

    return {
      letter,
      width: Math.ceil(primaryMetrics.width),
      height: fallbackSize,
      fontWidth: Math.ceil(primaryMetrics.width),
      fontHeight: fallbackSize,
      trimOffsetTop: 0,
      trimOffsetLeft: 0,
    }
  }

  const {
    actualBoundingBoxLeft: left,
    actualBoundingBoxRight: right,
    actualBoundingBoxAscent: ascent,
    actualBoundingBoxDescent: descent,
    width: textWidth,
  } = primaryMetrics

  const trimOffsetLeft = Math.ceil(left)
  const trimOffsetTop = Math.ceil(ascent)
  const width = trimOffsetLeft + Math.ceil(right)
  const height = Math.ceil(descent) + Math.ceil(ascent)
  const fontWidth = textWidth
  const fontHeight = height

  return {
    letter,
    width,
    height,
    fontWidth,
    fontHeight,
    trimOffsetTop,
    trimOffsetLeft,
  }
}

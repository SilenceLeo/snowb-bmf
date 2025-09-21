import createCanvasFontString from './createCanvasFontString'

interface StyleConfig {
  fontFamily: string
  fontSize: number
}

interface Baselines {
  middle: number
  hanging: number
  top: number
  alphabetic: number
  ideographic: number
  bottom: number
  lineHeight: number
}

let canvas: HTMLCanvasElement

const DEFAULT_TEST_TEXT = 'Ag'
const CANVAS_SIZE = 1000

export default function getFontBaselinesFromCanvas(
  text: string,
  styleConfig: StyleConfig,
): Baselines {
  if (!canvas) {
    canvas = document.createElement('canvas')
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas')
  }

  const font = createCanvasFontString(styleConfig)
  const testText = (
    !text || text.trim() === '' ? DEFAULT_TEST_TEXT : text
  ).substring(0, 20)

  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE

  ctx.font = font
  ctx.textAlign = 'left'

  const measurements = {
    middle: ctx.measureText(testText),
    hanging: ctx.measureText(testText),
    top: ctx.measureText(testText),
    alphabetic: ctx.measureText(testText),
    ideographic: ctx.measureText(testText),
    bottom: ctx.measureText(testText),
  }

  ctx.textBaseline = 'middle'
  measurements.middle = ctx.measureText(testText)

  ctx.textBaseline = 'hanging'
  measurements.hanging = ctx.measureText(testText)

  ctx.textBaseline = 'top'
  measurements.top = ctx.measureText(testText)

  ctx.textBaseline = 'alphabetic'
  measurements.alphabetic = ctx.measureText(testText)

  ctx.textBaseline = 'ideographic'
  measurements.ideographic = ctx.measureText(testText)

  ctx.textBaseline = 'bottom'
  measurements.bottom = ctx.measureText(testText)

  const baselines = {
    middle: 0,
    hanging:
      measurements.hanging.actualBoundingBoxAscent -
      measurements.middle.actualBoundingBoxAscent,
    top:
      measurements.top.actualBoundingBoxAscent -
      measurements.middle.actualBoundingBoxAscent,
    alphabetic:
      measurements.middle.actualBoundingBoxDescent -
      measurements.alphabetic.actualBoundingBoxDescent,
    ideographic:
      measurements.middle.actualBoundingBoxDescent -
      measurements.ideographic.actualBoundingBoxDescent,
    bottom:
      measurements.middle.actualBoundingBoxDescent -
      measurements.bottom.actualBoundingBoxDescent,
    lineHeight: 1,
  }

  const totalHeight = Math.max(
    measurements.middle.actualBoundingBoxAscent +
      measurements.middle.actualBoundingBoxDescent,
    measurements.alphabetic.actualBoundingBoxAscent +
      measurements.alphabetic.actualBoundingBoxDescent,
  )

  baselines.lineHeight = Math.max(1, totalHeight / styleConfig.fontSize)

  return baselines
}

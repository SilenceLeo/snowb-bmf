import createCanvasFontString from './createCanvasFontString'
import type { Baselines } from './types'

interface StyleConfig {
  fontFamily: string
  fontSize: number
}

// Module-level canvas singleton for reuse across calls. Not released during app lifetime.
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

  ctx.textBaseline = 'middle'
  const middleMeasure = ctx.measureText(testText)

  ctx.textBaseline = 'hanging'
  const hangingMeasure = ctx.measureText(testText)

  ctx.textBaseline = 'top'
  const topMeasure = ctx.measureText(testText)

  ctx.textBaseline = 'alphabetic'
  const alphabeticMeasure = ctx.measureText(testText)

  ctx.textBaseline = 'ideographic'
  const ideographicMeasure = ctx.measureText(testText)

  ctx.textBaseline = 'bottom'
  const bottomMeasure = ctx.measureText(testText)

  const baselines = {
    middle: 0,
    hanging:
      hangingMeasure.actualBoundingBoxAscent -
      middleMeasure.actualBoundingBoxAscent,
    top:
      topMeasure.actualBoundingBoxAscent -
      middleMeasure.actualBoundingBoxAscent,
    alphabetic:
      middleMeasure.actualBoundingBoxDescent -
      alphabeticMeasure.actualBoundingBoxDescent,
    ideographic:
      middleMeasure.actualBoundingBoxDescent -
      ideographicMeasure.actualBoundingBoxDescent,
    bottom:
      middleMeasure.actualBoundingBoxDescent -
      bottomMeasure.actualBoundingBoxDescent,
    lineHeight: 1,
  }

  const totalHeight = Math.max(
    middleMeasure.actualBoundingBoxAscent +
      middleMeasure.actualBoundingBoxDescent,
    alphabeticMeasure.actualBoundingBoxAscent +
      alphabeticMeasure.actualBoundingBoxDescent,
  )

  baselines.lineHeight = Math.max(1, totalHeight / styleConfig.fontSize)

  return baselines
}

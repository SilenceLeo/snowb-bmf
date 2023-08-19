import fontStyleStringify, { FontStyleConfig } from './fontStyleStringify'

export interface LetterSize {
  text: string
  letter: string
  width: number
  height: number
  fontWidth: number
  fontHeight: number
  trimOffsetTop: number
  trimOffsetLeft: number
}

let canvas: HTMLCanvasElement

export default function getLetterSizeFromCssText(
  letter: string,
  config: FontStyleConfig,
): LetterSize {
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

  const testA = ctx.measureText(letter)

  if (typeof testA.actualBoundingBoxLeft === 'undefined') {
    return {
      text: letter,
      letter,
      width: testA.width,
      height: parseInt(`${config.fontSize ?? '14'}`, 10),
      fontWidth: testA.width,
      fontHeight: parseInt(`${config.fontSize ?? '14'}`, 10),
      trimOffsetTop: 0,
      trimOffsetLeft: 0,
    }
  }

  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'

  const testB = ctx.measureText(letter)

  const trimOffsetLeft = Math.ceil(testA.actualBoundingBoxLeft)
  const trimOffsetTop = Math.ceil(testB.actualBoundingBoxAscent)
  const width = trimOffsetLeft + Math.ceil(testA.actualBoundingBoxRight)
  const height =
    Math.ceil(testA.actualBoundingBoxDescent) +
    Math.ceil(testA.actualBoundingBoxAscent)
  const fontWidth = Math.ceil(testA.width)
  const fontHeight =
    testA.actualBoundingBoxAscent - testB.actualBoundingBoxAscent

  return {
    text: letter,
    letter,
    width,
    height,
    fontWidth,
    fontHeight,
    trimOffsetTop,
    trimOffsetLeft,
  }
}

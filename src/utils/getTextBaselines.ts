import fontStyleStringify from './fontStyleStringify'

interface StyleConig {
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

export default function getTextBaselines(
  text: string,
  styleConig: StyleConig,
): Baselines {
  if (!canvas) canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Get context 2d failed.')
  const font = fontStyleStringify(styleConig)

  // clear before settings
  canvas.width = 1
  canvas.height = 1

  ctx.font = font

  ctx.textBaseline = 'middle'
  const middle = ctx.measureText(text)
  ctx.textBaseline = 'hanging'
  const hanging = ctx.measureText(text)
  ctx.textBaseline = 'top'
  const top = ctx.measureText(text)
  ctx.textBaseline = 'alphabetic'
  const alphabetic = ctx.measureText(text)
  ctx.textBaseline = 'ideographic'
  const ideographic = ctx.measureText(text)
  ctx.textBaseline = 'bottom'
  const bottom = ctx.measureText(text)

  const baselines = {
    middle: 0,
    hanging: hanging.actualBoundingBoxAscent - middle.actualBoundingBoxAscent,
    top: top.actualBoundingBoxAscent - middle.actualBoundingBoxAscent,
    alphabetic:
      middle.actualBoundingBoxDescent - alphabetic.actualBoundingBoxDescent,
    ideographic:
      middle.actualBoundingBoxDescent - ideographic.actualBoundingBoxDescent,
    bottom: middle.actualBoundingBoxDescent - bottom.actualBoundingBoxDescent,
    lineHeight: 1,
  }

  // TODO: LINEHEIGHT
  baselines.lineHeight =
    (Math.max(baselines.ideographic, baselines.bottom) -
      Math.min(baselines.hanging, baselines.top)) /
    styleConig.fontSize

  return baselines
}

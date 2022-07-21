import getPointOnCircle from '../supports/getPointOnCircle'

interface GarentColor {
  offset: number
  color: string
}

interface Pradient {
  type: 0 | 1
  palette: GarentColor[]
  angle: number
}

interface PatternTexture {
  image: HTMLImageElement | null
  repetition: string
  scale: number
}

interface Config {
  type: number
  color: string
  gradient: Pradient
  patternTexture: PatternTexture
}

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
const matrix = svg.createSVGMatrix()

export default function getCanvasStyle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  config: Config,
): string | CanvasGradient | CanvasPattern {
  // 纯色
  if (config.type === 0) {
    return config.color
  }

  // 渐变
  if (config.type === 1) {
    const { type, palette, angle } = config.gradient
    let gradient: CanvasGradient
    const cx = x + width / 2
    const cy = y + height / 2
    const r = Math.max(width, height) / 2
    if (type === 0) {
      const startPoint = getPointOnCircle(cx, cy, r, angle + 180)
      const endPoint = getPointOnCircle(cx, cy, r, angle)
      gradient = ctx.createLinearGradient(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y,
      )
    } else {
      gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    }

    palette.forEach((color) => {
      gradient.addColorStop(color.offset, color.color)
    })

    return gradient
  }

  const { image, repetition, scale } = config.patternTexture
  if (!image) return 'rgba(0,0,0,0)'

  const pattern = ctx.createPattern(image, repetition)
  if (!pattern) return 'rgba(0,0,0,0)'
  // TODO: Add trim translate and rotate.
  pattern.setTransform(matrix.scale(scale).translate(x, y))
  return pattern
}

import { TrimInfo } from '../glyphTrim/getTrimInfo'
import { Font } from '../../store'

export interface GlyphInfo extends TrimInfo {
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
}

interface Shadow {
  color: string
  blur: number
  offsetX: number
  offsetY: number
}

interface BgFill extends Fill {
  lPadding: number
  rPadding: number
  vPadding: number
}

export interface GlyphConfig {
  font: Font
  fullHeight: boolean

  fill: Fill
  stroke?: Stroke
  shadow?: Shadow
  bgFill?: BgFill
}

import { action, makeObservable, observable } from 'mobx'
import use from 'src/utils/use'

import Fill from './fill'

class Stroke extends Fill {
  width = 1

  /**
   * butt   Default. Adds a flat edge to each end of the line.
   * round  Adds a rounded line cap to each end of the line.
   * square Adds a square line cap to each end of the line.
   */
  lineCap: CanvasLineCap

  /**
   * bevel Creates a beveled corner.
   * round Creates a rounded corner.
   * miter Default. Creates a sharp corner.
   */
  lineJoin: CanvasLineJoin

  /**
   * Stroke Type
   *
   * 0 outer stroke
   * 1 middle stroke
   * 2 inner stroke
   */
  strokeType: 0 | 1 | 2

  constructor(stroke: Partial<Stroke> = {}) {
    super(stroke)
    makeObservable(this, {
      width: observable,
      lineCap: observable,
      lineJoin: observable,
      strokeType: observable,
      setWidth: action.bound,
      setLineCap: action.bound,
      setLineJoin: action.bound,
      setStrokeType: action.bound,
    })
    this.width = use.num(stroke.width, 1)
    this.lineCap = stroke.lineCap || 'round'
    this.lineJoin = stroke.lineJoin || 'round'
    this.strokeType = stroke.strokeType || 0
  }

  setWidth(width: number): void {
    this.width = width
  }

  setLineCap(lineCap: CanvasLineCap): void {
    this.lineCap = lineCap
  }

  setLineJoin(lineJoin: CanvasLineJoin): void {
    this.lineJoin = lineJoin
  }

  setStrokeType(strokeType: 0 | 1 | 2): void {
    this.strokeType = strokeType
  }
}

export default Stroke

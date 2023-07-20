import { action, makeObservable, observable } from 'mobx'
import use from 'src/utils/use'

import Fill from './fill'

class Stroke extends Fill {
  width = 1

  /**
   * butt   默认。向线条的每个末端添加平直的边缘。
   * round  向线条的每个末端添加圆形线帽。
   * square 向线条的每个末端添加正方形线帽。
   */
  lineCap: CanvasLineCap

  /**
   * bevel 创建斜角。
   * round 创建圆角。
   * miter 默认。创建尖角。
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

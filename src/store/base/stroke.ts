import { action, observable } from 'mobx'
import use from 'src/utils/use'

import Fill from './fill'

class Stroke extends Fill {
  @observable width = 1

  /**
   * butt   默认。向线条的每个末端添加平直的边缘。
   * round  向线条的每个末端添加圆形线帽。
   * square 向线条的每个末端添加正方形线帽。
   */
  @observable lineCap: CanvasLineCap

  /**
   * bevel 创建斜角。
   * round 创建圆角。
   * miter 默认。创建尖角。
   */
  @observable lineJoin: CanvasLineJoin

  /**
   * Stroke Type
   *
   * 0 outer stroke
   * 1 middle stroke
   * 2 inner stroke
   */
  @observable strokeType: 0 | 1 | 2

  constructor(stroke: Partial<Stroke> = {}) {
    super(stroke)
    this.width = use.num(stroke.width, 1)
    this.lineCap = stroke.lineCap || 'round'
    this.lineJoin = stroke.lineJoin || 'round'
    this.strokeType = stroke.strokeType || 0
  }

  @action.bound setWidth(width: number): void {
    this.width = width
  }

  @action.bound setLineCap(lineCap: CanvasLineCap): void {
    this.lineCap = lineCap
  }

  @action.bound setLineJoin(lineJoin: CanvasLineJoin): void {
    this.lineJoin = lineJoin
  }

  @action.bound setStrokeType(strokeType: 0 | 1 | 2): void {
    this.strokeType = strokeType
  }
}

export default Stroke

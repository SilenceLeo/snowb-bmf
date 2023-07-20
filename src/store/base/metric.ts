import { action, observable, makeObservable } from 'mobx'

class Metric {
  xAdvance = 0

  xOffset = 0

  yOffset = 0

  constructor(metric: Partial<Metric> = {}) {
    makeObservable(this, {
      xAdvance: observable,
      xOffset: observable,
      yOffset: observable,
      setXAdvance: action.bound,
      setXOffset: action.bound,
      setYOffset: action.bound,
    })
    this.xAdvance = metric.xAdvance || 0
    this.xOffset = metric.xOffset || 0
    this.yOffset = metric.yOffset || 0
  }

  setXAdvance(xAdvance: number): void {
    this.xAdvance = xAdvance
  }

  setXOffset(xOffset: number): void {
    this.xOffset = xOffset
  }

  setYOffset(yOffset: number): void {
    this.yOffset = yOffset
  }
}

export default Metric

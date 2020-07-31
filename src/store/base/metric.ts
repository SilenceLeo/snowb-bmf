import { action, observable } from 'mobx'

class Metric {
  @observable xAdvance = 0

  @observable xOffset = 0

  @observable yOffset = 0

  constructor(metric: Partial<Metric> = {}) {
    this.xAdvance = metric.xAdvance || 0
    this.xOffset = metric.xOffset || 0
    this.yOffset = metric.yOffset || 0
  }

  @action.bound setXAdvance(xAdvance: number): void {
    this.xAdvance = xAdvance
  }

  @action.bound setXOffset(xOffset: number): void {
    this.xOffset = xOffset
  }

  @action.bound setYOffset(yOffset: number): void {
    this.yOffset = yOffset
  }
}

export default Metric

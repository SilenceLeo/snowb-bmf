import { action, observable } from 'mobx'

import Gradient from './gradient'
import PatternTexture from './patternTexture'

export enum FillType {
  SOLID,
  GRADIENT,
  IMAGE,
}

class Fill {
  @observable type: FillType

  @observable color: string

  @observable.shallow gradient: Gradient

  @observable.shallow patternTexture: PatternTexture

  constructor(fill: Partial<Fill> = {}) {
    this.color = fill.color || '#000000'
    this.type = fill.type && FillType[fill.type] ? fill.type : 0
    this.gradient = new Gradient(fill.gradient)
    this.patternTexture = new PatternTexture(fill.patternTexture)
  }

  @action.bound setType(type: FillType = 0): void {
    this.type = type
  }

  @action.bound setColor(color = '#000000'): void {
    this.color = color
  }
}

export default Fill

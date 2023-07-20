import { action, observable, makeObservable } from 'mobx'

import Gradient from './gradient'
import PatternTexture from './patternTexture'

export enum FillType {
  SOLID,
  GRADIENT,
  IMAGE,
}

class Fill {
  type: FillType

  color: string

  gradient: Gradient

  patternTexture: PatternTexture

  constructor(fill: Partial<Fill> = {}) {
    makeObservable(this, {
      type: observable,
      color: observable,
      gradient: observable,
      patternTexture: observable,
      setType: action.bound,
      setColor: action.bound,
    })
    this.color = fill.color || '#000000'
    this.type = fill.type && FillType[fill.type] ? fill.type : 0
    this.gradient = new Gradient(fill.gradient)
    this.patternTexture = new PatternTexture(fill.patternTexture)
  }

  setType(type: FillType = 0): void {
    this.type = type
  }

  setColor(color = '#000000'): void {
    this.color = color
  }
}

export default Fill

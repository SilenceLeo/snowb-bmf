import { action, observable } from 'mobx'
import use from 'src/utils/supports/use'

import Fill from './fill'

class BgFill extends Fill {
  @observable lPadding = 1
  @observable rPadding = 1
  @observable vPadding = 1

  constructor(bgFill: Partial<BgFill> = {}) {
    super(bgFill)
    this.lPadding = use.num(bgFill.lPadding, 0)
    this.rPadding = use.num(bgFill.rPadding, 0)
    this.vPadding = use.num(bgFill.vPadding, 0)
  }

  @action.bound setLPadding(p: number): void {
    this.lPadding = p
  }

  @action.bound setRPadding(p: number): void {
    this.rPadding = p
  }

  @action.bound setVPadding(p: number): void {
    this.vPadding = p
  }
}

export default BgFill

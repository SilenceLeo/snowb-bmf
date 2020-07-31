import { action, observable } from 'mobx'
import use from 'src/utils/use'

class Layout {
  @observable padding = 1

  @observable spacing = 1

  @observable power = false

  constructor(layout: Partial<Layout> = {}) {
    this.padding = use.num(layout.padding, 1)

    this.spacing = use.num(layout.spacing, 1)

    this.power = !!layout.power
  }

  @action.bound setPadding(padding: number): void {
    this.padding = padding
  }

  @action.bound setSpacing(spacing: number): void {
    this.spacing = spacing
  }

  @action.bound setPower(power: boolean): void {
    this.power = power
  }
}

export default Layout

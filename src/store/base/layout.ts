import { action, observable } from 'mobx'
import use from 'src/utils/use'

class Layout {
  @observable padding = 1

  @observable spacing = 1

  @observable power = false

  @observable width = 1024

  @observable height = 1024

  @observable auto = true

  @observable fixedSize = false

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

  @action.bound setWidth(width: number): void {
    this.width = width
  }

  @action.bound setHeight(height: number): void {
    this.height = height
  }

  @action.bound setAuto(auto: boolean): void {
    this.auto = auto
  }

  @action.bound setFixedSize(fixedSize: boolean): void {
    this.fixedSize = fixedSize
  }
}

export default Layout

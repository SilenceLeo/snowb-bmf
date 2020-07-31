import { action, observable } from 'mobx'
import use from 'src/utils/use'

class Shadow {
  @observable color: string

  @observable blur = 1

  @observable offsetX = 1

  @observable offsetY = 1

  constructor(shadow: Partial<Shadow> = {}) {
    this.color = shadow.color || '#000000'
    this.blur = use.num(shadow.blur, 1)
    this.offsetX = use.num(shadow.offsetX, 1)
    this.offsetY = use.num(shadow.offsetY, 1)
  }

  @action.bound setColor(color: string): void {
    this.color = color
  }

  @action.bound setBlur(blur: number): void {
    this.blur = blur
  }

  @action.bound setOffsetX(offsetX: number): void {
    this.offsetX = offsetX
  }

  @action.bound setOffsetY(offsetY: number): void {
    this.offsetY = offsetY
  }

  @action.bound setOffset(offsetX: number, offsetY: number): void {
    this.offsetX = offsetX
    this.offsetY = offsetY
  }
}

export default Shadow

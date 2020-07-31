import { action, observable } from 'mobx'
import use from 'src/utils/use'

class Ui {
  @observable scale = 1

  @observable offsetX = 0

  @observable offsetY = 0

  @observable width = 0

  @observable height = 0

  @observable previewText = 'Hello World!\nHello Snow Bamboo!' // /\r\n|\r|\n/

  @observable selectLetter = ''

  @observable selectNextLetter = ''

  @observable showPreview = false

  @observable previewScale = 1

  @observable previewOffsetX = 0

  @observable previewOffsetY = 0

  constructor(ui: Partial<Ui> = {}) {
    if (ui.previewText) {
      this.previewText = ui.previewText
    }
  }

  reOffset() {
    this.offsetX = Math.min(
      Math.max(this.width / -2, this.offsetX),
      this.width / 2,
    )
    this.offsetY = Math.min(
      Math.max(this.height / -2, this.offsetY),
      this.height / 2,
    )
    this.scale = Math.max(this.scale, 0.01)
  }

  @action.bound setTransform(trans: Partial<Ui>): void {
    this.scale = use.num(trans.scale, this.scale)
    this.offsetX = use.num(trans.offsetX, this.offsetX)
    this.offsetY = use.num(trans.offsetY, this.offsetY)
    this.reOffset()
  }

  @action.bound setSize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.reOffset()
  }

  @action.bound setPreviewText(text: string): void {
    this.previewText = text
  }

  @action.bound setShowPreview(showPreview: boolean) {
    this.showPreview = showPreview
  }

  @action.bound setPreviewTransform(trans: Partial<Ui>): void {
    this.previewScale = Math.max(
      use.num(trans.previewScale, this.previewScale),
      0.01,
    )
    this.previewOffsetX = use.num(trans.previewOffsetX, this.previewOffsetX)
    this.previewOffsetY = use.num(trans.previewOffsetY, this.previewOffsetY)
  }

  @action.bound setSelectLetter(letter: string = '', next: string = '') {
    this.selectLetter = letter
    this.selectNextLetter = next
  }
}

export default Ui

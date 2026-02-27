import { action, makeObservable, observable } from 'mobx'
import use from 'src/utils/use'

class Ui {
  scale = 1

  offsetX = 0

  offsetY = 0

  width = 512

  height = 512

  previewText = 'Hello World!\nHello Snow Bamboo!' // /\r\n|\r|\n/

  selectLetter = ''

  selectNextLetter = ''

  showPreview = false

  previewScale = 1

  previewOffsetX = 0

  previewOffsetY = 0

  packFailed = false

  xFractional = 0

  constructor(ui: Partial<Ui> | null = {}) {
    const safeUi = ui ?? {}
    makeObservable(this, {
      scale: observable,
      offsetX: observable,
      offsetY: observable,
      width: observable,
      height: observable,
      previewText: observable,
      selectLetter: observable,
      selectNextLetter: observable,
      showPreview: observable,
      previewScale: observable,
      previewOffsetX: observable,
      previewOffsetY: observable,
      packFailed: observable,
      xFractional: observable,
      setTransform: action.bound,
      setSize: action.bound,
      setPreviewText: action.bound,
      setShowPreview: action.bound,
      setPreviewTransform: action.bound,
      setSelectLetter: action.bound,
      setPackFailed: action.bound,
      setXFractional: action.bound,
    })
    if (safeUi.previewText) {
      this.previewText = safeUi.previewText
    }
    this.xFractional = use.num(safeUi.xFractional, this.xFractional)
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

  setTransform(trans: Partial<Ui>): void {
    this.scale = use.num(trans.scale, this.scale)
    this.offsetX = use.num(trans.offsetX, this.offsetX)
    this.offsetY = use.num(trans.offsetY, this.offsetY)
    this.reOffset()
  }

  setSize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.reOffset()
  }

  setPreviewText(text: string): void {
    this.previewText = text
  }

  setShowPreview(showPreview: boolean): void {
    this.showPreview = showPreview
  }

  setPreviewTransform(trans: Partial<Ui>): void {
    this.previewScale = Math.max(
      use.num(trans.previewScale, this.previewScale),
      0.01,
    )
    this.previewOffsetX = use.num(trans.previewOffsetX, this.previewOffsetX)
    this.previewOffsetY = use.num(trans.previewOffsetY, this.previewOffsetY)
  }

  setSelectLetter(letter: string = '', next: string = ''): void {
    this.selectLetter = letter
    this.selectNextLetter = next
  }

  setPackFailed(packFailed: boolean): void {
    this.packFailed = packFailed
  }

  setXFractional(value: number): void {
    const intValue = Math.round(use.num(value, this.xFractional))
    this.xFractional = Math.max(0, Math.min(7, intValue))
  }
}

export default Ui

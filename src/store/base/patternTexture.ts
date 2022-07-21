import { action, observable, runInAction } from 'mobx'
import use from 'src/utils/supports/use'
import base64ToArrayBuffer from 'src/utils/supports/base64ToArrayBuffer'

export type Repetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'

const DEFAULT_IMAGE =
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX////MzMw46qqDAAAADklEQVQI12Pgh8IPEAgAEeAD/Xk4HBcAAAAASUVORK5CYII='

class PatternTexture {
  @observable.ref buffer: ArrayBuffer = base64ToArrayBuffer(DEFAULT_IMAGE)

  @observable.ref image: HTMLImageElement | null = null

  @observable src = ''

  @observable repetition: Repetition = 'repeat'

  @observable scale: number

  constructor(pt: Partial<PatternTexture> = {}) {
    this.scale = use.num(pt.scale, 1)
    this.repetition = pt.repetition || 'repeat'
    this.setImage(pt.buffer || this.buffer)
  }

  @action.bound setImage(buffer: ArrayBuffer): void {
    const src = URL.createObjectURL(new Blob([buffer]))
    const img = new Image()
    img.onload = () => {
      runInAction('setPatternTextureImage', () => {
        this.buffer = buffer
        this.image = img
        this.src = src
        img.onload = null
      })
    }
    img.src = src
  }

  @action.bound setRepetition(repetition: Repetition): void {
    this.repetition = repetition
  }

  @action.bound setScale(scale: number): void {
    this.scale = scale
  }
}

export default PatternTexture

import { action, makeObservable, observable, runInAction } from 'mobx'
import base64ToArrayBuffer from 'src/utils/base64ToArrayBuffer'
import use from 'src/utils/use'

export type Repetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'

const DEFAULT_IMAGE =
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX////MzMw46qqDAAAADklEQVQI12Pgh8IPEAgAEeAD/Xk4HBcAAAAASUVORK5CYII='

class PatternTexture {
  buffer: ArrayBuffer = base64ToArrayBuffer(DEFAULT_IMAGE)

  image: HTMLImageElement | null = null

  src = ''

  repetition: Repetition = 'repeat'

  scale: number

  constructor(pt: Partial<PatternTexture> = {}) {
    makeObservable(this, {
      buffer: observable.ref,
      image: observable.ref,
      src: observable,
      repetition: observable,
      scale: observable,
      setImage: action.bound,
      setRepetition: action.bound,
      setScale: action.bound,
    })
    this.scale = use.num(pt.scale, 1)
    this.repetition = pt.repetition || 'repeat'
    this.setImage(pt.buffer || this.buffer)
  }

  setImage(buffer: ArrayBuffer): void {
    const src = URL.createObjectURL(new Blob([buffer]))
    const img = new Image()
    img.onload = () => {
      runInAction(() => {
        this.buffer = buffer
        this.image = img
        this.src = src
        img.onload = null
      })
    }
    img.src = src
  }

  setRepetition(repetition: Repetition): void {
    this.repetition = repetition
  }

  setScale(scale: number): void {
    this.scale = scale
  }
}

export default PatternTexture

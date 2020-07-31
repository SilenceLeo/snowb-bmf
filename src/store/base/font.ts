import { action, observable, computed, runInAction } from 'mobx'
import getTextBaselines from 'src/utils/getTextBaselines'
import { parse, Font as OpenType } from 'opentype.js'
import updateFontFace from 'src/utils/updateFontFace'

class Font {
  @observable.ref font: ArrayBuffer | null = null

  @observable family: string = 'sans-serif'

  @observable size: number

  @observable lineHeight = 1.25

  @observable middle = 0

  @observable hanging = 0

  @observable top = 0

  @observable alphabetic = 0

  @observable ideographic = 0

  @observable bottom = 0

  @observable.ref opentype: OpenType | null = null

  @computed get minBaseLine() {
    return Math.min(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    )
  }

  @computed get maxBaseLine() {
    return Math.max(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    )
  }

  constructor(font: Partial<Font> = {}) {
    this.size = font.size || 72
    if (font.font && font.font.byteLength) {
      this.setFont(font.font)
    } else {
      this.updateBaseines()
    }
  }

  updateBaseines(): void {
    const bls = getTextBaselines('a', {
      fontFamily: this.family,
      fontSize: this.size,
    })

    this.middle = bls.middle
    this.hanging = bls.hanging
    this.top = bls.top
    this.alphabetic = bls.alphabetic
    this.ideographic = bls.ideographic
    this.bottom = bls.bottom
  }

  @action.bound setFont(buffer: ArrayBuffer): Promise<void> {
    try {
      this.opentype = parse(buffer, { lowMemory: true })
    } catch (e) {
      return Promise.resolve()
    }
    const { names } = this.opentype
    const fontName = names.postScriptName[Object.keys(names.postScriptName)[0]]
    const url = URL.createObjectURL(new Blob([buffer]))
    return updateFontFace(fontName, url).then(() => {
      runInAction(() => {
        this.family = fontName
        this.font = buffer
        this.updateBaseines()
      })
    })
  }

  @action.bound setSize(size: number): void {
    this.size = size
    this.updateBaseines()
  }

  @action.bound setLineHeight(lineHeight: number): void {
    this.lineHeight = lineHeight
  }
}

export default Font

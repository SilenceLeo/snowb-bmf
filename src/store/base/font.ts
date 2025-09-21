import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { Font as OpenType, parse } from 'opentype.js'
import getFontBaselinesFromCanvas from 'src/utils/getFontBaselinesFromCanvas'
import getFontBaselinesFromMetrics from 'src/utils/getFontBaselinesFromMetrics'
import is from 'src/utils/is'
import updateFontFace from 'src/utils/updateFontFace'

export interface FontResource {
  font: ArrayBuffer
  family: string
  opentype: OpenType
}

const DEFAULT_FAMILY = 'sans-serif'

class Font {
  fonts: FontResource[] = []

  size: number

  lineHeight = 1.25

  middle = 0

  hanging = 0

  top = 0

  alphabetic = 0

  ideographic = 0

  bottom = 0

  sharp = 80

  get mainFont() {
    if (this.fonts.length > 0) {
      return this.fonts[0]
    }
    return null
  }

  get mainFamily() {
    if (this.mainFont) {
      return this.mainFont.family
    }
    return DEFAULT_FAMILY
  }

  get opentype() {
    if (this.mainFont) {
      return this.mainFont.opentype
    }
    return null
  }

  get family(): string {
    return (
      this.fonts.map((fontResource) => `"${fontResource.family}"`).join(',') ||
      DEFAULT_FAMILY
    )
  }

  get minBaseLine() {
    const min = Math.min(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    )
    if (Number.isNaN(Number(min))) {
      return 0
    }
    return min
  }

  get maxBaseLine() {
    const max = Math.max(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    )
    if (Number.isNaN(Number(max))) {
      return this.size
    }
    return max
  }

  constructor(font: Partial<Font> = {}) {
    makeObservable(this, {
      fonts: observable.shallow,
      size: observable,
      lineHeight: observable,
      middle: observable,
      hanging: observable,
      top: observable,
      alphabetic: observable,
      ideographic: observable,
      bottom: observable,
      sharp: observable,
      mainFont: computed,
      mainFamily: computed,
      opentype: computed,
      family: computed,
      minBaseLine: computed,
      maxBaseLine: computed,
      addFont: action.bound,
      removeFont: action.bound,
      setSize: action.bound,
      setLineHeight: action.bound,
      setSharp: action.bound,
    })
    this.size = font.size || 72
    this.lineHeight = font.lineHeight || 1.25
    this.sharp = is.num(font.sharp) ? font.sharp : 80
    if (font.fonts?.length) {
      font.fonts.forEach((fontResource) => this.addFont(fontResource.font))
    } else {
      this.updateBaselines()
    }
  }

  updateBaselines(): void {
    let bls
    if (this.mainFont?.opentype) {
      bls = getFontBaselinesFromMetrics(this.mainFont.opentype, this.size)
    } else {
      bls = getFontBaselinesFromCanvas('Ag', {
        fontFamily: this.family,
        fontSize: this.size,
      })
    }

    if (this.lineHeight === 1.25) {
      this.lineHeight = bls.lineHeight
    }
    this.middle = bls.middle
    this.hanging = bls.hanging
    this.top = bls.top
    this.alphabetic = bls.alphabetic
    this.ideographic = bls.ideographic
    this.bottom = bls.bottom
  }

  async addFont(font: ArrayBuffer): Promise<void> {
    const opentype: OpenType = parse(font, { lowMemory: true })

    const { names } = opentype
    const family = names.postScriptName[Object.keys(names.postScriptName)[0]]
    const hasFont = this.fonts.find(
      (fontResource) => fontResource.family === family,
    )
    if (hasFont) {
      throw new Error('Font already exists.')
    }
    const url = URL.createObjectURL(new Blob([font]))

    await updateFontFace(family, url)

    runInAction(() => {
      this.fonts.push({
        font,
        family,
        opentype,
      })
      this.updateBaselines()
    })
  }

  removeFont(fontResource: FontResource) {
    const idx = this.fonts.indexOf(fontResource)
    if (idx === -1) {
      return
    }
    this.fonts.splice(idx, 1)
    if (idx === 0) {
      this.updateBaselines()
    }
  }

  setSize(size: number): void {
    this.size = size
    this.updateBaselines()
  }

  setLineHeight(lineHeight: number): void {
    this.lineHeight = lineHeight
  }

  setSharp(sharp: number): void {
    this.sharp = sharp
  }
}

export default Font

import { action, observable, computed, runInAction } from 'mobx'
import getTextBaselines from 'src/utils/getTextBaselines'
import { parse, Font as OpenType } from 'opentype.js'
import updateFontFace from 'src/utils/updateFontFace'
import getFontBaselines from 'src/utils/getFontBaselines'
import is from 'src/utils/is'

export interface FontResource {
  font: ArrayBuffer
  family: string
  opentype: OpenType
}

const DEFAULT_FAMILY = 'sans-serif'

class Font {
  @observable fonts: FontResource[] = []

  @observable size: number

  @observable lineHeight = 1

  @observable middle = 0

  @observable hanging = 0

  @observable top = 0

  @observable alphabetic = 0

  @observable ideographic = 0

  @observable bottom = 0

  @observable sharp = 80

  @computed get mainFont() {
    if (this.fonts.length > 0) return this.fonts[0]
    return null
  }

  @computed get mainFamily() {
    if (this.mainFont) return this.mainFont.family
    return DEFAULT_FAMILY
  }

  @computed get opentype() {
    if (this.mainFont) return this.mainFont.opentype
    return null
  }

  @computed get family(): string {
    return (
      this.fonts.map((fontResource) => `"${fontResource.family}"`).join(',') ||
      DEFAULT_FAMILY
    )
  }

  @computed get minBaseLine() {
    const min = Math.min(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    )
    if (Number.isNaN(Number(min))) return 0
    return min
  }

  @computed get maxBaseLine() {
    const max = Math.max(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    )
    if (Number.isNaN(Number(max))) return this.size
    return max
  }

  constructor(font: Partial<Font> = {}) {
    this.size = font.size || 72
    // this.lineHeight = font.lineHeight || 1.25
    this.sharp = is.num(font.sharp) ? font.sharp : 80
    if (font.fonts && font.fonts.length) {
      font.fonts.forEach((fontResource) => this.addFont(fontResource.font))
    } else {
      this.updateBaseines()
    }
  }

  updateBaseines(): void {
    let bls
    if (this.mainFont?.opentype) {
      bls = getFontBaselines(this.mainFont.opentype, this.size)
    } else {
      bls = getTextBaselines('a', {
        fontFamily: this.family,
        fontSize: this.size,
      })
    }
    this.lineHeight = bls.lineHeight
    this.middle = bls.middle
    this.hanging = bls.hanging
    this.top = bls.top
    this.alphabetic = bls.alphabetic
    this.ideographic = bls.ideographic
    this.bottom = bls.bottom
  }

  @action.bound addFont(font: ArrayBuffer): Promise<void> {
    let opentype: OpenType
    try {
      opentype = parse(font, { lowMemory: true })
    } catch (e) {
      return Promise.reject(e)
    }
    const { names } = opentype
    const family = names.postScriptName[Object.keys(names.postScriptName)[0]]
    const hasFont = this.fonts.find(
      (fontResource) => fontResource.family === family,
    )
    if (hasFont) {
      return Promise.reject(new Error('Font already exists.'))
    }
    const url = URL.createObjectURL(new Blob([font]))
    return updateFontFace(family, url).then(() => {
      runInAction(() => {
        this.fonts.push({
          font,
          family,
          opentype,
        })
        this.updateBaseines()
      })
    })
  }

  @action.bound removeFont(fontResource: FontResource) {
    const idx = this.fonts.indexOf(fontResource)
    if (idx === -1) return
    this.fonts.splice(idx, 1)
    if (idx === 0) {
      this.updateBaseines()
    }
  }

  @action.bound setSize(size: number): void {
    this.size = size
    this.updateBaseines()
  }

  @action.bound setLineHeight(lineHeight: number): void {
    this.lineHeight = lineHeight
  }

  @action.bound setSharp(sharp: number): void {
    this.sharp = sharp
  }
}

export default Font

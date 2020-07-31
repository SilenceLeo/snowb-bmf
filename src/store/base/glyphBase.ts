import { observable, action } from 'mobx'

import Metric from './metric'

export type GlyphType = 'text' | 'image'

class GlyphBase {
  readonly type: GlyphType = 'text'

  @observable letter = ''

  @observable.ref source: HTMLImageElement | HTMLCanvasElement | null = null

  @observable width = 0

  @observable height = 0

  @observable x = 0

  @observable y = 0

  @observable fontWidth = 0

  @observable fontHeight = 0

  @observable trimOffsetTop = 0

  @observable trimOffsetLeft = 0

  @observable trimOffsetRight = 0

  @observable trimOffsetBottom = 0

  @observable.ref adjustMetric: Metric

  @observable kerning: Map<string, number> = new Map()

  constructor(glyph: Partial<GlyphBase> = {}) {
    this.letter = glyph.letter || ''
    this.adjustMetric = new Metric(glyph.adjustMetric)

    if (glyph.kerning) {
      this.kerning = glyph.kerning
    }
  }

  @action.bound steKerning(text: string, kerning: number) {
    this.kerning.set(text, kerning)
  }
}

export default GlyphBase

import { action, makeObservable, observable } from 'mobx'

import Metric from './metric'

export type GlyphType = 'text' | 'image'

class GlyphBase {
  readonly type: GlyphType = 'text'

  letter = ''

  width = 0

  height = 0

  x = 0

  y = 0

  fontWidth = 0

  fontHeight = 0

  trimOffsetTop = 0

  trimOffsetLeft = 0

  adjustMetric: Metric

  kerning: Map<string, number> = new Map()

  constructor(glyph: Partial<GlyphBase> = {}) {
    makeObservable(this, {
      letter: observable,
      width: observable,
      height: observable,
      x: observable,
      y: observable,
      fontWidth: observable,
      fontHeight: observable,
      trimOffsetTop: observable,
      trimOffsetLeft: observable,
      kerning: observable,
      adjustMetric: observable.ref,
      steKerning: action.bound,
    })

    this.letter = glyph.letter || ''
    this.adjustMetric = new Metric(glyph.adjustMetric)

    if (glyph.kerning) {
      this.kerning = glyph.kerning
    }
  }

  steKerning(text: string, kerning: number) {
    this.kerning.set(text, kerning)
  }
}

export default GlyphBase

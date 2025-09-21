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

  page = 0

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
      page: observable,
      // Optimization: Set rarely changing size properties as observable.struct
      fontWidth: observable.struct,
      fontHeight: observable.struct,
      trimOffsetTop: observable.struct,
      trimOffsetLeft: observable.struct,
      // Optimization: Use shallow observable for kerning to avoid deep tracking
      kerning: observable.shallow,
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

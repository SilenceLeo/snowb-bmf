import { action, makeObservable } from 'mobx'
import { GlyphItem } from 'src/utils/getFontGlyphs'

import GlyphBase from './glyphBase'

class GlyphFont extends GlyphBase {
  canvasX = 0

  canvasY = 0

  constructor(galyphFont: Partial<GlyphFont> = {}, glyphInfo?: GlyphItem) {
    super(galyphFont)
    makeObservable(this, {
      setGlyphInfo: action,
    })
    if (glyphInfo) this.setGlyphInfo(glyphInfo)
  }

  setGlyphInfo(glyphInfo: GlyphItem): void {
    this.width = glyphInfo.width
    this.height = glyphInfo.height
    this.fontWidth = glyphInfo.fontWidth
    this.fontHeight = glyphInfo.fontHeight
    this.trimOffsetTop = glyphInfo.trimOffsetTop
    this.trimOffsetLeft = glyphInfo.trimOffsetLeft
    this.canvasX = glyphInfo.canvasX
    this.canvasY = glyphInfo.canvasY
  }
}

export default GlyphFont

import { action } from 'mobx'
import getFontGlyphInfo from 'src/utils/getFontGlyphInfo'
import getGlyphInfo, { Config } from 'src/utils/getGlyphInfo'
import GlyphBase from './glyphBase'

import Style from './style'

class GlyphFont extends GlyphBase {
  constructor(galyphFont: Partial<GlyphFont> = {}, textStyle: Style) {
    super(galyphFont)
    this.setGlyphInfo(textStyle)
  }

  @action setGlyphInfo(textStyle: Style): void {
    const { font, fill, useStroke, stroke, useShadow, shadow } = textStyle
    const config: Config = { font, fill }
    if (useStroke) config.stroke = stroke
    if (useShadow) config.shadow = shadow

    let glyphInfo
    try {
      glyphInfo = getFontGlyphInfo(this.letter, config as Style)
    } catch (e) {
      glyphInfo = getGlyphInfo(this.letter, config)
    }
    this.source = glyphInfo.canvas
    this.width = glyphInfo.width
    this.height = glyphInfo.height
    this.fontWidth = glyphInfo.fontWidth
    this.fontHeight = glyphInfo.fontHeight
    this.trimOffsetTop = glyphInfo.trimOffsetTop
    this.trimOffsetLeft = glyphInfo.trimOffsetLeft
    this.trimOffsetRight = glyphInfo.trimOffsetRight
    this.trimOffsetBottom = glyphInfo.trimOffsetBottom
  }
}

export default GlyphFont

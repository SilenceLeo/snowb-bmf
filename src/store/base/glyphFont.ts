import { action } from 'mobx'
import getGlyphInfoFromFont from 'src/utils/glyphInfo/getGlyphInfoFromFont'
import getGlyphInfo from 'src/utils/glyphInfo/getGlyphInfo'
import GlyphBase from './glyphBase'
import Style from './style'
import { GlyphConfig } from '../../utils/glyphInfo/ds'

class GlyphFont extends GlyphBase {
  constructor(glyphFont: Partial<GlyphFont> = {}, textStyle: Style) {
    super(glyphFont)
    this.setGlyphInfo(textStyle)
  }

  @action setGlyphInfo(textStyle: Style): void {
    const {
      font,
      fill,
      useStroke,
      stroke,
      useShadow,
      shadow,
      useBgFill,
      bgFill,
      fullHeight,
    } = textStyle
    /**
     * @mark: font 和 fill 是必有的，其他几个根据控制再开启
     */
    const config: GlyphConfig = { font, fill, fullHeight }
    if (useStroke) config.stroke = stroke
    if (useShadow) config.shadow = shadow
    if (useBgFill) config.bgFill = bgFill

    let glyphInfo
    try {
      glyphInfo = getGlyphInfoFromFont(this.letter, config)
    } catch (e) {
      glyphInfo = getGlyphInfo(this.letter, config)
    }

    this.source = glyphInfo.canvas
    this.width = glyphInfo.width
    this.height = glyphInfo.height
    this.fontWidth = glyphInfo.fontWidth
    this.fontHeight = glyphInfo.fontHeight
    this.trimOffsetTop = glyphInfo.trimOffsetTop
    this.trimOffsetBottom = glyphInfo.trimOffsetBottom
    this.trimOffsetLeft = glyphInfo.trimOffsetLeft
    this.trimOffsetRight = glyphInfo.trimOffsetRight
  }
}

export default GlyphFont

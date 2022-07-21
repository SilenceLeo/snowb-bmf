import { action, observable } from 'mobx'

import Font from './font'
import Fill from './fill'
import Stroke from './stroke'
import Shadow from './shadow'
import BgFill from './bgFill'

class Style {
  @observable readonly font: Font

  @observable readonly fill: Fill

  @observable useStroke: boolean

  @observable readonly stroke: Stroke

  @observable useShadow: boolean

  @observable readonly shadow: Shadow

  @observable readonly bgFill: BgFill

  @observable useBgFill: boolean

  @observable fullHeight: boolean

  constructor(style: Partial<Style> = {}) {
    this.font = new Font(style.font)
    this.fill = new Fill(style.fill)
    this.stroke = new Stroke(style.stroke)
    this.shadow = new Shadow(style.shadow)
    this.bgFill = new BgFill(style.bgFill)
    this.useShadow = !!style.useShadow
    this.useStroke = !!style.useStroke
    this.useBgFill = !!style.useBgFill
    this.fullHeight = !!style.fullHeight
  }

  @action.bound setUseStroke(useStroke: boolean): void {
    this.useStroke = useStroke
  }

  @action.bound setUseShadow(useShadow: boolean): void {
    this.useShadow = useShadow
  }

  @action.bound setUseBgFill(useBgFill: boolean): void {
    this.useBgFill = useBgFill
  }

  @action.bound setFullHeight(fullHeight: boolean): void {
    this.fullHeight = fullHeight
  }
}

export default Style

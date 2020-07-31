import { action, observable } from 'mobx'

import Font from './font'
import Fill from './fill'
import Stroke from './stroke'
import Shadow from './shadow'

class Style {
  @observable readonly font: Font

  @observable readonly fill: Fill

  @observable useStroke: boolean

  @observable readonly stroke: Stroke

  @observable useShadow: boolean

  @observable readonly shadow: Shadow

  @observable bgColor = 'rgba(0,0,0,0)'

  constructor(style: Partial<Style> = {}) {
    this.font = new Font(style.font)
    this.fill = new Fill(style.fill)
    this.stroke = new Stroke(style.stroke)
    this.shadow = new Shadow(style.shadow)
    this.useShadow = !!style.useShadow
    this.useStroke = !!style.useStroke
  }

  @action.bound setUseStroke(useStroke: boolean): void {
    this.useStroke = useStroke
  }

  @action.bound setUseShadow(useShadow: boolean): void {
    this.useShadow = useShadow
  }

  @action.bound setBgColor(bgColor: string): void {
    this.bgColor = bgColor
  }
}

export default Style

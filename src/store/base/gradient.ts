import { action, computed, observable } from 'mobx'

// import GradientPaletteItem from './gradientPaletteItem'

export enum GradientType {
  LINEAR,
  RADIAL,
}

export interface GradientColor {
  offset: number
  color: string
}

export interface GradientPaletteItem extends GradientColor {
  id: number
}

export interface GradientColorOption extends GradientColor {
  id?: number
}

class Gradient {
  @observable type: GradientType = 0

  @observable angle: number

  @observable.shallow palette: GradientPaletteItem[] = []

  constructor(gradient: Partial<Gradient> = {}) {
    this.type = gradient.type && GradientType[gradient.type] ? gradient.type : 0
    this.angle = gradient.angle || 0
    if (gradient.palette) {
      gradient.palette.forEach((item) => {
        this.palette.push({
          ...item,
          id: item.id || this.nextId,
        })
      })
    } else {
      this.addColor(0, 'rgba(255,255,255,1)')
      this.addColor(1)
    }
  }

  @computed get ids(): number[] {
    return this.palette.map((color) => color.id)
  }

  @computed get nextId(): number {
    if (this.ids.length === 0) return 1
    return Math.max(...this.ids) + 1
  }

  @action.bound setType(type: GradientType): void {
    this.type = type
  }

  @action.bound setAngle(angle: number): void {
    this.angle = angle
  }

  @action.bound addColor(offset = 0, color = 'rgba(0,0,0,1)'): void {
    this.palette.push({ offset, color, id: this.nextId })
  }

  @action.bound updatePalette(palette: GradientPaletteItem[]): void {
    this.palette = palette
  }
}

export default Gradient

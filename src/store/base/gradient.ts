import { action, computed, observable, makeObservable } from 'mobx'

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
  type: GradientType = 0

  angle: number

  palette: GradientPaletteItem[] = []

  constructor(gradient: Partial<Gradient> = {}) {
    makeObservable(this, {
      type: observable,
      angle: observable,
      palette: observable.shallow,
      ids: computed,
      nextId: computed,
      setType: action.bound,
      setAngle: action.bound,
      addColor: action.bound,
      updatePalette: action.bound,
    })

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

  get ids(): number[] {
    return this.palette.map((color) => color.id)
  }

  get nextId(): number {
    if (this.ids.length === 0) return 1
    return Math.max(...this.ids) + 1
  }

  setType(type: GradientType): void {
    this.type = type
  }

  setAngle(angle: number): void {
    this.angle = angle
  }

  addColor(offset = 0, color = 'rgba(0,0,0,1)'): void {
    this.palette.push({ offset, color, id: this.nextId })
  }

  updatePalette(palette: GradientPaletteItem[]): void {
    this.palette = palette
  }
}

export default Gradient

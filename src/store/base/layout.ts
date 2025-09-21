import { action, makeObservable, observable } from 'mobx'
import use from 'src/utils/use'

class Layout {
  padding = 1

  spacing = 1

  width = 512

  height = 512

  auto = true

  fixedSize = false

  page = 1

  packWidth = 512

  packHeight = 512

  constructor(layout: Partial<Layout> = {}) {
    makeObservable(this, {
      padding: observable,
      spacing: observable,
      width: observable,
      height: observable,
      auto: observable,
      fixedSize: observable,
      page: observable,
      packWidth: observable,
      packHeight: observable,
      setPadding: action.bound,
      setSpacing: action.bound,
      setWidth: action.bound,
      setHeight: action.bound,
      setAuto: action.bound,
      setFixedSize: action.bound,
      setPage: action.bound,
      setPackSize: action.bound,
    })
    this.padding = use.num(layout.padding, 1)

    this.spacing = use.num(layout.spacing, 1)

    this.width = use.num(layout.width, 512)

    this.height = use.num(layout.height, 512)

    // Compatible with old files, default true.
    this.auto = layout.auto === false ? false : true

    this.fixedSize = !!layout.fixedSize

    this.page = use.num(layout.page, 1)

    this.packWidth = use.num(layout.packWidth, 512)

    this.packHeight = use.num(layout.packHeight, 512)
  }

  setPadding(padding: number): void {
    this.padding = padding
  }

  setSpacing(spacing: number): void {
    this.spacing = spacing
  }

  setWidth(width: number): void {
    this.width = width
  }

  setHeight(height: number): void {
    this.height = height
  }

  setAuto(auto: boolean): void {
    this.auto = auto
  }

  setFixedSize(fixedSize: boolean): void {
    this.fixedSize = fixedSize
  }

  setPage(page: number): void {
    this.page = Math.max(1, Math.floor(page))
  }

  setPackSize(width: number, height: number): void {
    if (this.packWidth === width && this.packHeight === height) return
    this.packWidth = width
    this.packHeight = height
  }
}

export default Layout

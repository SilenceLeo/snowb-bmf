import { action, computed, makeObservable, observable } from 'mobx'
import { deepObserve } from 'mobx-utils'
import { GuillotineBinPack } from 'rectangle-packer'
import getFontGlyphs from 'src/utils/getFontGlyphs'
// eslint-disable-next-line import/no-webpack-loader-syntax
import AutoPacker from 'worker-loader?filename=static/js/AutoPacker.[hash].worker.js!src/workers/AutoPacker.worker'

import { GlyphType } from './base/glyphBase'
import GlyphFont from './base/glyphFont'
import GlyphImage, { FileInfo } from './base/glyphImage'
import Layout from './base/layout'
import Metric from './base/metric'
import Style from './base/style'
import Ui from './base/ui'

interface TextRectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
  type: GlyphType
}

class Project {
  name = 'Unnamed'

  id: number

  worker: AutoPacker | null = null

  packStart = 0

  packTimer = 0

  idleId = 0

  isPacking = false

  text =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!№;%:?*()_+-=.,/|"\'@#$^&{}[]'

  glyphs: Map<string, GlyphFont> = new Map()

  glyphImages: GlyphImage[] = []

  style: Style

  layout: Layout

  globalAdjustMetric: Metric

  packCanvas: HTMLCanvasElement | null = null

  ui: Ui = new Ui()

  constructor(project: Partial<Project> = {}) {
    makeObservable(this, {
      name: observable,
      isPacking: observable,
      text: observable,
      glyphs: observable.shallow,
      glyphImages: observable.shallow,
      style: observable.ref,
      layout: observable.ref,
      globalAdjustMetric: observable.ref,
      packCanvas: observable.ref,
      ui: observable.ref,
      glyphList: computed,
      rectangleList: computed,
      pack: action.bound,
      setPack: action.bound,
      packStyle: action.bound,
      throttlePack: action.bound,
      setText: action.bound,
      addGlyphs: action.bound,
      addImages: action.bound,
      removeImage: action.bound,
      setCanvas: action.bound,
      setName: action.bound,
    })
    this.id = project.id || Date.now()
    this.name = project.name || 'Unnamed'
    this.text = project.text || this.text
    this.ui = new Ui(project.ui)
    this.style = new Style(project.style)
    this.layout = new Layout(project.layout)
    this.globalAdjustMetric = new Metric(project.globalAdjustMetric)

    if (project.glyphs) {
      project.glyphs.forEach((value, key) => {
        this.glyphs.set(key, new GlyphFont(value))
      })
    }

    project.glyphImages?.forEach((img) => {
      this.glyphImages.push(new GlyphImage(img))
    })

    if (!this.glyphs.has(' '))
      this.glyphs.set(' ', new GlyphFont({ letter: ' ' }))

    this.addGlyphs(project.text || '')
    this.addAutoRun()
    this.pack()
  }

  get glyphList() {
    return Array.from(` ${this.text}`)
      .map((letter) => this.getGlyph(letter) as GlyphFont | GlyphImage)
      .filter((glyph) => glyph)
  }

  get rectangleList(): TextRectangle[] {
    const { padding, spacing } = this.layout
    return this.glyphList.map((glyph) => {
      const isUnEmpty = !!(glyph.width && glyph.height)
      return {
        letter: glyph.letter,
        type: glyph.type,
        width: isUnEmpty ? glyph.width + padding * 2 + spacing : 0,
        height: isUnEmpty ? glyph.height + padding * 2 + spacing : 0,
        x: 0,
        y: 0,
      }
    })
  }

  getGlyph(letter: string) {
    const glyph = this.glyphImages.find(
      (glyph) => glyph.letter === letter && glyph.selected,
    )
    if (glyph) return glyph
    return this.glyphs.get(letter)
  }

  pack(): void {
    if (this.idleId) return
    if (this.worker) this.worker.terminate()
    this.isPacking = true
    const packList = this.rectangleList.sort((a, b) => b.height - a.height)
    if (!this.layout.auto) {
      const packer = new GuillotineBinPack<TextRectangle>(
        this.layout.width + this.layout.spacing,
        this.layout.height + this.layout.spacing,
      )

      const list = packList.filter(({ width, height }) => !!(width && height))

      packer.InsertSizes(list, true, 1, 1)

      this.setPack(packer.usedRectangles, list)

      this.isPacking = false
      return
    }
    this.worker = new AutoPacker()
    this.worker.addEventListener(
      'message',
      action('PackerWorkerCallback', (messageEvent) => {
        const { data } = messageEvent
        this.setPack(data)

        this.isPacking = false
        this.worker?.terminate()
        this.worker = null
      }),
      false,
    )

    this.worker.postMessage(
      packList.filter(({ width, height }) => !!(width && height)),
    )
  }

  setPack(list: TextRectangle[], failedList?: TextRectangle[]): void {
    const imgList = this.glyphImages
    let maxWidth = 0
    let maxHeight = 0
    const { auto, fixedSize, width, height, spacing } = this.layout

    list.forEach((rectangle) => {
      const { letter, x, y, type, width, height } = rectangle
      let glyph: GlyphFont | GlyphImage | undefined

      if (type === 'image') {
        glyph = imgList.find((gi) => {
          if (gi && gi.letter === letter) return true
          return false
        })
      }

      if (!glyph) {
        glyph = this.glyphs.get(letter)
      }

      if (glyph) {
        glyph.x = x || 0
        glyph.y = y || 0
      }

      maxWidth = Math.max(maxWidth, x + width)
      maxHeight = Math.max(maxHeight, y + height)
    })

    if (failedList?.length) {
      failedList.forEach((rectangle) => {
        const { letter, type } = rectangle
        let glyph: GlyphFont | GlyphImage | undefined

        if (type === 'image') {
          glyph = imgList.find((gi) => {
            if (gi && gi.letter === letter) return true
            return false
          })
        }

        if (!glyph) {
          glyph = this.glyphs.get(letter)
        }

        if (glyph) {
          glyph.x = 0
          glyph.y = 0
        }
      })
      this.ui.setPackFailed(true)
    } else {
      this.ui.setPackFailed(false)
    }

    if (!auto && fixedSize) {
      this.ui.setSize(width, height)
      return
    }

    this.ui.setSize(maxWidth - spacing, maxHeight - spacing)
  }

  packStyle(): void {
    this.isPacking = true
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }

    const { canvas, glyphs } = getFontGlyphs(Array.from(` ${this.text}`), {
      font: this.style.font,
      fill: this.style.fill,
      stroke: this.style.useStroke ? this.style.stroke : void 0,
      shadow: this.style.useShadow ? this.style.shadow : void 0,
    })

    Array.from(glyphs.values()).forEach((glyph) => {
      const g = this.glyphs.get(glyph.letter)
      if (g) g.setGlyphInfo(glyph)
    })
    this.setCanvas(canvas)
    this.throttlePack()
    // cancel(this.idleId)

    // const tasks: GlyphFont[] = []

    // this.glyphs.forEach((glyph) => {
    //   tasks.push(glyph)
    // })

    // const runTasks = () => {
    //   this.idleId = request((deadline) => {
    //     const tr = deadline.timeRemaining()
    //     const start = Date.now()
    //     while (tasks.length && tr - (Date.now() - start) > -100) {
    //       const glyph = tasks.shift()
    //       if (glyph) glyph.setGlyphInfo(this.style)
    //     }

    //     if (tasks.length) {
    //       runTasks()
    //     } else {
    //       this.idleId = 0
    //       this.pack()
    //     }
    //   })
    // }

    // runTasks()
  }

  throttlePack(): void {
    // if (this.idleId) return
    window.clearTimeout(this.packTimer)
    if (Date.now() - this.packStart > 500) {
      Promise.resolve().then(this.pack)
    } else {
      this.packTimer = window.setTimeout(() => {
        this.pack()
      }, 500)
    }
    this.packStart = Date.now()
  }

  addAutoRun(): void {
    const isName = (obj: { name?: unknown }, name: string): boolean =>
      !!(obj.name && obj.name === name)

    deepObserve(this.glyphImages, () => {
      this.throttlePack()
    })

    deepObserve(this.layout, () => {
      this.throttlePack()
    })

    deepObserve(this.style, (change, path, root) => {
      if (
        isName(change, 'bgColor') ||
        (path === 'font' &&
          !(
            isName(change, 'size') ||
            isName(change, 'fonts') ||
            isName(change, 'sharp')
          ))
      )
        return

      this.packStyle()
    })
  }

  setText(str: string): void {
    const oldText = this.text
    this.text = str.replace(/\s/gm, '')
    this.addGlyphs(oldText)
  }

  addGlyphs(oldText = ''): void {
    const currentList = Array.from(new Set(Array.from(this.text)))
    const oldList = Array.from(new Set(Array.from(oldText)))
    this.text = currentList.join('')
    currentList.unshift(' ')
    const diffList = oldText
      ? Array.from(new Set(currentList.concat(oldList))).filter(
          (t) => !(currentList.includes(t) && oldList.includes(t)),
        )
      : currentList

    if (!diffList.length) return

    diffList.forEach((letter) => {
      if (currentList.includes(letter)) {
        this.glyphs.set(letter, new GlyphFont({ letter }))
      } else {
        // in diff
        this.glyphs.delete(letter)
      }
    })
    this.packStyle()
  }

  addImages<T extends FileInfo>(list: T[]): void {
    Promise.all(
      list.map((img) => {
        const glyphImage = new GlyphImage(img)
        this.glyphImages.push(glyphImage)
        return glyphImage.initImage()
      }),
    ).then(this.pack)
  }

  removeImage(image: GlyphImage): void {
    const idx = this.glyphImages.indexOf(image)
    if (idx > -1) this.glyphImages.splice(idx, 1)
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.packCanvas = canvas
  }

  setName(name: string): void {
    this.name = name || this.name
  }
}

export default Project

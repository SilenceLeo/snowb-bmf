import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx'
import { deepObserve } from 'mobx-utils'
import getFontGlyphs from 'src/utils/getFontGlyphs'
import getFontGlyphsProgressive from 'src/utils/getFontGlyphsProgressive'
import { globalPerformanceMonitor } from 'src/utils/performanceMonitor'

import { GlyphType } from './base/glyphBase'
import GlyphFont from './base/glyphFont'
import GlyphImage, { FileInfo } from './base/glyphImage'
import Layout from './base/layout'
import Metric from './base/metric'
import Style from './base/style'
import Ui from './base/ui'
import { PackingEngine } from './packing'

interface TextRectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
  type: GlyphType
}

/**
 * Packing mode descriptions:
 *
 * 1. Auto packing mode (auto = true)
 *    - Ignores fixedSize and configured width/height
 *    - Uses auto packing algorithm (binary search for optimal size)
 *    - Result size is the actual occupied size calculated by algorithm
 *
 * 2. Fixed size mode (auto = false, fixedSize = true)
 *    - Uses fixed packing algorithm (GuillotineBinPack)
 *    - Packing container size is the configured width/height
 *    - Result size is always the configured width/height
 *
 * 3. Adaptive size mode (auto = false, fixedSize = false)
 *    - Uses fixed packing algorithm (GuillotineBinPack)
 *    - Packing container size is the configured width/height (as maximum limit)
 *    - Result size is the actual occupied size (not exceeding configured width/height)
 */
class Project {
  name = 'Unnamed'
  id!: number

  // Throttling control
  packStart = 0
  packTimer = 0

  // Packing state
  isPacking = false

  // Loading state
  isInitializing = false
  isRenderingGlyphs = false

  // Performance optimization
  glyphRenderingAbortController: AbortController | null = null
  packingAbortController: AbortController | null = null

  // Canvas
  sourceCanvas: HTMLCanvasElement | null = null
  packCanvases: HTMLCanvasElement[] = []

  // Core data
  text =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!№;%:?*()_+-=.,/|"\'@#$^&{}[]'
  glyphs: Map<string, GlyphFont> = new Map()
  glyphImages: GlyphImage[] = []

  // Style and configuration
  style!: Style
  layout!: Layout
  globalAdjustMetric!: Metric
  ui: Ui = new Ui()

  // Packing engine
  packingEngine: PackingEngine

  constructor(project: Partial<Project> = {}) {
    // Start performance monitoring
    globalPerformanceMonitor.start('project-initialization')

    makeObservable(this, {
      name: observable,
      isPacking: observable,
      isInitializing: observable,
      isRenderingGlyphs: observable,
      packStart: observable,
      packTimer: observable,
      sourceCanvas: observable,
      packCanvases: observable.shallow,
      text: observable,
      glyphs: observable.shallow,
      glyphImages: observable.shallow,
      style: observable.ref,
      layout: observable.ref,
      globalAdjustMetric: observable.ref,
      ui: observable.ref,
      glyphList: computed,
      rectangleList: computed,
      pack: action.bound,
      packStyle: action.bound,
      throttlePack: action.bound,
      setText: action.bound,
      addGlyphs: action.bound,
      addImages: action.bound,
      removeImage: action.bound,
      setCanvas: action.bound,
      setName: action.bound,
      processPackingResults: action.bound,
      generatePageCanvases: action.bound,
      assignGlyphPositions: action.bound,
      calculateAndSetDimensions: action.bound,
      handleFailedGlyphs: action.bound,
      updateUIState: action.bound,
      destroy: action.bound,
    })

    // Batch initialize all observable properties to reduce MobX transaction overhead
    runInAction(() => {
      this.isInitializing = true
      this.id = project.id || Date.now()
      this.name = project.name || 'Unnamed'
      this.text = project.text || this.text

      this.ui = new Ui(project.ui)
      this.style = new Style(project.style)
      this.layout = new Layout(project.layout)
      this.globalAdjustMetric = new Metric(project.globalAdjustMetric)

      // Batch initialize glyphs to avoid multiple runInAction calls
      if (project.glyphs) {
        project.glyphs.forEach((value, key) => {
          this.glyphs.set(key, new GlyphFont(value))
        })
      }

      // Batch initialize image glyphs
      if (project.glyphImages) {
        project.glyphImages.forEach((img) => {
          this.glyphImages.push(new GlyphImage(img))
        })
      }

      // Ensure space glyph exists
      if (!this.glyphs.has(' ')) {
        this.glyphs.set(' ', new GlyphFont({ letter: ' ' }))
      }
    })

    // Initialize packing engine (doesn't need to be in runInAction)
    this.packingEngine = new PackingEngine({
      maxConcurrentWorkers: Math.min(navigator.hardwareConcurrency || 4, 8),
      workerTimeout: 5000,
      enableSentry: true,
    })

    // Log initialization stats
    const glyphCount = this.glyphs.size
    const imageCount = this.glyphImages.length
    console.log(
      `🎨 Initializing project with ${glyphCount} glyphs and ${imageCount} images`,
    )

    // Delay time-consuming operations to avoid blocking initialization
    // Use requestIdleCallback for non-critical initialization
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        () => {
          this.addGlyphs(project.text || '')
          this.addAutoRun()
          // Delay initial packing to allow UI to render
          requestAnimationFrame(() => {
            this.pack()
          })

          // Initialization complete
          runInAction(() => {
            this.isInitializing = false
          })

          globalPerformanceMonitor.logTiming(
            'project-initialization',
            `${glyphCount} glyphs`,
          )
        },
        { timeout: 100 },
      )
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.addGlyphs(project.text || '')
        this.addAutoRun()
        setTimeout(() => this.pack(), 50)

        runInAction(() => {
          this.isInitializing = false
        })

        globalPerformanceMonitor.logTiming(
          'project-initialization',
          `${glyphCount} glyphs`,
        )
      }, 16)
    }
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
    if (glyph) {
      return glyph
    }
    return this.glyphs.get(letter)
  }

  /**
   * Execute packing
   */
  pack(): void {
    // Cancel current packing task and any abort controllers
    this.packingEngine.cancelPacking()

    if (this.packingAbortController) {
      this.packingAbortController.abort()
    }

    // Create new abort controller for this packing
    this.packingAbortController = new AbortController()

    runInAction(() => {
      this.isPacking = true
    })

    const packList = this.rectangleList.sort((a, b) => b.height - a.height)
    const validList = packList.filter(
      ({ width, height }) => !!(width && height),
    )

    // Validate page count
    const { page, auto, width, height, spacing } = this.layout
    const pageCount = Math.max(1, Math.floor(page || 1))

    console.log(
      `📦 Starting packing with ${validList.length} glyphs across ${pageCount} page(s)`,
    )

    // Reset all glyph page assignments before redistribution
    runInAction(() => {
      this.glyphList.forEach((glyph) => {
        glyph.page = -1 // Use -1 to indicate unassigned
      })
    })

    // Distribute glyphs to pages
    const pageGroups = this.distributeGlyphs(validList, pageCount)

    // Execute packing
    this.executePacking(pageGroups, { auto, width, height, spacing })
  }

  /**
   * Distribute glyphs to pages with improved balancing
   */
  private distributeGlyphs(
    glyphs: TextRectangle[],
    pageCount: number,
  ): TextRectangle[][] {
    // Validate page count
    const validPageCount = Math.max(1, Math.floor(pageCount))

    // Single page optimization: directly return all glyphs
    if (validPageCount === 1) {
      console.log(`📦 Single page: ${glyphs.length} glyphs`)
      return [glyphs]
    }

    // Multi-page distribution: use improved area balancing algorithm
    const pages: TextRectangle[][] = Array.from(
      { length: validPageCount },
      () => [],
    )
    const pageAreas = new Array(validPageCount).fill(0)
    const pageHeights = new Array(validPageCount).fill(0)

    // Sort by area (larger first) for better packing
    const sortedGlyphs = [...glyphs].sort((a, b) => {
      // First by height, then by area
      const heightDiff = b.height - a.height
      if (Math.abs(heightDiff) > 5) {
        return heightDiff
      }
      return b.width * b.height - a.width * a.height
    })

    // Distribute to page with smallest area, considering height as well
    sortedGlyphs.forEach((glyph) => {
      const glyphArea = glyph.width * glyph.height
      let bestPageIndex = 0
      let minScore = pageAreas[0] + pageHeights[0] * 0.5 // Weight height slightly

      for (let i = 1; i < validPageCount; i++) {
        const score = pageAreas[i] + pageHeights[i] * 0.5
        if (score < minScore) {
          minScore = score
          bestPageIndex = i
        }
      }

      pages[bestPageIndex].push(glyph)
      pageAreas[bestPageIndex] += glyphArea
      pageHeights[bestPageIndex] = Math.max(
        pageHeights[bestPageIndex],
        glyph.height,
      )
    })

    // Log distribution statistics
    pages.forEach((page, idx) => {
      console.log(
        `📦 Page ${idx + 1}: ${page.length} glyphs, area: ${pageAreas[idx]}`,
      )
    })

    return pages
  }

  /**
   * Execute packing process with better error handling
   */
  private async executePacking(
    pageGroups: TextRectangle[][],
    options: { auto: boolean; width: number; height: number; spacing: number },
  ): Promise<void> {
    try {
      // Check if cancelled before starting
      if (this.packingAbortController?.signal.aborted) {
        console.log('🛑 Packing cancelled before execution')
        return
      }

      const results = await this.packingEngine.startPacking(
        pageGroups,
        {
          auto: options.auto,
          width: options.width,
          height: options.height,
          spacing: options.spacing,
          padding: this.layout.padding,
          page: this.layout.page,
          fixedSize: this.layout.fixedSize,
        },
        (completed, total) => {
          if (completed === total) {
            console.log(`✅ Packing completed: ${completed}/${total} pages`)
          }
        },
      )

      // Check if cancelled after packing
      if (this.packingAbortController?.signal.aborted) {
        console.log('🛑 Packing cancelled after completion')
        return
      }

      // Convert result format and process
      const pageResults = results.map((result) => ({
        pageIndex: result.pageIndex,
        list: result.rectangles,
        maxWidth: result.width,
        maxHeight: result.height,
      }))

      this.processPackingResults(pageResults)

      runInAction(() => {
        this.isPacking = false
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('cancelled')) {
        console.log('🛑 Packing was cancelled')
      } else {
        console.error('❌ Packing failed:', error)
      }
      runInAction(() => {
        this.isPacking = false
      })
    }
  }

  /**
   * Process packing results
   */
  processPackingResults(
    pageResults: {
      pageIndex: number
      list: TextRectangle[]
      maxWidth: number
      maxHeight: number
    }[],
  ): void {
    this.assignGlyphPositions(pageResults)
    this.calculateAndSetDimensions(pageResults)
    this.generatePageCanvases(pageResults)
    this.handleFailedGlyphs(pageResults)
    this.updateUIState(pageResults)
  }

  /**
   * Set glyph positions and page assignments
   */
  assignGlyphPositions(
    pageResults: {
      pageIndex: number
      list: TextRectangle[]
      maxWidth: number
      maxHeight: number
    }[],
  ): void {
    const imgList = this.glyphImages

    pageResults.forEach(({ pageIndex, list }) => {
      list.forEach((rectangle) => {
        const { letter, x, y, type } = rectangle
        let glyph: GlyphFont | GlyphImage | undefined

        if (type === 'image') {
          glyph = imgList.find((gi) => gi && gi.letter === letter)
        }

        if (!glyph) {
          glyph = this.glyphs.get(letter)
        }

        if (glyph) {
          runInAction(() => {
            glyph.x = x || 0
            glyph.y = y || 0
            glyph.page = pageIndex
          })
        } else {
          console.warn(`⚠️ Could not find glyph for letter '${letter}'`)
        }
      })
    })
  }

  /**
   * Calculate and set dimensions
   *
   * Behavior for three modes:
   * 1. auto = true: Ignore fixedSize, use actual size calculated by auto packing algorithm
   * 2. auto = false, fixedSize = true: Use configured fixed width/height
   * 3. auto = false, fixedSize = false: Use fixed algorithm but adaptive size (actual occupied size)
   */
  calculateAndSetDimensions(
    pageResults: {
      pageIndex: number
      list: TextRectangle[]
      maxWidth: number
      maxHeight: number
    }[],
  ): void {
    const {
      auto,
      fixedSize,
      width: layoutWidth,
      height: layoutHeight,
    } = this.layout

    let globalMaxWidth = 0
    let globalMaxHeight = 0

    if (auto || !fixedSize) {
      // Mode 1 (auto=true) or Mode 3 (auto=false, fixedSize=false):
      // Calculate maximum size based on actual content
      pageResults.forEach(({ maxWidth, maxHeight }) => {
        globalMaxWidth = Math.max(globalMaxWidth, maxWidth)
        globalMaxHeight = Math.max(globalMaxHeight, maxHeight)
      })
    } else {
      // Mode 2 (auto=false, fixedSize=true):
      // Use fixed dimensions configured in layout
      globalMaxWidth = layoutWidth
      globalMaxHeight = layoutHeight
    }

    this.layout.setPackSize(globalMaxWidth, globalMaxHeight)
  }

  /**
   * Generate page canvases
   */
  generatePageCanvases(
    pageResults: {
      pageIndex: number
      list: TextRectangle[]
      maxWidth: number
      maxHeight: number
    }[],
  ): void {
    const { padding } = this.layout

    // Reset canvas array
    runInAction(() => {
      this.packCanvases = new Array(this.layout.page)
    })

    // Generate canvas for each page
    for (let pageIndex = 0; pageIndex < this.layout.page; pageIndex++) {
      const pageResult = pageResults.find((pr) => pr.pageIndex === pageIndex)
      const maxWidth = pageResult?.maxWidth || 0
      const maxHeight = pageResult?.maxHeight || 0
      const canvas = document.createElement('canvas')

      // Set canvas dimensions
      // Only use fixed size when auto=false and fixedSize=true
      if (!this.layout.auto && this.layout.fixedSize) {
        canvas.width = this.layout.width
        canvas.height = this.layout.height
      } else {
        // Use actual size when auto=true or (auto=false && fixedSize=false)
        canvas.width = Math.max(maxWidth, 1)
        canvas.height = Math.max(maxHeight, 1)
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        this.packCanvases[pageIndex] = canvas
        continue
      }

      // Fill background color if specified (non-transparent)
      if (this.style.bgColor) {
        ctx.fillStyle = this.style.bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Get glyphs for this page
      const pageGlyphs = this.glyphList.filter(
        (glyph) => glyph.page === pageIndex,
      )

      // Draw each glyph
      pageGlyphs.forEach((glyph) => {
        if (
          glyph instanceof GlyphImage &&
          glyph.source &&
          glyph.source.width !== 0 &&
          glyph.source.height !== 0
        ) {
          // Draw image glyph
          ctx.drawImage(
            glyph.source as HTMLCanvasElement,
            glyph.x + padding,
            glyph.y + padding,
          )
        } else if (glyph instanceof GlyphFont && this.sourceCanvas) {
          // Draw font glyph from source canvas
          ctx.drawImage(
            this.sourceCanvas,
            glyph.canvasX,
            glyph.canvasY,
            glyph.width,
            glyph.height,
            glyph.x + padding,
            glyph.y + padding,
            glyph.width,
            glyph.height,
          )
        }
      })

      runInAction(() => {
        this.packCanvases[pageIndex] = canvas
      })
    }

    console.log(`✅ Generated ${this.packCanvases.length} page canvases`)
  }

  /**
   * Handle failed glyphs
   */
  handleFailedGlyphs(
    pageResults: {
      pageIndex: number
      list: TextRectangle[]
      maxWidth: number
      maxHeight: number
    }[],
  ): void {
    // Find all successfully packed glyphs
    const packedLetters = new Set(
      pageResults.flatMap(({ list }) => list.map((rect) => rect.letter)),
    )

    // Reset positions of unpacked glyphs
    this.glyphList.forEach((glyph) => {
      if (!packedLetters.has(glyph.letter)) {
        runInAction(() => {
          glyph.x = 0
          glyph.y = 0
          glyph.page = 0
        })
      }
    })
  }

  /**
   * Update UI state
   */
  updateUIState(
    pageResults: {
      pageIndex: number
      list: TextRectangle[]
      maxWidth: number
      maxHeight: number
    }[],
  ): void {
    // Calculate grid size
    const pageCount = this.layout.page
    const cols = Math.ceil(Math.sqrt(pageCount))
    const rows = Math.ceil(pageCount / cols)
    const spacing = 20
    const gridWidth = cols * this.layout.packWidth + (cols - 1) * spacing
    const gridHeight = rows * this.layout.packHeight + (rows - 1) * spacing

    this.ui.setSize(gridWidth, gridHeight)

    // Check packing failure
    const failedPages = pageResults.filter(({ list }) => list.length === 0)
    const hasFailed = failedPages.length > 0

    if (hasFailed) {
      console.warn(
        `⚠️ Packing failed for ${failedPages.length} page(s): ${failedPages.map((p) => p.pageIndex).join(', ')}`,
      )
    }

    this.ui.setPackFailed(hasFailed)
  }

  /**
   * Pack style (regenerate glyphs)
   * Optimization: batch update glyph information to reduce individual action calls
   */
  async packStyle(): Promise<void> {
    // Cancel any existing glyph rendering
    if (this.glyphRenderingAbortController) {
      this.glyphRenderingAbortController.abort()
    }

    // Create new abort controller for this rendering
    this.glyphRenderingAbortController = new AbortController()
    const signal = this.glyphRenderingAbortController.signal

    runInAction(() => {
      this.isRenderingGlyphs = true
    })

    // Cancel current packing task
    this.packingEngine.cancelPacking()

    try {
      const glyphText = Array.from(` ${this.text}`)
      const totalGlyphs = glyphText.length

      // Use progressive rendering for large glyph sets
      const useProgressive = totalGlyphs > 500

      if (useProgressive) {
        console.log(`🎨 Rendering ${totalGlyphs} glyphs progressively...`)

        const { canvas, glyphs } = await getFontGlyphsProgressive(
          glyphText,
          {
            font: this.style.font,
            fill: this.style.fill,
            stroke: this.style.useStroke ? this.style.stroke : void 0,
            shadow: this.style.useShadow ? this.style.shadow : void 0,
          },
          {
            batchSize: Math.min(100, Math.ceil(totalGlyphs / 20)),
            signal,
            onProgress: (completed, total) => {
              if (completed % 100 === 0 || completed === total) {
                console.log(
                  `🎨 Glyph rendering progress: ${completed}/${total}`,
                )
              }
            },
          },
        )

        // Check if cancelled
        if (signal.aborted) {
          console.log('🛑 Glyph rendering cancelled')
          return
        }

        // Batch update all glyph information
        runInAction(() => {
          Array.from(glyphs.values()).forEach((glyph) => {
            const g = this.glyphs.get(glyph.letter)
            if (g) {
              g.setGlyphInfo(glyph)
            }
          })

          // Save source canvas
          this.sourceCanvas = canvas
        })
      } else {
        // Use synchronous rendering for small glyph sets
        const { canvas, glyphs } = getFontGlyphs(glyphText, {
          font: this.style.font,
          fill: this.style.fill,
          stroke: this.style.useStroke ? this.style.stroke : void 0,
          shadow: this.style.useShadow ? this.style.shadow : void 0,
        })

        // Batch update all glyph information
        runInAction(() => {
          Array.from(glyphs.values()).forEach((glyph) => {
            const g = this.glyphs.get(glyph.letter)
            if (g) {
              g.setGlyphInfo(glyph)
            }
          })

          // Save source canvas
          this.sourceCanvas = canvas
        })
      }

      this.throttlePack()
    } catch (error) {
      if (error instanceof Error && error.message.includes('cancelled')) {
        console.log('🛑 Glyph rendering was cancelled')
      } else {
        console.error('Failed to render glyphs:', error)
      }
    } finally {
      runInAction(() => {
        this.isRenderingGlyphs = false
      })
    }
  }

  /**
   * Throttled packing
   */
  throttlePack(): void {
    window.clearTimeout(this.packTimer)
    if (Date.now() - this.packStart > 500) {
      Promise.resolve().then(this.pack)
    } else {
      runInAction(() => {
        this.packTimer = window.setTimeout(() => {
          this.pack()
        }, 500)
      })
    }
    runInAction(() => {
      this.packStart = Date.now()
    })
  }

  /**
   * Add auto-run listeners
   * Optimization: use reaction instead of deepObserve to reduce listening overhead
   */
  addAutoRun(): void {
    const isName = (obj: { name?: unknown }, name: string): boolean =>
      !!(obj.name && obj.name === name)

    // Listen to image glyph changes - only monitor specific properties that affect packing
    reaction(
      () => [
        // Monitor array length (add/remove images)
        this.glyphImages.length,
        // Monitor selected state of each image
        ...this.glyphImages.map((img) => img.selected),
        // Monitor letter mapping of each image
        ...this.glyphImages.map((img) => img.letter),
      ],
      () => {
        this.throttlePack()
      },
    )

    // Optimization: use more precise listening instead of deepObserve
    // Listen to layout-related property changes
    deepObserve(this.layout, (change) => {
      if (isName(change, 'packWidth') || isName(change, 'packHeight')) {
        return
      }
      this.throttlePack()
    })

    // Optimization: separate style listening to reduce unnecessary checks
    deepObserve(this.style, (change, path, _root) => {
      // Background color changes don't require regenerating glyphs
      // but do need to regenerate pack canvases with new background
      if (isName(change, 'bgColor')) {
        this.throttlePack()
        return
      }

      // Font-related changes require regenerating glyphs
      if (path === 'font') {
        if (
          isName(change, 'size') ||
          isName(change, 'fonts') ||
          isName(change, 'sharp')
        ) {
          // Only these property changes require regenerating glyphs
          this.packStyle()
        }
      } else {
        // Other style changes (fill, stroke, shadow, etc.) also require regenerating glyphs
        this.packStyle()
      }
    })
  }

  /**
   * Set text
   */
  setText(str: string): void {
    const oldText = this.text
    runInAction(() => {
      this.text = str.replace(/\s/gm, '')
    })
    this.addGlyphs(oldText)
  }

  /**
   * Add glyphs
   */
  addGlyphs(oldText = ''): void {
    const currentList = Array.from(new Set(Array.from(this.text)))
    const oldList = Array.from(new Set(Array.from(oldText)))
    runInAction(() => {
      this.text = currentList.join('')
    })
    currentList.unshift(' ')
    const diffList = oldText
      ? Array.from(new Set(currentList.concat(oldList))).filter(
          (t) => !(currentList.includes(t) && oldList.includes(t)),
        )
      : currentList

    if (!diffList.length) {
      return
    }

    runInAction(() => {
      diffList.forEach((letter) => {
        if (currentList.includes(letter)) {
          this.glyphs.set(letter, new GlyphFont({ letter }))
        } else {
          this.glyphs.delete(letter)
        }
      })
    })
    this.packStyle()
  }

  /**
   * Add images
   */
  addImages<T extends FileInfo>(list: T[]): void {
    Promise.all(
      list.map((img) => {
        const glyphImage = new GlyphImage(img)
        runInAction(() => {
          this.glyphImages.push(glyphImage)
        })
        return glyphImage.initImage()
      }),
    ).then(this.pack)
  }

  /**
   * Remove image
   */
  removeImage(image: GlyphImage): void {
    const idx = this.glyphImages.indexOf(image)
    if (idx > -1) {
      runInAction(() => {
        this.glyphImages.splice(idx, 1)
      })
    }
  }

  /**
   * Set source canvas
   * @deprecated Directly set sourceCanvas in runInAction
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    runInAction(() => {
      this.sourceCanvas = canvas
    })
  }

  /**
   * Set project name
   */
  setName(name: string): void {
    runInAction(() => {
      this.name = name || this.name
    })
  }

  /**
   * Destroy project and release resources
   */
  destroy(): void {
    // Cancel packing task
    this.packingEngine.cancelPacking()

    // Clean up timers
    if (this.packTimer) {
      window.clearTimeout(this.packTimer)
      runInAction(() => {
        this.packTimer = 0
      })
    }

    // Destroy packing engine
    this.packingEngine.destroy()

    // Clean up resources
    runInAction(() => {
      this.glyphs.clear()
      this.glyphImages.length = 0
      this.packCanvases = []
      this.sourceCanvas = null
    })
  }
}

export default Project

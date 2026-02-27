import type { Font as OpenType } from 'opentype.js'
import type { GlyphRenderConfig } from 'src/types/style'
import { PackingEngine } from 'src/utils/PackingEngine'
import { isCancelError } from 'src/utils/concurrency'
import getFontGlyphs from 'src/utils/getFontGlyphs'
import getFontGlyphsProgressive from 'src/utils/getFontGlyphsProgressive'

import { DEBUG_CONFIG, PERFORMANCE_THRESHOLDS } from '../config'
import {
  batchUpdateGlyphInfo,
  batchUpdateGlyphPositions,
  getGlyphForLetter,
  getGlyphList,
  getRectangleList,
  getSourceCanvas,
  resetFailedGlyphPositions,
  resetGlyphPages,
  setPackCanvases,
  setPackingState,
  setRenderingState,
  setSourceCanvas,
} from '../glyphStore'
import {
  clearPackTimer,
  getPackLastExecuteTime,
  getPackTimer,
  getProjectText,
  setPackLastExecuteTime,
  setPackTimer,
} from '../projectStore'
import {
  getPackingParams,
  layoutStore$,
  setPackSize,
} from '../stores/layoutStore'
import {
  type FillData,
  type FontData,
  type FontResource,
  type ShadowData,
  type StrokeData,
  getFontFamily,
  getMainFont,
  styleStore$,
} from '../stores/styleStore'
import { getPatternImage } from '../stores/styleSetterFactory'
import { setPackFailed, setSize } from '../stores/uiStore'
import type { GlyphInfoUpdate, ImageGlyphData, TextRectangle } from '../types'

let packingEngine: PackingEngine | null = null
let packingAbortController: AbortController | null = null
let glyphRenderingAbortController: AbortController | null = null

export function initPackingEngine(): void {
  if (!packingEngine) {
    packingEngine = new PackingEngine({
      maxConcurrentWorkers: Math.min(navigator.hardwareConcurrency || 4, 8),
      enableSentry: true,
    })
  }
}

function getPackingEngine(): PackingEngine {
  if (!packingEngine) {
    initPackingEngine()
  }
  return packingEngine!
}

export function destroyPackingEngine(): void {
  if (packingEngine) {
    packingEngine.cancelPacking()
    packingEngine.destroy()
    packingEngine = null
  }

  if (packingAbortController) {
    packingAbortController.abort()
    packingAbortController = null
  }

  if (glyphRenderingAbortController) {
    glyphRenderingAbortController.abort()
    glyphRenderingAbortController = null
  }
}

export function pack(): void {
  const engine = getPackingEngine()

  engine.cancelPacking()

  if (packingAbortController) {
    packingAbortController.abort()
  }

  packingAbortController = new AbortController()
  setPackingState(true)

  const { page, auto, width, height, spacing, padding, fixedSize } =
    getPackingParams()
  const text = getProjectText()

  const rectangleList = getRectangleList(text, padding, spacing)
  const validList = rectangleList
    .filter(({ width, height }) => !!(width && height))
    .sort((a, b) => b.height - a.height)

  const pageCount = Math.max(1, Math.floor(page || 1))

  if (DEBUG_CONFIG.logBatchUpdates) {
    console.log(
      `[Packing] Starting with ${validList.length} glyphs across ${pageCount} page(s)`,
    )
  }

  resetGlyphPages()

  const pageGroups = distributeGlyphs(validList, pageCount)
  executePacking(pageGroups, {
    auto,
    width,
    height,
    spacing,
    padding,
    page,
    fixedSize,
  })
}

function distributeGlyphs(
  glyphs: TextRectangle[],
  pageCount: number,
): TextRectangle[][] {
  const validPageCount = Math.max(1, Math.floor(pageCount))

  if (validPageCount === 1) {
    if (DEBUG_CONFIG.logBatchUpdates) {
      console.log(`[Packing] Single page: ${glyphs.length} glyphs`)
    }
    return [glyphs]
  }

  const pages: TextRectangle[][] = Array.from(
    { length: validPageCount },
    () => [],
  )
  const pageAreas = new Array(validPageCount).fill(0)
  const pageHeights = new Array(validPageCount).fill(0)

  const sortedGlyphs = [...glyphs].sort((a, b) => {
    // First by height, then by area
    const heightDiff = b.height - a.height
    if (Math.abs(heightDiff) > 5) {
      return heightDiff
    }
    return b.width * b.height - a.width * a.height
  })

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

  if (DEBUG_CONFIG.logBatchUpdates) {
    pages.forEach((page, idx) => {
      console.log(
        `[Packing] Page ${idx + 1}: ${page.length} glyphs, area: ${pageAreas[idx]}`,
      )
    })
  }

  return pages
}

async function executePacking(
  pageGroups: TextRectangle[][],
  options: {
    auto: boolean
    width: number
    height: number
    spacing: number
    padding: number
    page: number
    fixedSize: boolean
  },
): Promise<void> {
  const engine = getPackingEngine()

  try {
    if (packingAbortController?.signal.aborted) {
      return
    }

    const results = await engine.startPacking(
      pageGroups,
      {
        auto: options.auto,
        width: options.width,
        height: options.height,
        spacing: options.spacing,
        padding: options.padding,
        page: options.page,
        fixedSize: options.fixedSize,
      },
      undefined,
    )

    if (packingAbortController?.signal.aborted) {
      return
    }

    const pageResults = results.map((result) => ({
      pageIndex: result.pageIndex,
      list: result.rectangles,
      maxWidth: result.width,
      maxHeight: result.height,
    }))

    processPackingResults(pageResults, options)

    setPackingState(false)
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('[Packing] Failed:', error)
    }
    setPackingState(false)
  }
}

function processPackingResults(
  pageResults: {
    pageIndex: number
    list: TextRectangle[]
    maxWidth: number
    maxHeight: number
  }[],
  options: { auto: boolean; fixedSize: boolean; page: number },
): void {
  assignGlyphPositions(pageResults)
  calculateAndSetDimensions(pageResults, options)
  generatePageCanvases(pageResults, options.page)
  handleFailedGlyphs(pageResults)
  updateUIState(pageResults, options.page)
}

function assignGlyphPositions(
  pageResults: {
    pageIndex: number
    list: TextRectangle[]
    maxWidth: number
    maxHeight: number
  }[],
): void {
  const updates = pageResults.flatMap(({ pageIndex, list }) =>
    list.map((rectangle) => ({
      letter: rectangle.letter,
      x: rectangle.x ?? 0,
      y: rectangle.y ?? 0,
      page: pageIndex,
      type: rectangle.type,
      uid: rectangle.uid,
    })),
  )

  batchUpdateGlyphPositions(updates)

  const missingGlyphs: string[] = []
  updates.forEach(({ letter }) => {
    const glyph = getGlyphForLetter(letter)
    if (!glyph) {
      missingGlyphs.push(letter)
    }
  })

  if (missingGlyphs.length > 0 && DEBUG_CONFIG.logBatchUpdates) {
    console.warn(
      `[Packing] Could not find glyphs for letters: ${missingGlyphs.join(', ')}`,
    )
  }
}

function calculateAndSetDimensions(
  pageResults: {
    pageIndex: number
    list: TextRectangle[]
    maxWidth: number
    maxHeight: number
  }[],
  options: { auto: boolean; fixedSize: boolean },
): void {
  const layout = layoutStore$.layout.get()
  const { auto, fixedSize } = options

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
    globalMaxWidth = layout.width
    globalMaxHeight = layout.height
  }

  setPackSize(globalMaxWidth, globalMaxHeight)
}

function generatePageCanvases(
  pageResults: {
    pageIndex: number
    list: TextRectangle[]
    maxWidth: number
    maxHeight: number
  }[],
  pageCount: number,
): void {
  const layout = layoutStore$.layout.get()
  const style = styleStore$.style.get()
  const sourceCanvas = getSourceCanvas()
  const { padding } = layout
  const text = getProjectText()

  const canvases: HTMLCanvasElement[] = []

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const pageResult = pageResults.find((pr) => pr.pageIndex === pageIndex)
    const maxWidth = pageResult?.maxWidth || 0
    const maxHeight = pageResult?.maxHeight || 0
    const canvas = document.createElement('canvas')

    if (!layout.auto && layout.fixedSize) {
      canvas.width = layout.width
      canvas.height = layout.height
    } else {
      canvas.width = Math.max(maxWidth, 1)
      canvas.height = Math.max(maxHeight, 1)
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      canvases[pageIndex] = canvas
      continue
    }

    if (style.bgColor) {
      ctx.fillStyle = style.bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const glyphList = getGlyphList(text)
    const pageGlyphs = glyphList.filter((glyph) => glyph.page === pageIndex)

    pageGlyphs.forEach((glyph) => {
      if (glyph.type === 'image') {
        // Use glyph directly — it's already the correct ImageGlyphData
        // from getGlyphList → getGlyphForLetter → findImageGlyph
        const source = (glyph as ImageGlyphData).source
        if (source && glyph.width > 0 && glyph.height > 0) {
          ctx.drawImage(
            source as HTMLCanvasElement,
            glyph.x + padding,
            glyph.y + padding,
          )
        }
      } else if (sourceCanvas && glyph.canvasX !== undefined) {
        ctx.drawImage(
          sourceCanvas,
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

    canvases[pageIndex] = canvas
  }

  setPackCanvases(canvases)

  if (DEBUG_CONFIG.logBatchUpdates) {
    console.log(`[Packing] Generated ${canvases.length} page canvases`)
  }
}

function handleFailedGlyphs(
  pageResults: {
    pageIndex: number
    list: TextRectangle[]
    maxWidth: number
    maxHeight: number
  }[],
): void {
  const packedLetters = new Set(
    pageResults.flatMap(({ list }) => list.map((rect) => rect.letter)),
  )
  resetFailedGlyphPositions(packedLetters)
}

function updateUIState(
  pageResults: {
    pageIndex: number
    list: TextRectangle[]
    maxWidth: number
    maxHeight: number
  }[],
  pageCount: number,
): void {
  const layout = layoutStore$.layout.get()

  const cols = Math.ceil(Math.sqrt(pageCount))
  const rows = Math.ceil(pageCount / cols)
  const spacing = 20
  const gridWidth = cols * layout.packWidth + (cols - 1) * spacing
  const gridHeight = rows * layout.packHeight + (rows - 1) * spacing

  setSize(gridWidth, gridHeight)

  const failedPages = pageResults.filter(({ list }) => list.length === 0)
  const hasFailed = failedPages.length > 0

  if (hasFailed && DEBUG_CONFIG.logBatchUpdates) {
    console.warn(
      `[Packing] Failed for ${failedPages.length} page(s): ${failedPages.map((p) => p.pageIndex).join(', ')}`,
    )
  }

  setPackFailed(hasFailed)
}

// ============================================================================
// Pack Style (Regenerate Glyphs)
interface StyleConfig {
  font: FontData & {
    mainFont: FontResource | null
    mainFamily: string
    opentype: OpenType | null
    family: string
    minBaseLine: number
    maxBaseLine: number
  }
  fill: FillData
  stroke: StrokeData | undefined
  shadow: ShadowData | undefined
}

function createStyleConfig(): StyleConfig {
  const style = styleStore$.style.get()
  const mainFont = getMainFont()

  const fontConfig = {
    ...style.font,
    mainFont,
    mainFamily: mainFont ? mainFont.family : 'sans-serif',
    opentype: mainFont ? mainFont.opentype : null,
    family: getFontFamily(),
    minBaseLine: Math.min(
      style.font.middle,
      style.font.hanging,
      style.font.top,
      style.font.alphabetic,
      style.font.ideographic,
      style.font.bottom,
    ),
    maxBaseLine: Math.max(
      style.font.middle,
      style.font.hanging,
      style.font.top,
      style.font.alphabetic,
      style.font.ideographic,
      style.font.bottom,
    ),
  }

  return {
    font: fontConfig,
    fill: style.fill,
    stroke: style.useStroke ? style.stroke : undefined,
    shadow: style.useShadow ? style.shadow : undefined,
  }
}

/**
 * Convert internal StyleConfig to the GlyphRenderConfig expected by
 * getFontGlyphs / getFontGlyphsProgressive, avoiding double type assertions.
 */
function toGlyphRenderConfig(config: StyleConfig): GlyphRenderConfig {
  return {
    font: {
      ...config.font,
      fonts: config.font.mainFont ? [config.font.mainFont] : [],
    },
    fill: {
      ...config.fill,
      patternImage: getPatternImage('fill'),
    },
    stroke: config.stroke
      ? {
          ...config.stroke,
          patternImage: getPatternImage('stroke'),
        }
      : undefined,
    shadow: config.shadow,
  }
}

function toGlyphInfoUpdates(
  glyphs: Map<
    string,
    {
      letter: string
      width: number
      height: number
      fontWidth: number
      fontHeight: number
      trimOffsetTop: number
      trimOffsetLeft: number
      canvasX: number
      canvasY: number
    }
  >,
): GlyphInfoUpdate[] {
  return Array.from(glyphs.values()).map((glyph) => ({
    letter: glyph.letter,
    width: glyph.width,
    height: glyph.height,
    fontWidth: glyph.fontWidth,
    fontHeight: glyph.fontHeight,
    trimOffsetTop: glyph.trimOffsetTop,
    trimOffsetLeft: glyph.trimOffsetLeft,
    canvasX: glyph.canvasX,
    canvasY: glyph.canvasY,
  }))
}

export async function packStyle(): Promise<void> {
  if (glyphRenderingAbortController) {
    glyphRenderingAbortController.abort()
  }

  glyphRenderingAbortController = new AbortController()
  const signal = glyphRenderingAbortController.signal

  setRenderingState(true)
  getPackingEngine().cancelPacking()

  try {
    const text = getProjectText()
    const glyphText = Array.from(new Set(` ${text}`))
    const totalGlyphs = glyphText.length
    const useProgressive = totalGlyphs > PERFORMANCE_THRESHOLDS.PROGRESSIVE_THRESHOLD

    const styleOptions = toGlyphRenderConfig(createStyleConfig())

    let canvas: HTMLCanvasElement
    let glyphs: Map<string, any>

    if (useProgressive) {
      if (DEBUG_CONFIG.logBatchUpdates) {
        console.log(`[Packing] Rendering ${totalGlyphs} glyphs progressively`)
      }

      const result = await getFontGlyphsProgressive(glyphText, styleOptions, {
        batchSize: Math.min(PERFORMANCE_THRESHOLDS.BATCH_SIZE, Math.ceil(totalGlyphs / 20)),
        signal,
        onProgress: DEBUG_CONFIG.logBatchUpdates
          ? (completed, total) => {
              if (completed % PERFORMANCE_THRESHOLDS.BATCH_SIZE === 0 || completed === total) {
                console.log(`[Packing] Glyph rendering: ${completed}/${total}`)
              }
            }
          : undefined,
      })

      if (signal.aborted) {
        return
      }

      canvas = result.canvas
      glyphs = result.glyphs
    } else {
      const result = getFontGlyphs(glyphText, styleOptions)
      canvas = result.canvas
      glyphs = result.glyphs
    }

    batchUpdateGlyphInfo(toGlyphInfoUpdates(glyphs))
    setSourceCanvas(canvas)
    throttlePack()
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('[Packing] Failed to render glyphs:', error)
    }
  } finally {
    setRenderingState(false)
  }
}

const THROTTLE_INTERVAL = 300
const DEBOUNCE_DELAY = 200

export function throttlePack(): void {
  const currentTimer = getPackTimer()
  if (currentTimer) {
    window.clearTimeout(currentTimer)
  }

  const elapsed = Date.now() - getPackLastExecuteTime()

  if (elapsed >= THROTTLE_INTERVAL) {
    // Enough time since last execution, fire immediately (via setTimeout(0) for batch propagation)
    const timer = window.setTimeout(() => {
      setPackLastExecuteTime(Date.now())
      pack()
    }, 0)
    setPackTimer(timer)
  } else {
    // Trailing debounce ensures the last change in a burst also triggers pack
    const timer = window.setTimeout(() => {
      setPackLastExecuteTime(Date.now())
      pack()
    }, DEBOUNCE_DELAY)
    setPackTimer(timer)
  }
  // Key fix: do NOT reset lastExecuteTime here - only update when pack() actually runs
}

export function cancelAllOperations(): void {
  clearPackTimer()

  if (packingAbortController) {
    packingAbortController.abort()
    packingAbortController = null
  }

  if (glyphRenderingAbortController) {
    glyphRenderingAbortController.abort()
    glyphRenderingAbortController = null
  }

  if (packingEngine) {
    packingEngine.cancelPacking()
  }

  setPackingState(false)
  setRenderingState(false)
}

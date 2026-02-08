import { observe } from '@legendapp/state'
import type { ExportGlyphData, ExportProjectData } from 'src/file/export/type'

import { getGlyphList, glyphStore$, resetGlyphStore } from '../glyphStore'
import {
  DEFAULT_PROJECT_TEXT,
  clearPackTimer,
  projectStore$,
  setCurrentProject,
  setInitializing,
  setProjectName as setProjectStoreName,
} from '../projectStore'
import { layoutStore$ } from '../stores/layoutStore'
import { getMainFamily, getOpentype, styleStore$ } from '../stores/styleStore'
import { uiStore$ } from '../stores/uiStore'
import {
  clearAllImageGlyphs,
  ensureSpaceGlyph,
  initializeGlyphsFromText,
} from './glyphActions'
import {
  cancelAllOperations,
  destroyPackingEngine,
  initPackingEngine,
  packStyle,
  throttlePack,
} from './packingActions'

export interface ProjectInitData {
  id?: number
  name?: string
  text?: string
}

let cleanupFunctions: Array<() => void> = []

export async function initializeProject(
  projectData: ProjectInitData = {},
): Promise<void> {
  console.log('[Project] Initializing...')

  setInitializing(true)

  try {
    // Cancel any pending operations
    cancelAllOperations()

    // Initialize packing engine
    initPackingEngine()

    // Set project info
    const id = projectData.id || Date.now()
    const name = projectData.name || 'Unnamed'
    const text = projectData.text || DEFAULT_PROJECT_TEXT

    setCurrentProject({ id, name, text })

    // Initialize glyphs
    initializeGlyphsFromText(text)
    ensureSpaceGlyph()

    // Use requestIdleCallback for non-blocking initialization
    // Note: setupAutoRunListeners() is deferred until after the initial pack
    // completes to prevent auto-run triggers during initialization from causing
    // redundant packing operations.
    const currentProjectId = id
    const finalizePack = async () => {
      // Guard: skip if project has switched before callback fires
      if (projectStore$.current.id.get() !== currentProjectId) return
      await packStyle()
      // Re-check after async operation
      if (projectStore$.current.id.get() !== currentProjectId) return
      // Setup auto-run listeners after initial pack to avoid race conditions
      setupAutoRunListeners()
      setInitializing(false)
      console.log('[Project] Initialization complete')
    }

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => finalizePack(), { timeout: 100 })
    } else {
      setTimeout(() => finalizePack(), 16)
    }
  } catch (error) {
    console.error('[Project] Initialization failed:', error)
    setInitializing(false)
    throw error
  }
}

export async function initializeProjectFromData(data: {
  id: number
  name: string
  text: string
  // Additional data can be passed for style, layout, glyphs, etc.
}): Promise<void> {
  console.log(`[Project] Loading: ${data.name}`)

  setInitializing(true)

  try {
    // Cancel any pending operations
    cancelAllOperations()

    // Initialize packing engine
    initPackingEngine()

    // Set project info
    setCurrentProject({
      id: data.id,
      name: data.name,
      text: data.text,
    })

    // Initialize glyphs from text
    initializeGlyphsFromText(data.text)
    ensureSpaceGlyph()

    // Setup auto-run listeners
    setupAutoRunListeners()

    // Initial packing
    await packStyle()

    setInitializing(false)
    console.log('[Project] Loaded successfully')
  } catch (error) {
    console.error('[Project] Loading failed:', error)
    setInitializing(false)
    throw error
  }
}

let layoutDebounceTimer: ReturnType<typeof setTimeout> | null = null
let styleDebounceTimer: ReturnType<typeof setTimeout> | null = null

export function setupAutoRunListeners(): void {
  cleanupListeners()

  // Image glyph changes - triggers packing
  let prevImageSignature = ''
  const unsubscribeImageGlyphs = observe(() => {
    // Monitor array length and selection states
    const imageGlyphs = glyphStore$.imageGlyphs.get()
    const selectionSignature = imageGlyphs
      .map((img) => `${img.letter}:${img.selected}`)
      .join(',')

    const signature = `${imageGlyphs.length}|${selectionSignature}`
    if (prevImageSignature && prevImageSignature !== signature) {
      throttlePack()
    }
    prevImageSignature = signature
  })

  // Layout changes (excluding packWidth/packHeight output values)
  const unsubscribePadding = layoutStore$.layout.padding.onChange(() => {
    debouncedLayoutChange()
  })

  const unsubscribeSpacing = layoutStore$.layout.spacing.onChange(() => {
    debouncedLayoutChange()
  })

  const unsubscribeWidth = layoutStore$.layout.width.onChange(() => {
    debouncedLayoutChange()
  })

  const unsubscribeHeight = layoutStore$.layout.height.onChange(() => {
    debouncedLayoutChange()
  })

  const unsubscribeAuto = layoutStore$.layout.auto.onChange(() => {
    debouncedLayoutChange()
  })

  const unsubscribeFixedSize = layoutStore$.layout.fixedSize.onChange(() => {
    debouncedLayoutChange()
  })

  const unsubscribePage = layoutStore$.layout.page.onChange(() => {
    debouncedLayoutChange()
  })

  // Background color changes - re-packing only
  const unsubscribeBgColor = styleStore$.style.bgColor.onChange(() => {
    throttlePack()
  })

  // Font changes - requires glyph regeneration
  const unsubscribeFontSize = styleStore$.style.font.size.onChange(() => {
    debouncedStyleChange()
  })

  const unsubscribeFontFonts = styleStore$.style.font.fonts.onChange(() => {
    debouncedStyleChange()
  })

  const unsubscribeFontSharp = styleStore$.style.font.sharp.onChange(() => {
    debouncedStyleChange()
  })

  // Fill changes - requires glyph regeneration
  const unsubscribeFill = styleStore$.style.fill.onChange(() => {
    debouncedStyleChange()
  })

  // Stroke changes - requires glyph regeneration
  const unsubscribeStroke = styleStore$.style.stroke.onChange(() => {
    debouncedStyleChange()
  })

  const unsubscribeUseStroke = styleStore$.style.useStroke.onChange(() => {
    debouncedStyleChange()
  })

  // Shadow changes - requires glyph regeneration
  const unsubscribeShadow = styleStore$.style.shadow.onChange(() => {
    debouncedStyleChange()
  })

  const unsubscribeUseShadow = styleStore$.style.useShadow.onChange(() => {
    debouncedStyleChange()
  })

  cleanupFunctions = [
    unsubscribeImageGlyphs,
    unsubscribePadding,
    unsubscribeSpacing,
    unsubscribeWidth,
    unsubscribeHeight,
    unsubscribeAuto,
    unsubscribeFixedSize,
    unsubscribePage,
    unsubscribeBgColor,
    unsubscribeFontSize,
    unsubscribeFontFonts,
    unsubscribeFontSharp,
    unsubscribeFill,
    unsubscribeStroke,
    unsubscribeUseStroke,
    unsubscribeShadow,
    unsubscribeUseShadow,
  ]

  console.log('[Project] Auto-run listeners setup complete')
}

function debouncedLayoutChange(): void {
  if (layoutDebounceTimer) {
    clearTimeout(layoutDebounceTimer)
  }
  layoutDebounceTimer = setTimeout(() => {
    throttlePack()
    layoutDebounceTimer = null
  }, 50)
}

function debouncedStyleChange(): void {
  if (styleDebounceTimer) {
    clearTimeout(styleDebounceTimer)
  }
  styleDebounceTimer = setTimeout(() => {
    packStyle()
    styleDebounceTimer = null
  }, 50)
}

export function cleanupListeners(): void {
  cleanupFunctions.forEach((cleanup) => cleanup())
  cleanupFunctions = []
}

// ============================================================================
// Project Management
// ============================================================================

/**
 * Set project name
 */
export function setProjectName(name: string): void {
  if (name) {
    setProjectStoreName(name)
  }
}

export function getProjectName(): string {
  return projectStore$.current.name.get()
}

export function getProjectId(): number {
  return projectStore$.current.id.get()
}

export { setText } from './glyphActions'

export function destroyProject(): void {
  console.log('[Project] Destroying...')

  cancelAllOperations()
  clearPackTimer()
  cleanupListeners()
  destroyPackingEngine()
  clearAllImageGlyphs()
  resetGlyphStore()

  console.log('[Project] Destroyed')
}

export function resetProject(): void {
  console.log('[Project] Resetting...')

  cancelAllOperations()
  clearAllImageGlyphs()
  resetGlyphStore()

  setCurrentProject({
    id: Date.now(),
    name: 'Unnamed',
    text: DEFAULT_PROJECT_TEXT,
  })

  initializeGlyphsFromText(DEFAULT_PROJECT_TEXT)
  ensureSpaceGlyph()
  packStyle()

  console.log('[Project] Reset complete')
}

export function isProjectInitializing(): boolean {
  return projectStore$.initialization.isInitializing.get()
}

export function isProjectPacking(): boolean {
  return glyphStore$.packing.isPacking.get()
}

export function isRenderingGlyphs(): boolean {
  return glyphStore$.packing.isRenderingGlyphs.get()
}

export function getProjectSnapshot(): {
  id: number
  name: string
  text: string
} {
  return {
    id: projectStore$.current.id.get(),
    name: projectStore$.current.name.get(),
    text: projectStore$.current.text.get(),
  }
}

/**
 * Collect all necessary data from Legend State stores
 * in a format compatible with export functions.
 */
export function getExportProjectData(): ExportProjectData {
  const style = styleStore$.style.get()
  const layout = layoutStore$.layout.get()
  const globalAdjustMetric = styleStore$.globalAdjustMetric.get()
  const text = projectStore$.current.text.get()
  const name = projectStore$.current.name.get()
  const ui = uiStore$.ui.get()
  const packCanvases = glyphStore$.packing.packCanvases.get()

  const glyphListRaw = getGlyphList(text)
  const glyphList: ExportGlyphData[] = glyphListRaw.map((glyph) => ({
    letter: glyph.letter,
    x: glyph.x,
    y: glyph.y,
    page: glyph.page,
    width: glyph.width,
    height: glyph.height,
    fontWidth: glyph.fontWidth,
    trimOffsetTop: glyph.trimOffsetTop,
    trimOffsetLeft: glyph.trimOffsetLeft,
    adjustMetric: {
      xAdvance: glyph.adjustMetric.xAdvance,
      xOffset: glyph.adjustMetric.xOffset,
      yOffset: glyph.adjustMetric.yOffset,
    },
    kerning: glyph.kerning,
  }))

  return {
    name,
    style: {
      font: {
        ...style.font,
        mainFamily: getMainFamily(),
        opentype: getOpentype(),
      },
    },
    layout,
    globalAdjustMetric,
    glyphList,
    ui: {
      width: ui.width,
      height: ui.height,
    },
    packCanvases,
  }
}

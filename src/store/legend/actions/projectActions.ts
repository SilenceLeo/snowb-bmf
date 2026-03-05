import { observe } from '@legendapp/state'
import type { ExportGlyphData, ExportProjectData } from 'src/file/export/type'

import { DEBUG_CONFIG } from '../config'
import { getGlyphList, glyphStore$, resetGlyphStore } from '../glyphStore'
import {
  DEFAULT_PROJECT_TEXT,
  clearPackTimer,
  projectStore$,
  setCurrentProject,
  setInitializing,
  setProjectName as setProjectStoreName,
} from '../projectStore'
import { layoutStore$, resetLayoutStore } from '../stores/layoutStore'
import {
  getMainFamily,
  getOpentype,
  resetStyleStore,
  styleStore$,
} from '../stores/styleStore'
import { resetUiStore, uiStore$ } from '../stores/uiStore'
import {
  getActiveId,
  setProjectName as setWorkspaceProjectName,
} from '../stores/workspaceStore'
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
  if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Initializing...')

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
      if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Initialization complete')
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
  if (DEBUG_CONFIG.logBatchUpdates) console.log(`[Project] Loading: ${data.name}`)

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

    // Guard: track current project ID for async safety
    const currentProjectId = data.id

    // Initial packing first, then setup listeners
    // (matches initializeProject order to avoid redundant packing during init)
    await packStyle()

    // Re-check after async operation — abort if project switched
    if (projectStore$.current.id.get() !== currentProjectId) {
      if (DEBUG_CONFIG.logBatchUpdates) {
        console.log('[Project] Aborted: project switched during loading')
      }
      return
    }

    // Setup auto-run listeners after initial pack
    setupAutoRunListeners()

    setInitializing(false)
    if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Loaded successfully')
  } catch (error) {
    console.error('[Project] Loading failed:', error)
    setInitializing(false)
    throw error
  }
}

let layoutDebounceTimer: number | null = null
let styleDebounceTimer: number | null = null

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
  // Monitor input fields only; packWidth/packHeight are output values set by packing
  const layoutInputFields = new Set([
    'padding',
    'spacing',
    'width',
    'height',
    'auto',
    'fixedSize',
    'page',
  ])
  const unsubscribeLayout = layoutStore$.layout.onChange(({ changes }) => {
    const hasInputChange = changes.some(({ path }) =>
      layoutInputFields.has(path[0] as string),
    )
    if (hasInputChange) {
      debouncedLayoutChange()
    }
  })

  // Background color changes - re-packing only (skip in SDF mode where bgColor is ignored)
  const unsubscribeBgColor = styleStore$.style.bgColor.onChange(() => {
    if (styleStore$.style.render.mode.get() === 'default') {
      throttlePack()
    }
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

  // Render mode changes — only needs full glyph re-render when switching between
  // default and SDF modes (different fill styles). Switching within SDF modes
  // (sdf↔msdf↔psdf↔mtsdf) only needs re-packing since all use white fill.
  let prevRenderMode = styleStore$.style.render.mode.get()
  const unsubscribeRenderMode = styleStore$.style.render.mode.onChange(({ value }) => {
    const wasDefault = prevRenderMode === 'default'
    const isDefault = value === 'default'
    prevRenderMode = value
    if (wasDefault !== isDefault) {
      // Crossing default↔SDF boundary: glyph style changes (white fill vs styled)
      debouncedStyleChange()
    } else {
      // Within SDF modes or within default: only re-pack
      debouncedLayoutChange()
    }
  })

  // Distance range changes — only affects SDF post-processing (no glyph re-render needed)
  const unsubscribeDistanceRange = styleStore$.style.render.distanceRange.onChange(
    () => {
      debouncedLayoutChange()
    },
  )

  // SDF channel changes — only affects SDF post-processing (no glyph re-render needed)
  const unsubscribeSdfChannel = styleStore$.style.render.sdfChannel.onChange(() => {
    debouncedLayoutChange()
  })

  // MSDF parameters — changes only need re-packing (no glyph re-render)
  const unsubscribeAngleThreshold =
    styleStore$.style.render.angleThreshold.onChange(() => {
      debouncedLayoutChange()
    })

  const unsubscribeOverlapSupport =
    styleStore$.style.render.overlapSupport.onChange(() => {
      debouncedLayoutChange()
    })

  const unsubscribeEdgeColoringSeed =
    styleStore$.style.render.edgeColoringSeed.onChange(() => {
      debouncedLayoutChange()
    })

  const unsubscribeScanlinePass =
    styleStore$.style.render.scanlinePass.onChange(() => {
      debouncedLayoutChange()
    })

  const unsubscribeFillRule = styleStore$.style.render.fillRule.onChange(() => {
    debouncedLayoutChange()
  })

  const unsubscribeColoringStrategy =
    styleStore$.style.render.coloringStrategy.onChange(() => {
      debouncedLayoutChange()
    })

  const unsubscribeErrorCorrection =
    styleStore$.style.render.errorCorrection.onChange(() => {
      debouncedLayoutChange()
    })

  cleanupFunctions = [
    unsubscribeImageGlyphs,
    unsubscribeLayout,
    unsubscribeBgColor,
    unsubscribeFontSize,
    unsubscribeFontFonts,
    unsubscribeFontSharp,
    unsubscribeFill,
    unsubscribeStroke,
    unsubscribeUseStroke,
    unsubscribeShadow,
    unsubscribeUseShadow,
    unsubscribeRenderMode,
    unsubscribeDistanceRange,
    unsubscribeSdfChannel,
    unsubscribeAngleThreshold,
    unsubscribeOverlapSupport,
    unsubscribeEdgeColoringSeed,
    unsubscribeScanlinePass,
    unsubscribeFillRule,
    unsubscribeColoringStrategy,
    unsubscribeErrorCorrection,
  ]

  if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Auto-run listeners setup complete')
}

function debouncedLayoutChange(): void {
  if (layoutDebounceTimer) {
    window.clearTimeout(layoutDebounceTimer)
  }
  layoutDebounceTimer = window.setTimeout(() => {
    throttlePack()
    layoutDebounceTimer = null
  }, 50)
}

function debouncedStyleChange(): void {
  if (styleDebounceTimer) {
    window.clearTimeout(styleDebounceTimer)
  }
  styleDebounceTimer = window.setTimeout(() => {
    packStyle()
    styleDebounceTimer = null
  }, 50)
}

export function cleanupListeners(): void {
  cleanupFunctions.forEach((cleanup) => cleanup())
  cleanupFunctions = []

  // Cancel pending debounce timers to prevent stale callbacks
  if (layoutDebounceTimer) {
    window.clearTimeout(layoutDebounceTimer)
    layoutDebounceTimer = null
  }
  if (styleDebounceTimer) {
    window.clearTimeout(styleDebounceTimer)
    styleDebounceTimer = null
  }
}

// ============================================================================
// Project Management
// ============================================================================

/**
 * Set project name and sync to workspace.
 *
 * Note: Sync is intentionally one-way (projectStore → workspaceStore).
 * ProjectTabs.handleRename calls setWorkspaceProjectName directly,
 * which is correct because the active project's projectStore is the
 * source of truth and gets overwritten on project switch anyway.
 */
export function setProjectName(name: string): void {
  if (name) {
    setProjectStoreName(name)
    // Sync the workspace project list name to keep both stores in sync
    const activeId = getActiveId()
    if (activeId) {
      setWorkspaceProjectName(activeId, name)
    }
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
  if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Destroying...')

  cancelAllOperations()
  clearPackTimer()
  cleanupListeners()
  destroyPackingEngine()
  clearAllImageGlyphs()
  resetGlyphStore()
  resetStyleStore()
  resetLayoutStore()
  resetUiStore()

  if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Destroyed')
}

export function resetProject(): void {
  if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Resetting...')

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

  if (DEBUG_CONFIG.logBatchUpdates) console.log('[Project] Reset complete')
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
    xFractional: styleStore$.xFractional.get(),
    renderMode: style.render.mode,
    distanceRange: style.render.distanceRange,
    sdfChannel: style.render.sdfChannel,
    ui: {
      width: ui.width,
      height: ui.height,
    },
    packCanvases,
  }
}

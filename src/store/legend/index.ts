/**
 * Legend State Store - Main Entry Point
 *
 * This module exports the Legend State store and utilities for
 * high-performance state management, particularly optimized for
 * batch glyph position updates during packing operations.
 *
 * Architecture:
 * - glyphStore: High-frequency glyph data (positions, dimensions)
 * - projectStore: Project-level state (name, text, timing)
 * - styleStore: Style configuration (font, fill, stroke, shadow)
 * - layoutStore: Layout configuration (padding, spacing, dimensions)
 * - uiStore: UI state (transform, preview, selection)
 * - workspaceStore: Multi-project workspace management
 *
 * Key Features:
 * - batch() for grouping updates into single notification
 * - Fine-grained reactivity with Memo/For components
 * - Direct DOM updates bypassing virtual DOM when possible
 */

// Configuration
export { initLegendState, DEBUG_CONFIG, PERFORMANCE_THRESHOLDS } from './config'

// ============================================================================
// New Stores (Full Legend State implementation)
// ============================================================================

// Style Store - Font, Fill, Stroke, Shadow, Gradient configuration
export {
  styleStore$,
  // Types
  type StyleData,
  type RenderData,
  type RenderMode,
  type SdfChannel,
  type FillRule,
  type ColoringStrategy,
  type ErrorCorrectionMode,
  type FontData,
  type FillData,
  type StrokeData,
  type ShadowData,
  type GradientData,
  type PatternTextureData,
  type MetricData,
  type FontResource,
  type GradientPaletteItem,
  type StyleStoreState,
  type Repetition,
  FillType,
  GradientType,
  // Font actions
  getMainFont,
  getMainFamily,
  getFontFamily,
  getOpentype,
  getMinBaseLine,
  getMaxBaseLine,
  updateBaselines,
  addFont,
  removeFont,
  setFontSize,
  setLineHeight,
  setSharp,
  // Fill actions
  setFillType,
  setFillColor,
  setGradientType,
  setGradientAngle,
  addGradientColor,
  updateGradientPalette,
  setPatternImage,
  setPatternRepetition,
  setPatternScale,
  // Stroke actions
  setUseStroke,
  setStrokeWidth,
  setStrokeLineCap,
  setStrokeLineJoin,
  setStrokeType,
  setStrokeFillType,
  setStrokeColor,
  setStrokeGradientType,
  setStrokeGradientAngle,
  addStrokeGradientColor,
  updateStrokeGradientPalette,
  setStrokePatternImage,
  setStrokePatternRepetition,
  setStrokePatternScale,
  // Shadow actions
  setUseShadow,
  setShadowColor,
  setShadowBlur,
  setShadowOffsetX,
  setShadowOffsetY,
  setShadowOffset,
  // Inner Shadow actions
  setUseInnerShadow,
  setInnerShadowColor,
  setInnerShadowBlur,
  setInnerShadowOffsetX,
  setInnerShadowOffsetY,
  setInnerShadowOffset,
  // Render mode
  setRenderMode,
  setDistanceRange,
  setSdfChannel,
  // MSDF parameters
  setAngleThreshold,
  setOverlapSupport,
  setEdgeColoringSeed,
  setScanlinePass,
  setFillRule,
  setColoringStrategy,
  setErrorCorrection,
  // Background color
  setBgColor,
  // Global metric actions
  setGlobalXAdvance,
  setGlobalXOffset,
  setGlobalYOffset,
  // Fractional precision
  setXFractional,
  // Store management
  initializeStyleStore,
  resetStyleStore,
  getStyleSnapshot,
} from './stores/styleStore'

// Layout Store - Packing configuration
export {
  layoutStore$,
  type LayoutData,
  type LayoutStoreState,
  setPadding,
  setSpacing,
  setWidth,
  setHeight,
  setAuto,
  setFixedSize,
  setPage,
  setPackSize,
  updateLayout,
  getLayout,
  getPackingParams,
  getPackDimensions,
  isAutoPacking,
  isFixedSizePacking,
  isAdaptivePacking,
  initializeLayoutStore,
  resetLayoutStore,
  getLayoutSnapshot,
} from './stores/layoutStore'

// UI Store - Editor UI state
export {
  uiStore$,
  type UiData,
  type UiStoreState,
  setTransform,
  setSize,
  setScale,
  setOffset,
  setPreviewText,
  setShowPreview,
  setPreviewTransform,
  setPreviewScale,
  setPreviewOffset,
  setSelectLetter,
  clearSelection,
  setPackFailed,
  getUi,
  getTransform,
  getDimensions,
  getPreviewState,
  getSelection,
  hasSelection,
  isPackFailed,
  initializeUiStore,
  resetUiStore,
  getUiSnapshot,
  getUiStoreState,
} from './stores/uiStore'

// Workspace Store - Multi-project management
export {
  workspaceStore$,
  type ProjectMeta,
  type WorkspaceData,
  type WorkspaceStoreState,
  getActiveId,
  getCurrentProject,
  getNamedList,
  getProjectCount,
  hasProject,
  selectProject,
  addProject,
  removeProject,
  setProjectName as setWorkspaceProjectName,
  updateProjectMeta,
  observeActiveProject,
  observeProjectList,
  initializeWorkspace,
  initializeWorkspaceFromData,
  resetWorkspaceStore,
  getWorkspaceSnapshot,
  getWorkspaceStoreState,
} from './stores/workspaceStore'

// ============================================================================
// Glyph Store
// ============================================================================

// Types
export type {
  GlyphType,
  GlyphData,
  FontGlyphData,
  ImageGlyphData,
  GlyphPositionUpdate,
  GlyphInfoUpdate,
  PackingState,
  ProjectState,
  TextRectangle,
  GlyphStoreState,
} from './types'

// Glyph Store
export {
  glyphStore$,
  // Glyph creation
  createFontGlyph,
  createImageGlyph,
  generateImageGlyphUid,
  // Glyph management
  addGlyph,
  removeGlyph,
  getGlyph,
  addGlyphsBatch,
  // Image glyph management
  addImageGlyph,
  removeImageGlyph,
  findImageGlyph,
  // Batch position updates (core optimization)
  batchUpdateGlyphPositions,
  resetGlyphPages,
  resetFailedGlyphPositions,
  // Batch info updates
  batchUpdateGlyphInfo,
  // Packing state
  setPackingState,
  setRenderingState,
  getSourceCanvas,
  setSourceCanvas,
  setPackCanvases,
  // Selectors
  getGlyphLetters,
  getGlyphCount,
  getGlyphForLetter,
  getGlyphList,
  getRectangleList,
  // Observers
  observeGlyphCount,
  observePackingState,
  // Reset
  resetGlyphStore,
  incrementGlyphDataVersion,
} from './glyphStore'

// Project Store
export {
  projectStore$,
  DEFAULT_PROJECT_TEXT,
  setCurrentProject,
  setProjectName,
  setProjectText,
  getProjectText,
  setPackLastExecuteTime as setPackStart,
  getPackLastExecuteTime as getPackStart,
  setPackTimer,
  getPackTimer,
  clearPackTimer,
  setInitializing,
  isInitializing,
  resetProjectStore,
} from './projectStore'

// React Hooks
export {
  // Glyph hooks
  useGlyph,
  useGlyphPosition,
  useGlyphDimensions,
  useGlyphLetters,
  useGlyphCount,
  useGlyphDataVersion,
  useAllGlyphs,
  // Image glyph hooks
  useImageGlyphs,
  useImageGlyphCount,
  useImageGlyph,
  // Packing state hooks
  useIsPacking,
  useIsRenderingGlyphs,
  usePackCanvases,
  useSourceCanvas,
  // Project state hooks
  useCurrentProject,
  useProjectName,
  useProjectText,
  useIsInitializing,
  // Combined hooks
  useLoadingStates,
  useGlyphForLetter,
  useGlyphsForPage,
  // Style hooks
  useStyle,
  useFont,
  useFontBaselines,
  useFontSize,
  useFontLineHeight,
  useFontSharp,
  useFontResources,
  useMainFont,
  useMainFontFamily,
  useFill,
  useFillColor,
  useFillType,
  useGradient,
  usePatternTexture,
  useStrokeEnabled,
  useStroke,
  useShadowEnabled,
  useShadow,
  useInnerShadowEnabled,
  useInnerShadow,
  useBgColor,
  useGlobalAdjustMetric,
  // Layout hooks
  useLayout,
  usePackDimensions,
  usePadding,
  useSpacing,
  useLayoutWidth,
  useLayoutHeight,
  useAutoLayout,
  useFixedSize,
  usePageCount,
  // UI hooks
  useUi,
  useUiDimensions,
  useScale,
  usePreviewScale,
  usePreviewText,
  useShowPreview,
  useSelectLetter,
  usePackFailed,
  useRenderMode,
  useDistanceRange,
  useSdfChannel,
  useAngleThreshold,
  useOverlapSupport,
  useEdgeColoringSeed,
  useScanlinePass,
  useFillRule,
  useColoringStrategy,
  useErrorCorrection,
  useXFractional,
  useUiTransform,
  usePreviewTransform,
  // Workspace hooks
  useWorkspace,
  useActiveProjectId,
  useProjectList,
  useProjectCount,
  useProjectMeta,
  // Kerning hooks
  useGlyphKerning,
  // Gradient preset hooks
  useGradientPresets,
  useGradientPresetsLoaded,
} from './hooks'

// Gradient Preset Store
export {
  gradientPresetStore$,
  loadGradientPresets,
  saveGradientPreset,
  deleteGradientPreset,
} from './stores/gradientPresetStore'

// Gradient Preset Types
export type { GradientPreset } from 'src/types/gradientPreset'

// ============================================================================
// Actions (Business Logic)
// ============================================================================

// Packing Actions
export {
  initPackingEngine,
  destroyPackingEngine,
  pack,
  packStyle,
  throttlePack,
  cancelAllOperations,
} from './actions/packingActions'

// Glyph Actions
export {
  type ImageFileInfo,
  type KerningUpdate,
  type MetricAdjustment,
  setText,
  syncGlyphsWithTextChange,
  initializeGlyphsFromText,
  ensureSpaceGlyph,
  addImages,
  removeImage,
  removeImageByData,
  setImageGlyphLetter,
  setImageGlyphSelected,
  findImageGlyphIndex,
  setKerning,
  batchSetKerning,
  getKerning,
  setGlyphAdjustMetric,
  setImageGlyphAdjustMetric,
  getFontGlyph,
  getImageGlyph,
  getAllFontGlyphs,
  getAllImageGlyphs,
  getSelectedImageGlyphs,
  getTotalGlyphCount,
  clearAllImageGlyphs,
  resetAllGlyphs,
} from './actions/glyphActions'

// Project Actions
export {
  type ProjectInitData,
  initializeProject,
  initializeProjectFromData,
  setupAutoRunListeners,
  cleanupListeners,
  setProjectName as setProjectNameAction,
  getProjectName as getProjectNameAction,
  getProjectId,
  destroyProject,
  resetProject,
  isProjectInitializing,
  isProjectPacking,
  isRenderingGlyphs,
  getProjectSnapshot,
  getExportProjectData,
} from './actions/projectActions'

// ============================================================================
// Persistence (Serialization/Deserialization)
// ============================================================================

export {
  // Serialization
  serializeProject,
  serializeProjectById,
  getProjectMeta,
  validateSerializedProject,
  type SerializableProject,
  // Deserialization
  deserializeProject,
  initializeImageGlyphSources,
  validateDecodedProject,
  type DecodedProject,
} from './persistence'

// Re-export Legend State utilities for component usage
export { batch, observable, observe } from '@legendapp/state'
export { Memo, useSelector } from '@legendapp/state/react'

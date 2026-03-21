/**
 * Legend State Stores - Unified Exports
 *
 * This module re-exports all Legend State stores for easy importing.
 */

// Style Store
export {
  styleStore$,
  // Types
  type StyleData,
  type FontData,
  type FillData,
  type StrokeData,
  type ShadowData,
  type GradientData,
  type PatternTextureData,
  type MetricData,
  type FontResource,
  type GradientPaletteItem,
  type GradientColor,
  type Repetition,
  type StyleStoreState,
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
  updateStrokeGradientPalette,
  addStrokeGradientColor,
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
  // Background color
  setBgColor,
  // Global metric actions
  setGlobalXAdvance,
  setGlobalXOffset,
  setGlobalYOffset,
  // Store management
  initializeStyleStore,
  resetStyleStore,
  getStyleSnapshot,
} from './styleStore'

// Layout Store
export {
  layoutStore$,
  // Types
  type LayoutData,
  type LayoutStoreState,
  // Actions
  setPadding,
  setSpacing,
  setWidth,
  setHeight,
  setAuto,
  setFixedSize,
  setPage,
  setPackSize,
  updateLayout,
  // Selectors
  getLayout,
  getPackingParams,
  getPackDimensions,
  isAutoPacking,
  isFixedSizePacking,
  isAdaptivePacking,
  // Store management
  initializeLayoutStore,
  resetLayoutStore,
  getLayoutSnapshot,
} from './layoutStore'

// UI Store
export {
  uiStore$,
  // Types
  type UiData,
  type UiStoreState,
  // Transform actions
  setTransform,
  setSize,
  setScale,
  setOffset,
  // Preview actions
  setPreviewText,
  setShowPreview,
  setPreviewTransform,
  setPreviewScale,
  setPreviewOffset,
  // Selection actions
  setSelectLetter,
  clearSelection,
  // Packing state
  setPackFailed,
  // Selectors
  getUi,
  getTransform,
  getDimensions,
  getPreviewState,
  getSelection,
  hasSelection,
  isPackFailed,
  // Store management
  initializeUiStore,
  resetUiStore,
  getUiSnapshot,
  getUiStoreState,
} from './uiStore'

// Workspace Store
export {
  workspaceStore$,
  // Types
  type ProjectMeta,
  type WorkspaceData,
  type WorkspaceStoreState,
  // Selectors
  getActiveId,
  getCurrentProject,
  getNamedList,
  getProjectCount,
  hasProject,
  // Actions
  selectProject,
  addProject,
  removeProject,
  setProjectName,
  updateProjectMeta,
  // Observers
  observeActiveProject,
  observeProjectList,
  // Store management
  initializeWorkspace,
  initializeWorkspaceFromData,
  resetWorkspaceStore,
  getWorkspaceSnapshot,
  getWorkspaceStoreState,
} from './workspaceStore'

/**
 * Legend State Actions - Unified Exports
 *
 * This module re-exports all action modules for easy importing.
 */

// Packing Actions
export {
  // Packing engine management
  initPackingEngine,
  destroyPackingEngine,
  // Packing operations
  pack,
  packStyle,
  throttlePack,
  cancelAllOperations,
} from './packingActions'

// Glyph Actions
export {
  // Type definitions
  type ImageFileInfo,
  type KerningUpdate,
  type MetricAdjustment,
  // Text and glyph synchronization
  setText,
  syncGlyphsWithTextChange,
  initializeGlyphsFromText,
  ensureSpaceGlyph,
  // Image glyph management
  addImages,
  removeImage,
  removeImageByData,
  setImageGlyphLetter,
  setImageGlyphSelected,
  findImageGlyphIndex,
  // Glyph property modifications
  setKerning,
  batchSetKerning,
  getKerning,
  setGlyphAdjustMetric,
  setImageGlyphAdjustMetric,
  // Glyph data access
  getFontGlyph,
  getImageGlyph,
  getAllFontGlyphs,
  getAllImageGlyphs,
  getSelectedImageGlyphs,
  getTotalGlyphCount,
  // Cleanup
  clearAllImageGlyphs,
  resetAllGlyphs,
} from './glyphActions'

// Project Actions
export {
  // Type definitions
  type ProjectInitData,
  // Project initialization
  initializeProject,
  initializeProjectFromData,
  // Auto-run listeners
  setupAutoRunListeners,
  cleanupListeners,
  // Project management
  setProjectName,
  getProjectName,
  getProjectId,
  // Project cleanup
  destroyProject,
  resetProject,
  // Project state queries
  isProjectInitializing,
  isProjectPacking,
  isRenderingGlyphs,
  getProjectSnapshot,
  getExportProjectData,
} from './projectActions'

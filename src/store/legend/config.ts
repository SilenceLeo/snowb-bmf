/**
 * Legend State configuration
 *
 * This module configures Legend State for optimal performance in high-frequency
 * update scenarios like glyph position updates during packing.
 */

/**
 * Initialize Legend State with optimal settings
 *
 * Note: Legend State v2 has automatic optimal settings out of the box.
 * This function is reserved for any future configuration needs.
 */
export function initLegendState(): void {
  // Placeholder: Legend State v2 is optimized by default and requires no
  // additional configuration. This function is retained as a hook point
  // for future configuration needs (e.g., persistence plugins, custom
  // serialization, or performance tuning) without requiring call-site changes.
}

/**
 * Performance thresholds for monitoring
 */
export const PERFORMANCE_THRESHOLDS = {
  // Warn if batch update takes longer than this (ms)
  BATCH_UPDATE_WARN: 100,

  // Warn if single glyph count exceeds this
  GLYPH_COUNT_WARN: 2000,

  // Progressive rendering threshold
  PROGRESSIVE_THRESHOLD: 500,

  // Batch size for progressive updates
  BATCH_SIZE: 100,
}

/**
 * Debug configuration
 */
export const DEBUG_CONFIG = {
  // Log batch update timing
  logBatchUpdates: import.meta.env.DEV,

  // Log glyph position changes
  logPositionChanges: false,

  // Log state changes
  logStateChanges: false,
}

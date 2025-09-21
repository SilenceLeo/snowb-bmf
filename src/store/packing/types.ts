/**
 * Type definitions for the packing system
 */
import { GlyphType } from '../base/glyphBase'

/**
 * Rectangle interface for packing algorithms
 */
export interface TextRectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
  type: GlyphType
}

/**
 * Packing options
 */
export interface PackingOptions {
  auto: boolean
  width: number
  height: number
  spacing: number
  padding: number
  page: number
  fixedSize: boolean
}

/**
 * Packing result for a single page
 */
export interface PackingResult {
  pageIndex: number
  rectangles: TextRectangle[]
  width: number
  height: number
}

/**
 * Packing task information
 */
export interface PackingTask {
  id: string
  pageIndex: number
  startTime: number
  worker: Worker
  cleanup: () => void
  messageHandler?: EventListener
  errorHandler?: EventListener
}

/**
 * Packing progress callback
 */
export type PackingProgressCallback = (completed: number, total: number) => void

/**
 * Packing error information
 */
export interface PackingError extends Error {
  context: string
  pageIndex?: number
  details?: any
}

/**
 * Worker message types
 */
export enum WorkerMessageType {
  PACK = 'PACK',
  CANCEL = 'CANCEL',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  PROGRESS = 'PROGRESS',
}

/**
 * Worker message
 */
export interface WorkerMessage<T = any> {
  type: WorkerMessageType
  data?: T
  error?: Error
}

/**
 * Packing engine configuration
 */
export interface PackingEngineConfig {
  maxConcurrentWorkers?: number
  workerTimeout?: number
  enableSentry?: boolean
}

/**
 * Packing statistics
 */
export interface PackingStats {
  totalPages: number
  successfulPages: number
  failedPages: number
  totalGlyphs: number
  packedGlyphs: number
  duration: number
}

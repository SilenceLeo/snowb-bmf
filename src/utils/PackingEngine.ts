/**
 * Packing engine - Core logic responsible for glyph packing
 *
 * Uses Web Workers for auto-packing and synchronous algorithms for fixed-size packing.
 */
import { GuillotineBinPack } from 'rectangle-packer'
import { autoPackerWorkerPool } from 'src/utils/AutoPackerWorkerPool'
import { Semaphore, isCancelError } from 'src/utils/concurrency'

// ============================================================================
// Type Definitions
// ============================================================================

export type GlyphType = 'text' | 'image'

export interface TextRectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
  type: GlyphType
}

export interface PackingOptions {
  auto: boolean
  width: number
  height: number
  spacing: number
  padding: number
  page: number
  fixedSize: boolean
}

export interface PackingResult {
  pageIndex: number
  rectangles: TextRectangle[]
  width: number
  height: number
}

interface PackingTask {
  id: string
  pageIndex: number
  startTime: number
  worker: Worker
  cleanup: () => void
  reject?: (reason: Error) => void
}

export type PackingProgressCallback = (completed: number, total: number) => void

export interface PackingEngineConfig {
  maxConcurrentWorkers?: number
  enableSentry?: boolean
}

interface PackingStats {
  totalPages: number
  successfulPages: number
  failedPages: number
  totalGlyphs: number
  packedGlyphs: number
  duration: number
}

// ============================================================================
// PackingEngine
// ============================================================================

export class PackingEngine {
  private config: Required<PackingEngineConfig>
  private currentPackingId: string | null = null
  private packingTasks = new Map<string, PackingTask>()
  private activeWorkers = new Set<Worker>()
  private abortController: AbortController | null = null
  private workerSemaphore: Semaphore
  private _isPacking = false

  stats: PackingStats = {
    totalPages: 0,
    successfulPages: 0,
    failedPages: 0,
    totalGlyphs: 0,
    packedGlyphs: 0,
    duration: 0,
  }

  constructor(config: PackingEngineConfig = {}) {
    this.config = {
      maxConcurrentWorkers:
        config.maxConcurrentWorkers ??
        Math.min(navigator.hardwareConcurrency || 4, 8),
      enableSentry: config.enableSentry ?? true,
    }

    this.workerSemaphore = new Semaphore(this.config.maxConcurrentWorkers)
  }

  get isPacking(): boolean {
    return this._isPacking
  }

  /**
   * Start packing
   */
  async startPacking(
    pageGroups: TextRectangle[][],
    options: PackingOptions,
    onProgress?: PackingProgressCallback,
  ): Promise<PackingResult[]> {
    this.cancelPacking()

    this.abortController = new AbortController()
    const signal = this.abortController.signal

    this.currentPackingId = `pack-${Date.now()}`
    const localPackingId = this.currentPackingId
    this._isPacking = true

    this.stats = {
      totalPages: pageGroups.length,
      successfulPages: 0,
      failedPages: 0,
      totalGlyphs: pageGroups.reduce((sum, page) => sum + page.length, 0),
      packedGlyphs: 0,
      duration: 0,
    }

    const startTime = Date.now()

    try {
      if (options.auto) {
        console.log('[Packing] Mode: Auto (dynamic size)')
      } else if (options.fixedSize) {
        console.log(
          `[Packing] Mode: Fixed size (${options.width}x${options.height})`,
        )
      } else {
        console.log(
          `[Packing] Mode: Fixed algorithm with adaptive size (max: ${options.width}x${options.height})`,
        )
      }

      if (signal.aborted) {
        throw new Error('Packing cancelled')
      }

      const results = options.auto
        ? await this.autoPackPages(pageGroups, options, onProgress, signal)
        : this.fixedPackPages(pageGroups, options, onProgress, signal)

      this.stats.duration = Date.now() - startTime
      this.stats.successfulPages = results.filter(
        (r) => r.rectangles.length > 0,
      ).length
      this.stats.failedPages =
        this.stats.totalPages - this.stats.successfulPages
      this.stats.packedGlyphs = results.reduce(
        (sum, r) => sum + r.rectangles.length,
        0,
      )

      if (this.stats.failedPages > 0) {
        console.log(
          `[Packing] Completed with ${this.stats.failedPages} failed page(s) out of ${this.stats.totalPages}`,
        )
      }

      return results
    } catch (error) {
      this.handleError(error as Error, 'startPacking')
      throw error
    } finally {
      if (this.currentPackingId === localPackingId) {
        this._isPacking = false
        this.currentPackingId = null
      }
    }
  }

  /**
   * Cancel current packing task
   */
  cancelPacking(): void {
    if (!this.currentPackingId && !this.abortController) {
      return
    }

    console.log(
      `[Packing] Canceling packing task: ${this.currentPackingId || 'active'}`,
    )

    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }

    const cancelError = new Error('Packing cancelled')

    this.packingTasks.forEach((task) => {
      try {
        task.reject?.(cancelError)
      } catch (error) {
        console.error(`Failed to reject task ${task.id}:`, error)
      }
    })

    this.packingTasks.clear()
    this.activeWorkers.clear()
    this.currentPackingId = null
    this._isPacking = false

    // reset() handles worker termination and semaphore reset atomically
    autoPackerWorkerPool.reset()
    this.workerSemaphore.reset()
  }

  /**
   * Auto packing mode
   */
  private async autoPackPages(
    pageGroups: TextRectangle[][],
    options: PackingOptions,
    onProgress?: PackingProgressCallback,
    signal?: AbortSignal,
  ): Promise<PackingResult[]> {
    const results: PackingResult[] = []
    const packingId = this.currentPackingId!
    let completedPages = 0

    const batchSize = pageGroups.length === 1 ? 1 : 4

    for (
      let batchStart = 0;
      batchStart < pageGroups.length;
      batchStart += batchSize
    ) {
      if (this.currentPackingId !== packingId || signal?.aborted) {
        throw new Error('Packing cancelled')
      }

      const batchEnd = Math.min(batchStart + batchSize, pageGroups.length)
      const batchPromises: Promise<PackingResult>[] = []

      for (let pageIndex = batchStart; pageIndex < batchEnd; pageIndex++) {
        const promise = this.packPageWithWorker(
          pageIndex,
          pageGroups[pageIndex],
          options,
          packingId,
          signal,
        ).then((result) => {
          completedPages++
          onProgress?.(completedPages, pageGroups.length)
          return result
        })

        batchPromises.push(promise)
      }

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      if (batchEnd < pageGroups.length) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }

    return results.sort((a, b) => a.pageIndex - b.pageIndex)
  }

  /**
   * Fixed size packing mode
   */
  private fixedPackPages(
    pageGroups: TextRectangle[][],
    options: PackingOptions,
    onProgress?: PackingProgressCallback,
    signal?: AbortSignal,
  ): PackingResult[] {
    const results: PackingResult[] = []

    pageGroups.forEach((pageGlyphs, pageIndex) => {
      if (signal?.aborted) {
        throw new Error('Packing cancelled')
      }

      if (pageGlyphs.length === 0) {
        results.push({
          pageIndex,
          rectangles: [],
          width: 0,
          height: 0,
        })
        return
      }

      const packer = new GuillotineBinPack<TextRectangle>(
        options.width + options.spacing,
        options.height + options.spacing,
      )

      packer.InsertSizes([...pageGlyphs], true, 1, 1)

      const unpackedCount = pageGlyphs.length - packer.usedRectangles.length
      if (unpackedCount > 0) {
        console.warn(
          `[Packing] Page ${pageIndex}: ${unpackedCount} of ${pageGlyphs.length} glyphs could not fit in ${options.width}x${options.height}`,
        )
        results.push({
          pageIndex,
          rectangles: [],
          width: options.width,
          height: options.height,
        })
      } else {
        let resultWidth = options.width
        let resultHeight = options.height

        if (!options.fixedSize) {
          let maxWidth = 0
          let maxHeight = 0
          packer.usedRectangles.forEach((rect) => {
            maxWidth = Math.max(maxWidth, rect.x + rect.width)
            maxHeight = Math.max(maxHeight, rect.y + rect.height)
          })
          resultWidth = maxWidth > 0 ? maxWidth - options.spacing : 0
          resultHeight = maxHeight > 0 ? maxHeight - options.spacing : 0
        }

        results.push({
          pageIndex,
          rectangles: packer.usedRectangles,
          width: resultWidth,
          height: resultHeight,
        })
      }

      onProgress?.(pageIndex + 1, pageGroups.length)
    })

    return results
  }

  /**
   * Pack single page using Worker
   */
  private async packPageWithWorker(
    pageIndex: number,
    pageGlyphs: TextRectangle[],
    options: PackingOptions,
    packingId: string,
    signal?: AbortSignal,
  ): Promise<PackingResult> {
    if (pageGlyphs.length === 0) {
      return {
        pageIndex,
        rectangles: [],
        width: 0,
        height: 0,
      }
    }

    // Filter zero-size glyphs before sending to worker
    const filteredGlyphs = pageGlyphs.filter(
      ({ width, height }) => !!(width && height),
    )

    // B4: If all glyphs were filtered out, return empty result
    if (filteredGlyphs.length === 0) {
      return {
        pageIndex,
        rectangles: [],
        width: 0,
        height: 0,
      }
    }

    await this.workerSemaphore.acquire()

    // B2: Check cancellation after acquiring semaphore
    if (this.currentPackingId !== packingId || signal?.aborted) {
      this.workerSemaphore.release()
      return {
        pageIndex,
        rectangles: [],
        width: 0,
        height: 0,
      }
    }

    let worker: Worker | null = null
    const taskId = `${packingId}-page-${pageIndex}`

    try {
      worker = await autoPackerWorkerPool.getWorkerAsync()

      const workPromise = new Promise<PackingResult>((resolve, reject) => {
        const messageHandler = (event: MessageEvent) => {
          if (this.currentPackingId !== packingId) {
            return
          }

          // B3: Handle error responses from worker
          if (event.data && event.data.error) {
            reject(new Error(`Worker packing error: ${event.data.error}`))
            return
          }

          const data = event.data as TextRectangle[]

          let maxWidth = 0
          let maxHeight = 0
          data.forEach((rect) => {
            maxWidth = Math.max(maxWidth, rect.x + rect.width)
            maxHeight = Math.max(maxHeight, rect.y + rect.height)
          })

          // B4: Guard against negative dimensions when data is empty
          resolve({
            pageIndex,
            rectangles: data,
            width: maxWidth > 0 ? maxWidth - options.spacing : 0,
            height: maxHeight > 0 ? maxHeight - options.spacing : 0,
          })
        }

        const errorHandler = (error: ErrorEvent) => {
          reject(new Error(`Worker error: ${error.message}`))
        }

        // I3: Store handler references for proper removeEventListener
        worker!.addEventListener('message', messageHandler)
        worker!.addEventListener('error', errorHandler)

        const task: PackingTask = {
          id: taskId,
          pageIndex,
          startTime: Date.now(),
          worker: worker!,
          reject,
          cleanup: () => {
            worker!.removeEventListener('message', messageHandler)
            worker!.removeEventListener('error', errorHandler)
            this.activeWorkers.delete(worker!)
            autoPackerWorkerPool.returnWorker(worker!)
            this.workerSemaphore.release()
          },
        }

        this.packingTasks.set(taskId, task)
        this.activeWorkers.add(worker!)

        worker!.postMessage(filteredGlyphs)
      })

      const result = await workPromise

      const task = this.packingTasks.get(taskId)
      if (task) {
        task.cleanup()
        this.packingTasks.delete(taskId)
      }

      return result
    } catch (error) {
      const task = this.packingTasks.get(taskId)
      if (task) {
        if (isCancelError(error)) {
          // Cancellation - worker was already terminated by cancelPacking, just release semaphore
          this.activeWorkers.delete(task.worker)
          this.workerSemaphore.release()
        } else {
          task.cleanup()
        }
        this.packingTasks.delete(taskId)
      } else if (worker) {
        this.activeWorkers.delete(worker)
        autoPackerWorkerPool.returnWorker(worker)
        this.workerSemaphore.release()
      }

      throw error
    }
  }

  /**
   * Error handling
   */
  private handleError(error: Error, context: string): void {
    if (isCancelError(error)) {
      return
    }

    console.error(`PackingEngine error in ${context}:`, error)

    if (
      this.config.enableSentry &&
      typeof window !== 'undefined' &&
      window.Sentry
    ) {
      window.Sentry.captureException(error, {
        tags: {
          component: 'PackingEngine',
          context,
        },
        extra: {
          stats: this.stats,
          packingId: this.currentPackingId,
        },
      })
    }
  }

  /**
   * Get current statistics
   */
  getStats(): Readonly<PackingStats> {
    return { ...this.stats }
  }

  /**
   * Destroy engine and release resources
   */
  destroy(): void {
    this.cancelPacking()
    console.log('PackingEngine destroyed')
  }
}

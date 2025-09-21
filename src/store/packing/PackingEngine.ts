/**
 * Packing engine - Core logic responsible for glyph packing
 */
import { action, makeObservable, observable, runInAction } from 'mobx'
import { GuillotineBinPack } from 'rectangle-packer'
import { autoPackerWorkerPool } from 'src/utils/AutoPackerWorkerPool'
import { Semaphore } from 'src/utils/concurrency'

import {
  PackingEngineConfig,
  PackingOptions,
  PackingProgressCallback,
  PackingResult,
  PackingStats,
  PackingTask,
  TextRectangle,
  WorkerMessageType,
} from './types'

export class PackingEngine {
  // Configuration
  private config: Required<PackingEngineConfig>

  // State
  isPacking = false
  currentPackingId: string | null = null

  // Task management
  private packingTasks = new Map<string, PackingTask>()
  private activeWorkers = new Set<Worker>()
  private abortController: AbortController | null = null

  // Concurrency control
  private workerSemaphore: Semaphore

  // Statistics
  stats: PackingStats = {
    totalPages: 0,
    successfulPages: 0,
    failedPages: 0,
    totalGlyphs: 0,
    packedGlyphs: 0,
    duration: 0,
  }

  constructor(config: PackingEngineConfig = {}) {
    makeObservable(this, {
      isPacking: observable,
      currentPackingId: observable,
      stats: observable,
      startPacking: action,
      cancelPacking: action,
    })

    // Set default configuration
    this.config = {
      maxConcurrentWorkers:
        config.maxConcurrentWorkers ??
        Math.min(navigator.hardwareConcurrency || 4, 8),
      workerTimeout: config.workerTimeout ?? 30000,
      enableSentry: config.enableSentry ?? true,
    }

    // Initialize semaphore
    this.workerSemaphore = new Semaphore(this.config.maxConcurrentWorkers)
  }

  /**
   * Start packing
   */
  async startPacking(
    pageGroups: TextRectangle[][],
    options: PackingOptions,
    onProgress?: PackingProgressCallback,
  ): Promise<PackingResult[]> {
    // Cancel previous packing task
    this.cancelPacking()

    // Create new abort controller for this packing session
    this.abortController = new AbortController()
    const signal = this.abortController.signal

    // Set new packing ID
    runInAction(() => {
      this.currentPackingId = `pack-${Date.now()}`
      this.isPacking = true

      // Reset statistics
      this.stats = {
        totalPages: pageGroups.length,
        successfulPages: 0,
        failedPages: 0,
        totalGlyphs: pageGroups.reduce((sum, page) => sum + page.length, 0),
        packedGlyphs: 0,
        duration: 0,
      }
    })

    const startTime = Date.now()

    try {
      // Log: Display packing mode
      if (options.auto) {
        console.log('📦 Packing mode: Auto (dynamic size)')
      } else if (options.fixedSize) {
        console.log(
          `📦 Packing mode: Fixed size (${options.width}x${options.height})`,
        )
      } else {
        console.log(
          `📦 Packing mode: Fixed algorithm with adaptive size (max: ${options.width}x${options.height})`,
        )
      }

      // Check if cancelled before starting
      if (signal.aborted) {
        throw new Error('Packing cancelled')
      }

      const results = options.auto
        ? await this.autoPackPages(pageGroups, options, onProgress, signal)
        : await this.fixedPackPages(pageGroups, options, onProgress, signal)

      // Update statistics
      runInAction(() => {
        this.stats.duration = Date.now() - startTime

        // In fixed size mode, empty results indicate packing failure
        // In auto mode, only pages that truly have no glyphs will return empty results
        if (options.auto) {
          // Auto mode: Only count pages with content as successful
          this.stats.successfulPages = results.filter(
            (r) => r.rectangles.length > 0,
          ).length
        } else {
          // Fixed size mode: Need to consider whether it's a true failure
          // Since our logic already ensures empty lists are only returned on failure, this judgment is correct
          this.stats.successfulPages = results.filter(
            (r) => r.rectangles.length > 0,
          ).length
        }

        this.stats.failedPages =
          this.stats.totalPages - this.stats.successfulPages
        this.stats.packedGlyphs = results.reduce(
          (sum, r) => sum + r.rectangles.length,
          0,
        )

        if (this.stats.failedPages > 0) {
          console.log(
            `📦 Packing completed with ${this.stats.failedPages} failed page(s) out of ${this.stats.totalPages}`,
          )
        }
      })

      return results
    } catch (error) {
      this.handleError(error as Error, 'startPacking')
      throw error
    } finally {
      runInAction(() => {
        this.isPacking = false
        this.currentPackingId = null
      })
    }
  }

  /**
   * Cancel current packing task with complete cleanup
   */
  cancelPacking(): void {
    if (!this.currentPackingId && !this.abortController) {
      return
    }

    console.log(
      `🛑 Canceling packing task: ${this.currentPackingId || 'active'}`,
    )

    // Abort all ongoing operations
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }

    // Clean up all tasks
    this.packingTasks.forEach((task) => {
      try {
        // Send cancel message to worker
        task.worker.postMessage({ type: WorkerMessageType.CANCEL })

        // Terminate the worker immediately for faster cleanup
        if (task.worker.terminate) {
          task.worker.terminate()
        }

        // Clean up task resources
        task.cleanup()
      } catch (error) {
        console.error(`Failed to cleanup task ${task.id}:`, error)
      }
    })

    // Force terminate all active workers
    this.activeWorkers.forEach((worker) => {
      try {
        if (worker.terminate) {
          worker.terminate()
        }
      } catch (error) {
        console.error('Failed to terminate worker:', error)
      }
    })

    // Clear collections
    runInAction(() => {
      this.packingTasks.clear()
      this.activeWorkers.clear()

      this.currentPackingId = null
      this.isPacking = false
    })

    // Force reset the worker pool to clean state
    if ((window as any).autoPackerWorkerPool) {
      const pool = (window as any).autoPackerWorkerPool
      if (pool.reset) {
        pool.reset()
      }
    }
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

    // Batch processing configuration
    const batchSize = pageGroups.length === 1 ? 1 : 4

    for (
      let batchStart = 0;
      batchStart < pageGroups.length;
      batchStart += batchSize
    ) {
      // Check if already cancelled
      if (this.currentPackingId !== packingId || signal?.aborted) {
        console.log(`⚠️ Packing task ${packingId} cancelled, skipping batch`)
        throw new Error('Packing cancelled')
      }

      const batchEnd = Math.min(batchStart + batchSize, pageGroups.length)
      const batchPromises: Promise<PackingResult>[] = []

      // Process pages in batch in parallel
      for (let pageIndex = batchStart; pageIndex < batchEnd; pageIndex++) {
        const promise = this.packPageWithWorker(
          pageIndex,
          pageGroups[pageIndex],
          options,
          packingId,
        ).then((result) => {
          completedPages++
          onProgress?.(completedPages, pageGroups.length)
          return result
        })

        batchPromises.push(promise)
      }

      // Wait for batch completion
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Brief delay between batches
      if (batchEnd < pageGroups.length) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }

    // Sort by page index
    return results.sort((a, b) => a.pageIndex - b.pageIndex)
  }

  /**
   * Fixed size packing mode
   */
  private async fixedPackPages(
    pageGroups: TextRectangle[][],
    options: PackingOptions,
    onProgress?: PackingProgressCallback,
    signal?: AbortSignal,
  ): Promise<PackingResult[]> {
    const results: PackingResult[] = []

    pageGroups.forEach((pageGlyphs, pageIndex) => {
      // Check for cancellation
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

      // Use GuillotineBinPack algorithm
      const packer = new GuillotineBinPack<TextRectangle>(
        options.width + options.spacing,
        options.height + options.spacing,
      )

      packer.InsertSizes([...pageGlyphs], true, 1, 1)

      // Check if there are unplaced elements
      const unpackedCount = pageGlyphs.length - packer.usedRectangles.length
      if (unpackedCount > 0) {
        console.warn(
          `⚠️ Page ${pageIndex}: ${unpackedCount} of ${pageGlyphs.length} glyphs could not fit in ${options.width}x${options.height}`,
        )
        // When packing fails, return empty result to indicate page packing failure
        results.push({
          pageIndex,
          rectangles: [],
          width: options.width,
          height: options.height,
        })
      } else {
        // All elements successfully placed
        let resultWidth = options.width
        let resultHeight = options.height

        // If not in fixed size mode, calculate actual occupied dimensions
        if (!options.fixedSize) {
          let maxWidth = 0
          let maxHeight = 0
          packer.usedRectangles.forEach((rect) => {
            maxWidth = Math.max(maxWidth, rect.x + rect.width)
            maxHeight = Math.max(maxHeight, rect.y + rect.height)
          })
          // Subtract excess spacing
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
  ): Promise<PackingResult> {
    if (pageGlyphs.length === 0) {
      return {
        pageIndex,
        rectangles: [],
        width: 0,
        height: 0,
      }
    }

    // Acquire semaphore
    await this.workerSemaphore.acquire()

    let worker: Worker | null = null
    const taskId = `${packingId}-page-${pageIndex}`

    try {
      // Get Worker
      worker = await autoPackerWorkerPool.getWorkerAsync()

      // Create work Promise
      const workPromise = new Promise<PackingResult>((resolve, reject) => {
        const messageHandler = (event: MessageEvent) => {
          // Check if task has been cancelled
          if (this.currentPackingId !== packingId) {
            console.log(
              `⚠️ Worker result ignored, task ${packingId} was cancelled`,
            )
            return
          }

          // Worker directly returns array result
          const data = event.data as TextRectangle[]

          let maxWidth = 0
          let maxHeight = 0
          data.forEach((rect) => {
            maxWidth = Math.max(maxWidth, rect.x + rect.width)
            maxHeight = Math.max(maxHeight, rect.y + rect.height)
          })

          resolve({
            pageIndex,
            rectangles: data,
            width: maxWidth - options.spacing,
            height: maxHeight - options.spacing,
          })
        }

        const errorHandler = (error: ErrorEvent) => {
          reject(new Error(`Worker error: ${error.message}`))
        }

        // Add listeners
        worker!.addEventListener('message', messageHandler)
        worker!.addEventListener('error', errorHandler)

        // Create task record
        const task: PackingTask = {
          id: taskId,
          pageIndex,
          startTime: Date.now(),
          worker: worker!,
          cleanup: () => {
            worker!.removeEventListener('message', messageHandler)
            worker!.removeEventListener('error', errorHandler)
            runInAction(() => {
              this.activeWorkers.delete(worker!)
            })
            autoPackerWorkerPool.returnWorker(worker!)
            this.workerSemaphore.release()
          },
        }

        runInAction(() => {
          this.packingTasks.set(taskId, task)
          this.activeWorkers.add(worker!)
        })

        // Send packing message (Worker expects to receive array directly)
        worker!.postMessage(
          pageGlyphs.filter(({ width, height }) => !!(width && height)),
        )
      })

      // Wait for result
      const result = await workPromise

      // Clean up task
      const task = this.packingTasks.get(taskId)
      if (task) {
        task.cleanup()
        runInAction(() => {
          this.packingTasks.delete(taskId)
        })
      }

      return result
    } catch (error) {
      // Ensure cleanup
      const task = this.packingTasks.get(taskId)
      if (task) {
        task.cleanup()
        runInAction(() => {
          this.packingTasks.delete(taskId)
        })
      } else if (worker) {
        // If task creation failed, manually clean up
        runInAction(() => {
          this.activeWorkers.delete(worker!)
        })
        autoPackerWorkerPool.returnWorker(worker!)
        this.workerSemaphore.release()
      }

      throw error
    }
  }

  /**
   * Error handling
   */
  private handleError(error: Error, context: string): void {
    // Don't log cancel errors
    if (error.message === 'Packing cancelled') {
      return
    }

    console.error(`PackingEngine error in ${context}:`, error)

    if (this.config.enableSentry && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, {
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

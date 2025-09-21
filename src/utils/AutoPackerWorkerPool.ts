import AutoPackerWorker from 'src/workers/AutoPacker.worker?worker'

class AutoPackerWorkerPool {
  private workers: Worker[] = []
  private availableWorkers: Worker[] = []
  private busyWorkers: Set<Worker> = new Set()
  private maxWorkers = 4 // Base pool size
  private maxPoolSize = this.getOptimalPoolSize() // Maximum expandable size based on CPU count
  private isInitialized = false

  /**
   * Get optimal pool size based on CPU core count
   */
  private getOptimalPoolSize(): number {
    try {
      // Try to get CPU core count
      const cpuCores = navigator.hardwareConcurrency || 0
      if (cpuCores > 0) {
        // Use CPU core count, but don't exceed reasonable range
        return Math.min(Math.max(cpuCores, 4), 32)
      }
    } catch (error) {
      console.warn('Failed to detect CPU cores:', error)
    }
    // If unable to get CPU count, use default value 16
    return 16
  }

  constructor() {
    // Delayed initialization to avoid blocking startup
    this.delayedInitialize()

    // Expose worker pool status and reset in console for debugging
    if (typeof window !== 'undefined') {
      ;(window as any).getWorkerPoolStatus = () => this.getStatus()
      ;(window as any).resetWorkerPool = () => this.reset()
      ;(window as any).autoPackerWorkerPool = this
    }
  }

  /**
   * Delayed initialization of worker pool
   */
  private delayedInitialize(): void {
    // Initialize during idle time
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        () => {
          this.preInitializeWorkers()
        },
        { timeout: 2000 },
      )
    } else {
      // Fallback to short delay
      setTimeout(() => {
        this.preInitializeWorkers()
      }, 100)
    }
  }

  /**
   * Pre-initialize worker pool
   */
  private preInitializeWorkers(): void {
    if (this.isInitialized) return

    // Pre-create workers
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new AutoPackerWorker()
      // Add ID to worker for debugging
      ;(worker as any)._poolId = `pool-${i}`
      this.workers.push(worker)
      this.availableWorkers.push(worker)
    }

    this.isInitialized = true
  }

  /**
   * Get available worker - now supports async mode
   */
  async getWorkerAsync(): Promise<Worker> {
    // If not initialized, create one first
    if (!this.isInitialized) {
      return this.createWorkerAsync()
    }

    if (this.availableWorkers.length > 0) {
      // Use worker from pool
      const worker = this.availableWorkers.shift()!
      this.busyWorkers.add(worker)
      return worker
    } else if (this.workers.length < this.maxPoolSize) {
      // Dynamically expand pool, create new worker asynchronously
      const worker = await this.createWorkerAsync()
      ;(worker as any)._poolId = `pool-expansion-${this.workers.length}`

      // Add to pool for management
      this.workers.push(worker)
      this.busyWorkers.add(worker)
      return worker
    } else {
      // Pool has reached maximum capacity, create temporary worker
      const worker = await this.createWorkerAsync()
      ;(worker as any)._poolId = `temp-${Date.now()}`
      return worker
    }
  }

  /**
   * Create worker asynchronously to avoid blocking UI
   */
  private async createWorkerAsync(): Promise<Worker> {
    return new Promise((resolve) => {
      // Use setTimeout to defer worker creation to next event loop
      setTimeout(() => {
        const worker = new AutoPackerWorker()
        resolve(worker)
      }, 0)
    })
  }

  /**
   * Synchronous method for backward compatibility
   */
  getWorker(): Worker {
    // If not initialized, create one first
    if (!this.isInitialized) {
      return new AutoPackerWorker()
    }

    if (this.availableWorkers.length > 0) {
      // Use worker from pool
      const worker = this.availableWorkers.shift()!
      this.busyWorkers.add(worker)
      return worker
    } else {
      // When no worker is available, return a placeholder worker being created
      const worker = new AutoPackerWorker()
      ;(worker as any)._poolId = `sync-fallback-${Date.now()}`
      return worker
    }
  }

  /**
   * Return worker to pool
   * Caller should call this method after completing the task
   */
  returnWorker(
    worker: Worker,
    eventListener?: (event: MessageEvent) => void,
  ): void {
    if (!this.isInitialized) return

    // Check if worker is actually in busy set to avoid duplicate returns
    if (!this.busyWorkers.has(worker) && this.workers.includes(worker)) {
      return
    }

    // Remove from busy set
    this.busyWorkers.delete(worker)

    // Check if it's a worker from the pool
    if (this.workers.includes(worker)) {
      // Clean event listeners - remove if listener provided
      if (eventListener) {
        worker.removeEventListener('message', eventListener as EventListener)
      }

      // Clean all possible event listeners
      if (worker.onmessage) worker.onmessage = null
      if (worker.onerror) worker.onerror = null

      // Check if already in available pool to avoid duplicate addition
      if (!this.availableWorkers.includes(worker)) {
        this.availableWorkers.push(worker)
      }
    } else {
      // Not a worker from the pool, terminate directly
      worker.terminate()
    }
  }

  /**
   * Get worker pool status
   */
  getStatus() {
    const cpuCores = navigator.hardwareConcurrency || 0
    return {
      isInitialized: this.isInitialized,
      maxWorkers: this.maxWorkers,
      maxPoolSize: this.maxPoolSize,
      detectedCpuCores: cpuCores,
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.busyWorkers.size,
      busyWorkersList: Array.from(this.busyWorkers).map((w) => ({
        id: (w as any)._poolId || 'unknown',
      })),
    }
  }

  /**
   * Reset worker pool - terminate all workers and clear state
   * Useful for cancelling all ongoing operations
   */
  reset(): void {
    console.log('🔄 Resetting worker pool...')

    // Terminate all workers
    this.workers.forEach((worker) => {
      try {
        worker.terminate()
      } catch (error) {
        console.error('Failed to terminate worker:', error)
      }
    })

    // Also terminate any busy workers not in the main pool
    this.busyWorkers.forEach((worker) => {
      try {
        if (!this.workers.includes(worker)) {
          worker.terminate()
        }
      } catch (error) {
        console.error('Failed to terminate busy worker:', error)
      }
    })

    // Clear all collections
    this.workers = []
    this.availableWorkers = []
    this.busyWorkers.clear()
    this.isInitialized = false

    // Re-initialize after a short delay
    setTimeout(() => {
      this.preInitializeWorkers()
    }, 100)
  }

  /**
   * Destroy worker pool
   */
  destroy(): void {
    // Terminate all workers
    this.workers.forEach((worker) => {
      worker.terminate()
    })

    this.workers = []
    this.availableWorkers = []
    this.busyWorkers.clear()
    this.isInitialized = false
  }
}

// Create singleton instance
export const autoPackerWorkerPool = new AutoPackerWorkerPool()

export default AutoPackerWorkerPool

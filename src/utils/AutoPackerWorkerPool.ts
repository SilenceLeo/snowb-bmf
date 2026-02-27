import AutoPackerWorker from 'src/workers/AutoPacker.worker?worker'

/** Worker extended with debugging metadata */
interface PoolWorker extends Worker {
  _poolId?: string
}

class AutoPackerWorkerPool {
  /** Delay before re-initializing workers after reset (ms) */
  private static readonly REINIT_DELAY_MS = 100

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
        // Use CPU core count, capped at 8 to align with PackingEngine maxConcurrentWorkers
        return Math.min(Math.max(cpuCores, 4), 8)
      }
    } catch (error) {
      console.warn('Failed to detect CPU cores:', error)
    }
    // If unable to get CPU count, use default value 8
    return 8
  }

  constructor() {
    // Delayed initialization to avoid blocking startup
    this.delayedInitialize()

    // Expose worker pool instance on window (used by PackingEngine at runtime)
    if (typeof window !== 'undefined') {
      window.autoPackerWorkerPool = this
      if (import.meta.env.DEV) {
        window.getWorkerPoolStatus = () => this.getStatus()
        window.resetWorkerPool = () => this.reset()
      }
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
      }, AutoPackerWorkerPool.REINIT_DELAY_MS)
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
      ;(worker as PoolWorker)._poolId = `pool-${i}`
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
      ;(worker as PoolWorker)._poolId = `pool-expansion-${this.workers.length}`

      // Add to pool for management
      this.workers.push(worker)
      this.busyWorkers.add(worker)
      return worker
    } else {
      // Pool has reached maximum capacity, create temporary worker
      const worker = await this.createWorkerAsync()
      ;(worker as PoolWorker)._poolId = `temp-${Date.now()}`
      return worker
    }
  }

  /**
   * Create a new worker. Worker constructor is synchronous; wrapping in
   * setTimeout(0) provided no real async benefit, so we return directly.
   */
  private createWorkerAsync(): Promise<Worker> {
    return Promise.resolve(new AutoPackerWorker())
  }

  /**
   * Remove worker from pool entirely (e.g., after termination due to timeout)
   * Unlike returnWorker, this does not return the worker to the available pool
   */
  removeWorker(worker: Worker): void {
    this.busyWorkers.delete(worker)
    const idx = this.workers.indexOf(worker)
    if (idx !== -1) {
      this.workers.splice(idx, 1)
    }
    const availIdx = this.availableWorkers.indexOf(worker)
    if (availIdx !== -1) {
      this.availableWorkers.splice(availIdx, 1)
    }
  }

  /**
   * Return worker to pool
   * Caller should call this method after completing the task
   */
  returnWorker(worker: Worker): void {
    if (!this.isInitialized) return

    // Check if worker is actually in busy set to avoid duplicate returns
    if (!this.busyWorkers.has(worker) && this.workers.includes(worker)) {
      return
    }

    // Remove from busy set
    this.busyWorkers.delete(worker)

    // Check if it's a worker from the pool
    if (this.workers.includes(worker)) {
      // Event listeners are cleaned up by PackingEngine's task.cleanup()
      // via removeEventListener with the actual handler references

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
        id: (w as PoolWorker)._poolId || 'unknown',
      })),
    }
  }

  /**
   * Reset worker pool - terminate all workers and clear state
   * Useful for cancelling all ongoing operations
   */
  reset(): void {
    console.log('[WorkerPool] Resetting...')

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
    }, AutoPackerWorkerPool.REINIT_DELAY_MS)
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

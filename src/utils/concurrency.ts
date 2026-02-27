/**
 * Simple semaphore implementation for limiting concurrency count
 */
export class Semaphore {
  private queue: (() => void)[] = []
  private currentCount: number
  private readonly maxCount: number

  constructor(maxCount: number) {
    this.maxCount = maxCount
    this.currentCount = maxCount
  }

  /**
   * Acquire semaphore, wait if limit is reached
   */
  async acquire(): Promise<void> {
    if (this.currentCount > 0) {
      this.currentCount--
      return
    }

    // Limit reached, join waiting queue
    return new Promise<void>((resolve) => {
      this.queue.push(resolve)
    })
  }

  /**
   * Release semaphore
   */
  release(): void {
    const next = this.queue.shift()
    if (next) {
      // Has waiting tasks, execute directly
      next()
    } else if (this.currentCount < this.maxCount) {
      // No waiting tasks, increase available count (guard against over-release)
      this.currentCount++
    }
  }

  /**
   * Get current available semaphore count
   */
  get available(): number {
    return this.currentCount
  }

  /**
   * Get waiting queue length
   */
  get waiting(): number {
    return this.queue.length
  }

  /**
   * Reset semaphore to initial state.
   * Resolves all pending acquire() Promises to prevent memory leaks.
   * Callers waiting on acquire() will proceed and should check cancellation state.
   */
  reset(): void {
    const pending = this.queue
    this.queue = []
    this.currentCount = this.maxCount
    // Resolve (not reject) — callers proceed then check abort signal
    pending.forEach((resolve) => resolve())
  }
}

/**
 * Check if an error is a cancellation/abort error.
 * Unifies detection across PackingEngine and packing actions.
 */
export function isCancelError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true
  if (error instanceof Error) {
    return error.message === 'Packing cancelled'
  }
  return false
}

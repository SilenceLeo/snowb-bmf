/**
 * Simple semaphore implementation for limiting concurrency count
 */
export class Semaphore {
  private queue: (() => void)[] = []
  private currentCount: number

  constructor(maxCount: number) {
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
    } else {
      // No waiting tasks, increase available count
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
}

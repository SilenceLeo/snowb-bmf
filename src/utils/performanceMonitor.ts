/**
 * Performance monitoring utility for tracking operation times
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number[]> = new Map()

  /**
   * Start timing an operation
   */
  start(name: string): void {
    this.marks.set(name, performance.now())
  }

  /**
   * End timing an operation and record the duration
   */
  end(name: string): number {
    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`No start mark found for "${name}"`)
      return 0
    }

    const duration = performance.now() - startTime
    this.marks.delete(name)

    // Store measure
    const measures = this.measures.get(name) || []
    measures.push(duration)
    this.measures.set(name, measures)

    return duration
  }

  /**
   * Log timing with optional details
   */
  logTiming(name: string, details?: string): void {
    const duration = this.end(name)
    if (duration > 0) {
      const emoji = duration < 100 ? '⚡' : duration < 1000 ? '🚀' : '🐢'
      console.log(
        `${emoji} ${name}: ${duration.toFixed(2)}ms${details ? ` (${details})` : ''}`,
      )
    }
  }

  /**
   * Get average duration for an operation
   */
  getAverage(name: string): number {
    const measures = this.measures.get(name)
    if (!measures || measures.length === 0) return 0

    const sum = measures.reduce((a, b) => a + b, 0)
    return sum / measures.length
  }

  /**
   * Get statistics for an operation
   */
  getStats(name: string): {
    count: number
    min: number
    max: number
    avg: number
    total: number
  } | null {
    const measures = this.measures.get(name)
    if (!measures || measures.length === 0) return null

    return {
      count: measures.length,
      min: Math.min(...measures),
      max: Math.max(...measures),
      avg: this.getAverage(name),
      total: measures.reduce((a, b) => a + b, 0),
    }
  }

  /**
   * Clear all marks and measures
   */
  clear(): void {
    this.marks.clear()
    this.measures.clear()
  }

  /**
   * Log all statistics
   */
  logAllStats(): void {
    console.log('📊 Performance Statistics:')
    this.measures.forEach((_, name) => {
      const stats = this.getStats(name)
      if (stats) {
        console.log(
          `  ${name}: ${stats.count} calls, avg: ${stats.avg.toFixed(2)}ms, ` +
            `min: ${stats.min.toFixed(2)}ms, max: ${stats.max.toFixed(2)}ms, ` +
            `total: ${stats.total.toFixed(2)}ms`,
        )
      }
    })
  }
}

// Global instance for debugging
export const globalPerformanceMonitor = new PerformanceMonitor()

// Expose to window for debugging
if (typeof window !== 'undefined') {
  ;(window as any).performanceMonitor = globalPerformanceMonitor
  ;(window as any).logPerformanceStats = () =>
    globalPerformanceMonitor.logAllStats()
}

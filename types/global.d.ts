import './theme/index.d'
import './workers/index.d'
import './opentype.js/index.d'
import './fonteditor-core/index.d'

// Debug globals exposed by AutoPackerWorkerPool
declare global {
  interface Window {
    getWorkerPoolStatus?: () => Record<string, unknown>
    resetWorkerPool?: () => void
    autoPackerWorkerPool?: import('../src/utils/AutoPackerWorkerPool').default
    Sentry?: {
      captureException: (error: unknown, context?: Record<string, unknown>) => void
    }
  }
}

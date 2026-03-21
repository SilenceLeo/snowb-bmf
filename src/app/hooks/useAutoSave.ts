import { observe } from '@legendapp/state'
import { useEffect, useRef } from 'react'
import {
  glyphStore$,
  isInitializing,
  layoutStore$,
  projectStore$,
  styleStore$,
} from 'src/store/legend'
import { saveLegendWorkspace } from 'src/utils/persistence'

const DEBOUNCE_MS = 3000

/**
 * Hook to automatically save workspace to IndexedDB via debounced store observation.
 * Primary mechanism: store changes trigger a 3s debounced save.
 * Fallback: beforeunload and visibilitychange events for edge cases.
 */
export function useAutoSave(): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSavingRef = useRef(false)

  useEffect(() => {
    const debouncedSave = () => {
      if (isInitializing()) return
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        if (isSavingRef.current || isInitializing()) return
        isSavingRef.current = true
        try {
          await saveLegendWorkspace()
        } finally {
          isSavingRef.current = false
        }
      }, DEBOUNCE_MS)
    }

    const disposers = [
      observe(styleStore$, debouncedSave),
      observe(layoutStore$, debouncedSave),
      observe(glyphStore$, debouncedSave),
      observe(projectStore$, debouncedSave),
    ]

    const handleBeforeUnload = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      saveLegendWorkspace()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (timerRef.current) clearTimeout(timerRef.current)
        saveLegendWorkspace()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      disposers.forEach((d) => d())
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}

export default useAutoSave

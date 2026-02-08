import { useEffect } from 'react'
import { saveLegendWorkspace } from 'src/utils/persistence'

/**
 * Hook to automatically save workspace to IndexedDB when user leaves the page
 * Uses Legend State stores directly (no workspace parameter needed)
 */
export function useAutoSave(): void {
  useEffect(() => {
    // Save function that will be called on page unload
    const handleBeforeUnload = () => {
      try {
        saveLegendWorkspace()
      } catch (error) {
        console.error('[AutoSave] Failed to save:', error)
      }
    }

    // Backup save when tab becomes hidden (e.g., switching tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        try {
          saveLegendWorkspace()
        } catch (error) {
          console.error('[AutoSave] Failed to save:', error)
        }
      }
    }

    // Register event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}

export default useAutoSave

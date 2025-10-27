import { useEffect, useRef } from 'react'
import type Workspace from 'src/store/workspace'
import { saveWorkspace } from 'src/utils/persistence'

/**
 * Hook to automatically save workspace to IndexedDB when user leaves the page
 * @param workspace - The workspace instance to save
 */
export function useAutoSave(workspace: Workspace | null): void {
  const workspaceRef = useRef<Workspace | null>(workspace)

  // Keep ref updated
  useEffect(() => {
    workspaceRef.current = workspace
  }, [workspace])

  useEffect(() => {
    // Save function that will be called on page unload
    const handleBeforeUnload = () => {
      const currentWorkspace = workspaceRef.current
      if (!currentWorkspace) return

      try {
        // Use synchronous save approach to ensure data is saved before page unloads
        // We use a promise but don't await it in beforeunload as browsers may terminate
        saveWorkspace(currentWorkspace)
        console.log('[AutoSave] Triggered save on beforeunload')
      } catch (error) {
        console.error('[AutoSave] Failed to save on beforeunload:', error)
      }
    }

    // Backup save when tab becomes hidden (e.g., switching tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const currentWorkspace = workspaceRef.current
        if (!currentWorkspace) return

        try {
          saveWorkspace(currentWorkspace)
          console.log('[AutoSave] Triggered save on visibility change')
        } catch (error) {
          console.error(
            '[AutoSave] Failed to save on visibility change:',
            error,
          )
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

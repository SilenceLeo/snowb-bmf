import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import {
  cleanupListeners,
  initLegendState,
  initializeProject,
  setupAutoRunListeners,
} from 'src/store/legend'
import { loadWorkspaceToLegendState } from 'src/utils/persistence'

import DynamicTitle from './components/DynamicTitle'
import useAutoSave from './hooks/useAutoSave'
import Wrap from './layout/Wrap'
import theme from './theme'

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true)

  // Auto-save workspace on page unload
  useAutoSave()

  useEffect(() => {
    let cancelled = false

    // Initialize Legend State
    initLegendState()

    // Initialize store asynchronously
    const init = async () => {
      try {
        // Try to restore from IndexedDB
        const loaded = await loadWorkspaceToLegendState()

        if (cancelled) return

        if (!loaded) {
          // No saved data, initialize default project
          await initializeProject()
        } else {
          // Setup listeners for the loaded project
          setupAutoRunListeners()
        }
      } catch (error) {
        if (cancelled) return
        console.error('[App] Failed to initialize store:', error)
        // Even if loading fails, create a new project
        try {
          await initializeProject()
        } catch (fallbackError) {
          console.error(
            '[App] Failed to create fallback project:',
            fallbackError,
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      cleanupListeners()
    }
  }, [])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              color: '#fff',
              fontSize: '16px',
            }}
          >
            Loading...
          </div>
        ) : (
          <SnackbarProvider
            anchorOrigin={{
              horizontal: 'center',
              vertical: 'top',
            }}
          >
            <DynamicTitle />
            <Wrap />
          </SnackbarProvider>
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App

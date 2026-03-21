import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { useEffect } from 'react'
import {
  cleanupListeners,
  initLegendState,
  initPackingEngine,
  initializeProject,
  packStyle,
  setupAutoRunListeners,
} from 'src/store/legend'
import { loadGradientPresets } from 'src/store/legend/stores/gradientPresetStore'
import { loadWorkspaceToLegendState } from 'src/utils/persistence'

import DynamicTitle from './components/DynamicTitle'
import useAutoSave from './hooks/useAutoSave'
import Wrap from './layout/Wrap'
import theme from './theme'

function App(): React.JSX.Element {
  // Auto-save workspace on page unload
  useAutoSave()

  useEffect(() => {
    let cancelled = false

    // Initialize Legend State
    initLegendState()
    loadGradientPresets()

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
          // Restored project needs packing before listeners
          initPackingEngine()
          await packStyle()
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
        <SnackbarProvider
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
        >
          <DynamicTitle />
          <Wrap />
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App

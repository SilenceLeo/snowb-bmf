import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import createStore, { type Store, StoreContext } from 'src/store'

import DynamicTitle from './components/DynamicTitle'
import useAutoSave from './hooks/useAutoSave'
import Wrap from './layout/Wrap'
import theme from './theme'

function App(): React.JSX.Element {
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-save workspace on page unload
  useAutoSave(store?.workspace ?? null)

  useEffect(() => {
    // Initialize store asynchronously
    createStore()
      .then((initializedStore) => {
        setStore(initializedStore)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('[App] Failed to initialize store:', error)
        // Even if loading fails, create a new store
        setIsLoading(false)
      })
  }, [])

  // Show loading indicator while initializing
  if (isLoading || !store) {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
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
        </ThemeProvider>
      </StyledEngineProvider>
    )
  }

  return (
    <StoreContext value={store}>
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
    </StoreContext>
  )
}

export default App

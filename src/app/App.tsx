import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import createStore, { StoreContext } from 'src/store'

import Wrap from './layout/Wrap'
import theme from './theme'

function App(): JSX.Element {
  return (
    <StoreContext.Provider value={createStore()}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            anchorOrigin={{
              horizontal: 'center',
              vertical: 'top',
            }}
          >
            <Wrap />
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StoreContext.Provider>
  )
}

export default App

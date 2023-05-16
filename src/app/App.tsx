import { Provider } from 'mobx-react'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material/styles'

import createStore from 'src/store'
import theme from './theme'

import Wrap from './layout/Wrap'

function App(): JSX.Element {
  return (
    <Provider {...createStore()}>
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
    </Provider>
  )
}

export default App

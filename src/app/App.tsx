import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import createStore, { StoreContext } from 'src/store'

import DynamicTitle from './components/DynamicTitle'
import GoogleAnalytics from './components/GoogleAnalytics'
import Wrap from './layout/Wrap'
import theme from './theme'

function App(): React.JSX.Element {
  return (
    <StoreContext value={createStore()}>
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
            <GoogleAnalytics />
            <Wrap />
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StoreContext>
  )
}

export default App

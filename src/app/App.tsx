import React from 'react'
import { Provider } from 'mobx-react'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'

import createStore from 'src/store'
import theme from './theme'

import Wrap from './layout/Wrap'

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider {...createStore()}>
        <SnackbarProvider
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
        >
          <Wrap />
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App

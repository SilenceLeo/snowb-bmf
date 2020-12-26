import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider } from 'mobx-react'

import createStore from 'src/store'
import theme from './theme'

import Wrap from './layout/Wrap'

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider {...createStore()}>
        <Wrap />
      </Provider>
    </ThemeProvider>
  )
}

export default App

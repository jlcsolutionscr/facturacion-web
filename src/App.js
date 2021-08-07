import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import appReducer from 'store/reducer'
import { INITIAL_STATE } from 'store/InitialState'

import RoutingPage from 'pages/routing-page'

const store = createStore(appReducer, INITIAL_STATE, applyMiddleware(thunk))

const theme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 20
      }
    }
  }
})

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RoutingPage />
      </ThemeProvider>
    </Provider>
  )
}

export default App
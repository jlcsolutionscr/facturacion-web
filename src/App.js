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
  palette: {
    type: 'dark',
    primary: {
      main: '#90CAF9'
    }
  },
  overrides: {
    MuiInputLabel: {
      root: {
        "&$focused": {
          color: "#90CAF9"
        }
      }
    },
    MuiInput: {
      underline: {
        '&$focused:after': {
          borderColor: "#90CAF9"
        }
      }
    },
    MuiOutlinedInput: {
      root: {
        '&$focused $notchedOutline': {
          borderColor: "#90CAF9"
        }
      }
    },
    MuiLink: {
      root: {
        color: '#90CAF9'
      }
    },
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
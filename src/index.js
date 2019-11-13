import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import appReducer from './store/reducer'
import { INITIAL_STATE } from './store/InitialState'

import './index.css'

import App from './components/App'

import * as serviceWorker from './serviceWorker'
import './fonts/RussoOne-Regular.ttf'

const store = createStore(appReducer, INITIAL_STATE, applyMiddleware(thunk))

const theme = createMuiTheme({
    overrides: {
      MuiButton: {
        outlined: {
          borderRadius: 2
        }
      }
    }
  })

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <div style={{minWidth: `${window.innerWidth / 8 * 7}px`}} >
        <App />
      </div>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()

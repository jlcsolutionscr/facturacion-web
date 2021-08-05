import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import appReducer from 'store/reducer'
import { INITIAL_STATE } from 'store/InitialState'

import './index.css'

import InfoPage from 'components/info/info-page'
import PrivacyPolicyPage from 'components/privacy-policy/privacy-policy-page'
import FacturacionPage from 'components/billing/facturacion-page'

import * as serviceWorker from './serviceWorker'
import './fonts/RussoOne-Regular.ttf'

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

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path='/info' component={InfoPage} />
          <Route exact path='/privacypolicy' component={PrivacyPolicyPage} />
          <Route exact path='/facturacion' component={FacturacionPage} />
          <Redirect from="/" to="/info" />
        </Switch>
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()

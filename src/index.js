import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import { routerMiddleware } from 'react-router-redux'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import appReducer from './store/reducer'
import { INITIAL_STATE } from './store/InitialState'

import './index.css'

import InfoPage from 'components/info/invoice/info-page'
import PrivacyPolicyPage from 'components/privacy-policy/privacy-policy-page'
import EnterprisePage from 'components/enterprise/enterprise-page'

import * as serviceWorker from './serviceWorker'
import './fonts/RussoOne-Regular.ttf'

const browserHistory = createBrowserHistory()
const store = createStore(appReducer, INITIAL_STATE, applyMiddleware(thunk, routerMiddleware(browserHistory)))
const history = syncHistoryWithStore(browserHistory, store)

const theme = createMuiTheme({
    overrides: {
      MuiButton: {
        root: {
          borderRadius: 25
        }
      }
    }
  })

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path='/info' component={InfoPage} />
          <Route exact path='/privacypolicy' component={PrivacyPolicyPage} />
          <Route exact path='/enterprise' component={EnterprisePage} />
          <Redirect from="/" to="/info" />
        </Switch>
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()

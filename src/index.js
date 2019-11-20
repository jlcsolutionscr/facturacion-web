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

import App from 'components/app'
import LoginPage from 'components/login/login-page'
import CompanyPage from 'components/company/company-page'
import ReportsPage from 'components/reports/reports-page'

import * as serviceWorker from './serviceWorker'
import './fonts/RussoOne-Regular.ttf'

const browserHistory = createBrowserHistory()
const store = createStore(appReducer, INITIAL_STATE, applyMiddleware(thunk, routerMiddleware(browserHistory)))
const history = syncHistoryWithStore(browserHistory, store)

const theme = createMuiTheme({
    overrides: {
      MuiButton: {
        root: {
          borderRadius: 25,
          '&$disabled': {
            color: 'rgba(255,255,255,0.65)'
          }
        }
      }
    }
  })

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path='/home' component={App} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/company' component={CompanyPage} />
          <Route exact path='/reports' component={ReportsPage} />
          <Redirect from="/" to="/home" />
        </Switch>
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()

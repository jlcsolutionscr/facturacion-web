import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import uiReducer from './ui/reducer'
import sessionReducer from './session/reducer'
import invoiceReducer from './invoice/reducer'
import visitortrackingReducer from './visitortracking/reducer'

export default combineReducers({
  ui: uiReducer,
  session: sessionReducer,
  invoice: invoiceReducer,
  visitortracking: visitortrackingReducer,
  routing
})

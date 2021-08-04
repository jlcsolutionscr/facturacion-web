import { combineReducers } from 'redux'

import uiReducer from './ui/reducer'
import sessionReducer from './session/reducer'
import invoiceReducer from './invoice/reducer'

export default combineReducers({
  ui: uiReducer,
  session: sessionReducer,
  invoice: invoiceReducer
})

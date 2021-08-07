import { combineReducers } from 'redux'

import companyReducer from './company/reducer'
import customerReducer from './customer/reducer'
import invoiceReducer from './invoice/reducer'
import sessionReducer from './session/reducer'
import uiReducer from './ui/reducer'

export default combineReducers({
  company: companyReducer,
  customer: customerReducer,
  invoice: invoiceReducer,
  session: sessionReducer,
  ui: uiReducer
})

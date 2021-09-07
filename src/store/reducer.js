import { combineReducers } from 'redux'

import companyReducer from './company/reducer'
import customerReducer from './customer/reducer'
import productReducer from './product/reducer'
import invoiceReducer from './invoice/reducer'
import receiptReducer from './receipt/reducer'
import workingOrderReducer from './working-order/reducer'
import documentReducer from './document/reducer'
import sessionReducer from './session/reducer'
import uiReducer from './ui/reducer'

export default combineReducers({
  company: companyReducer,
  customer: customerReducer,
  product: productReducer,
  invoice: invoiceReducer,
  receipt: receiptReducer,
  document: documentReducer,
  workingOrder: workingOrderReducer,
  session: sessionReducer,
  ui: uiReducer
})

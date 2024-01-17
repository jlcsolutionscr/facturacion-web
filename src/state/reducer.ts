import { combineReducers } from "redux";

import companyReducer from "./company/reducer";
import customerReducer from "./customer/reducer";
import documentReducer from "./document/reducer";
import invoiceReducer from "./invoice/reducer";
import productReducer from "./product/reducer";
import receiptReducer from "./receipt/reducer";
import sessionReducer from "./session/reducer";
import uiReducer from "./ui/reducer";
import workingOrderReducer from "./working-order/reducer";

export default combineReducers({
  company: companyReducer,
  customer: customerReducer,
  product: productReducer,
  invoice: invoiceReducer,
  receipt: receiptReducer,
  document: documentReducer,
  workingOrder: workingOrderReducer,
  session: sessionReducer,
  ui: uiReducer,
});

import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./listener-middleware";

import uiReducer from "./ui/reducer";
import sessionReducer from "./session/reducer";
import companyReducer from "./company/reducer";
import customerReducer from "./customer/reducer";
import documentReducer from "./document/reducer";
import productReducer from "./product/reducer";
import invoiceReducer from "./invoice/reducer";
import receiptReducer from "./receipt/reducer";
import workingOrderReducer from "./working-order/reducer";

const store = configureStore({
  reducer: {
    ui: uiReducer,
    session: sessionReducer,
    company: companyReducer,
    customer: customerReducer,
    document: documentReducer,
    product: productReducer,
    invoice: invoiceReducer,
    receipt: receiptReducer,
    workingOrder: workingOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

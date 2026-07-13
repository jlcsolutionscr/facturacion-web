import { configureStore, Middleware } from "@reduxjs/toolkit";

import companyReducer from "./company/reducer";
import customerReducer from "./customer/reducer";
import documentReducer from "./document/reducer";
import invoiceReducer from "./invoice/reducer";
import { listenerMiddleware } from "./listener-middleware";
import productReducer from "./product/reducer";
import proformaReducer from "./proforma/reducer";
import receiptReducer from "./receipt/reducer";
import sessionReducer from "./session/reducer";
import uiReducer from "./ui/reducer";
import workingOrderReducer from "./working-order/reducer";
import setupUiListeners from "state/ui/listener";
import { IS_LOGGER_ENABLED, LOGGER_ENTRIES } from "utils/constants";
import { readyKeyFromStorage, writeKeyToStorage } from "utils/utilities";

const isLoggingEnabled = readyKeyFromStorage(IS_LOGGER_ENABLED) || false;

const loggerMiddleware: Middleware = () => next => action => {
  const storageData = readyKeyFromStorage(LOGGER_ENTRIES);
  let logEntries = [];
  if (storageData) {
    logEntries = storageData;
  }
  if (logEntries.length > 300) logEntries.shift();
  logEntries.push(`${action.type}: ${new Date().toLocaleString()}`);
  writeKeyToStorage(LOGGER_ENTRIES, logEntries);
  return next(action);
};

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
    proforma: proformaReducer,
  },
  middleware: getDefaultMiddleware => {
    return isLoggingEnabled
      ? getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(loggerMiddleware)
      : getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});

setupUiListeners();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

import { SET_INVOICE_ATTRIBUTES, SET_LIST_PAGE, SET_LIST_COUNT, SET_LIST, RESET_INVOICE } from "./types";

import { defaultInvoice } from "utils/defaults";

import { LOGOUT } from "store/session/types";

const invoiceReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_INVOICE_ATTRIBUTES:
      return { ...state, ...payload };
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page };
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count };
    case SET_LIST:
      return { ...state, list: payload.list };
    case LOGOUT:
    case RESET_INVOICE:
      return {
        ...defaultInvoice,
        activityCode: state.activityCode,
      };
    default:
      return state;
  }
};

export default invoiceReducer;

import { SET_PROFORMA_ATTRIBUTES, SET_LIST_PAGE, SET_LIST_COUNT, SET_LIST, RESET_PROFORMA } from "./types";

import { defaultProforma } from "utils/defaults";

import { LOGOUT } from "store/session/types";

const invoiceReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_PROFORMA_ATTRIBUTES:
      return { ...state, ...payload };
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page };
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count };
    case SET_LIST:
      return { ...state, list: payload.list };
    case LOGOUT:
    case RESET_PROFORMA:
      return { ...defaultProforma, listPage: 1, listCount: 0, list: [] };
    default:
      return state;
  }
};

export default invoiceReducer;

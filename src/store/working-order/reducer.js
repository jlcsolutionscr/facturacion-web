import {
  SET_ORDER_ATTRIBUTES,
  SET_DELIVERY_ATTRIBUTE,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  RESET_ORDER,
} from "./types";

import { defaultWorkingOrder } from "utils/defaults";

import { LOGOUT } from "store/session/types";

const workingOrderReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_ORDER_ATTRIBUTES:
      return { ...state, ...payload };
    case SET_DELIVERY_ATTRIBUTE:
      return { ...state, status: "on-progress", delivery: { ...state.delivery, [payload.attribute]: payload.value } };
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page };
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count };
    case SET_LIST:
      return { ...state, list: payload.list };
    case LOGOUT:
    case RESET_ORDER:
      return {
        ...state,
        ...defaultWorkingOrder,
        activityCode: state.activityCode,
      };
    default:
      return state;
  }
};

export default workingOrderReducer;

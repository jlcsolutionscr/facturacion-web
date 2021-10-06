import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_DETAILS_LIST,
  SET_PAYMENT_ID,
  SET_CASH_ADVANCE,
  SET_SUMMARY,
  SET_DELIVERY_ATTRIBUTE,
  SET_ID,
  SET_INVOICE_ID,
  SET_STATUS,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  RESET_ORDER,
  SET_SERVICE_POINT_LIST
} from './types'

import { defaultWorkingOrder } from 'utils/defaults'

import { LOGOUT } from 'store/session/types'

const workingOrderReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_DESCRIPTION:
      return { ...state, description: payload.description }
    case SET_QUANTITY:
      return { ...state, quantity: payload.quantity }
    case SET_PRICE:
      return { ...state, price: payload.price }
    case SET_DETAILS_LIST:
      return { ...state, status: 'on-progress', detailsList: payload.details }
    case SET_SUMMARY:
      return { ...state, summary: payload.summary }
    case SET_PAYMENT_ID:
      return { ...state, paymentId: payload.id }
    case SET_CASH_ADVANCE:
      return { ...state, cashAdvance: payload.cash }
    case SET_DELIVERY_ATTRIBUTE:
      return { ...state, status: 'on-progress', delivery: {...state.delivery, [payload.attribute]: payload.value }}
    case SET_ID:
      return { ...state, workingOrderId: payload.id }
    case SET_INVOICE_ID:
      return { ...state, invoiceId: payload.id }
    case SET_STATUS:
      return { ...state, status: payload.status }
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page }
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count }
    case SET_LIST:
      return { ...state, list: payload.list }
    case SET_SERVICE_POINT_LIST:
      return { ...state, servicePointList: payload.list }
    case LOGOUT:
    case RESET_ORDER:
      return {
        ...state,
        ...defaultWorkingOrder
      }
    default:
      return state
  }
}

export default workingOrderReducer
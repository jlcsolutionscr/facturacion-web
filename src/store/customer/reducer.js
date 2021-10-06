import {
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  SET_CUSTOMER,
  SET_PRICE_TYPE_LIST,
  SET_CUSTOMER_ATTRIBUTE
} from './types'

import { RESET_INVOICE } from 'store/invoice/types'
import { RESET_ORDER } from 'store/working-order/types'
import { LOGOUT } from 'store/session/types'

import { defaultCustomer } from 'utils/defaults'

const customerReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page }
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count }
    case SET_LIST:
      return { ...state, list: payload.list }
    case SET_CUSTOMER:
      return { ...state, customer: payload.customer }
    case SET_PRICE_TYPE_LIST:
      return { ...state, priceTypeList: payload.list }
    case SET_CUSTOMER_ATTRIBUTE:
      return { ...state, customer: {...state.customer, [payload.attribute]: payload.value }}
    case RESET_INVOICE:
    case RESET_ORDER:
      return { ...state, customer: defaultCustomer }
    case LOGOUT:
      return { ...state, customer: null, customerList: [] }
    default:
      return state
  }
}

export default customerReducer

import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER,
  SET_ID_TYPE_LIST,
  SET_PRICE_TYPE_LIST,
  SET_EXONERATION_TYPE_LIST,
  SET_CUSTOMER_ATTRIBUTE
} from './types'

import { LOGOUT } from 'store/session/types'

const customerReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_CUSTOMER_LIST:
      return { ...state, customerList: payload.list }
    case SET_CUSTOMER:
      return { ...state, customer: payload.customer }
    case SET_ID_TYPE_LIST:
      return { ...state, idTypeList: payload.list }
    case SET_PRICE_TYPE_LIST:
      return { ...state, priceTypeList: payload.list }
    case SET_EXONERATION_TYPE_LIST:
      return { ...state, exonerationTypeList: payload.list }
    case SET_CUSTOMER_ATTRIBUTE:
      return { ...state, customer: {...state.customer, [payload.attribute]: payload.value }}
    case LOGOUT:
      return { ...state, customer: null, customerList: [] }
    default:
      return state
  }
}

export default customerReducer

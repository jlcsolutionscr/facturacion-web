import {
  SET_PRODUCT_LIST,
  SET_PRODUCT,
  SET_PRODUCT_TYPE_LIST,
  SET_CATEGORY_LIST,
  SET_PROVIDER_LIST,
  SET_PRODUCT_ATTRIBUTE
} from './types'

import { RESET_INVOICE } from 'store/invoice/types'
import { RESET_ORDER } from 'store/working-order/types'
import { LOGOUT } from 'store/session/types'

const productReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_PRODUCT_LIST:
      return { ...state, productList: payload.list }
    case SET_PRODUCT:
      return { ...state, product: payload.product }
    case SET_PRODUCT_TYPE_LIST:
      return { ...state, productTypeList: payload.list }
    case SET_CATEGORY_LIST:
      return { ...state, categoryList: payload.list }
    case SET_PROVIDER_LIST:
      return { ...state, providerList: payload.list }
    case SET_PRODUCT_ATTRIBUTE:
      return { ...state, product: {...state.product, [payload.attribute]: payload.value }}
    case RESET_INVOICE:
    case RESET_ORDER:
      return { ...state, product: null }
    case LOGOUT:
      return { ...state, product: null, productList: [] }
    default:
      return state
  }
}

export default productReducer

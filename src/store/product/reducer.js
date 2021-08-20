import {
  SET_PRODUCT_LIST,
  SET_PRODUCT,
  SET_PRODUCT_TYPE_LIST,
  SET_CATEGORY_LIST,
  SET_PROVIDER_LIST,
  SET_PRODUCT_ATTRIBUTE
} from './types'

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
    default:
      return state
  }
}

export default productReducer

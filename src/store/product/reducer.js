import {
  SET_PRODUCT_LIST,
  SET_PRODUCT
} from './types'

const productReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_PRODUCT_LIST:
      return { ...state, productList: payload.list }
    case SET_PRODUCT:
      return { ...state, product: payload.product }
    default:
      return state
  }
}

export default productReducer

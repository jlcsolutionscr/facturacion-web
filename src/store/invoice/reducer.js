import {
  RESET_INVOICE,
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_PAYMENT,
  SET_SUCCESSFUL
} from './types'

const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case RESET_INVOICE:
      return { ...state, description: '', quantity: 1, price: 0, productDetails: [], payment: null }
    case SET_DESCRIPTION:
      return { ...state, description: payload.description }
    case SET_QUANTITY:
      return { ...state, quantity: payload.quantity }
    case SET_PRICE:
      return { ...state, price: payload.price }
    case SET_PRODUCTS_DETAIL:
      return { ...state, productDetails: payload.details }
    case SET_SUMMARY:
      return { ...state, summary: payload.summary }
    case SET_PAYMENT:
      return { ...state, payment: payload.payment }
    case SET_SUCCESSFUL:
      return { ...state, successful: payload.success }
    default:
      return state
  }
}

export default companyReducer

import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_PAYMENT_ID,
  SET_BRANCH_ID,
  SET_SUCCESSFUL,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST
} from './types'

const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
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
    case SET_PAYMENT_ID:
      return { ...state, paymentId: payload.id }
    case SET_BRANCH_ID:
      return { ...state, branchId: payload.id }
    case SET_SUCCESSFUL:
      return { ...state, successful: payload.success }
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page }
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count }
    case SET_LIST:
      return { ...state, list: payload.list }
    default:
      return state
  }
}

export default companyReducer

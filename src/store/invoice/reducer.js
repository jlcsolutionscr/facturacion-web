import {
  RESET_INVOICE,
  ADD_DETAIL,
  REMOVE_DETAIL,
  SET_PAYMENT
} from './types'

const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case RESET_INVOICE:
      return { ...state, productDetails: [], payment: null }
    case ADD_DETAIL:
      return { ...state, productDetails: [...state.productDetails, payload.detail] }
    case REMOVE_DETAIL:
      return { ...state, productDetails: state.productDetails.filter(detail => detail.Id !== payload.id) }
    case SET_PAYMENT:
      return { ...state, payment: payload.payment }
    default:
      return state
  }
}

export default companyReducer

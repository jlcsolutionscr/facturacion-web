import {
  SET_CUSTOMER_ID,
  SET_DETAILS,
  SET_PAYMENT
} from './types'

const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_CUSTOMER_ID:
      return { ...state, customerId: payload.id }
    case SET_DETAILS:
      return { ...state, productDetails: payload.list }
    case SET_PAYMENT:
      return { ...state, payment: payload.payment }
    default:
      return state
  }
}

export default companyReducer

import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER
} from './types'

const customerReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_CUSTOMER_LIST:
      return { ...state, customerList: payload.list }
    case SET_CUSTOMER:
      return { ...state, customer: payload.customer }
    default:
      return state
  }
}

export default customerReducer

import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_PAYMENT_ID,
  SET_COMMENT,
  SET_SUCCESSFUL,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  SET_TICKET,
  RESET_INVOICE
} from './types'

import { LOGOUT } from 'store/session/types'

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
    case SET_COMMENT:
      return { ...state, comment: payload.comment }
    case SET_SUCCESSFUL:
      return { ...state, invoiceId: payload.id, successful: payload.success }
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page }
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count }
    case SET_LIST:
      return { ...state, list: payload.list }
    case SET_TICKET:
      return { ...state, ticket: payload.ticket }
    case LOGOUT:
    case RESET_INVOICE:
      return {
        invoiceId: null,
        description: '',
        quantity: 1,
        price: 0,
        productDetails: [],
        paymentId: 1,
        summary: {
          gravado: 0,
          exonerado: 0,
          excento: 0,
          subTotal: 0,
          impuesto: 0,
          total: 0,
        },
        comment: '',
        successful: false,
        listPage: 1,
        listCount: 0,
        list: [],
        ticket: null
      }
    default:
      return state
  }
}

export default companyReducer

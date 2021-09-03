import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_DELIVERY_PHONE,
  SET_DELIVERY_ADDRESS,
  SET_DELIVERY_DESCRIPTION,
  SET_DELIVERY_DATE,
  SET_DELIVERY_TIME,
  SET_DELIVERY_DETAILS,
  SET_ID,
  SET_STATUS,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  RESET
} from './types'

import { LOGOUT } from 'store/session/types'

const workingOrderReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_DESCRIPTION:
      return { ...state, description: payload.description }
    case SET_QUANTITY:
      return { ...state, quantity: payload.quantity }
    case SET_PRICE:
      return { ...state, price: payload.price }
    case SET_PRODUCTS_DETAIL:
      return { ...state, productDetails: payload.details, status: 'on-progress' }
    case SET_SUMMARY:
      return { ...state, summary: payload.summary }
    case SET_DELIVERY_PHONE:
      return { ...state, deliveryPhone: payload.phone, status: 'on-progress' }
    case SET_DELIVERY_ADDRESS:
      return { ...state, deliveryAddress: payload.address, status: 'on-progress' }
    case SET_DELIVERY_DESCRIPTION:
      return { ...state, deliveryDescription: payload.description, status: 'on-progress' }
    case SET_DELIVERY_DATE:
      return { ...state, deliveryDate: payload.date, status: 'on-progress' }
    case SET_DELIVERY_TIME:
      return { ...state, deliveryTime: payload.time, status: 'on-progress' }
    case SET_DELIVERY_DETAILS:
      return { ...state, deliveryDetails: payload.details, status: 'on-progress' }
    case SET_ID:
      return { ...state, workingOrderId: payload.id }
    case SET_STATUS:
      return { ...state, status: payload.status }
    case SET_LIST_PAGE:
      return { ...state, listPage: payload.page }
    case SET_LIST_COUNT:
      return { ...state, listCount: payload.count }
    case SET_LIST:
      return { ...state, list: payload.list }
    case LOGOUT:
    case RESET:
      return {
        ...state,
        workingOrderId: 0,
        status: 'on-progress',
        description: '',
        quantity: 1,
        price: 0,
        productDetails: [],
        summary: {
          gravado: 0,
          exonerado: 0,
          excento: 0,
          subTotal: 0,
          impuesto: 0,
          total: 0,
        },
        deliveryPhone: '',
        deliveryAddress: '',
        deliveryDescription: '',
        deliveryDate: '',
        deliveryTime: '',
        deliveryDetails: '',
        successful: false
      }
    default:
      return state
  }
}

export default workingOrderReducer

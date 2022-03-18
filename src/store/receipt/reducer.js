import {
  SET_ISSUER_DETAILS,
  SET_PRODUCT_DETAILS,
  SET_DETAILS_LIST,
  SET_SUMMARY,
  SET_EXONERATION_DETAILS,
  SET_ACTIVITY_CODE,
  SET_SUCCESSFUL,
  RESET_RECEIPT
} from './types'

import { defaultReceipt } from 'utils/defaults'

import { LOGOUT } from 'store/session/types'

const receiptReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_ISSUER_DETAILS:
      return { ...state, issuer: {...state.issuer, [payload.attribute]: payload.value }}
    case SET_PRODUCT_DETAILS:
      return { ...state, product: {...state.product, [payload.attribute]: payload.value }}
    case SET_DETAILS_LIST:
      return { ...state, detailsList: payload.details }
    case SET_SUMMARY:
      return { ...state, summary: payload.summary }
    case SET_EXONERATION_DETAILS:
      return { ...state, exoneration: {...state.exoneration, [payload.attribute]: payload.value }}
    case SET_ACTIVITY_CODE:
      return { ...state, activityCode: payload.code }
    case SET_SUCCESSFUL:
      return { ...state, successful: true }
    case RESET_RECEIPT:
    case LOGOUT:
      return defaultReceipt
    default:
      return state
  }
}

export default receiptReducer

import {
  SET_ISSUER_ID_TYPE,
  SET_ISSUER_ID,
  SET_ISSUER_NAME,
  SET_ISSUER_ADDRESS,
  SET_ISSUER_PHONE,
  SET_ISSUER_EMAIL,
  SET_PRODUCT_CODE,
  SET_PRODUCT_DESCRIPTION,
  SET_PRODUCT_QUANTITY,
  SET_PRODUCT_TAX_TYPE,
  SET_PRODUCT_TAX_RATE,
  SET_PRODUCT_UNIT,
  SET_PRODUCT_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_EXONERATION_TYPE,
  SET_EXONERATION_REF,
  SET_EXONERATION_ISSUER,
  SET_EXONERATION_DATE,
  SET_EXONERATION_PERCENTAGE,
  SET_SUCCESSFUL,
  RESET_RECEIPT
} from './types'

import { LOGOUT } from 'store/session/types'

const recepitReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_ISSUER_ID_TYPE:
      return { ...state, issuerIdType: payload.type }
    case SET_ISSUER_ID:
      return { ...state, issuerId: payload.id }
    case SET_ISSUER_NAME:
      return { ...state, issuerName: payload.name }
    case SET_ISSUER_ADDRESS:
      return { ...state, issuerAddress: payload.address }
    case SET_ISSUER_PHONE:
      return { ...state, issuerPhone: payload.phone }
    case SET_ISSUER_EMAIL:
      return { ...state, issuerEmail: payload.email }
    case SET_PRODUCT_CODE:
      return { ...state, productCode: payload.code }
    case SET_PRODUCT_DESCRIPTION:
      return { ...state, productDescription: payload.description }
    case SET_PRODUCT_QUANTITY:
      return { ...state, productQuantity: payload.quantity }
    case SET_PRODUCT_TAX_TYPE:
      return { ...state, productTaxType: payload.type }
    case SET_PRODUCT_TAX_RATE:
      return { ...state, productTaxRate: payload.rate }
    case SET_PRODUCT_UNIT:
      return { ...state, productUnit: payload.unit }
    case SET_PRODUCT_PRICE:
      return { ...state, productPrice: payload.price }
    case SET_PRODUCTS_DETAIL:
      return { ...state, productDetails: payload.details }
    case SET_SUMMARY:
      return { ...state, summary: payload.summary }
    case SET_EXONERATION_TYPE:
      return { ...state, exonerationType: payload.type }
    case SET_EXONERATION_REF:
      return { ...state, exonerationRef: payload.ref }
    case SET_EXONERATION_ISSUER:
      return { ...state, exonerationIssuer: payload.issuer }
    case SET_EXONERATION_DATE:
      return { ...state, exonerationDate: payload.date }
    case SET_EXONERATION_PERCENTAGE:
      return { ...state, exonerationPercentage: payload.percentage }
    case SET_SUCCESSFUL:
      return { ...state, successful: payload.successful }
    case RESET_RECEIPT:
    case LOGOUT:
      return {
        ...state,
        receiptId: 0,
        issuerIdType: '',
        issuerId: '',
        issuerName: '',
        issuerAddress: '',
        issuerPhone: '',
        issuerEmail: '',
        productCode: '',
        productDescription: '',
        productQuantity: 1,
        productTaxId: 8,
        productTaxRate: 0,
        productUnit: 'UND',
        productPrice: 0,
        productDetails: [],
        summary: {
          gravado: 0,
          exonerado: 0,
          excento: 0,
          subTotal: 0,
          impuesto: 0,
          total: 0,
        },
        exonerationType: 1,
        exonerationRef: '',
        exonerationIssuer: '',
        exonerationDate: '01/01/2000',
        exonerationPercentage: 0,
        successful: false
      }
    default:
  }
}

export default recepitReducer

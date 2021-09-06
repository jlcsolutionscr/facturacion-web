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
  SET_DETAILS_LIST,
  SET_SUMMARY,
  SET_EXONERATION_TYPE,
  SET_EXONERATION_REF,
  SET_EXONERATION_ISSUER,
  SET_EXONERATION_DATE,
  SET_EXONERATION_PERCENTAGE,
  SET_SUCCESSFUL,
  RESET_RECEIPT
} from './types'

import {
  startLoader,
  stopLoader,
  setActiveSection,
  setIdTypeList,
  setRentTypeList,
  setExonerationTypeList,
  setMessage
} from 'store/ui/actions'

import { setCompany } from 'store/company/actions'

import {
  getCompanyEntity,
  getIdTypeList,
  getRentTypeList,
  getExonerationTypeList
} from 'utils/domainHelper'

export const setIssuerIdType = (type) => {
  return {
    type: SET_ISSUER_ID_TYPE,
    payload: { type }
  }
}

export const setIssuerId = (id) => {
  return {
    type: SET_ISSUER_ID,
    payload: { id }
  }
}

export const setIssuerName = (name) => {
  return {
    type: SET_ISSUER_NAME,
    payload: { name }
  }
}

export const setIssuerAddress = (address) => {
  return {
    type: SET_ISSUER_ADDRESS,
    payload: { address }
  }
}

export const setIssuerPhone = (phone) => {
  return {
    type: SET_ISSUER_PHONE,
    payload: { phone }
  }
}

export const setIssuerEmail = (email) => {
  return {
    type: SET_ISSUER_EMAIL,
    payload: { email }
  }
}

export const setProductCode = (code) => {
  return {
    type: SET_PRODUCT_CODE,
    payload: { code }
  }
}

export const setProductDescription = (description) => {
  return {
    type: SET_PRODUCT_DESCRIPTION,
    payload: { description }
  }
}

export const setProductQuantity = (quantity) => {
  return {
    type: SET_PRODUCT_QUANTITY,
    payload: { quantity }
  }
}

export const setProductTaxType = (type) => {
  return {
    type: SET_PRODUCT_TAX_TYPE,
    payload: { type }
  }
}

export const setProductTaxRate = (rate) => {
  return {
    type: SET_PRODUCT_TAX_RATE,
    payload: { rate }
  }
}

export const setProductUnit = (unit) => {
  return {
    type: SET_PRODUCT_UNIT,
    payload: { unit }
  }
}

export const setProductPrice = (price) => {
  return {
    type: SET_PRODUCT_PRICE,
    payload: { price }
  }
}

export const setProductsDetail = (details) => {
  return {
    type: SET_DETAILS_LIST,
    payload: { details }
  }
}

export const setSummary = (summary) => {
  return {
    type: SET_SUMMARY,
    payload: { summary }
  }
}

export const setExonerationType = (type) => {
  return {
    type: SET_EXONERATION_TYPE,
    payload: { type }
  }
}

export const setExonerationRef = (ref) => {
  return {
    type: SET_EXONERATION_REF,
    payload: { ref }
  }
}

export const setExonerationIssuer = (issuer) => {
  return {
    type: SET_EXONERATION_ISSUER,
    payload: { issuer }
  }
}

export const setExonerationDate = (date) => {
  return {
    type: SET_EXONERATION_DATE,
    payload: { date }
  }
}

export const setExonerationPercentage = (percentage) => {
  return {
    type: SET_EXONERATION_PERCENTAGE,
    payload: { percentage }
  }
}

export const setSuccessful = () => {
  return {
    type: SET_SUCCESSFUL
  }
}

export const resetReceipt = () => {
  return {
    type: RESET_RECEIPT
  }
}

export function setReceiptParameters (id) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    const { idTypeList, rentTypeList, exonerationTypeList } = getState().ui
    const { company } = getState().company
    dispatch(startLoader())
    try {
      if (company === null) {
        const companyEntity = await getCompanyEntity(token, companyId)
        dispatch(setCompany(companyEntity))
      }
      if (idTypeList.length === 0) {
        const newList = await getIdTypeList(token)
        dispatch(setIdTypeList(newList))
      }
      if (rentTypeList.length === 0) {
        const newList = await getRentTypeList(token)
        dispatch(setRentTypeList(newList))
      }
      if (exonerationTypeList.length === 0) {
        const newList = await getExonerationTypeList(token)
        dispatch(setExonerationTypeList(newList))
      }
      dispatch(resetReceipt())
      dispatch(setActiveSection(id))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}
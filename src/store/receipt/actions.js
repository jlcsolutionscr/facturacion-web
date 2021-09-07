import {
  SET_ISSUER_DETAILS,
  SET_PRODUCT_DETAILS,
  SET_DETAILS_LIST,
  SET_SUMMARY,
  SET_EXONERATION_DETAILS,
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
  getTaxRateByType,
  getExonerationTypeList,
  getProductSummary,
  saveReceiptEntity
} from 'utils/domainHelper'

import { roundNumber } from 'utils/utilities'

export const setIssuerDetails = (attribute, value) => {
  return {
    type: SET_ISSUER_DETAILS,
    payload: { attribute, value }
  }
}

export const setProductDetails = (attribute, value) => {
  return {
    type: SET_PRODUCT_DETAILS,
    payload: { attribute, value }
  }
}

export const setDetailsList = (details) => {
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

export const setExonerationDetails = (attribute, value) => {
  return {
    type: SET_EXONERATION_DETAILS,
    payload: { attribute, value }
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

export function addDetails () {
  return (dispatch, getState) => {
    const { exoneration, product, detailsList } = getState().receipt
    try {
      
      if (product != null && product.code && product.taxType && product.description !== '' && product.quantity > 0 &&  product.price > 0) {
        let newProducts = null
        let taxParam = getTaxRateByType(product.taxType)
        const item = {
          Cantidad: product.quantity,
          Codigo: product.code,
          Descripcion: product.description,
          IdImpuesto: product.taxType,
          PorcentajeIVA: taxParam,
          UnidadMedida: product.unit,
          PrecioVenta: roundNumber(product.price * (1 + (taxParam / 100)), 2),
        }
        newProducts = [...detailsList, item]
        dispatch(setDetailsList(newProducts))
        const summary = getProductSummary(newProducts, exoneration.percentage)
        dispatch(setSummary(summary))
        dispatch(setProductDetails('code', ''))
        dispatch(setProductDetails('description', ''))
        dispatch(setProductDetails('taxType', 8))
        dispatch(setProductDetails('unit', 'UND'))
        dispatch(setProductDetails('quantity', 1))
        dispatch(setProductDetails('price', 0))
      }
    } catch (error) {
      const message = error.message ? error.message : error
      dispatch(setMessage(message))
    }
  }
}

export const removeDetails = (id) => {
  return (dispatch, getState) => {
    const { exoneration, detailsList } = getState().receipt
    const index = detailsList.findIndex(item => item.IdProducto === id)
    const newProducts = [...detailsList.slice(0, index), ...detailsList.slice(index + 1)]
    dispatch(setDetailsList(newProducts))
    const summary = getProductSummary(newProducts, exoneration.percentage)
    dispatch(setSummary(summary))
  }
}

export const saveReceipt = () => {
  return async (dispatch, getState) => {
    const { token, userId, branchId } = getState().session
    const { company } = getState().company
    const { issuer, exoneration, detailsList, summary } = getState().receipt
    dispatch(startLoader())
    try {
      await saveReceiptEntity(
        token,
        userId,
        branchId,
        company,
        issuer,
        exoneration,
        detailsList,
        summary
      )
      dispatch(setSuccessful(true))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

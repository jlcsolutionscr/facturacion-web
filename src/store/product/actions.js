import {
  SET_PRODUCT_LIST,
  SET_PRODUCT
} from './types'

import {
  startLoader,
  stopLoader,
  setErrorMessage
} from 'store/ui/actions'

import { getProductEntity } from 'utils/domainHelper'

export const setProductList = (list) => {
  return {
    type: SET_PRODUCT_LIST,
    payload: { list }
  }
}

export const setProduct = (product) => {
  return {
    type: SET_PRODUCT,
    payload: { product }
  }
}

export function getProduct (idProduct) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const product = await getProductEntity(token, idProduct)
      dispatch(setProduct(product))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setProduct(null))
      dispatch(setErrorMessage(error))
    }
  }
}
import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER
} from './types'

import {
  startLoader,
  stopLoader,
  setErrorMessage
} from 'store/ui/actions'

import { getCustomerEntity } from 'utils/domainHelper'

export const setCustomerList = (list) => {
  return {
    type: SET_CUSTOMER_LIST,
    payload: { list }
  }
}

export const setCustomer = (entity) => {
  return {
    type: SET_CUSTOMER,
    payload: { entity }
  }
}

export function getCustomer (idCustomer) {
  return async (dispatch, getState) => {
    const { serviceURL } = getState().config
    const { token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const customer = await getCustomerEntity(serviceURL, token, idCustomer)
      dispatch(setCustomer(customer))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setCustomer(null))
      dispatch(setErrorMessage(error))
    }
  }
}
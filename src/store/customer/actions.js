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

export const setCustomer = (customer) => {
  return {
    type: SET_CUSTOMER,
    payload: { customer }
  }
}

export function getCustomer (idCustomer) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const customer = await getCustomerEntity(token, idCustomer)
      dispatch(setCustomer(customer))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setCustomer(null))
      dispatch(setErrorMessage(error))
    }
  }
}
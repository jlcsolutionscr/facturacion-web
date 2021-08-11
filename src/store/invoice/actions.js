import {
  RESET_INVOICE,
  ADD_DETAIL,
  REMOVE_DETAIL,
  SET_PAYMENT
} from './types'

import {
  startLoader,
  stopLoader,
  setErrorMessage,
  setActiveSection
} from 'store/ui/actions'

import { setCustomer, setCustomerList } from 'store/customer/actions'

import { getCustomerList } from 'utils/domainHelper'

export const resetInvoice = () => {
  return {
    type: RESET_INVOICE
  }
}

export const setDetails = (detail) => {
  return {
    type: ADD_DETAIL,
    payload: { detail }
  }
}

export const removeDetails = (id) => {
  return {
    type: REMOVE_DETAIL,
    payload: { id }
  }
}

export const setPayment = (method) => {
  return {
    type: SET_PAYMENT,
    payload: { method }
  }
}

export function setInvoiceParameters () {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const newList = await getCustomerList(token, companyId)
      dispatch(setActiveSection(5))
      const customer = {
        Id: 1,
        NombreCliente: 'CLIENTE DE CONTADO',
        ParametroExoneracion: {
          Descripcion: 'Ley especial'
        },
        NumDocExoneracion: '',
        NombreInstExoneracion: '',
        FechaEmisionDoc: '01/01/2000',
        PorcentajeExoneracion: 0
      }
      dispatch(setCustomer(customer))
      dispatch(resetInvoice())
      dispatch(setCustomerList([customer, ...newList]))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setErrorMessage(error))
    }
  }
}

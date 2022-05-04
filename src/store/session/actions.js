import {
  LOGIN,
  LOGOUT,
  SET_COMPANY,
  SET_BRANCH_ID,
  SET_PRINTER,
  SET_VENDOR_LIST
} from './types'

import {
  startLoader,
  stopLoader,
  setMessage,
  setRentTypeList,
  setExonerationTypeList,
  setIdTypeList
} from 'store/ui/actions'

import { setPriceTypeList } from 'store/customer/actions'
import { setProductTypeList } from 'store/product/actions'

import { userLogin } from 'utils/domainHelper'
import { writeToLocalStorage, cleanLocalStorage } from 'utils/utilities'

export const logIn = (username, company) => {
  return {
    type: LOGIN,
    payload: { username, company }
  }
}

export const logOut = () => {
  return {
    type: LOGOUT
  }
}

export const setCompany = (company) => {
  return {
    type: SET_COMPANY,
    payload: { company }
  }
}

export const setBranchId = (id) => {
  return {
    type: SET_BRANCH_ID,
    payload: { id }
  }
}

export const setPrinter = (device) => {
  return {
    type: SET_PRINTER,
    payload: { device }
  }
}

export const setVendorList = (list) => {
  return {
    type: SET_VENDOR_LIST,
    payload: { list }
  }
}

export function login (username, password, id) {
  return async (dispatch) => {
    dispatch(startLoader())
    try {
      const company = await userLogin(username, password, id)
      dispatch(setIdTypeList(company.ListadoTipoIdentificacion))
      dispatch(setRentTypeList(company.ListadoTipoImpuesto))
      dispatch(setExonerationTypeList(company.ListadoTipoExoneracion))
      dispatch(setPriceTypeList(company.ListadoTipoPrecio))
      dispatch(setProductTypeList(company.ListadoTipoProducto))
      writeToLocalStorage(username, company)
      dispatch(logIn(username, company))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

export function logout () {
  return async (dispatch) => {
    try {
      cleanLocalStorage()
      dispatch(logOut())
    } catch (error) {
      dispatch(setMessage(error.message))
      console.error('Exeption on logout session', error)
    }
  }
}

export function restoreSession (username, company) {
  return (dispatch) => {
    dispatch(startLoader())
    try {
      dispatch(logIn(username, company))
      dispatch(setIdTypeList(company.ListadoTipoIdentificacion))
      dispatch(setRentTypeList(company.ListadoTipoImpuesto))
      dispatch(setExonerationTypeList(company.ListadoTipoExoneracion))
      dispatch(setPriceTypeList(company.ListadoTipoPrecio))
      dispatch(setProductTypeList(company.ListadoTipoProducto))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

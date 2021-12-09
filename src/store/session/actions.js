import {
  LOGIN,
  LOGOUT,
  SET_COMPANY,
  SET_BRANCH_ID,
  SET_PRINTER
} from './types'

import {
  startLoader,
  stopLoader,
  setMessage
} from 'store/ui/actions'

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

export function login (username, password, id) {
  return async (dispatch) => {
    dispatch(startLoader())
    try {
      const company = await userLogin(username, password, id)
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
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

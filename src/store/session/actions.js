import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR,
  SET_BRANCH_LIST,
  SET_TERMINAL_LIST,
  SET_BRANCH,
  SET_TERMINAL
} from './types'

import { startLoader, stopLoader } from 'store/ui/actions'
import { validateCredentials } from 'utils/domainHelper'

export const logIn = (company) => {
  return {
    type: LOGIN,
    payload: { company }
  }
}

export const LogOut = () => {
  return {
    type: LOGOUT
  }
}

export const setLoginError = (error) => {
  return {
    type: SET_LOGIN_ERROR,
    payload: { error }
  }
}

export const setBranchList = (list) => {
  return {
    type: SET_BRANCH_LIST,
    payload: { list }
  }
}

export const setTerminalList = (list) => {
  return {
    type: SET_TERMINAL_LIST,
    payload: { list }
  }
}

export const setBranch = (entity) => {
  return {
    type: SET_BRANCH,
    payload: { entity }
  }
}

export const setTerminal = (entity) => {
  return {
    type: SET_TERMINAL,
    payload: { entity }
  }
}

export function authenticateSession (username, password, id) {
  return async (dispatch) => {
    dispatch(setLoginError(''))
    dispatch(startLoader())
    try {
      const company = await validateCredentials(username, password, id)
      dispatch(logIn(company))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(LogOut())
      dispatch(setLoginError(error))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

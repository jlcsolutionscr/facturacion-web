import {
  LOGIN,
  LOGOUT,
  SET_BRANCH_ID
} from './types'

import {
  startLoader,
  stopLoader,
  setMessage
} from 'store/ui/actions'

import { userLogin } from 'utils/domainHelper'

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

export const setBranchId = (id) => {
  return {
    type: SET_BRANCH_ID,
    payload: { id }
  }
}

export function login (username, password, id) {
  return async (dispatch) => {
    dispatch(startLoader())
    try {
      const company = await userLogin(username, password, id)
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

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

export const logIn = (user, company) => {
  return {
    type: LOGIN,
    payload: { user, company }
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
      const user = await userLogin(username, password, id)
      dispatch(logIn(user, user.Empresa))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR
} from './types'

import { startLoader, stopLoader } from 'store/ui/actions'
import { setIdentifier } from 'store/company/actions'
import { validateCredentials } from 'utils/domainHelper'

export const logIn = (user) => {
  return {
    type: LOGIN,
    payload: { user }
  }
}

export const logOut = () => {
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

export function authenticateSession (username, password, id) {
  return async (dispatch) => {
    dispatch(setLoginError(''))
    dispatch(startLoader())
    try {
      const user = await validateCredentials(username, password, id)
      dispatch(logIn(user))
      const company = user.UsuarioPorEmpresa[0]
      dispatch(setIdentifier(company.IdEmpresa, company.Empresa.Identificacion, company.Empresa.NombreEmpresa))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setLoginError(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

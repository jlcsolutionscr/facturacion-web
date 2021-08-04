import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR
} from './types'

import { startLoader, stopLoader } from 'store/ui/actions'
import { setInvoiceSession } from 'store/invoice/actions'
import { invoiceLogin } from 'utils/invoiceHelper'

export const logIn = (roles, token) => {
  return {
    type: LOGIN,
    payload: { roles, token }
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

export function login (username, password, id) {
  return async (dispatch) => {
    dispatch(setLoginError(''))
    dispatch(startLoader())
    try {
      const user = await invoiceLogin(username, password, id)
      const roles = user.RolePorUsuario.map(role => ({IdUsuario: role.IdUsuario, IdRole: role.IdRole}))
      dispatch(logIn(roles, user.Token))
      const company = user.UsuarioPorEmpresa[0]
      dispatch(setInvoiceSession(company.IdEmpresa, company.Empresa.Identificacion, company.Empresa.NombreEmpresa))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setLoginError(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

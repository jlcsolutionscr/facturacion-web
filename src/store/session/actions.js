import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR
} from './types'

import { startLoader, stopLoader } from 'store/ui/actions'
import { setInvoiceSession } from 'store/invoice/actions'
import { setVisitorSession } from 'store/visitortracking/actions'
import { invoiceLogin } from 'utils/invoiceHelper'
import { visitorLogin } from 'utils/visitorTrackingHelper'

export const logIn = (productId, roles, token) => {
  return {
    type: LOGIN,
    payload: { productId, roles, token }
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

export function loginInvoiceSession (username, password, id) {
  return async (dispatch) => {
    dispatch(setLoginError(''))
    dispatch(startLoader())
    try {
      const user = await invoiceLogin(username, password, id)
      dispatch(logIn(1, user.RolePorUsuario, user.Token))
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

export function loginVisitorSession (username, password, id) {
  return async (dispatch) => {
    dispatch(setLoginError(''))
    dispatch(startLoader())
    try {
      const session = await visitorLogin(username, password, id)
      dispatch(logIn(2, session.RolePerUser, session.Token))
      dispatch(setVisitorSession(session.CompanyId, session.CompanyIdentifier, session.CompanyName))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setLoginError(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

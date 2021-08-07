import {
  LOGIN,
  LOGOUT
} from './types'

import {
  startLoader,
  stopLoader,
  setErrorMessage
} from 'store/ui/actions'

import { userLogin } from 'utils/domainHelper'

export const logIn = (user, companyId, companyName, companyIdentifier) => {
  return {
    type: LOGIN,
    payload: { user, companyId, companyName, companyIdentifier }
  }
}

export const logOut = () => {
  return {
    type: LOGOUT
  }
}

export function login (username, password, id) {
  return async (dispatch) => {
    dispatch(setErrorMessage(''))
    dispatch(startLoader())
    try {
      const user = await userLogin(username, password, id)
      const company = user.UsuarioPorEmpresa[0]
      const companyName = company.Empresa.NombreComercial || company.Empresa.NombreEmpresa
      const companyIdentifier = company.Empresa.Identificacion
      dispatch(logIn(user, company.IdEmpresa, companyName, companyIdentifier))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

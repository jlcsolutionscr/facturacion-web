import {
  LOGIN,
  LOGOUT,
  SET_BRANCH_ID
} from './types'

import {
  startLoader,
  stopLoader,
  setErrorMessage
} from 'store/ui/actions'

import { userLogin, getBranchList } from 'utils/domainHelper'

export const logIn = (user, companyId, branchList, companyName, companyIdentifier) => {
  return {
    type: LOGIN,
    payload: { user, companyId, branchList, companyName, companyIdentifier }
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
    dispatch(setErrorMessage(''))
    dispatch(startLoader())
    try {
      const user = await userLogin(username, password, id)
      const company = user.UsuarioPorEmpresa[0]
      const companyName = company.Empresa.NombreComercial || company.Empresa.NombreEmpresa
      const companyIdentifier = company.Empresa.Identificacion
      const branchList = await getBranchList(user.Token, company.IdEmpresa)
      dispatch(logIn(user, company.IdEmpresa, branchList, companyName, companyIdentifier))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

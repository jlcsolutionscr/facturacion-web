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

import { userLogin, getBranchList } from 'utils/domainHelper'

export const logIn = (user, companyId, branchList, companyName, companyIdentifier, reportList) => {
  return {
    type: LOGIN,
    payload: { user, companyId, branchList, companyName, companyIdentifier, reportList }
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
      const company = user.UsuarioPorEmpresa[0].Empresa
      const companyName = company.NombreComercial || company.NombreEmpresa
      const companyIdentifier = company.Identificacion
      const companyReports = company.ReportePorEmpresa
      const branchList = await getBranchList(user.Token, user.UsuarioPorEmpresa[0].IdEmpresa)
      dispatch(logIn(user, user.UsuarioPorEmpresa[0].IdEmpresa, branchList, companyName, companyIdentifier, companyReports))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(logOut())
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

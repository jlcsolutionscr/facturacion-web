import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR,
  SET_ACTIVE_HOME_SECTION,
  SET_BRANCH_LIST,
  SET_TERMINAL_LIST,
  SET_BRANCH,
  SET_TERMINAL,
  SET_CANTON_LIST,
  SET_DISTRITO_LIST,
  SET_BARRIO_LIST,
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_COMPANY_PAGE_ERROR
} from './types'

import { startLoader, stopLoader } from 'store/ui/actions'
import {
  validateCredentials,
  getCompanyEntity,
  getCantonList,
  getDistritoList,
  getBarrioList,
  saveCompanyEntity
} from 'utils/domainHelper'

export const logIn = (user) => {
  return {
    type: LOGIN,
    payload: { user }
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

export const setActiveHomeSection = (pageId) => {
  return {
    type: SET_ACTIVE_HOME_SECTION,
    payload: { pageId }
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

export const setCantonList = (list) => {
  return {
    type: SET_CANTON_LIST,
    payload: { list }
  }
}

export const setDistritoList = (list) => {
  return {
    type: SET_DISTRITO_LIST,
    payload: { list }
  }
}

export const setBarrioList = (list) => {
  return {
    type: SET_BARRIO_LIST,
    payload: { list }
  }
}

export const setCompany = (company) => {
  return {
    type: SET_COMPANY,
    payload: { company }
  }
}

export const setCompanyAttribute = (attribute, value) => {
  return {
    type: SET_COMPANY_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const setCompanyPageError = (error) => {
  return {
    type: SET_COMPANY_PAGE_ERROR,
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
      dispatch(stopLoader())
    } catch (error) {
      dispatch(LogOut())
      dispatch(setLoginError(error))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

export function getCompany () {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setCompanyPageError(''))
    try {
      const company = await getCompanyEntity(companyId, token)
      dispatch(setCompany(company))
      const cantonList = await getCantonList(company.IdProvincia, token)
      dispatch(setCantonList(cantonList))
      const distritoList = await getDistritoList(company.IdProvincia, company.IdCanton, token)
      dispatch(setDistritoList(distritoList))
      const barrioList = await getBarrioList(company.IdProvincia, company.IdCanton, company.IdDistrito, token)
      dispatch(setBarrioList(barrioList))
      dispatch(stopLoader())
      dispatch(setActiveHomeSection(1))
    } catch (error) {
      dispatch(setCompanyPageError(error))
      dispatch(stopLoader())
    }
  }
}

export function updateCantonList (idProvincia) {
  return async (dispatch, getState) => {
    const { company, token } = getState().session
    if (company.IdProvincia !== idProvincia) {
      dispatch(setCompanyPageError(''))
      dispatch(startLoader())
      try {
        const newCompany = { ...company, IdProvincia: idProvincia, IdCanton: 1, IdDistrito: 1, IdBarrio: 1 }
        dispatch(setCompany(newCompany))
        const cantonList = await getCantonList(idProvincia, token)
        dispatch(setCantonList(cantonList))
        const distritoList = await getDistritoList(idProvincia, 1, token)
        dispatch(setDistritoList(distritoList))
        const barrioList = await getBarrioList(idProvincia, 1, 1, token)
        dispatch(setBarrioList(barrioList))
        dispatch(stopLoader())
      } catch (error) {
        dispatch(setCompanyPageError(error))
        dispatch(stopLoader())
      }
    }
  }
}

export function updateDistritoList (idProvincia, idCanton) {
  return async (dispatch, getState) => {
    const { company, token } = getState().session
    if (company.IdCanton !== idCanton) {
      dispatch(setCompanyPageError(''))
      dispatch(startLoader())
      try {
        const newCompany = { ...company, IdCanton: idCanton, IdDistrito: 1, IdBarrio: 1 }
        dispatch(setCompany(newCompany))
        const distritoList = await getDistritoList(idProvincia, idCanton, token)
        dispatch(setDistritoList(distritoList))
        const barrioList = await getBarrioList(idProvincia, idCanton, 1, token)
        dispatch(setBarrioList(barrioList))
        dispatch(stopLoader())
      } catch (error) {
        dispatch(setCompanyPageError(error))
        dispatch(stopLoader())
      }
    }
  }
}

export function updateBarrioList (idProvincia, idCanton, idDistrito) {
  return async (dispatch, getState) => {
    const { company, token } = getState().session
    if (company.IdDistrito !== idDistrito) {
      dispatch(setCompanyPageError(''))
      dispatch(startLoader())
      try {
        const newCompany = { ...company, IdDistrito: idDistrito, IdBarrio: 1 }
        dispatch(setCompany(newCompany))
        const barrioList = await getBarrioList(idProvincia, idCanton, idDistrito, token)
        dispatch(setBarrioList(barrioList))
        dispatch(stopLoader())
      } catch (error) {
        dispatch(setCompanyPageError(error))
        dispatch(stopLoader())
      }
    }
  }
}

export function saveCompany () {
  return async (dispatch, getState) => {
    const { company, token } = getState().session
    dispatch(setCompanyPageError('Procesando'))
    dispatch(startLoader())
    try {
      await saveCompanyEntity(company, token)
      dispatch(logIn(company))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setCompanyPageError(error))
      dispatch(stopLoader())
      console.error('Exeption authenticating session', error)
    }
  }
}

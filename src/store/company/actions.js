import {
  SET_IDENTIFIER,
  SET_CANTON_LIST,
  SET_DISTRITO_LIST,
  SET_BARRIO_LIST,
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_COMPANY_PAGE_ERROR,
  SET_LOGO_PAGE_ERROR
} from './types'

import { startLoader, stopLoader, setActiveHomeSection } from 'store/ui/actions'

import {
  getCompanyEntity,
  getCantonList,
  getDistritoList,
  getBarrioList,
  saveCompanyEntity,
  saveCompanyCertificate,
  saveCompanyLogo
} from 'utils/domainHelper'

export const setIdentifier = (companyId, companyIdentifier, companyName) => {
  return {
    type: SET_IDENTIFIER,
    payload: { companyId, companyIdentifier, companyName }
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

export const setLogoPageError = (error) => {
  return {
    type: SET_LOGO_PAGE_ERROR,
    payload: { error }
  }
}

export function getCompany () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().company
    dispatch(startLoader())
    dispatch(setCompanyPageError(''))
    try {
      dispatch(setActiveHomeSection(1))
      const company = await getCompanyEntity(companyId, token)
      dispatch(setCompany(company))
      const cantonList = await getCantonList(company.IdProvincia, token)
      dispatch(setCantonList(cantonList))
      const distritoList = await getDistritoList(company.IdProvincia, company.IdCanton, token)
      dispatch(setDistritoList(distritoList))
      const barrioList = await getBarrioList(company.IdProvincia, company.IdCanton, company.IdDistrito, token)
      dispatch(setBarrioList(barrioList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setCompanyPageError(error.message))
      dispatch(stopLoader())
    }
  }
}

export function updateCantonList (idProvincia) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().company
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
        dispatch(setCompanyPageError(error.message))
        dispatch(stopLoader())
      }
    }
  }
}

export function updateDistritoList (idProvincia, idCanton) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().company
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
        dispatch(setCompanyPageError(error.message))
        dispatch(stopLoader())
      }
    }
  }
}

export function updateBarrioList (idProvincia, idCanton, idDistrito) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().company
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
        dispatch(setCompanyPageError(error.message))
        dispatch(stopLoader())
      }
    }
  }
}

export function saveCompany (certificate) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId, company } = getState().company
    dispatch(setCompanyPageError(''))
    dispatch(startLoader())
    try {
      await saveCompanyEntity(company, token)
      if (certificate !== '') {
        await saveCompanyCertificate(companyId, certificate, token)
      }
      dispatch(setActiveHomeSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setCompanyPageError(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveLogo (logo) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().company
    dispatch(setCompanyPageError(''))
    dispatch(startLoader())
    try {
      if (logo !== '') {
        await saveCompanyLogo(companyId, logo, token)
      }
      dispatch(setActiveHomeSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setCompanyPageError(error.message))
      dispatch(stopLoader())
    }
  }
}

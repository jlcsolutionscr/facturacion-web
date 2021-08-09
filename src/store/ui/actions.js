import {
  START_LOADER,
  STOP_LOADER,
  SET_ACTIVE_SECTION,
  SET_ERROR_MESSAGE,
  SET_CANTON_LIST,
  SET_DISTRITO_LIST,
  SET_BARRIO_LIST,
  SET_BRANCH_LIST
} from './types'

import {
  getCantonList,
  getDistritoList,
  getBarrioList
} from 'utils/domainHelper'

export const startLoader = (text) => {
  return {
    type: START_LOADER,
    payload: { text }
  }
}

export const stopLoader = () => {
  return {
    type: STOP_LOADER
  }
}

export const setActiveSection = (pageId) => {
  return {
    type: SET_ACTIVE_SECTION,
    payload: { pageId }
  }
}

export const setErrorMessage = (error) => {
  return {
    type: SET_ERROR_MESSAGE,
    payload: { error }
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

export const setBranchList = (list) => {
  return {
    type: SET_BRANCH_LIST,
    payload: { list }
  }
}

export function updateCantonList (idProvincia) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().invoice
    if (company.IdProvincia !== idProvincia) {
      dispatch(startLoader())
      dispatch(setErrorMessage(''))
      try {
        const cantonList = await getCantonList(idProvincia, token)
        dispatch(setCantonList(cantonList))
        const distritoList = await getDistritoList(idProvincia, 1, token)
        dispatch(setDistritoList(distritoList))
        const barrioList = await getBarrioList(idProvincia, 1, 1, token)
        dispatch(setBarrioList(barrioList))
        dispatch(stopLoader())
      } catch (error) {
        dispatch(setErrorMessage(error.message))
        dispatch(stopLoader())
      }
    }
  }
}

export function updateDistritoList (idProvincia, idCanton) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().invoice
    if (company.IdCanton !== idCanton) {
      dispatch(startLoader())
      dispatch(setErrorMessage(''))
      try {
        const distritoList = await getDistritoList(idProvincia, idCanton, token)
        dispatch(setDistritoList(distritoList))
        const barrioList = await getBarrioList(idProvincia, idCanton, 1, token)
        dispatch(setBarrioList(barrioList))
        dispatch(stopLoader())
      } catch (error) {
        dispatch(setErrorMessage(error.message))
        dispatch(stopLoader())
      }
    }
  }
}

export function updateBarrioList (idProvincia, idCanton, idDistrito) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().invoice
    if (company.IdDistrito !== idDistrito) {
      dispatch(startLoader())
      dispatch(setErrorMessage(''))
      try {
        const barrioList = await getBarrioList(idProvincia, idCanton, idDistrito, token)
        dispatch(setBarrioList(barrioList))
        dispatch(stopLoader())
      } catch (error) {
        dispatch(setErrorMessage(error.message))
        dispatch(stopLoader())
      }
    }
  }
}


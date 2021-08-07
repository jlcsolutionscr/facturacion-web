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

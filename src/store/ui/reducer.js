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

const uiReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case START_LOADER:
      return { ...state, isLoaderOpen: true, loaderText: payload.text !== undefined ? payload.text : 'Procesando' }
    case STOP_LOADER:
      return { ...state, isLoaderOpen: false, loaderText: '' }
    case SET_ACTIVE_SECTION:
      return { ...state, activeSection: payload.pageId }
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage: payload.error }
    case SET_CANTON_LIST:
      return { ...state, cantonList: payload.list }
    case SET_DISTRITO_LIST:
      return { ...state, distritoList: payload.list }
    case SET_BARRIO_LIST:
      return { ...state, barrioList: payload.list }
    case SET_BRANCH_LIST:
      return { ...state, branchList: payload.list }
    default:
      return state
  }
}

export default uiReducer

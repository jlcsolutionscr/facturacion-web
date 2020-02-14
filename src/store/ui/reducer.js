import {
  START_LOADER,
  STOP_LOADER,
  SET_ACTIVE_INFO_SECTION,
  SET_ERROR_MESSAGE
} from './types'

const uiReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case START_LOADER:
      return { ...state, isLoaderActive: true, loaderText: payload.text !== undefined ? payload.text : 'Procesando' }
    case STOP_LOADER:
      return { ...state, isLoaderActive: false, loaderText: '' }
    case SET_ACTIVE_INFO_SECTION:
      return { ...state, activeInfoSection: payload.pageId }
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage: payload.error }
    default:
      return state
  }
}

export default uiReducer

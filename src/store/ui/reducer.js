import {
  START_LOADER,
  STOP_LOADER,
  SET_ACTIVE_HOME_SECTION,
  SET_DOWNLOAD_ERROR
} from './types'

const configReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case START_LOADER:
      return { ...state, isLoaderActive: true, loaderText: payload.text }
    case STOP_LOADER:
      return { ...state, isLoaderActive: false, loaderText: '' }
    case SET_ACTIVE_HOME_SECTION:
      return { ...state, activeHomeSection: payload.pageId }
    case SET_DOWNLOAD_ERROR:
      return { ...state, downloadError: payload.error }
    default:
      return state
  }
}

export default configReducer

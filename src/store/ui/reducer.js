import {
  START_LOADER,
  STOP_LOADER,
  SET_DOWNLOAD_ERROR
} from './types'

const configReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case START_LOADER:
      return { ...state, loaderVisible: true }
    case STOP_LOADER:
      return { ...state, loaderVisible: false }
    case SET_DOWNLOAD_ERROR:
      return { ...state, downloadError: payload.error }
    default:
      return state
  }
}

export default configReducer

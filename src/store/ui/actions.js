import {
  START_LOADER,
  STOP_LOADER,
  SET_ACTIVE_HOME_SECTION,
  SET_DOWNLOAD_ERROR
} from './types'

import { downloadWindowsApp } from 'utils/domainHelper'

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

export const setActionHomeSection = (pageId) => {
  return {
    type: SET_ACTIVE_HOME_SECTION,
    payload: { pageId }
  }
}

export const setDownloadError = (error) => {
  return {
    type: SET_DOWNLOAD_ERROR,
    payload: { error }
  }
}

export function downloadWindowsAppFromWebSite () {
  return async (dispatch) => {
    console.log('startLoader dispatched')
    dispatch(setDownloadError(''))
    dispatch(startLoader('Descargando'))
    try {
      await downloadWindowsApp()
      console.log('stopLoader dispatched')
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setDownloadError(error))
      console.log('stopLoader dispatched')
      dispatch(stopLoader())
      console.log('Exepción en el procesamiento de la descarga:', error)
    }
  }
}

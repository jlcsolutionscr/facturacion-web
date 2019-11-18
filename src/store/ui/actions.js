import {
  START_LOADER,
  STOP_LOADER,
  SET_MENU_DRAWER_OPEN,
  SET_MENU_PAGE,
  SET_DOWNLOAD_ERROR
} from './types'

import { downloadWindowsApp } from 'utils/utilities'

export const startLoader = () => {
  return {
    type: START_LOADER
  }
}

export const stopLoader = () => {
  return {
    type: STOP_LOADER
  }
}

export const setMenuDrawerOpen = (open) => {
  return {
    type: SET_MENU_DRAWER_OPEN,
    payload: { open }
  }
}

export const setMenuPage = (pageId) => {
  return {
    type: SET_MENU_PAGE,
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
    dispatch(setDownloadError(''))
    try {
      await downloadWindowsApp()
    } catch (error) {
      dispatch(setDownloadError(error))
      console.log('Exepción en el procesamiento de la descarga:', error)
    }
  }
}

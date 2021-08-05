import {
  START_LOADER,
  STOP_LOADER,
  SET_ACTIVE_PRODUCT_INFO,
  SET_ACTIVE_INFO_SECTION,
  SET_ERROR_MESSAGE
} from './types'

import { downloadWindowsApp } from 'utils/billingHelper'

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

export const setActiveProductInfo = (productId) => {
  return {
    type: SET_ACTIVE_PRODUCT_INFO,
    payload: { productId }
  }
}

export const setActiveInfoSection = (pageId) => {
  return {
    type: SET_ACTIVE_INFO_SECTION,
    payload: { pageId }
  }
}

export const setErrorMessage = (error) => {
  return {
    type: SET_ERROR_MESSAGE,
    payload: { error }
  }
}

export function downloadWindowsAppFromWebSite () {
  return async (dispatch) => {
    dispatch(startLoader('Descargando'))
    try {
      await downloadWindowsApp()
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error))
      dispatch(stopLoader())
      console.error('Exepción en el procesamiento de la descarga:', error)
    }
  }
}

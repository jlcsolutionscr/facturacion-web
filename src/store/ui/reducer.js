import {
  START_LOADER,
  STOP_LOADER,
  SET_MENU_DRAWER_OPEN,
  SET_MENU_PAGE,
  SET_DOWNLOAD_ERROR
} from './types'

const configReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case START_LOADER:
      return { ...state, isLoaderActive: true, loaderText: payload.text }
    case STOP_LOADER:
      return { ...state, isLoaderActive: false, loaderText: '' }
    case SET_MENU_DRAWER_OPEN:
      return { ...state, menuDrawerOpen: payload.open }
    case SET_MENU_PAGE:
      let title = ''
      switch(payload.pageId) {
        case 0:
          title = 'Página de inicio'
          break
        case 1:
          title = 'Aplicación Android'
          break
        case 2:
          title = 'Aplicación Windows'
          break
        case 3:
          title = 'Plataforma de Servicios'
          break
        case 4:
          title = 'Descargas'
          break
        default:
          title = ''
      }
      return { ...state, activeMenuPage: payload.pageId, menuPageTitle: title, menuDrawerOpen: false }
    case SET_DOWNLOAD_ERROR:
      return { ...state, downloadError: payload.error }
    default:
      return state
  }
}

export default configReducer

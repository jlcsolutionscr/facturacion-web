import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR,
  SET_ACTIVE_HOME_SECTION,
  SET_BRANCH_LIST,
  SET_TERMINAL_LIST,
  SET_BRANCH,
  SET_TERMINAL,
  SET_CANTON_LIST,
  SET_DISTRITO_LIST,
  SET_BARRIO_LIST,
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_COMPANY_PAGE_ERROR
} from './types'

const configReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...state,
        authenticated: true,
        rolesPerUser: payload.user.RolePorUsuario,
        activeHomeSection: 0,
        companyId: payload.user.UsuarioPorEmpresa[0].IdEmpresa,
        companyIdentifier: payload.user.UsuarioPorEmpresa[0].Empresa.Identificacion,
        companyName: payload.user.UsuarioPorEmpresa[0].Empresa.NombreEmpresa,
        company: null,
        token: payload.user.Token
      }
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        rolesPerUser: [],
        activeHomeSection: 0,
        companyId: null,
        companyIdentifier: '',
        companyName: '',
        company: null,
        token: null
      }
    case SET_LOGIN_ERROR:
      return { ...state, loginError: payload.error }
    case SET_ACTIVE_HOME_SECTION:
      return { ...state, activeHomeSection: payload.pageId }
    case SET_BRANCH_LIST:
      return { ...state, branchList: payload.list }
    case SET_TERMINAL_LIST:
      return { ...state, terminalList: payload.list }
    case SET_BRANCH:
      return { ...state, branch: payload.entity }
    case SET_TERMINAL:
      return { ...state, terminal: payload.entity }
    case SET_CANTON_LIST:
      return { ...state, cantonList: payload.list }
    case SET_DISTRITO_LIST:
      return { ...state, distritoList: payload.list }
    case SET_BARRIO_LIST:
      return { ...state, barrioList: payload.list }
    case SET_COMPANY:
      return { ...state, company: payload.company }
    case SET_COMPANY_ATTRIBUTE:
      return { ...state, company: {...state.company, [payload.attribute]: payload.value }}
    case SET_COMPANY_PAGE_ERROR:
      return { ...state, companyPageError: payload.error }
    default:
      return state
  }
}

export default configReducer

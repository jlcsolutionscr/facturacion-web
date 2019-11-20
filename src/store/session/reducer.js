import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR,
  SET_BRANCH_LIST,
  SET_TERMINAL_LIST,
  SET_BRANCH,
  SET_TERMINAL
} from './types'

const configReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return { ...state, authenticated: true, company: payload.company, token: payload.company.Usuario.Token }
    case LOGOUT:
      return { ...state, authenticated: false, company: null, token: null, branchList: [], terminalList: [] }
    case SET_LOGIN_ERROR:
      return { ...state, loginError: payload.error }
    case SET_BRANCH_LIST:
      return { ...state, branchList: payload.list }
    case SET_TERMINAL_LIST:
      return { ...state, terminalList: payload.list }
    case SET_BRANCH:
      return { ...state, branch: payload.entity }
    case SET_TERMINAL:
      return { ...state, terminal: payload.entity }
    default:
      return state
  }
}

export default configReducer

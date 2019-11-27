import {
  LOGIN,
  LOGOUT,
  SET_LOGIN_ERROR
} from './types'

const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...state,
        authenticated: true,
        rolesPerUser: payload.user.RolePorUsuario,
        token: payload.user.Token
      }
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        rolesPerUser: [],
        token: null
      }
    case SET_LOGIN_ERROR:
      return { ...state, loginError: payload.error }
    default:
      return state
  }
}

export default sessionReducer

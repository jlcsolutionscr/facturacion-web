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
        productId: payload.productId,
        rolesPerUser: payload.roles,
        token: payload.token
      }
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        productId: null,
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

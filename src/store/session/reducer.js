import {
  LOGIN,
  LOGOUT
} from './types'

const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...state,
        authenticated: true,
        userId: payload.user.IdUsuario,
        companyId: payload.companyId,
        companyName: payload.companyName,
        companyIdentifier: payload.companyIdentifier,
        permissions: payload.user.RolePorUsuario.map(role => ({IdUsuario: role.IdUsuario, IdRole: role.IdRole})),
        token: payload.user.Token
      }
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        permissions: [],
        token: null
      }
    default:
      return state
  }
}

export default sessionReducer

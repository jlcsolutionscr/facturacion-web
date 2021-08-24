import {
  LOGIN,
  LOGOUT,
  SET_BRANCH_ID
} from './types'

const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...state,
        authenticated: true,
        userId: payload.user.IdUsuario,
        companyId: payload.company.IdEmpresa,
        companyName: payload.company.NombreComercial || payload.company.NombreEmpresa,
        companyIdentifier: payload.company.Identificacion,
        reportList: payload.company.ReportePorEmpresa,
        permissions: payload.user.RolePorUsuario.map(role => ({IdUsuario: role.IdUsuario, IdRole: role.IdRole})),
        branchList: payload.company.SucursalPorEmpresa.map(branch => ({Id: branch.IdSucursal, Descripcion: branch.NombreSucursal})),
        branchId: payload.user.IdSucursal,
        token: payload.user.Token
      }
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        userId: null,
        companyId: null,
        branchId: null,
        companyName: '',
        companyIdentifier: '',
        reportList: [],
        permissions: [],
        branchList: [],
        token: null
      }
    case SET_BRANCH_ID:
      return { ...state, branchId: payload.id }
    default:
      return state
  }
}

export default sessionReducer

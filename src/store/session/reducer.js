import {
  LOGIN,
  LOGOUT,
  SET_COMPANY,
  SET_BRANCH_ID,
  SET_PRINTER
} from './types'

const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...state,
        authenticated: true,
        userId: payload.company.Usuario.IdUsuario,
        userCode: payload.company.Usuario.CodigoUsuario,
        companyId: payload.company.IdEmpresa,
        company: payload.company,
        device: payload.company.EquipoRegistrado,
        reportList: payload.company.ReportePorEmpresa.map(report => ({IdReporte: report.IdReporte, NombreReporte: report.CatalogoReporte.NombreReporte})),
        permissions: payload.company.Usuario.RolePorUsuario.map(role => ({IdUsuario: role.IdUsuario, IdRole: role.IdRole})),
        branchList: payload.company.SucursalPorEmpresa.map(branch => ({Id: branch.IdSucursal, Descripcion: branch.NombreSucursal})),
        branchId: payload.company.EquipoRegistrado.IdSucursal,
        terminalId: payload.company.EquipoRegistrado.IdTerminal,
        token: payload.company.Usuario.Token
      }
    case LOGOUT:
      return {
        ...state,
        authenticated: false,
        userId: null,
        companyId: null,
        branchId: null,
        terminalId: null,
        company: null,
        reportList: [],
        permissions: [],
        branchList: [],
        token: null
      }
    case SET_COMPANY:
      return { ...state, company: { ...state.company, ...payload.company} }
    case SET_BRANCH_ID:
      return { ...state, branchId: payload.id }
    case SET_PRINTER:
      return { ...state, printer: payload.device }
    default:
      return state
  }
}

export default sessionReducer

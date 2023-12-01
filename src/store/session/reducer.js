import { LOGIN, LOGOUT, SET_COMPANY, SET_BRANCH_ID, SET_PRINTER, SET_VENDOR_LIST } from "./types";

import { defaultSession } from "utils/defaults";

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
        reportList: payload.company.ReportePorEmpresa.map(report => ({
          IdReporte: report.IdReporte,
          NombreReporte: report.CatalogoReporte.NombreReporte,
        })),
        permissions: payload.company.Usuario.RolePorUsuario.map(role => ({
          IdUsuario: role.IdUsuario,
          IdRole: role.IdRole,
        })),
        branchList: payload.company.SucursalPorEmpresa.map(branch => ({
          Id: branch.IdSucursal,
          Descripcion: branch.NombreSucursal,
        })),
        branchId: payload.company.EquipoRegistrado.IdSucursal,
        terminalId: payload.company.EquipoRegistrado.IdTerminal,
        token: payload.company.Usuario.Token,
      };
    case LOGOUT:
      return defaultSession;
    case SET_COMPANY:
      return { ...state, company: { ...state.company, ...payload.company } };
    case SET_BRANCH_ID:
      return { ...state, branchId: payload.id };
    case SET_PRINTER:
      return { ...state, printer: payload.device };
    case SET_VENDOR_LIST:
      return { ...state, vendorList: payload.list };
    default:
      return state;
  }
};

export default sessionReducer;

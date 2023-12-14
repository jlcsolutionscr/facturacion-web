import { createSlice } from "@reduxjs/toolkit";

import { sessionInitialState } from "state/InitialState";
import { RootState } from "state/store";

export const sessionSlice = createSlice({
  name: "session",
  initialState: sessionInitialState,
  reducers: {
    login: (state, action) => {
      state.authenticated = true;
      state.userId = action.payload.Usuario.IdUsuario;
      state.userCode = action.payload.Usuario.CodigoUsuario;
      state.companyId = action.payload.IdEmpresa;
      state.company = action.payload;
      state.device = action.payload.EquipoRegistrado;
      state.reportList = action.payload.ReportePorEmpresa.map(
        (report: {
          IdReporte: number;
          CatalogoReporte: { NombreReporte: string };
        }) => ({
          IdReporte: report.IdReporte,
          NombreReporte: report.CatalogoReporte.NombreReporte,
        })
      );
      state.permissions = action.payload.Usuario.RolePorUsuario.map(
        (role: { IdUsuario: number; IdRole: number }) => ({
          IdUsuario: role.IdUsuario,
          IdRole: role.IdRole,
        })
      );
      state.branchList = action.payload.SucursalPorEmpresa.map(
        (branch: { IdSucursal: number; NombreSucursal: string }) => ({
          Id: branch.IdSucursal,
          Descripcion: branch.NombreSucursal,
        })
      );
      state.branchId = action.payload.EquipoRegistrado.IdSucursal;
      state.terminalId = action.payload.EquipoRegistrado.IdTerminal;
      state.token = action.payload.Usuario.Token;
    },
    logout: () => {
      sessionInitialState;
    },
    setCompany: (state, action) => {
      state.company = { ...state.company, ...action.payload.company };
    },
    setBranchId: (state, action) => {
      state.branchId = action.payload.id;
    },
    setPrinter: (state, action) => {
      state.printer = action.payload.device;
    },
    setVendorList: (state, action) => {
      state.vendorList = action.payload.list;
    },
  },
});

export const {
  login,
  logout,
  setCompany,
  setBranchId,
  setPrinter,
  setVendorList,
} = sessionSlice.actions;

export const getCompany = (state: RootState) => state.session.company;
export const getBranchId = (state: RootState) => state.session.branchId;
export const getPrinter = (state: RootState) => state.session.printer;
export const getVendorList = (state: RootState) => state.session.vendorList;

export default sessionSlice.reducer;

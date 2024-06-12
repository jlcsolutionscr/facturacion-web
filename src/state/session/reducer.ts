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
        (report: { IdReporte: number; CatalogoReporte: { NombreReporte: string } }) => ({
          IdReporte: report.IdReporte,
          NombreReporte: report.CatalogoReporte.NombreReporte,
        })
      );
      state.permissions = action.payload.Usuario.RolePorUsuario.map((role: { IdUsuario: number; IdRole: number }) => ({
        IdUsuario: role.IdUsuario,
        IdRole: role.IdRole,
      }));
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
      return sessionInitialState;
    },
    setCompany: (state, action) => {
      state.company = { ...state.company, ...action.payload };
    },
    setBranchId: (state, action) => {
      state.branchId = action.payload;
    },
    setPrinter: (state, action) => {
      state.printer = action.payload;
    },
    setVendorList: (state, action) => {
      state.vendorList = action.payload;
    },
  },
});

export const { login, logout, setCompany, setBranchId, setPrinter, setVendorList } = sessionSlice.actions;

export const getAuthenticated = (state: RootState) => state.session.authenticated;
export const getCompany = (state: RootState) => state.session.company;
export const getBranchId = (state: RootState) => state.session.branchId;
export const getPrinter = (state: RootState) => state.session.printer;
export const getVendorList = (state: RootState) => state.session.vendorList;
export const getPermissions = (state: RootState) => state.session.permissions;
export const getBranchList = (state: RootState) => state.session.branchList;
export const getReportList = (state: RootState) => state.session.reportList;

export default sessionSlice.reducer;

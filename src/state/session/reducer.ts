import { createSlice } from "@reduxjs/toolkit";

import { sessionInitialState } from "state/InitialState";
import { RootState } from "state/store";
import { convertToDateTimeString } from "utils/utilities";

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
    setProcessingToken: (state, action) => {
      state.processingToken = { type: action.payload.type, id: action.payload.id };
    },
    setProcessingTokenMessage: (state, action) => {
      state.processingTokenMessage = action.payload;
    },
    setCashCloseEntity: (state, action) => {
      state.cashCloseEntity = action.payload;
      if (state.cashCloseEntity !== null) {
        state.cashCloseEntity.FechaCierre = convertToDateTimeString(new Date(), true);
        state.cashCloseEntity.FondoCierre =
          action.payload.FondoInicio +
          action.payload.AdelantosApartadoEfectivo +
          action.payload.AdelantosOrdenEfectivo +
          action.payload.IngresosEfectivo +
          action.payload.PagosCxCEfectivo +
          action.payload.VentasEfectivo -
          action.payload.ComprasEfectivo -
          action.payload.EgresosEfectivo -
          action.payload.PagosCxPEfectivo;
      }
    },
    setWidthawalAmount: (state, action) => {
      const cashClose = state.cashCloseEntity;
      if (cashClose !== null) {
        cashClose.RetiroEfectivo = action.payload;
        cashClose.FondoCierre =
          cashClose.FondoInicio +
          cashClose.AdelantosApartadoEfectivo +
          cashClose.AdelantosOrdenEfectivo +
          cashClose.IngresosEfectivo +
          cashClose.PagosCxCEfectivo +
          cashClose.VentasEfectivo -
          cashClose.ComprasEfectivo -
          cashClose.EgresosEfectivo -
          cashClose.PagosCxPEfectivo -
          action.payload;
      }
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
  setProcessingToken,
  setProcessingTokenMessage,
  setCashCloseEntity,
  setWidthawalAmount,
} = sessionSlice.actions;

export const getAuthenticated = (state: RootState) => state.session.authenticated;
export const getCompany = (state: RootState) => state.session.company;
export const getCompanyMode = (state: RootState) => state.session.company?.Modalidad ?? 1;
export const getUserId = (state: RootState) => state.session.userId;
export const getUserCode = (state: RootState) => state.session.userCode;
export const getBranchId = (state: RootState) => state.session.branchId;
export const getPrinter = (state: RootState) => state.session.printer;
export const getVendorList = (state: RootState) => state.session.vendorList;
export const getPermissions = (state: RootState) => state.session.permissions;
export const getBranchList = (state: RootState) => state.session.branchList;
export const getReportList = (state: RootState) => state.session.reportList;
export const getProcessingToken = (state: RootState) => state.session.processingToken;
export const getProcessingTokenMessage = (state: RootState) => state.session.processingTokenMessage;
export const getCashCloseEntity = (state: RootState) => state.session.cashCloseEntity;

export default sessionSlice.reducer;

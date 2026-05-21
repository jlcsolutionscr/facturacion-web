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
      state.roles = action.payload.RolePorEmpresa.map((role: { IdRole: number }) => ({
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
        state.isCashCloseSaved = false;
      }
    },
    setCashCloseMethod: (state, action) => {
      const entity = state.cashCloseEntity;
      if (entity) {
        const amount =
          entity.FondoInicio +
          entity.EfectivoCierreAnterior +
          entity.AdelantosApartadoEfectivo +
          entity.AdelantosOrdenEfectivo +
          entity.PagosCxCEfectivo +
          entity.IngresosEfectivo +
          entity.VentasEfectivo -
          entity.ComprasEfectivo -
          entity.EgresosEfectivo -
          entity.PagosCxPEfectivo -
          entity.FondoCierre;
        if (action.payload) {
          entity.EfectivoCierreSiguiente = 0;
          entity.RetiroEfectivo = amount;
        } else {
          entity.EfectivoCierreSiguiente = amount;
          entity.RetiroEfectivo = 0;
        }
      }
    },
    setIsCashCloseSaved: (state, action) => {
      state.cashCloseId = action.payload.cashCloseId;
      state.isCashCloseSaved = action.payload.isSaved;
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
  setCashCloseMethod,
  setIsCashCloseSaved,
} = sessionSlice.actions;

export const getAuthenticated = (state: RootState) => state.session.authenticated;
export const getCompany = (state: RootState) => state.session.company;
export const getCompanyMode = (state: RootState) => state.session.company?.Modalidad ?? 1;
export const getUserId = (state: RootState) => state.session.userId;
export const getUserCode = (state: RootState) => state.session.userCode;
export const getCompanyId = (state: RootState) => state.session.companyId;
export const getBranchId = (state: RootState) => state.session.branchId;
export const getPrinter = (state: RootState) => state.session.printer;
export const getVendorList = (state: RootState) => state.session.vendorList;
export const getPermissions = (state: RootState) => state.session.permissions;
export const getCompanyRoles = (state: RootState) => state.session.roles;
export const getBranchList = (state: RootState) => state.session.branchList;
export const getReportList = (state: RootState) => state.session.reportList;
export const getProcessingToken = (state: RootState) => state.session.processingToken;
export const getProcessingTokenMessage = (state: RootState) => state.session.processingTokenMessage;
export const getCashCloseEntity = (state: RootState) => state.session.cashCloseEntity;
export const getIsCashCloseSaved = (state: RootState) => state.session.isCashCloseSaved;
export const getCashCloseId = (state: RootState) => state.session.cashCloseId;
export default sessionSlice.reducer;

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
    setCreditCardBankId: (state, action) => {
      state.creditCardBankId = action.payload;
    },
    setTransferBankId: (state, action) => {
      state.transferBankId = action.payload;
    },
    setPrinter: (state, action) => {
      state.printer = action.payload;
    },
    setProcessingToken: (state, action) => {
      state.processingToken = { type: action.payload.type, id: action.payload.id };
    },
    setProcessingTokenMessage: (state, action) => {
      state.processingTokenMessage = action.payload;
    },
    setCashCloseEntity: (state, action) => {
      state.cashCloseEntity = action.payload.entity;
      state.cashCloseId = action.payload.id;
      state.isCashCloseSaved = action.payload.isSaved;
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
    setCashCloseListPage: (state, action) => {
      state.cashCloseListPage = action.payload;
    },
    setCashCloseListCount: (state, action) => {
      state.cashCloseListCount = action.payload;
    },
    setCashCloseList: (state, action) => {
      state.cashCloseList = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setCompany,
  setBranchId,
  setCreditCardBankId,
  setTransferBankId,
  setPrinter,
  setProcessingToken,
  setProcessingTokenMessage,
  setCashCloseEntity,
  setCashCloseMethod,
  setIsCashCloseSaved,
  setCashCloseListPage,
  setCashCloseListCount,
  setCashCloseList,
} = sessionSlice.actions;

export const getAuthenticated = (state: RootState) => state.session.authenticated;
export const getCompany = (state: RootState) => state.session.company;
export const getCompanyMode = (state: RootState) => state.session.company?.Modalidad ?? 1;
export const getCompanyIsSimplified = (state: RootState) => state.session.company?.RegimenSimplificado ?? false;
export const getUserId = (state: RootState) => state.session.userId;
export const getUserCode = (state: RootState) => state.session.userCode;
export const getCompanyId = (state: RootState) => state.session.companyId;
export const getBranchId = (state: RootState) => state.session.branchId;
export const getCreditCardBankId = (state: RootState) => state.session.creditCardBankId;
export const getTransferBankId = (state: RootState) => state.session.transferBankId;
export const getPrinter = (state: RootState) => state.session.printer;
export const getVendorList = (state: RootState) => state.session.vendorList;
export const getPermissions = (state: RootState) => state.session.permissions;
export const getBranchList = (state: RootState) => state.session.branchList;
export const getReportList = (state: RootState) => state.session.reportList;
export const getProcessingToken = (state: RootState) => state.session.processingToken;
export const getProcessingTokenMessage = (state: RootState) => state.session.processingTokenMessage;
export const getCashCloseEntity = (state: RootState) => state.session.cashCloseEntity;
export const getIsCashCloseSaved = (state: RootState) => state.session.isCashCloseSaved;
export const getCashCloseId = (state: RootState) => state.session.cashCloseId;
export const getCashCloseListPage = (state: RootState) => state.session.cashCloseListPage;
export const getCashCloseListCount = (state: RootState) => state.session.cashCloseListCount;
export const getCashCloseList = (state: RootState) => state.session.cashCloseList;
export default sessionSlice.reducer;

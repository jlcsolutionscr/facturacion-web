import { CompanyType, IdDescriptionType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setPriceTypeList } from "state/customer/reducer";
import { setProductTypeList } from "state/product/reducer";
import {
  login,
  logout,
  setCashCloseEntity,
  setCashCloseList,
  setCashCloseListCount,
  setCashCloseListPage,
  setIsCashCloseSaved,
  setProcessingToken,
  setProcessingTokenMessage,
  setVendorList,
} from "state/session/reducer";
import { RootState } from "state/store";
import {
  setActiveSection,
  setExonerationNameList,
  setExonerationTypeList,
  setIdTypeList,
  setMessage,
  setTaxTypeList,
  startLoader,
  stopLoader,
} from "state/ui/reducer";
import {
  abortCashCloseProcess as abortCashCloseProcessRequest,
  authorizeUserEmail as authorizeUserEmailRequest,
  generateCashClosePDF as generateCashClosePDFRequest,
  generateCashCloseDetails as getCashCloseDetailsRequest,
  getCashCloseEntity,
  getCashCloseListCount,
  getCashCloseListPerPage,
  getVendorList,
  requestUserLogin,
  requestUserPasswordReset,
  resetUserPassword as resetUserPasswordRequest,
  saveCashCloseDetails as saveCashCloseDetailsRequest,
  saveUserPassword,
  updateUserEmail,
  validateProcessingToken as validateProcessingTokenRequest,
} from "utils/domainHelper";
import {
  clearSessionFromStorage,
  convertToDateTimeString,
  getErrorMessage,
  writeSessionToStorage,
} from "utils/utilities";

type SessionCompanyType = CompanyType & {
  ListadoTipoIdentificacion: IdDescriptionType[];
  ListadoTipoImpuesto: IdDescriptionType[];
  ListadoTipoExoneracion: IdDescriptionType[];
  ListadoNombreInstExoneracion: IdDescriptionType[];
  ListadoTipoPrecio: IdDescriptionType[];
  ListadoTipoProducto: IdDescriptionType[];
};

export const userLogin = createAsyncThunk(
  "session/userLogin",
  async (payload: { username: string; password: string; id: string }, { dispatch }) => {
    dispatch(startLoader());
    try {
      const company = await requestUserLogin(payload.username, payload.password, payload.id);
      const vendorList = await getVendorList(company.Usuario.Token, company.IdEmpresa);
      dispatch(setVendorList(vendorList));
      dispatch(login(company));
      dispatch(setIdTypeList(company.ListadoTipoIdentificacion));
      dispatch(setTaxTypeList(company.ListadoTipoImpuesto));
      dispatch(setExonerationTypeList(company.ListadoTipoExoneracion));
      dispatch(setExonerationNameList(company.ListadoNombreInstExoneracion));
      dispatch(setPriceTypeList(company.ListadoTipoPrecio));
      dispatch(setProductTypeList(company.ListadoTipoProducto));
      writeSessionToStorage(payload.username, company);
      dispatch(setActiveSection(0));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(logout());
      dispatch(stopLoader());
    }
  }
);

export const userLogout = createAsyncThunk("session/userLogout", async (_payload, { dispatch }) => {
  try {
    clearSessionFromStorage();
    dispatch(logout());
  } catch (error) {
    dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
  }
});

export const restoreSession = createAsyncThunk(
  "session/restoreSession",
  async (payload: SessionCompanyType, { dispatch }) => {
    dispatch(startLoader());
    try {
      const vendorList = await getVendorList(payload.Usuario.Token, payload.IdEmpresa);
      dispatch(setVendorList(vendorList));
      dispatch(login(payload));
      dispatch(setIdTypeList(payload.ListadoTipoIdentificacion));
      dispatch(setTaxTypeList(payload.ListadoTipoImpuesto));
      dispatch(setExonerationTypeList(payload.ListadoTipoExoneracion));
      dispatch(setExonerationNameList(payload.ListadoNombreInstExoneracion));
      dispatch(setPriceTypeList(payload.ListadoTipoPrecio));
      dispatch(setProductTypeList(payload.ListadoTipoProducto));
      dispatch(setActiveSection(0));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(logout());
      dispatch(stopLoader());
    }
  }
);

export const requestUserPasswordResetLink = createAsyncThunk(
  "session/requestUserPasswordResetLink",
  async (payload: { email: string }, { dispatch }) => {
    dispatch(startLoader());
    try {
      await requestUserPasswordReset(payload.email);
      dispatch(stopLoader());
      dispatch(setMessage({ message: "Solicitud de restablecimiento enviada satisfactoriamente. . .", type: "INFO" }));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const validateProcessingToken = createAsyncThunk(
  "session/validateProcessingToken",
  async (payload: { type: string; id: string }, { dispatch }) => {
    dispatch(startLoader());
    try {
      await validateProcessingTokenRequest(payload.id);
      dispatch(setProcessingToken({ type: payload.type, id: payload.id }));
    } catch {
      dispatch(
        setProcessingTokenMessage(
          "La sesión se encuentra expirada. Por favor reinicie la solicitud de cambio de contraseña. . ."
        )
      );
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

export const updateSecurityUserInfo = createAsyncThunk(
  "session/updateSecurityUserInfo",
  async (payload: { password: string; email: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userId } = session;
    dispatch(startLoader());
    try {
      if (payload.password !== "") await saveUserPassword(token, userId, payload.password);
      if (payload.email) await updateUserEmail(token, userId, payload.email);
      dispatch(setMessage({ message: "Se actualizó la información del usuario satisfactoriamente . .", type: "INFO" }));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

export const resetUserPassword = createAsyncThunk(
  "session/resetUserPassword",
  async (payload: { id: string; password: string }, { dispatch }) => {
    dispatch(startLoader());
    try {
      await resetUserPasswordRequest(payload.id, payload.password);
      dispatch(setProcessingTokenMessage("La contraseña se reestableció satisfactoriamente. . ."));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

export const saveUserEmail = createAsyncThunk(
  "session/saveUserEmail",
  async (payload: { email: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userId } = session;
    dispatch(startLoader());
    try {
      await updateUserEmail(token, userId, payload.email);
      dispatch(
        setMessage({
          message:
            "La dirección de correo se actualizó correctamente sin embargo debe validar la información ingresada con el acceso adjunto en el correo enviado. . .",
          type: "INFO",
        })
      );
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

export const authorizeUserEmail = createAsyncThunk(
  "session/authorizeUserEmail",
  async (payload: { id: string }, { dispatch }) => {
    dispatch(startLoader());
    try {
      await authorizeUserEmailRequest(payload.id);
      dispatch(setProcessingTokenMessage("La autorización se realizó satisfactoriamente. . ."));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

export const generateCashCloseDetails = createAsyncThunk(
  "session/generateCashCloseDetails",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const cashCloseEntity = await getCashCloseDetailsRequest(token, companyId, branchId);
      if (cashCloseEntity !== null) {
        cashCloseEntity.FechaCierre = convertToDateTimeString(new Date(), true);
        dispatch(setCashCloseEntity({ entity: cashCloseEntity, id: 0, isSaved: false }));
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

export const saveCashCloseDetails = createAsyncThunk(
  "session/saveCashCloseDetails",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, cashCloseEntity } = session;
    if (cashCloseEntity !== null) {
      dispatch(startLoader());
      try {
        const cashCloseId = await saveCashCloseDetailsRequest(token, cashCloseEntity);
        dispatch(setIsCashCloseSaved({ cashCloseId, isSaved: true }));
        dispatch(setMessage({ message: "El cierre de efectivo se guardó satisfactoriamente...", type: "INFO" }));
      } catch (error) {
        dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
        dispatch(stopLoader());
      }
      dispatch(stopLoader());
    } else {
      dispatch(setMessage({ message: "No se ha generado la información para el cierre de efectivo!", type: "ERROR" }));
    }
  }
);

export const abortCashCloseProcess = createAsyncThunk(
  "session/abortCashCloseProcess",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      await abortCashCloseProcessRequest(token, companyId, branchId);
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

export const generateCashClosePDF = createAsyncThunk(
  "session/generateCashClosePDF",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, cashCloseId } = session;
    dispatch(startLoader());
    try {
      await generateCashClosePDFRequest(token, cashCloseId);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getCashCloseListFirstPage = createAsyncThunk(
  "session/getCashCloseListFirstPage",
  async (payload: { rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      dispatch(setCashCloseListPage(1));
      const recordCount = await getCashCloseListCount(token, companyId, branchId);
      dispatch(setCashCloseListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getCashCloseListPerPage(token, companyId, branchId, 1, payload.rowsPerPage);
        dispatch(setCashCloseList(newList));
      } else {
        dispatch(setCashCloseList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getCashCloseListByPageNumber = createAsyncThunk(
  "session/getCashCloseListByPageNumber",
  async (payload: { pageNumber: number; rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const newList = await getCashCloseListPerPage(
        token,
        companyId,
        branchId,
        payload.pageNumber,
        payload.rowsPerPage
      );
      dispatch(setCashCloseListPage(payload.pageNumber));
      dispatch(setCashCloseList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getCashCloseDetails = createAsyncThunk(
  "session/getCashCloseDetails",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      const cashCloseEntity = await getCashCloseEntity(token, payload.id);
      dispatch(setCashCloseEntity({ entity: cashCloseEntity, id: cashCloseEntity.IdCierre, isSaved: true }));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

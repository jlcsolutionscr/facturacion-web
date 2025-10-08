import { CompanyType, IdDescriptionType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setPriceTypeList } from "state/customer/reducer";
import { setProductTypeList } from "state/product/reducer";
import { login, logout, setProcessingToken, setProcessingTokenMessage, setVendorList } from "state/session/reducer";
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
  authorizeUserEmail as authorizeUserEmailRequest,
  getVendorList,
  requestUserLogin,
  requestUserPasswordReset,
  resetUserPassword as resetUserPasswordRequest,
  updateUserEmail,
  validateProcessingToken as validateProcessingTokenRequest,
} from "utils/domainHelper";
import { cleanLocalStorage, getErrorMessage, writeToLocalStorage } from "utils/utilities";

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
      writeToLocalStorage(payload.username, company);
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
    cleanLocalStorage();
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

import { CompanyType, IdDescriptionType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setPriceTypeList } from "state/customer/reducer";
import { setProductTypeList } from "state/product/reducer";
import { login, logout, setPasswordResetMessage, setResetPasswordId, setVendorList } from "state/session/reducer";
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
  getVendorList,
  requestUserLogin,
  requestUserPasswordReset,
  resetUserPassword as resetUserPasswordRequest,
  validateResetId,
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
  async (payload: { id: string; email: string }, { dispatch }) => {
    dispatch(startLoader());
    try {
      await requestUserPasswordReset(payload.id, payload.email);
      dispatch(stopLoader());
      dispatch(setMessage({ message: "Solicitud de restablecimiento enviada satisfactoriamente. . .", type: "INFO" }));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const validateResetLink = createAsyncThunk(
  "session/validateResetLink",
  async (payload: { id: string }, { dispatch }) => {
    dispatch(startLoader());
    try {
      await validateResetId(payload.id);
      dispatch(setResetPasswordId(payload.id));
    } catch (error) {
      dispatch(
        setPasswordResetMessage(
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
      dispatch(setPasswordResetMessage("La contraseña se reestableció satisfactoriamente. . ."));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
    dispatch(stopLoader());
  }
);

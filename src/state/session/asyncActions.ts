import { createAsyncThunk } from "@reduxjs/toolkit";

import { setPriceTypeList } from "state/customer/reducer";
import { setProductTypeList } from "state/product/reducer";
import { login, logout } from "state/session/reducer";
import {
  startLoader,
  stopLoader,
  setMessage,
  setTaxTypeList,
  setExonerationTypeList,
  setIdTypeList,
} from "state/ui/reducer";
import { CompanyType } from "types/domain";
import { requestUserLogin } from "utils/domainHelper";
import {
  writeToLocalStorage,
  cleanLocalStorage,
  getErrorMessage,
} from "utils/utilities";

export const userLogin = createAsyncThunk(
  "session/userLogin",
  async (
    payload: { username: string; password: string; id: string },
    { dispatch }
  ) => {
    dispatch(startLoader());
    try {
      const company: CompanyType = await requestUserLogin(
        payload.username,
        payload.password,
        payload.id
      );
      dispatch(login(company));
      dispatch(setIdTypeList(company.ListadoTipoIdentificacion));
      dispatch(setTaxTypeList(company.ListadoTipoImpuesto));
      dispatch(setExonerationTypeList(company.ListadoTipoExoneracion));
      dispatch(setPriceTypeList(company.ListadoTipoPrecio));
      dispatch(setProductTypeList(company.ListadoTipoProducto));
      writeToLocalStorage(payload.username, company);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(logout());
      dispatch(stopLoader());
      console.error("Exeption authenticating session", error);
    }
  }
);

export const userLogout = createAsyncThunk(
  "session/userLogout",
  async (_payload, { dispatch }) => {
    try {
      cleanLocalStorage();
      dispatch(logout());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      console.error("Exeption on logout session", error);
    }
  }
);

export const restoreSession = createAsyncThunk(
  "session/restoreSession",
  async (payload: CompanyType, { dispatch }) => {
    dispatch(startLoader());
    try {
      dispatch(login(payload));
      dispatch(setIdTypeList(payload.ListadoTipoIdentificacion));
      dispatch(setTaxTypeList(payload.ListadoTipoImpuesto));
      dispatch(setExonerationTypeList(payload.ListadoTipoExoneracion));
      dispatch(setPriceTypeList(payload.ListadoTipoPrecio));
      dispatch(setProductTypeList(payload.ListadoTipoProducto));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(logout());
      dispatch(stopLoader());
      console.error("Exeption authenticating session", error);
    }
  }
);

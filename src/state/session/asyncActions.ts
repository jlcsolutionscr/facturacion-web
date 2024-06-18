import { CompanyType, IdDescriptionType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setPriceTypeList } from "state/customer/reducer";
import { setProductTypeList } from "state/product/reducer";
import { login, logout, setVendorList } from "state/session/reducer";
import {
  setActiveSection,
  setExonerationTypeList,
  setIdTypeList,
  setMessage,
  setTaxTypeList,
  startLoader,
  stopLoader,
} from "state/ui/reducer";
import { getVendorList, requestUserLogin } from "utils/domainHelper";
import { cleanLocalStorage, getErrorMessage, writeToLocalStorage } from "utils/utilities";

type SessionCompanyType = CompanyType & {
  ListadoTipoIdentificacion: IdDescriptionType[];
  ListadoTipoImpuesto: IdDescriptionType[];
  ListadoTipoExoneracion: IdDescriptionType[];
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

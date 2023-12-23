import { createSlice } from "@reduxjs/toolkit";
import { companyInitialState } from "state/InitialState";
import { RootState } from "state/store";

const companySlice = createSlice({
  name: "company",
  initialState: companyInitialState,
  reducers: {
    setCompany: (state, action) => {
      state.entity = action.payload;
    },
    setCompanyLogo: (state, action) => {
      state.logo = action.payload;
    },
    setCredentials: (state, action) => {
      state.credentialsChanged = false;
      state.credentialsNew = !action.payload;
      state.credentials.UsuarioHacienda = action.payload.UsuarioHacienda;
      state.credentials.ClaveHacienda = action.payload.ClaveHacienda;
      state.credentials.Certificado = action.payload.Certificado;
      state.credentials.PinCertificado = action.payload.PinCertificado;
    },
    setAvailableEconomicActivityList: (state, action) => {
      state.availableEconomicActivityList = action.payload;
    },
    setCompanyAttribute: (state, action) => {
      state.entity = {
        ...state.entity,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setCredentialsAttribute: (state, action) => {
      state.credentialsChanged = true;
      state.credentials = {
        ...state.credentials,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setReportResults: (state, action) => {
      state.reportResults = action.payload.list;
      state.reportSummary = action.payload.summary;
    },
  },
});

export const {
  setCompany,
  setCompanyLogo,
  setCredentials,
  setAvailableEconomicActivityList,
  setCompanyAttribute,
  setCredentialsAttribute,
  setReportResults,
} = companySlice.actions;

export const getCompany = (state: RootState) => state.company.entity;
export const getCompanyLogo = (state: RootState) => state.company.logo;
export const getCredentials = (state: RootState) => state.company.credentials;
export const getAvailableEconomicActivityList = (state: RootState) =>
  state.company.availableEconomicActivityList;
export const getReportResults = (state: RootState) =>
  state.company.reportResults;

export default companySlice.reducer;

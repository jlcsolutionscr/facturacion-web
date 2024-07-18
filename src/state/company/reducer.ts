import { createSlice } from "@reduxjs/toolkit";

import { companyInitialState } from "state/InitialState";
import { logout } from "state/session/reducer";
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
      const { credentials, newCredentials } = action.payload;
      state.credentialsChanged = false;
      state.newCredentials = newCredentials;
      state.credentials.UsuarioHacienda = credentials.UsuarioHacienda;
      state.credentials.ClaveHacienda = credentials.ClaveHacienda;
      state.credentials.NombreCertificado = credentials.NombreCertificado;
      state.credentials.PinCertificado = credentials.PinCertificado;
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
  extraReducers: builder => {
    builder.addCase(logout, () => {
      return companyInitialState;
    });
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
export const getAvailableEconomicActivityList = (state: RootState) => state.company.availableEconomicActivityList;
export const getReportResults = (state: RootState) => state.company.reportResults;
export const getReportSummary = (state: RootState) => state.company.reportSummary;

export default companySlice.reducer;

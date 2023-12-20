import { createSlice } from "@reduxjs/toolkit";
import { companyInitialState } from "state/InitialState";
import { RootState } from "state/store";

const companySlice = createSlice({
  name: "company",
  initialState: companyInitialState,
  reducers: {
    setCompany: (state, action) => {
      state.entity = action.payload.company;
    },
    setCompanyLogo: (state, action) => {
      state.logo = action.payload.image;
    },
    setCredentials: (state, action) => {
      state.credentialsChanged = false;
      state.credentialsNew = !action.payload.credentials;
      state.credentials = action.payload.credentials;
    },
    setAvailableEconomicActivityList: (state, action) => {
      state.entity.ActividadEconomicaEmpresa = action.payload.list;
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

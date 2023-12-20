import { createSelector, createSlice } from "@reduxjs/toolkit";

import { uiInitialState } from "state/InitialState";
import { RootState } from "state/store";

const uiSlice = createSlice({
  name: "ui",
  initialState: uiInitialState,
  reducers: {
    startLoader: (state, action: { payload?: { text?: string } }) => {
      state.isLoaderOpen = true;
      state.loaderText =
        action.payload?.text !== undefined
          ? action.payload?.text
          : "Procesando";
    },
    stopLoader: (state) => {
      state.isLoaderOpen = false;
      state.loaderText = "";
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload.message;
      state.messageType = action.payload.type;
    },
    setCantonList: (state, action) => {
      state.cantonList = action.payload.list;
    },
    setDistritoList: (state, action) => {
      state.distritoList = action.payload.list;
    },
    setBarrioList: (state, action) => {
      state.barrioList = action.payload.list;
    },
    setTaxTypeList: (state, action) => {
      state.taxTypeList = action.payload.list;
    },
    setExonerationTypeList: (state, action) => {
      state.exonerationTypeList = action.payload.list;
    },
    setIdTypeList: (state, action) => {
      state.idTypeList = action.payload.list;
    },
  },
});

export const {
  startLoader,
  stopLoader,
  setActiveSection,
  setMessage,
  setCantonList,
  setDistritoList,
  setBarrioList,
  setTaxTypeList,
  setExonerationTypeList,
  setIdTypeList,
} = uiSlice.actions;

export const getIsLoaderOpen = (state: RootState) => state.ui.isLoaderOpen;
export const getActiveSection = (state: RootState) => state.ui.activeSection;
export const getLoaderText = (state: RootState) => state.ui.loaderText;
export const getMessage = createSelector(
  (state: RootState) => state.ui,
  (ui) => {
    return { message: ui.message, messageType: ui.messageType };
  }
);
export const getCantonList = (state: RootState) => state.ui.distritoList;
export const getDistritoList = (state: RootState) => state.ui.distritoList;
export const getBarrioList = (state: RootState) => state.ui.barrioList;
export const getTaxTypeList = (state: RootState) => state.ui.taxTypeList;
export const getExonerationTypeList = (state: RootState) =>
  state.ui.exonerationTypeList;
export const getIdTypeList = (state: RootState) => state.ui.idTypeList;

export default uiSlice.reducer;

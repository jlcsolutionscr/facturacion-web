import { createSlice } from "@reduxjs/toolkit";

import { documentInitialState } from "state/InitialState";
import { RootState } from "state/store";

const documentSlice = createSlice({
  name: "document",
  initialState: documentInitialState,
  reducers: {
    setDocumentList: (state, action) => {
      state.list = action.payload;
    },
    setDocumentCount: (state, action) => {
      state.listCount = action.payload;
    },
    setDocumentPage: (state, action) => {
      state.listPage = action.payload;
    },
    setDocumentDetails: (state, action) => {
      state.details = action.payload;
    },
  },
});

export const { setDocumentList, setDocumentCount, setDocumentPage, setDocumentDetails } = documentSlice.actions;

export const getDocumentList = (state: RootState) => state.document.list;
export const getDocumentListCount = (state: RootState) => state.document.listCount;
export const getDocumentListPage = (state: RootState) => state.document.listPage;
export const getDocumentDetails = (state: RootState) => state.document.details;

export default documentSlice.reducer;

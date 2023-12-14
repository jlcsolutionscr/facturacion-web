import { createSlice } from "@reduxjs/toolkit";

import { receiptInitialState } from "state/InitialState";
import { RootState } from "state/store";
import { defaultReceipt, defaultReceiptProduct } from "utils/defaults";

export const receiptSlice = createSlice({
  name: "receipt",
  initialState: receiptInitialState,
  reducers: {
    setIssuerDetails: (state, action) => {
      state.entity.issuer = {
        ...state.entity.issuer,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setProductDetails: (state, action) => {
      state.entity.productDetails = {
        ...state.entity.productDetails,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setProductList: (state, action) => {
      state.entity.productDetailList = action.payload.details;
    },
    resetProductDetail: (state) => {
      state.entity.productDetails = defaultReceiptProduct;
    },
    setSummary: (state, action) => {
      state.entity.summary = action.payload.summary;
    },
    setExonerationDetails: (state, action) => {
      state.entity.exoneration = {
        ...state.entity.exoneration,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setActivityCode: (state, action) => {
      state.entity.activityCode = action.payload.code;
    },
    setSuccessful: (state) => {
      state.entity.successful = true;
    },
    resetReceipt: (state) => {
      state.entity = defaultReceipt;
    },
  },
});

export const {
  setIssuerDetails,
  setProductDetails,
  setProductList,
  resetProductDetail,
  setSummary,
  setExonerationDetails,
  setActivityCode,
  setSuccessful,
  resetReceipt,
} = receiptSlice.actions;

export const getIssuerDetails = (state: RootState) =>
  state.receipt.entity.issuer;
export const getProductDetails = (state: RootState) =>
  state.receipt.entity.productDetails;
export const getProductList = (state: RootState) =>
  state.receipt.entity.productDetailList;
export const getSummary = (state: RootState) => state.receipt.entity.summary;
export const getExonerationDetails = (state: RootState) =>
  state.receipt.entity.exoneration;
export const getActivityCode = (state: RootState) =>
  state.receipt.entity.activityCode;
export const getSuccessful = (state: RootState) =>
  state.receipt.entity.successful;

export default receiptSlice.reducer;

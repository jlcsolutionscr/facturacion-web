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
    setProductDetailsList: (state, action) => {
      state.entity.productDetailsList = action.payload;
    },
    resetProductDetails: (state) => {
      state.entity.productDetails = defaultReceiptProduct;
    },
    setProductTaxDetails: (state, action) => {
      state.entity.productDetails.taxRate = action.payload.rate;
      state.entity.productDetails.taxRateType = action.payload.type;
    },
    setSummary: (state, action) => {
      state.entity.summary = action.payload;
    },
    setExonerationDetails: (state, action) => {
      state.entity.exoneration = {
        ...state.entity.exoneration,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setActivityCode: (state, action) => {
      state.entity.activityCode = action.payload;
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
  setProductDetailsList,
  resetProductDetails,
  setProductTaxDetails,
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
export const getProductDetailsList = (state: RootState) =>
  state.receipt.entity.productDetailsList;
export const getSummary = (state: RootState) => state.receipt.entity.summary;
export const getExonerationDetails = (state: RootState) =>
  state.receipt.entity.exoneration;
export const getActivityCode = (state: RootState) =>
  state.receipt.entity.activityCode;
export const getSuccessful = (state: RootState) =>
  state.receipt.entity.successful;

export default receiptSlice.reducer;

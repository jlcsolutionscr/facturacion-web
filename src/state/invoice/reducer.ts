import { createSlice } from "@reduxjs/toolkit";

import { invoiceInitialState } from "state/InitialState";
import { logout } from "state/session/reducer";
import { RootState } from "state/store";
import { defaultInvoice, defaultProductDetails } from "utils/defaults";

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: invoiceInitialState,
  reducers: {
    setCustomerDetails: (state, action) => {
      state.entity.customerDetails = action.payload;
    },
    setCustomerAttribute: (state, action) => {
      state.entity.customerDetails = {
        ...state.entity.customerDetails,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setProductDetails: (state, action) => {
      state.entity.productDetails = action.payload;
    },
    setDescription: (state, action) => {
      state.entity.productDetails.description = action.payload;
    },
    setQuantity: (state, action) => {
      state.entity.productDetails.quantity = action.payload;
    },
    setPrice: (state, action) => {
      state.entity.productDetails.price = action.payload;
    },
    resetProductDetails: state => {
      state.entity.productDetails = defaultProductDetails;
    },
    setProductDetailsList: (state, action) => {
      state.entity.productDetailsList = action.payload;
    },
    setSummary: (state, action) => {
      state.entity.summary = action.payload;
    },
    setActivityCode: (state, action) => {
      state.entity.activityCode = action.payload;
    },
    setPaymentDetailsList: (state, action) => {
      state.entity.paymentDetailsList = action.payload;
    },
    setVendorId: (state, action) => {
      state.entity.vendorId = action.payload;
    },
    setComment: (state, action) => {
      state.entity.comment = action.payload;
    },
    setCurrency: (state, action) => {
      state.entity.currency = action.payload;
    },
    setSuccessful: (state, action) => {
      state.entity.invoiceId = action.payload.id;
      state.entity.consecutive = action.payload.consecutive;
      state.entity.successful = action.payload.success;
    },
    setInvoiceListPage: (state, action) => {
      state.listPage = action.payload;
    },
    setInvoiceListCount: (state, action) => {
      state.listCount = action.payload;
    },
    setInvoiceList: (state, action) => {
      state.list = action.payload;
    },
    resetInvoice: state => {
      state.entity = defaultInvoice;
    },
  },
  extraReducers: builder => {
    builder.addCase(logout, () => {
      return invoiceInitialState;
    });
  },
});

export const {
  setCustomerDetails,
  setCustomerAttribute,
  setProductDetails,
  setDescription,
  setQuantity,
  setPrice,
  resetProductDetails,
  setProductDetailsList,
  setSummary,
  setActivityCode,
  setPaymentDetailsList,
  setVendorId,
  setComment,
  setCurrency,
  setSuccessful,
  setInvoiceListPage,
  setInvoiceListCount,
  setInvoiceList,
  resetInvoice,
} = invoiceSlice.actions;

export const getInvoiceId = (state: RootState) => state.invoice.entity.invoiceId;
export const getCustomerDetails = (state: RootState) => state.invoice.entity.customerDetails;
export const getProductDetails = (state: RootState) => state.invoice.entity.productDetails;
export const getProductDetailsList = (state: RootState) => state.invoice.entity.productDetailsList;
export const getSummary = (state: RootState) => state.invoice.entity.summary;
export const getActivityCode = (state: RootState) => state.invoice.entity.activityCode;
export const getPaymentDetailsList = (state: RootState) => state.invoice.entity.paymentDetailsList;
export const getVendorId = (state: RootState) => state.invoice.entity.vendorId;
export const getComment = (state: RootState) => state.invoice.entity.comment;
export const getCurrency = (state: RootState) => state.invoice.entity.currency;
export const getSuccessful = (state: RootState) => state.invoice.entity.successful;
export const getInvoiceListPage = (state: RootState) => state.invoice.listPage;
export const getInvoiceListCount = (state: RootState) => state.invoice.listCount;
export const getInvoiceList = (state: RootState) => state.invoice.list;

export default invoiceSlice.reducer;

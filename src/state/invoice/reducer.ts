import { createSlice } from "@reduxjs/toolkit";
import { invoiceInitialState } from "state/InitialState";
import { RootState } from "state/store";
import { defaultInvoice, defaultInvoiceProduct } from "utils/defaults";

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: invoiceInitialState,
  reducers: {
    setCustomerDetails: (state, action) => {
      state.entity.customerDetails = action.payload;
    },
    setProductDetails: (state, action) => {
      state.entity.productDetails = action.payload;
    },
    setDescription: (state, action) => {
      state.entity.productDetails.description = action.payload.description;
    },
    setQuantity: (state, action) => {
      state.entity.productDetails.quantity = action.payload.quantity;
    },
    setPrice: (state, action) => {
      state.entity.productDetails.price = action.payload.price;
    },
    resetProductDetail: (state) => {
      state.entity.productDetails = defaultInvoiceProduct;
    },
    setProductList: (state, action) => {
      state.entity.productDetailList = action.payload.details;
    },
    setSummary: (state, action) => {
      state.entity.summary = action.payload.summary;
    },
    setActivityCode: (state, action) => {
      state.entity.activityCode = action.payload.code;
    },
    setPaymentDetailsList: (state, action) => {
      state.entity.paymentDetailsList = [action.payload];
    },
    setVendorId: (state, action) => {
      state.entity.vendorId = action.payload.id;
    },
    setComment: (state, action) => {
      state.entity.comment = action.payload.comment;
    },
    setSuccessful: (state, action) => {
      state.entity.invoiceId = action.payload.id;
      state.entity.successful = action.payload.success;
    },
    setInvoiceListPage: (state, action) => {
      state.listPage = action.payload.page;
    },
    setInvoiceListCount: (state, action) => {
      state.listCount = action.payload.count;
    },
    setInvoiceList: (state, action) => {
      state.list = action.payload.list;
    },
    resetInvoice: (state) => {
      state.entity = defaultInvoice;
    },
  },
});

export const {
  setCustomerDetails,
  setProductDetails,
  setDescription,
  setQuantity,
  setPrice,
  resetProductDetail,
  setProductList,
  setSummary,
  setActivityCode,
  setPaymentDetailsList,
  setVendorId,
  setComment,
  setSuccessful,
  setInvoiceListPage,
  setInvoiceListCount,
  setInvoiceList,
  resetInvoice,
} = invoiceSlice.actions;

export const getCustomerDetails = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getProductDetails = (state: RootState) =>
  state.invoice.entity.productDetails;
export const getProductList = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getSummary = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getActivityCode = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getPaymentDetailsList = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getVendorId = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getComment = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getSuccessful = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getInvoiceListPage = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getInvoiceListCount = (state: RootState) =>
  state.invoice.entity.customerDetails;
export const getInvoiceList = (state: RootState) =>
  state.invoice.entity.customerDetails;

export default invoiceSlice.reducer;

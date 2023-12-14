import { createSlice } from "@reduxjs/toolkit";

import { workingOrderInitialState } from "state/InitialState";
import { RootState } from "state/store";
import { defaultInvoiceProduct, defaultWorkingOrder } from "utils/defaults";

const workingOrderSlice = createSlice({
  name: "ui",
  initialState: workingOrderInitialState,
  reducers: {
    setCustomerDetails: (state, action) => {
      state.entity.customerDetails = action.payload;
    },
    setProductDetails: (state, action) => {
      state.entity.productDetails = action.payload;
    },
    setDescription: (state, action) => {
      state.entity.delivery.description = action.payload.description;
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
      state.entity.status = "on-progress";
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
    setDeliveryAttribute: (state, action) => {
      state.entity.status = "on-progress";
      state.entity.delivery = {
        ...state.entity.delivery,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setWorkingOrder: (state, action) => {
      state.entity = action.payload;
    },
    setInvoiceId: (state, action) => {
      state.entity.invoiceId = action.payload.id;
    },
    setStatus: (state, action) => {
      state.entity.status = action.payload.status;
    },
    setWorkingOrderListPage: (state, action) => {
      state.listPage = action.payload.page;
    },
    setWorkingOrderListCount: (state, action) => {
      state.listCount = action.payload.count;
    },
    setWorkingOrderList: (state, action) => {
      state.list = action.payload.list;
    },
    setServicePointList: (state, action) => {
      state.servicePointList = action.payload.list;
    },
    resetWorkingOrder: (state) => {
      state.entity = defaultWorkingOrder;
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
  setDeliveryAttribute,
  setWorkingOrder,
  setInvoiceId,
  setStatus,
  setWorkingOrderListPage,
  setWorkingOrderListCount,
  setWorkingOrderList,
  setServicePointList,
  resetWorkingOrder,
} = workingOrderSlice.actions;

export const getCustomerDetails = (state: RootState) =>
  state.workingOrder.entity.customerDetails;
export const getProductDetails = (state: RootState) =>
  state.workingOrder.entity.productDetails;
export const getProductList = (state: RootState) =>
  state.workingOrder.entity.productDetailList;
export const getSummary = (state: RootState) =>
  state.workingOrder.entity.summary;
export const getActivityCode = (state: RootState) =>
  state.workingOrder.entity.activityCode;
export const getPaymentDetailsList = (state: RootState) =>
  state.workingOrder.entity.paymentDetailsList;
export const getVendorId = (state: RootState) =>
  state.workingOrder.entity.vendorId;
export const getDeliveryDetails = (state: RootState) =>
  state.workingOrder.entity.delivery;
export const getWorkingOrder = (state: RootState) => state.workingOrder.entity;
export const getInvoiceId = (state: RootState) =>
  state.workingOrder.entity.invoiceId;
export const getStatus = (state: RootState) => state.workingOrder.entity.status;
export const getWorkingOrderListPage = (state: RootState) =>
  state.workingOrder.listPage;
export const getWorkingOrderListCount = (state: RootState) =>
  state.workingOrder.listCount;
export const getWorkingOrderList = (state: RootState) =>
  state.workingOrder.list;
export const getServicePointList = (state: RootState) =>
  state.workingOrder.servicePointList;

export default workingOrderSlice.reducer;

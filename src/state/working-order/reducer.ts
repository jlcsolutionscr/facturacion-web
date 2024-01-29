import { createSlice } from "@reduxjs/toolkit";

import { workingOrderInitialState } from "state/InitialState";
import { RootState } from "state/store";
import { defaultProductDetails, defaultWorkingOrder } from "utils/defaults";

const workingOrderSlice = createSlice({
  name: "working-order",
  initialState: workingOrderInitialState,
  reducers: {
    setCustomerDetails: (state, action) => {
      state.entity.customerDetails = action.payload;
    },
    setCustomerAttribute: (state, action) => {
      state.entity.status = "on-progress";
      state.entity.customerDetails = {
        ...state.entity.customerDetails,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setProductDetails: (state, action) => {
      state.entity.productDetails = action.payload;
    },
    setDescription: (state, action) => {
      state.entity.delivery.description = action.payload;
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
      state.entity.status = "on-progress";
      state.entity.productDetailsList = action.payload;
    },
    setSummary: (state, action) => {
      state.entity.summary = action.payload;
    },
    setActivityCode: (state, action) => {
      state.entity.status = "on-progress";
      state.entity.activityCode = action.payload;
    },
    setPaymentDetailsList: (state, action) => {
      state.entity.paymentDetailsList = action.payload;
    },
    setVendorId: (state, action) => {
      state.entity.vendorId = action.payload;
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
      state.entity.invoiceId = action.payload;
    },
    setStatus: (state, action) => {
      state.entity.status = action.payload;
    },
    setWorkingOrderListPage: (state, action) => {
      state.listPage = action.payload;
    },
    setWorkingOrderListCount: (state, action) => {
      state.listCount = action.payload;
    },
    setWorkingOrderList: (state, action) => {
      state.list = action.payload;
    },
    setServicePointList: (state, action) => {
      state.servicePointList = action.payload;
    },
    resetWorkingOrder: state => {
      state.entity = defaultWorkingOrder;
    },
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

export const getCustomerDetails = (state: RootState) => state.workingOrder.entity.customerDetails;
export const getProductDetails = (state: RootState) => state.workingOrder.entity.productDetails;
export const getProductDetailsList = (state: RootState) => state.workingOrder.entity.productDetailsList;
export const getSummary = (state: RootState) => state.workingOrder.entity.summary;
export const getActivityCode = (state: RootState) => state.workingOrder.entity.activityCode;
export const getPaymentDetailsList = (state: RootState) => state.workingOrder.entity.paymentDetailsList;
export const getVendorId = (state: RootState) => state.workingOrder.entity.vendorId;
export const getDeliveryDetails = (state: RootState) => state.workingOrder.entity.delivery;
export const getWorkingOrder = (state: RootState) => state.workingOrder.entity;
export const getWorkingOrderId = (state: RootState) => state.workingOrder.entity.id;
export const getInvoiceId = (state: RootState) => state.workingOrder.entity.invoiceId;
export const getStatus = (state: RootState) => state.workingOrder.entity.status;
export const getCashAdvance = (state: RootState) => state.workingOrder.entity.cashAdvance;
export const getWorkingOrderListPage = (state: RootState) => state.workingOrder.listPage;
export const getWorkingOrderListCount = (state: RootState) => state.workingOrder.listCount;
export const getWorkingOrderList = (state: RootState) => state.workingOrder.list;
export const getServicePointList = (state: RootState) => state.workingOrder.servicePointList;

export default workingOrderSlice.reducer;

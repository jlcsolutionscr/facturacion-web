import { createSlice } from "@reduxjs/toolkit";

import { workingOrderInitialState } from "state/InitialState";
import { logout } from "state/session/reducer";
import { RootState } from "state/store";
import { ORDER_STATUS } from "utils/constants";
import { defaultPaymentList, defaultProductDetails, defaultWorkingOrder } from "utils/defaults";

const workingOrderSlice = createSlice({
  name: "working-order",
  initialState: workingOrderInitialState,
  reducers: {
    setCustomerDetails: (state, action) => {
      state.paymentInfo.customerDetails = action.payload;
    },
    setCustomerAttribute: (state, action) => {
      state.entity.status = ORDER_STATUS.ON_PROGRESS;
      state.paymentInfo.customerDetails = {
        ...state.paymentInfo.customerDetails,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setProductDetails: (state, action) => {
      state.entity.productDetails = action.payload;
    },
    setDescription: (state, action) => {
      state.entity.productDetails.description = action.payload;
    },
    setAdditionalInformation: (state, action) => {
      state.entity.productDetails.additionalInformation = action.payload;
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
      state.entity.status = ORDER_STATUS.ON_PROGRESS;
      state.entity.productDetailsList = action.payload;
      state.paymentInfo.summaryProductList = action.payload;
    },
    setSummary: (state, action) => {
      state.paymentInfo.summary = action.payload;
      state.entity.total = action.payload.total;
    },
    setActivityCode: (state, action) => {
      state.paymentInfo.activityCode = action.payload;
    },
    setVendorId: (state, action) => {
      state.entity.vendorId = action.payload;
    },
    setCurrency: (state, action) => {
      state.entity.currency = action.payload;
    },
    setDeliveryAttribute: (state, action) => {
      state.entity.status = ORDER_STATUS.ON_PROGRESS;
      state.entity.delivery = {
        ...state.entity.delivery,
        [action.payload.attribute]: action.payload.value,
      };
    },
    setPaymentMethodList: (state, action) => {
      state.paymentInfo.paymentMethodList = action.payload;
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
      state.entity = {
        ...defaultWorkingOrder,
        vendorId: state.entity.vendorId,
        servicePointId: state.entity.servicePointId,
      };
      state.paymentInfo = defaultPaymentList;
      state.savedOrderTotal = 0;
      state.paymentTotal = 0;
    },
    setServicePointId: (state, action) => {
      state.entity.servicePointId = action.payload;
    },
    setPrintingTicketList: (state, action) => {
      state.printingTicketList = action.payload;
    },
    setServicePointEntity: (state, action) => {
      state.servicePointEntity = action.payload;
    },
    setServicePointAttribute: (state, action) => {
      state.servicePointEntity = {
        ...state.servicePointEntity,
        [action.payload.attribute]: action.payload.value,
      };
    },
    updatePaymentInfo: (state, action) => {
      state.paymentInfo = action.payload;
    },
    setCashAmount: (state, action) => {
      state.paymentInfo.summary = {
        ...state.paymentInfo.summary,
        cashAmount: action.payload,
      };
    },
    setSavedOrderTotal: (state, action) => {
      state.savedOrderTotal = action.payload;
    },
    setPaymentTotal: (state, action) => {
      state.paymentTotal = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(logout, () => {
      return workingOrderInitialState;
    });
  },
});

export const {
  setCustomerDetails,
  setCustomerAttribute,
  setProductDetails,
  setDescription,
  setAdditionalInformation,
  setQuantity,
  setPrice,
  resetProductDetails,
  setProductDetailsList,
  setSummary,
  setActivityCode,
  setVendorId,
  setCurrency,
  setDeliveryAttribute,
  setPaymentMethodList,
  setWorkingOrder,
  setInvoiceId,
  setStatus,
  setWorkingOrderListPage,
  setWorkingOrderListCount,
  setWorkingOrderList,
  setServicePointList,
  resetWorkingOrder,
  setServicePointId,
  setPrintingTicketList,
  setServicePointEntity,
  setServicePointAttribute,
  updatePaymentInfo,
  setCashAmount,
  setSavedOrderTotal,
  setPaymentTotal,
} = workingOrderSlice.actions;

export const getCustomerDetails = (state: RootState) => state.workingOrder.paymentInfo.customerDetails;
export const getProductDetails = (state: RootState) => state.workingOrder.entity.productDetails;
export const getProductDetailsList = (state: RootState) => state.workingOrder.entity.productDetailsList;
export const getSummary = (state: RootState) => state.workingOrder.paymentInfo.summary;
export const getActivityCode = (state: RootState) => state.workingOrder.paymentInfo.activityCode;
export const getPaymentMethodList = (state: RootState) => state.workingOrder.paymentInfo.paymentMethodList;
export const getVendorId = (state: RootState) => state.workingOrder.entity.vendorId;
export const getCurrency = (state: RootState) => state.workingOrder.entity.currency;
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
export const getPrintingTicketList = (state: RootState) => state.workingOrder.printingTicketList;
export const getServicePointEntity = (state: RootState) => state.workingOrder.servicePointEntity;
export const getSavedOrderTotal = (state: RootState) => state.workingOrder.savedOrderTotal;
export const getPaymentTotal = (state: RootState) => state.workingOrder.paymentTotal;

export default workingOrderSlice.reducer;

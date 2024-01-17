import { createSlice } from "@reduxjs/toolkit";

import { customerInitialState } from "state/InitialState";
import { RootState } from "state/store";
import { defaultCustomer } from "utils/defaults";

const customerSlice = createSlice({
  name: "customer",
  initialState: customerInitialState,
  reducers: {
    setCustomerListPage: (state, action) => {
      state.listPage = action.payload;
    },
    setCustomerListCount: (state, action) => {
      state.listCount = action.payload;
    },
    setCustomerList: (state, action) => {
      state.list = action.payload;
    },
    setCustomer: (state, action) => {
      state.isDialogOpen = true;
      state.entity = action.payload;
    },
    resetCustomer: state => {
      state.entity = defaultCustomer;
    },
    setPriceTypeList: (state, action) => {
      state.priceTypeList = action.payload;
    },
    setCustomerAttribute: (state, action) => {
      state.entity = {
        ...state.entity,
        [action.payload.attribute]: action.payload.value,
      };
    },
    closeCustomerDialog: state => {
      state.isDialogOpen = false;
    },
  },
});

export const {
  setCustomerListPage,
  setCustomerListCount,
  setCustomerList,
  setCustomer,
  resetCustomer,
  setPriceTypeList,
  setCustomerAttribute,
  closeCustomerDialog,
} = customerSlice.actions;

export const getCustomerListPage = (state: RootState) => state.customer.listPage;
export const getCustomerListCount = (state: RootState) => state.customer.listCount;
export const getCustomerList = (state: RootState) => state.customer.list;
export const getCustomer = (state: RootState) => state.customer.entity;
export const getPriceTypeList = (state: RootState) => state.customer.priceTypeList;
export const getCustomerDialogStatus = (state: RootState) => state.customer.isDialogOpen;

export default customerSlice.reducer;

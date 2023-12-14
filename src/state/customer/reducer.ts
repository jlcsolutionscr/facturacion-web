import { createSlice } from "@reduxjs/toolkit";

import { customerInitialState } from "state/InitialState";
import { RootState } from "state/store";
import { defaultCustomer } from "utils/defaults";

const customerSlice = createSlice({
  name: "customer",
  initialState: customerInitialState,
  reducers: {
    setCustomerListPage: (state, action) => {
      state.listPage = action.payload.page;
    },
    setCustomerListCount: (state, action) => {
      state.listCount = action.payload.count;
    },
    setCustomerList: (state, action) => {
      state.list = action.payload.list;
    },
    setCustomer: (state, action) => {
      state.entity = action.payload;
    },
    resetCustomer: (state) => {
      state.entity = defaultCustomer;
    },
    setPriceTypeList: (state, action) => {
      state.priceTypeList = action.payload.list;
    },
    setCustomerAttribute: (state, action) => {
      state.entity = {
        ...state.entity,
        [action.payload.attribute]: action.payload.value,
      };
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
} = customerSlice.actions;

export const getCustomerListPage = (state: RootState) =>
  state.customer.listPage;
export const getCustomerListCount = (state: RootState) =>
  state.customer.listCount;
export const getCustomerList = (state: RootState) => state.customer.list;
export const getCustomer = (state: RootState) => state.customer.entity;
export const getPriceTypeList = (state: RootState) =>
  state.customer.priceTypeList;

export default customerSlice.reducer;

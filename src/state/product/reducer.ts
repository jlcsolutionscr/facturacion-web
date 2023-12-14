import { createSlice } from "@reduxjs/toolkit";

import { productInitialState } from "state/InitialState";
import { resetInvoice } from "state/invoice/reducer";
import { resetReceipt } from "state/receipt/reducer";
import { RootState } from "state/store";
import { resetWorkingOrder } from "state/working-order/reducer";

import { defaultProduct } from "utils/defaults";

const productSlice = createSlice({
  name: "product",
  initialState: productInitialState,
  reducers: {
    setProductListPage: (state, action) => {
      state.listPage = action.payload.page;
    },
    setProductListCount: (state, action) => {
      state.listCount = action.payload.count;
    },
    setProductList: (state, action) => {
      state.list = action.payload.list;
    },
    setProduct: (state, action) => {
      state.entity = action.payload.product;
    },
    setProductTypeList: (state, action) => {
      state.productTypeList = action.payload.list;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload.list;
    },
    setProviderList: (state, action) => {
      state.providerList = action.payload.list;
    },
    setClasificationList: (state, action) => {
      state.clasificationList = action.payload.list;
    },
    setProductAttribute: (state, action) => {
      state.entity = {
        ...state.entity,
        [action.payload.attribute]: action.payload.value,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetInvoice, (state) => {
      state.entity = defaultProduct;
    });
    builder.addCase(resetReceipt, (state) => {
      state.entity = defaultProduct;
    });
    builder.addCase(resetWorkingOrder, (state) => {
      state.entity = defaultProduct;
    });
  },
});

export const {
  setProductListPage,
  setProductListCount,
  setProductList,
  setProduct,
  setProductTypeList,
  setCategoryList,
  setProviderList,
  setClasificationList,
  setProductAttribute,
} = productSlice.actions;

export const getProductListPage = (state: RootState) => state.product.listPage;
export const getProductListCount = (state: RootState) =>
  state.product.listCount;
export const getProductList = (state: RootState) => state.product.list;
export const getProduct = (state: RootState) => state.product.entity;
export const getProductTypeList = (state: RootState) =>
  state.product.productTypeList;
export const getCategoryList = (state: RootState) => state.product.categoryList;
export const getProviderList = (state: RootState) => state.product.providerList;
export const getClasificationList = (state: RootState) =>
  state.product.clasificationList;

export default productSlice.reducer;

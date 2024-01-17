import { createSlice } from "@reduxjs/toolkit";

import { productInitialState } from "state/InitialState";
import { RootState } from "state/store";

const productSlice = createSlice({
  name: "product",
  initialState: productInitialState,
  reducers: {
    setProductListPage: (state, action) => {
      state.listPage = action.payload;
    },
    setProductListCount: (state, action) => {
      state.listCount = action.payload;
    },
    setProductList: (state, action) => {
      state.list = action.payload;
    },
    setProduct: (state, action) => {
      state.entity = action.payload;
    },
    setProductTypeList: (state, action) => {
      state.productTypeList = action.payload;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
    setProviderList: (state, action) => {
      state.providerList = action.payload;
    },
    setClasificationList: (state, action) => {
      state.clasificationList = action.payload;
    },
    setProductAttribute: (state, action) => {
      state.entity = {
        ...state.entity,
        [action.payload.attribute]: action.payload.value,
      };
    },
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
export const getProductListCount = (state: RootState) => state.product.listCount;
export const getProductList = (state: RootState) => state.product.list;
export const getProduct = (state: RootState) => state.product.entity;
export const getProductTypeList = (state: RootState) => state.product.productTypeList;
export const getCategoryList = (state: RootState) => state.product.categoryList;
export const getProviderList = (state: RootState) => state.product.providerList;
export const getClasificationList = (state: RootState) => state.product.clasificationList;

export default productSlice.reducer;

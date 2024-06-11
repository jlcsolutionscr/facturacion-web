import { createSlice } from "@reduxjs/toolkit";

import { proformaInitialState } from "state/InitialState";
import { logout } from "state/session/reducer";
import { RootState } from "state/store";
import { defaultProductDetails, defaultProforma } from "utils/defaults";

const proformaSlice = createSlice({
  name: "proforma",
  initialState: proformaInitialState,
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
    setVendorId: (state, action) => {
      state.entity.vendorId = action.payload;
    },
    setComment: (state, action) => {
      state.entity.comment = action.payload;
    },
    setSuccessful: (state, action) => {
      state.entity.proformaId = action.payload.id;
      state.entity.consecutive = action.payload.consecutive;
      state.entity.successful = action.payload.success;
    },
    setProformaListPage: (state, action) => {
      state.listPage = action.payload;
    },
    setProformaListCount: (state, action) => {
      state.listCount = action.payload;
    },
    setProformaList: (state, action) => {
      state.list = action.payload;
    },
    resetProforma: state => {
      state.entity = defaultProforma;
    },
  },
  extraReducers: builder => {
    builder.addCase(logout, () => {
      return proformaInitialState;
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
  setVendorId,
  setComment,
  setSuccessful,
  setProformaListPage,
  setProformaListCount,
  setProformaList,
  resetProforma,
} = proformaSlice.actions;

export const getProformaId = (state: RootState) => state.proforma.entity.proformaId;
export const getCustomerDetails = (state: RootState) => state.proforma.entity.customerDetails;
export const getProductDetails = (state: RootState) => state.proforma.entity.productDetails;
export const getProductDetailsList = (state: RootState) => state.proforma.entity.productDetailsList;
export const getSummary = (state: RootState) => state.proforma.entity.summary;
export const getVendorId = (state: RootState) => state.proforma.entity.vendorId;
export const getComment = (state: RootState) => state.proforma.entity.comment;
export const getSuccessful = (state: RootState) => state.proforma.entity.successful;
export const getProformaListPage = (state: RootState) => state.proforma.listPage;
export const getProformaListCount = (state: RootState) => state.proforma.listCount;
export const getProformaList = (state: RootState) => state.proforma.list;

export default proformaSlice.reducer;

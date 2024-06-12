import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
import { setProductList, setProductListCount, setProductListPage } from "state/product/reducer";
import {
  resetProductDetails,
  resetProforma,
  setProductDetailsList,
  setProformaList,
  setProformaListCount,
  setProformaListPage,
  setSuccessful,
  setSummary,
  setVendorId,
} from "state/proforma/reducer";
import { setVendorList } from "state/session/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { ROWS_PER_CUSTOMER, ROWS_PER_PRODUCT } from "utils/constants";
import {
  generateProformaPDF,
  getCustomerListCount,
  getCustomerListPerPage,
  getProductListCount,
  getProductListPerPage,
  getProductSummary,
  getProformaListCount,
  getProformaListPerPage,
  getTaxedPrice,
  getVendorList,
  revokeProformaEntity,
  saveProformaEntity,
} from "utils/domainHelper";
import { getErrorMessage } from "utils/utilities";

export const setProformaParameters = createAsyncThunk(
  "proforma/setProformaParameters",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    dispatch(startLoader());
    try {
      const customerCount = await getCustomerListCount(token, companyId, "");
      const customerList = await getCustomerListPerPage(token, companyId, 1, ROWS_PER_CUSTOMER, "");
      const productCount = await getProductListCount(token, companyId, branchId, true, "", 1);
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, ROWS_PER_PRODUCT, "", 1);
      const vendorList = await getVendorList(token, companyId);
      dispatch(setVendorList(vendorList));
      dispatch(setCustomerListPage(1));
      dispatch(setCustomerListCount(customerCount));
      dispatch(setCustomerList(customerList));
      dispatch(setProductListPage(1));
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
      dispatch(resetProforma());
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const addDetails = createAsyncThunk("proforma/addDetails", async (_payload, { getState, dispatch }) => {
  const { session, invoice } = getState() as RootState;
  const { company } = session;
  const { customerDetails, productDetails, productDetailsList } = invoice.entity;
  if (
    company &&
    productDetails.id !== "" &&
    productDetails.description !== "" &&
    productDetails.quantity > 0 &&
    productDetails.price > 0
  ) {
    try {
      const { taxRate, price, pricePlusTaxes } = getTaxedPrice(
        productDetails.taxRate,
        productDetails.price,
        company.PrecioVentaIncluyeIVA,
        customerDetails.taxRate
      );
      let newProducts = null;
      const item = {
        id: productDetails.id,
        code: productDetails.code,
        description: productDetails.description,
        quantity: productDetails.quantity,
        taxRate,
        unit: "UND",
        price,
        pricePlusTaxes,
        costPrice: productDetails.costPrice,
        disccountRate: productDetails.disccountRate,
      };
      const index = productDetailsList.findIndex(item => item.id === productDetails.id);
      if (index >= 0) {
        newProducts = [
          ...productDetailsList.slice(0, index),
          {
            ...item,
            quantity: productDetailsList[index].quantity + item.quantity,
          },
          ...productDetailsList.slice(index + 1),
        ];
      } else {
        newProducts = [...productDetailsList, item];
      }
      dispatch(setProductDetailsList(newProducts));
      const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
      dispatch(setSummary(summary));
      dispatch(resetProductDetails());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
  }
});

export const removeDetails = createAsyncThunk(
  "proforma/removeDetails",
  async (payload: { id: string }, { getState, dispatch }) => {
    const { invoice } = getState() as RootState;
    const { customerDetails, productDetailsList } = invoice.entity;
    const index = productDetailsList.findIndex(item => item.id === payload.id);
    const newProducts = [...productDetailsList.slice(0, index), ...productDetailsList.slice(index + 1)];
    dispatch(setProductDetailsList(newProducts));
    const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
    dispatch(setSummary(summary));
  }
);

export const saveProforma = createAsyncThunk("proforma/saveProforma", async (_payload, { getState, dispatch }) => {
  const { session, proforma } = getState() as RootState;
  const { token, userId, branchId, companyId } = session;
  const { vendorId, customerDetails, productDetailsList, summary, comment } = proforma.entity;
  dispatch(startLoader());
  try {
    const ids = await saveProformaEntity(
      token,
      userId,
      companyId,
      branchId,
      vendorId,
      customerDetails,
      productDetailsList,
      summary,
      comment
    );
    dispatch(setSuccessful({ id: ids.id, consecutive: ids.consecutive, success: true }));
    dispatch(
      setMessage({
        message: "Transacción completada satisfactoriamente",
        type: "INFO",
      })
    );
    dispatch(stopLoader());
  } catch (error) {
    dispatch(stopLoader());
    dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
  }
});

export const getProformaListFirstPage = createAsyncThunk(
  "proforma/getProformaListFirstPage",
  async (payload: { id: number | null }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      dispatch(setProformaListPage(1));
      const recordCount = await getProformaListCount(token, companyId, branchId, false);
      dispatch(setProformaListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProformaListPerPage(token, companyId, branchId, false, 1, 10);
        dispatch(setProformaList(newList));
      } else {
        dispatch(setProformaList([]));
      }
      if (payload.id) dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getProformaListByPageNumber = createAsyncThunk(
  "proforma/getProformaListByPageNumber",
  async (payload: { pageNumber: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const newList = await getProformaListPerPage(token, companyId, branchId, false, payload.pageNumber, 10);
      dispatch(setProformaListPage(payload.pageNumber));
      dispatch(setProformaList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const revokeProforma = createAsyncThunk(
  "proforma/revokeProforma",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userId } = session;
    dispatch(startLoader());
    try {
      await revokeProformaEntity(token, payload.id, userId);
      dispatch(getProformaListFirstPage({ id: null }));
      dispatch(
        setMessage({
          message: "Transacción completada satisfactoriamente",
          type: "INFO",
        })
      );
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const generatePDF = createAsyncThunk(
  "proforma/generatePDF",
  async (payload: { id: number; ref: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await generateProformaPDF(token, payload.id, payload.ref);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

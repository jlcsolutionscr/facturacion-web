import { CustomerDetailsType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
import { setProductList, setProductListCount, setProductListPage } from "state/product/reducer";
import {
  resetProductDetails,
  resetProforma,
  setCustomerDetails,
  setProductDetailsList,
  setProformaList,
  setProformaListCount,
  setProformaListPage,
  setSuccessful,
  setSummary,
} from "state/proforma/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import {
  generateProformaPDF,
  getCustomerListCount,
  getCustomerListPerPage,
  getProductListCount,
  getProductListPerPage,
  getProductsSummary,
  getProformaListCount,
  getProformaListPerPage,
  revokeProformaEntity,
  saveProformaEntity,
  sendProformaEmail,
} from "utils/domainHelper";
import { getErrorMessage } from "utils/utilities";

export const setProformaParameters = createAsyncThunk(
  "proforma/setProformaParameters",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(14));
    try {
      dispatch(resetProforma());
      dispatch(setCustomerListPage(1));
      const customerCount = await getCustomerListCount(token, companyId, "");
      dispatch(setCustomerListCount(customerCount));
      if (customerCount > 0) {
        const newList = await getCustomerListPerPage(token, companyId, 1, 7, "");
        dispatch(setCustomerList([{ Id: 1, Descripcion: "CLIENTE DE CONTADO" }, ...newList]));
      } else {
        dispatch(setCustomerList([]));
      }
      dispatch(setProductListPage(1));
      const recordCount = await getProductListCount(token, companyId, branchId, false, "", 1);
      dispatch(setProductListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProductListPerPage(token, companyId, branchId, false, 1, 8, "", false, 1);
        dispatch(setProductList(newList));
      } else {
        dispatch(setProductList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const selectCustomer = createAsyncThunk(
  "proforma/selectCustomer",
  async (payload: CustomerDetailsType, { getState, dispatch }) => {
    const { proforma } = getState() as RootState;
    const { productDetailsList } = proforma.entity;
    try {
      dispatch(setCustomerDetails(payload));
      const summary = getProductsSummary(productDetailsList, payload.exonerationPercentage);
      dispatch(setSummary(summary));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
  }
);

export const addDetails = createAsyncThunk("proforma/addDetails", async (_payload, { getState, dispatch }) => {
  const { session, proforma } = getState() as RootState;
  const { company } = session;
  const { customerDetails, productDetails, productDetailsList } = proforma.entity;
  if (
    company &&
    productDetails.id !== 0 &&
    productDetails.description !== "" &&
    !["0", ""].includes(productDetails.quantity) &&
    !["0", ""].includes(productDetails.price)
  ) {
    try {
      let newProducts = null;
      const item = {
        id: productDetails.id,
        code: productDetails.code,
        description: productDetails.description,
        additionalInformation: "",
        quantity: productDetails.quantity,
        taxRate: productDetails.taxRate,
        unit: "UND",
        price: productDetails.price,
        costPrice: productDetails.costPrice,
        disccountRate: productDetails.disccountRate,
        isService: productDetails.isService,
      };
      const index = productDetailsList.findIndex(
        item => item.id === productDetails.id && item.price === productDetails.price
      );
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
      const summary = getProductsSummary(newProducts, customerDetails.exonerationPercentage);
      dispatch(setSummary(summary));
      dispatch(resetProductDetails());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
  }
});

export const removeDetails = createAsyncThunk(
  "proforma/removeDetails",
  async (payload: { pos: number }, { getState, dispatch }) => {
    const { proforma } = getState() as RootState;
    const { customerDetails, productDetailsList } = proforma.entity;
    const index = productDetailsList.findIndex((_item, index) => index === payload.pos);
    const newProducts = [...productDetailsList.slice(0, index), ...productDetailsList.slice(index + 1)];
    dispatch(setProductDetailsList(newProducts));
    const summary = getProductsSummary(newProducts, customerDetails.exonerationPercentage);
    dispatch(setSummary(summary));
  }
);

export const saveProforma = createAsyncThunk("proforma/saveProforma", async (_payload, { getState, dispatch }) => {
  const { session, proforma } = getState() as RootState;
  const { token, userId, branchId, companyId } = session;
  dispatch(startLoader());
  try {
    const references = await saveProformaEntity(token, userId, companyId, branchId, proforma.entity);
    dispatch(setSuccessful({ id: references.id, consecutive: references.consecutive, success: true }));
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

export const sendEmail = createAsyncThunk(
  "proforma/sendEmail",
  async (payload: { id: number; emailTo: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await sendProformaEmail(token, payload.id, payload.emailTo);
      dispatch(
        setMessage({
          message: "Correo enviado satisfactoriamente.",
          type: "INFO",
        })
      );
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getProformaListFirstPage = createAsyncThunk(
  "proforma/getProformaListFirstPage",
  async (payload: { rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      dispatch(setProformaListPage(1));
      const recordCount = await getProformaListCount(token, companyId, branchId, false);
      dispatch(setProformaListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProformaListPerPage(token, companyId, branchId, false, 1, payload.rowsPerPage);
        dispatch(setProformaList(newList));
      } else {
        dispatch(setProformaList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getProformaListByPageNumber = createAsyncThunk(
  "proforma/getProformaListByPageNumber",
  async (payload: { pageNumber: number; rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const newList = await getProformaListPerPage(
        token,
        companyId,
        branchId,
        false,
        payload.pageNumber,
        payload.rowsPerPage
      );
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
  async (payload: { id: number; rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userId } = session;
    dispatch(startLoader());
    try {
      await revokeProformaEntity(token, payload.id, userId);
      dispatch(getProformaListFirstPage({ rowsPerPage: payload.rowsPerPage }));
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

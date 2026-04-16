import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  resetInvoice,
  resetProductDetails,
  setActivityCode,
  setInvoiceList,
  setInvoiceListCount,
  setInvoiceListPage,
  setProductDetailsList,
  setSuccessful,
  setSummary,
  setVendorId,
} from "state/invoice/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { ROWS_PER_LIST } from "utils/constants";
import {
  generateInvoicePDF,
  generateInvoiceTicketPDF,
  getProcessedInvoiceListCount,
  getProcessedInvoiceListPerPage,
  getProductSummary,
  revokeInvoiceEntity,
  saveInvoiceEntity,
} from "utils/domainHelper";
import { getErrorMessage } from "utils/utilities";

export const setInvoiceParameters = createAsyncThunk(
  "invoice/setInvoiceParameters",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { company, vendorList } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(payload.id));
    dispatch(resetInvoice());
    try {
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const addDetails = createAsyncThunk("invoice/addDetails", async (_payload, { getState, dispatch }) => {
  const { session, invoice } = getState() as RootState;
  const { company } = session;
  const { customerDetails, productDetails, productDetailsList } = invoice.entity;
  if (
    company &&
    productDetails.id !== 0 &&
    productDetails.description !== "" &&
    productDetails.quantity > 0 &&
    productDetails.price > 0
  ) {
    try {
      let newProducts = null;
      const item = {
        id: productDetails.id,
        code: productDetails.code,
        description: productDetails.description,
        quantity: productDetails.quantity,
        taxRate: productDetails.taxRate,
        unit: "UND",
        price: productDetails.price,
        costPrice: productDetails.costPrice,
        disccountRate: productDetails.disccountRate,
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
      const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
      dispatch(setSummary(summary));
      dispatch(resetProductDetails());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
  }
});

export const removeDetails = createAsyncThunk(
  "invoice/removeDetails",
  async (payload: { pos: number }, { getState, dispatch }) => {
    const { invoice } = getState() as RootState;
    const { customerDetails, productDetailsList } = invoice.entity;
    const index = productDetailsList.findIndex((_item, index) => index === payload.pos);
    const newProducts = [...productDetailsList.slice(0, index), ...productDetailsList.slice(index + 1)];
    dispatch(setProductDetailsList(newProducts));
    const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
    dispatch(setSummary(summary));
  }
);

export const saveInvoice = createAsyncThunk("invoice/saveInvoice", async (_payload, { getState, dispatch }) => {
  const { session, invoice } = getState() as RootState;
  const { token, userId, branchId, companyId } = session;
  const {
    activityCode,
    paymentDetailsList,
    vendorId,
    customerDetails,
    productDetailsList,
    summary,
    comment,
    currency,
  } = invoice.entity;

  dispatch(startLoader());
  try {
    const ids = await saveInvoiceEntity(
      token,
      userId,
      companyId,
      branchId,
      activityCode,
      paymentDetailsList,
      0,
      currency,
      vendorId,
      0,
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

export const getInvoiceListFirstPage = createAsyncThunk(
  "invoice/getInvoiceListFirstPage",
  async (payload: { id: number | null }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    if (payload.id) dispatch(setActiveSection(payload.id));
    try {
      dispatch(setInvoiceListPage(1));
      const recordCount = await getProcessedInvoiceListCount(token, companyId, branchId);
      dispatch(setInvoiceListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProcessedInvoiceListPerPage(token, companyId, branchId, 1, ROWS_PER_LIST);
        dispatch(setInvoiceList(newList));
      } else {
        dispatch(setInvoiceList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getInvoiceListByPageNumber = createAsyncThunk(
  "invoice/getInvoiceListByPageNumber",
  async (payload: { pageNumber: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const newList = await getProcessedInvoiceListPerPage(
        token,
        companyId,
        branchId,
        payload.pageNumber,
        ROWS_PER_LIST
      );
      dispatch(setInvoiceListPage(payload.pageNumber));
      dispatch(setInvoiceList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const revokeInvoice = createAsyncThunk(
  "invoice/revokeInvoice",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userId } = session;
    dispatch(startLoader());
    try {
      await revokeInvoiceEntity(token, payload.id, userId);
      dispatch(getInvoiceListFirstPage({ id: null }));
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
  "invoice/generatePDF",
  async (payload: { id: number; ref: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await generateInvoicePDF(token, payload.id);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const generateInvoiceTicket = createAsyncThunk(
  "invoice/generateInvoiceTicket",
  async (payload: { id: number; ref?: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await generateInvoiceTicketPDF(token, payload.id);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

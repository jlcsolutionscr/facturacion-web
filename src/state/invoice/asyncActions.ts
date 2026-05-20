import { CustomerDetailsType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  resetInvoice,
  resetProductDetails,
  setActivityCode,
  setCustomerDetails,
  setInvoiceList,
  setInvoiceListCount,
  setInvoiceListPage,
  setPaymentMethodList,
  setProductDetailsList,
  setSuccessful,
  setSummary,
  setVendorId,
} from "state/invoice/reducer";
import { setCategoryList, setProductList, setProductListCount, setProductListPage } from "state/product/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { defaultPaymentMethod } from "utils/defaults";
import {
  generateInvoicePDF,
  generateInvoiceTicketPDF,
  getProcessedInvoiceListCount,
  getProcessedInvoiceListPerPage,
  getProductCategoryList,
  getProductListCount,
  getProductListPerPage,
  getProductSummary,
  revokeInvoiceEntity,
  saveInvoiceEntity,
} from "utils/domainHelper";
import { getNewProductItem } from "utils/store/product";
import { getErrorMessage } from "utils/utilities";

export const setInvoiceParameters = createAsyncThunk(
  "invoice/setInvoiceParameters",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session, product } = getState() as RootState;
    const { token, company, companyId, branchId, vendorList } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(payload.id));
    dispatch(resetInvoice());
    try {
      if (company?.Modalidad === 2) {
        if (product.list.length === 0) {
          const productCount = await getProductListCount(token, companyId, branchId, true, "", 1);
          const productList = await getProductListPerPage(
            token,
            companyId,
            branchId,
            true,
            1,
            productCount,
            "",
            true,
            1
          );
          dispatch(setProductListPage(1));
          dispatch(setProductListCount(productCount));
          dispatch(setProductList(productList));
        }
        if (product.categoryList.length === 0) {
          const categoryList = await getProductCategoryList(token, companyId);
          dispatch(setCategoryList(categoryList));
        }
      }
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      dispatch(setPaymentMethodList([defaultPaymentMethod]));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const selectCustomer = createAsyncThunk(
  "invoice/selectCustomer",
  async (payload: CustomerDetailsType, { getState, dispatch }) => {
    const { workingOrder } = getState() as RootState;
    const { productDetailsList } = workingOrder.entity;
    try {
      dispatch(setCustomerDetails(payload));
      const summary = getProductSummary(productDetailsList, payload.exonerationPercentage);
      dispatch(setSummary(summary));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
  }
);

export const addDetails = createAsyncThunk(
  "invoice/addDetails",
  async (payload: { id?: number }, { getState, dispatch }) => {
    const { session, invoice, ui } = getState() as RootState;
    const { token, company, branchId } = session;
    const { customerDetails, productDetails, productDetailsList } = invoice.entity;
    if (company) {
      if (payload.id) dispatch(startLoader());
      const newProduct = await getNewProductItem(
        token,
        branchId,
        customerDetails.priceTypeId,
        company.PrecioVentaIncluyeIVA,
        productDetails,
        ui.taxTypeList,
        payload.id
      );
      if (payload.id) dispatch(stopLoader());
      if (
        newProduct.id !== 0 &&
        newProduct.description !== "" &&
        !["0", ""].includes(newProduct.quantity) &&
        !["0", ""].includes(newProduct.price)
      ) {
        try {
          let newProducts = null;
          const index = productDetailsList.findIndex(
            item => item.id === newProduct.id && item.price === newProduct.price
          );
          if (index >= 0) {
            newProducts = [
              ...productDetailsList.slice(0, index),
              {
                ...newProduct,
                quantity: (parseFloat(productDetailsList[index].quantity) + parseFloat(newProduct.quantity)).toString(),
              },
              ...productDetailsList.slice(index + 1),
            ];
          } else {
            newProducts = [...productDetailsList, newProduct];
          }
          dispatch(setProductDetailsList(newProducts));
          const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
          dispatch(setSummary(summary));
          dispatch(resetProductDetails());
        } catch (error) {
          dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
        }
      }
    }
  }
);

export const updateDetails = createAsyncThunk(
  "invoice/updateDetails",
  async (payload: { pos: number }, { getState, dispatch }) => {
    const { session, invoice } = getState() as RootState;
    const { company } = session;
    const { customerDetails, productDetails, productDetailsList } = invoice.entity;
    if (company && productDetails.id) {
      if (company && !["0", ""].includes(productDetails.quantity) && !["0", ""].includes(productDetails.price)) {
        try {
          const index = productDetailsList.findIndex(
            (item, index) => item.id === productDetails.id && index === payload.pos
          );
          if (index >= 0) {
            const newProducts = [
              ...productDetailsList.slice(0, index),
              {
                ...productDetailsList[index],
                additionalInformation: productDetails.additionalInformation,
                price: productDetails.price,
                quantity: productDetails.quantity,
              },
              ...productDetailsList.slice(index + 1),
            ];
            dispatch(setProductDetailsList(newProducts));
            const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
            dispatch(setSummary(summary));
            dispatch(resetProductDetails());
          }
        } catch (error) {
          dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
        }
      }
    }
  }
);

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
  const { activityCode, paymentMethodList, vendorId, customerDetails, productDetailsList, summary, comment, currency } =
    invoice.entity;

  dispatch(startLoader());
  try {
    const ids = await saveInvoiceEntity(
      token,
      userId,
      companyId,
      branchId,
      activityCode,
      paymentMethodList,
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
  async (payload: { rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      dispatch(setInvoiceListPage(1));
      const recordCount = await getProcessedInvoiceListCount(token, companyId, branchId);
      dispatch(setInvoiceListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProcessedInvoiceListPerPage(token, companyId, branchId, 1, payload.rowsPerPage);
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
  async (payload: { pageNumber: number; rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const newList = await getProcessedInvoiceListPerPage(
        token,
        companyId,
        branchId,
        payload.pageNumber,
        payload.rowsPerPage
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
  async (payload: { id: number; rowsPerPage?: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userId } = session;
    dispatch(startLoader());
    try {
      await revokeInvoiceEntity(token, payload.id, userId);
      if (payload.rowsPerPage) {
        dispatch(getInvoiceListFirstPage({ rowsPerPage: payload.rowsPerPage }));
      }
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

import { CustomerDetailsType, PaymentMethodType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
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
import {
  setCategoryList,
  setProductList,
  setProductListCount,
  setProductListPage,
  setTouchScreenProductList,
} from "state/product/reducer";
import { setCreditCardBankId, setTransferBankId } from "state/session/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { defaultPaymentMethod } from "utils/defaults";
import {
  generateInvoicePDF,
  generateInvoiceTicketPDF,
  getCustomerListCount,
  getCustomerListPerPage,
  getPaymentBankId,
  getProcessedInvoiceListCount,
  getProcessedInvoiceListPerPage,
  getProductCategoryList,
  getProductListCount,
  getProductListPerPage,
  getProductsSummary,
  revokeInvoiceEntity,
  saveInvoiceEntity,
} from "utils/domainHelper";
import { getCustomerPrice, getNewProductItem } from "utils/store/product";
import { getErrorMessage } from "utils/utilities";

export const setInvoiceParameters = createAsyncThunk(
  "invoice/setInvoiceParameters",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session, product } = getState() as RootState;
    const { token, company, companyId, branchId, vendorList } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(payload.id));
    dispatch(resetInvoice());
    dispatch(setVendorId(vendorList[0].Id));
    dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
    dispatch(setPaymentMethodList([defaultPaymentMethod]));
    try {
      dispatch(setCustomerListPage(1));
      const recordCount = await getCustomerListCount(token, companyId, "");
      dispatch(setCustomerListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getCustomerListPerPage(token, companyId, 1, 7, "");
        dispatch(setCustomerList([{ Id: 1, Descripcion: "CLIENTE DE CONTADO" }, ...newList]));
      } else {
        dispatch(setCustomerList([]));
      }
      if (company?.Modalidad === 2) {
        const categoryList = await getProductCategoryList(token, companyId);
        dispatch(setCategoryList(categoryList));
        if (product.touchScreenProductList.length <= 0) {
          const recordCount = await getProductListCount(token, companyId, branchId, false, "", 1);
          if (recordCount > 0) {
            const newList = await getProductListPerPage(token, companyId, branchId, false, 1, recordCount, "", true, 1);
            dispatch(setTouchScreenProductList(newList));
          } else {
            dispatch(setTouchScreenProductList([]));
          }
        }
      } else {
        dispatch(setProductListPage(1));
        const recordCount = await getProductListCount(token, companyId, branchId, false, "", 1);
        dispatch(setProductListCount(recordCount));
        if (recordCount > 0) {
          const newList = await getProductListPerPage(token, companyId, branchId, false, 1, 8, "", false, 1);
          dispatch(setProductList(newList));
        } else {
          dispatch(setProductList([]));
        }
      }
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
    const { invoice } = getState() as RootState;
    const { productDetailsList } = invoice.entity;
    try {
      dispatch(setCustomerDetails(payload));
      const summary = getProductsSummary(productDetailsList, payload.exonerationPercentage);
      dispatch(setSummary(summary));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
  }
);

export const addDetails = createAsyncThunk(
  "invoice/addDetails",
  async (payload: { id?: number }, { getState, dispatch }) => {
    const { session, invoice, ui, product } = getState() as RootState;
    const { token, company, branchId } = session;
    const { customerDetails, productDetails, productDetailsList } = invoice.entity;
    if (company) {
      let newProduct = null;
      if (company?.Modalidad === 1) {
        if (payload.id) dispatch(startLoader());
        newProduct = await getNewProductItem(
          token,
          branchId,
          customerDetails.priceTypeId,
          productDetails,
          ui.taxTypeList,
          payload.id
        );
        if (payload.id) dispatch(stopLoader());
      } else {
        const productItem = product.touchScreenProductList.find(item => item.Id === payload.id);
        if (productItem) {
          const { price, taxRate } = getCustomerPrice(customerDetails.priceTypeId, productItem, ui.taxTypeList);
          newProduct = {
            id: productItem.Id,
            quantity: "1",
            description: productItem.Descripcion,
            price: price.toString(),
            taxRate: taxRate,
            code: productItem.Codigo,
            additionalInformation: "",
            unit: "UND",
            costPrice: 0,
            disccountRate: 0,
            isService: false,
          };
        }
      }
      if (payload.id) dispatch(stopLoader());
      if (
        newProduct &&
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
          const summary = getProductsSummary(newProducts, customerDetails.exonerationPercentage);
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
            const summary = getProductsSummary(newProducts, customerDetails.exonerationPercentage);
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
    const summary = getProductsSummary(newProducts, customerDetails.exonerationPercentage);
    dispatch(setSummary(summary));
  }
);

export const saveInvoice = createAsyncThunk(
  "invoice/saveInvoice",
  async (payload: { paymentList: PaymentMethodType[] }, { getState, dispatch }) => {
    const { session, invoice } = getState() as RootState;
    const { token, userId, branchId, companyId, creditCardBankId, transferBankId } = session;
    const { activityCode, vendorId, customerDetails, productDetailsList, summary, comment, currency } = invoice.entity;

    dispatch(startLoader());
    try {
      const paymentDetailsList = [];
      for (let i = 0; i < payload.paymentList.length; i++) {
        const payment = payload.paymentList[i];
        paymentDetailsList.push({ ...payment });
        let bankId = 0;
        if (payment.paymentId > 1) {
          if (payment.paymentId === 2) {
            if (creditCardBankId === 0) {
              bankId = await getPaymentBankId(token, companyId, payment.paymentId);
              if (bankId == null)
                throw new Error("La empresa no tiene parametrizada la cuenta bancaría para el pago con tarjeta!");
              dispatch(setCreditCardBankId(bankId));
            } else {
              bankId = creditCardBankId;
            }
          } else {
            if (transferBankId === 0) {
              bankId = await getPaymentBankId(token, companyId, payment.paymentId);
              if (bankId == null)
                throw new Error("La empresa no tiene parametrizada la cuenta bancaría para el pago con transferencia!");
              dispatch(setTransferBankId(bankId));
            } else {
              bankId = transferBankId;
            }
          }
          paymentDetailsList[i].bankId = bankId;
        }
      }
      const ids = await saveInvoiceEntity(
        token,
        userId,
        companyId,
        branchId,
        activityCode,
        paymentDetailsList,
        currency,
        vendorId,
        0,
        customerDetails,
        productDetailsList,
        summary,
        comment,
        false
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
  }
);

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

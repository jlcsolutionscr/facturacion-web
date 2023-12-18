import { createAsyncThunk } from "@reduxjs/toolkit";

import { ROWS_PER_CUSTOMER, ROWS_PER_PRODUCT } from "utils/constants";

import {
  startLoader,
  stopLoader,
  setMessage,
  setActiveSection,
} from "state/ui/reducer";
import {
  setCustomerDetails,
  setProductDetails,
  setPaymentDetailsList,
  setDescription,
  setQuantity,
  setPrice,
  resetProductDetail,
  setProductList,
  setSummary,
  setActivityCode,
  setVendorId,
  setSuccessful,
  setInvoiceListPage,
  setInvoiceListCount,
  setInvoiceList,
  resetInvoice,
} from "state/invoice/reducer";
import { setVendorList } from "state/session/reducer";
import {
  setCustomerListPage,
  setCustomerListCount,
  setCustomerList,
} from "state/customer/reducer";
import { setProductListPage, setProductListCount } from "state/product/reducer";
import { RootState } from "state/store";
import { defaultCustomerDetails, defaultPaymentDetails } from "utils/defaults";
import {
  getCustomerListCount,
  getCustomerListPerPage,
  getProductListCount,
  getProductListPerPage,
  getProductEntity,
  getVendorList,
  getCustomerPrice,
  getProductSummary,
  saveInvoiceEntity,
  getProcessedInvoiceListCount,
  getProcessedInvoiceListPerPage,
  revokeInvoiceEntity,
  generateInvoicePDF,
  getInvoiceEntity,
} from "utils/domainHelper";
import { printInvoice } from "utils/printing";
import { getErrorMessage } from "utils/utilities";

export const setInvoiceParameters = createAsyncThunk(
  "invoice/setInvoiceParameters",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, company, token } = session;
    dispatch(startLoader());
    try {
      const customerCount = await getCustomerListCount(token, companyId, "");
      const customerList = await getCustomerListPerPage(
        token,
        companyId,
        1,
        ROWS_PER_CUSTOMER,
        ""
      );
      const productCount = await getProductListCount(
        token,
        companyId,
        branchId,
        true,
        "",
        1
      );
      const productList = await getProductListPerPage(
        token,
        companyId,
        branchId,
        true,
        1,
        ROWS_PER_PRODUCT,
        "",
        1
      );
      const vendorList = await getVendorList(token, companyId);
      dispatch(setVendorList(vendorList));
      dispatch(setCustomerListPage(1));
      dispatch(setCustomerListCount(customerCount));
      dispatch(setCustomerList(customerList));
      dispatch(setProductListPage(1));
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
      dispatch(resetInvoice());
      dispatch(setCustomerDetails(defaultCustomerDetails));
      dispatch(setPaymentDetailsList([defaultPaymentDetails]));
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(
        setActivityCode(company?.ActividadEconomicaEmpresa[0].CodigoActividad)
      );
      dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const getProduct = createAsyncThunk(
  "invoice/getProduct",
  async (
    payload: { id: number; filterType: number },
    { getState, dispatch }
  ) => {
    const { session, invoice, ui } = getState() as RootState;
    const { token, company } = session;
    const { taxTypeList } = ui;
    if (company) {
      dispatch(startLoader());
      try {
        const product = await getProductEntity(token, payload.id, 1);
        if (product) {
          const { finalPrice, taxRate } = getCustomerPrice(
            company,
            invoice.entity.customerDetails,
            product,
            taxTypeList
          );
          dispatch(
            setProductDetails({
              id: product.id,
              quantity: 1,
              code: product.code,
              description: product.description,
              taxRate,
              unit: "UND",
              price: finalPrice,
              costPrice: product.costPrice,
              instalationPrice: 0,
            })
          );
        }
        dispatch(stopLoader());
      } catch (error) {
        dispatch(stopLoader());
        dispatch(setDescription(""));
        dispatch(setQuantity(1));
        dispatch(setPrice(0));
        dispatch(setMessage({ message: getErrorMessage(error) }));
      }
    }
  }
);

export const addDetails = createAsyncThunk(
  "invoice/addDetails",
  async (_payload, { getState, dispatch }) => {
    const { session, invoice } = getState() as RootState;
    const { company } = session;
    const { customerDetails, productDetails, productDetailList } =
      invoice.entity;
    if (
      company &&
      productDetails.id &&
      productDetails.id > 0 &&
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
          instalationPrice: 0,
        };
        const index = productDetailList.findIndex(
          (item) => item.id === productDetails.id
        );
        if (index >= 0) {
          newProducts = [
            ...productDetailList.slice(0, index),
            {
              ...item,
              quantity: productDetailList[index].quantity + item.quantity,
            },
            ...productDetailList.slice(index + 1),
          ];
        } else {
          newProducts = [...productDetailList, item];
        }
        dispatch(setProductList(newProducts));
        const summary = getProductSummary(
          newProducts,
          customerDetails.exonerationPercentage
        );
        dispatch(setSummary(summary));
        dispatch(resetProductDetail());
      } catch (error) {
        dispatch(setMessage({ message: getErrorMessage(error) }));
      }
    }
  }
);

export const removeDetails = createAsyncThunk(
  "invoice/removeDetails",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { invoice } = getState() as RootState;
    const { customerDetails, productDetailList } = invoice.entity;
    const index = productDetailList.findIndex((item) => item.id === payload.id);
    const newProducts = [
      ...productDetailList.slice(0, index),
      ...productDetailList.slice(index + 1),
    ];
    dispatch(setProductList(newProducts));
    const summary = getProductSummary(
      newProducts,
      customerDetails.exonerationPercentage
    );
    dispatch(setSummary(summary));
  }
);

export const saveInvoice = createAsyncThunk(
  "invoice/saveInvoice",
  async (_payload: { id: number }, { getState, dispatch }) => {
    const { session, invoice } = getState() as RootState;
    const { token, userId, branchId, companyId, currencyType } = session;
    const {
      activityCode,
      paymentDetailsList,
      vendorId,
      customerDetails,
      productDetailList,
      summary,
      comment,
    } = invoice.entity;
    dispatch(startLoader());
    try {
      const invoiceId = await saveInvoiceEntity(
        token,
        userId,
        companyId,
        branchId,
        activityCode,
        paymentDetailsList,
        0,
        currencyType,
        vendorId,
        0,
        customerDetails,
        productDetailList,
        summary,
        comment
      );
      dispatch(setSuccessful({ id: invoiceId, success: true }));
      dispatch(
        setMessage({
          error: "Transacción completada satisfactoriamente",
          type: "INFO",
        })
      );
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage({ message: getErrorMessage(error) }));
    }
  }
);

export const getInvoiceListFirstPage = createAsyncThunk(
  "invoice/getInvoiceListFirstPage",
  async (payload: { id: number | null }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      dispatch(setInvoiceListPage(1));
      const recordCount = await getProcessedInvoiceListCount(
        token,
        companyId,
        branchId
      );
      dispatch(setInvoiceListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProcessedInvoiceListPerPage(
          token,
          companyId,
          branchId,
          1,
          10
        );
        dispatch(setInvoiceList(newList));
      } else {
        dispatch(setInvoiceList([]));
      }
      if (payload.id) dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
        10
      );
      dispatch(setInvoiceListPage(payload.pageNumber));
      dispatch(setInvoiceList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
          error: "Transacción completada satisfactoriamente",
          type: "INFO",
        })
      );
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const generatePDF = createAsyncThunk(
  "invoice/revokeInvoice",
  async (payload: { id: number; ref: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await generateInvoicePDF(token, payload.id, payload.ref);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const generateInvoiceTicket = createAsyncThunk(
  "invoice/revokeInvoice",
  async (payload: { id: number; ref: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userCode, device, branchList, branchId, company } = session;
    dispatch(startLoader());
    try {
      const invoice = await getInvoiceEntity(token, payload.id);
      const branchName =
        branchList.find((x) => x.id === branchId)?.description ??
        "SIN DESCRIPCION";
      if (company !== null) {
        printInvoice(
          userCode,
          company,
          invoice,
          branchName,
          device?.lineWidth ?? 80
        );
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
import { filterProductList } from "state/product/asyncActions";
import { setProductList, setProductListCount, setProductListPage } from "state/product/reducer";
import { setVendorList } from "state/session/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import {
  resetProductDetails,
  resetWorkingOrder,
  setActivityCode,
  setCustomerDetails,
  setDescription,
  setInvoiceId,
  setPrice,
  setProductDetails,
  setProductDetailsList,
  setQuantity,
  setServicePointList,
  setStatus,
  setSummary,
  setVendorId,
  setWorkingOrder,
  setWorkingOrderList,
  setWorkingOrderListCount,
  setWorkingOrderListPage,
} from "state/working-order/reducer";
import { ROWS_PER_CUSTOMER, ROWS_PER_PRODUCT } from "utils/constants";
import { defaultCustomerDetails } from "utils/defaults";
import {
  generateWorkingOrderPDF,
  getCustomerEntity,
  getCustomerListCount,
  getCustomerListPerPage,
  getCustomerPrice,
  getInvoiceEntity,
  getProductEntity,
  getProductListCount,
  getProductListPerPage,
  getProductSummary,
  getServicePointList,
  getVendorList,
  getWorkingOrderEntity,
  getWorkingOrderListCount,
  getWorkingOrderListPerPage,
  revokeWorkingOrderEntity,
  saveInvoiceEntity,
  saveWorkingOrderEntity,
} from "utils/domainHelper";
import { printInvoice, printWorkingOrder } from "utils/printing";
import { getErrorMessage } from "utils/utilities";

export const setWorkingOrderParameters = createAsyncThunk(
  "working-order/setWorkingOrderParameters",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, company, token } = session;
    dispatch(startLoader());
    try {
      if (company?.Modalidad === 1) {
        const customerCount = await getCustomerListCount(token, companyId, "");
        const customerList = await getCustomerListPerPage(token, companyId, 1, ROWS_PER_CUSTOMER, "");
        dispatch(setCustomerListPage(1));
        dispatch(setCustomerListCount(customerCount));
        dispatch(setCustomerList(customerList));
      } else {
        const servicePointList = await getServicePointList(token, companyId, branchId, true, "");
        dispatch(setServicePointList(servicePointList));
      }
      const productCount = await getProductListCount(token, companyId, branchId, true, "", 1);
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, ROWS_PER_PRODUCT, "", 1);
      const vendorList = await getVendorList(token, companyId);
      dispatch(setVendorList(vendorList));
      dispatch(setProductListPage(1));
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
      dispatch(resetWorkingOrder());
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setCustomerDetails(defaultCustomerDetails));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0].CodigoActividad));
      dispatch(setActiveSection(21));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getProduct = createAsyncThunk(
  "working-order/setWorkingOrderParameters",
  async (payload: { id: number; filterType: number }, { getState, dispatch }) => {
    const { session, ui, workingOrder } = getState() as RootState;
    const { token, branchId, company } = session;
    const { taxTypeList } = ui;
    if (company) {
      dispatch(startLoader());
      try {
        const product = await getProductEntity(token, payload.id, branchId);
        if (product) {
          const { taxRate, taxRateType, finalPrice } = getCustomerPrice(
            company,
            workingOrder.entity.customerDetails,
            product,
            taxTypeList
          );
          dispatch(filterProductList({ text: "", type: payload.filterType }));
          setProductDetails({
            id: product.id,
            quantity: 1,
            code: product.code,
            description: product.description,
            taxRate,
            taxRateType,
            unit: "UND",
            price: finalPrice,
            costPrice: product.costPrice,
            instalationPrice: 0,
          });
        }
        dispatch(stopLoader());
      } catch (error) {
        dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
        dispatch(stopLoader());
        dispatch(setDescription(""));
        dispatch(setQuantity(1));
        dispatch(setPrice(0));
      }
    }
  }
);

export const addDetails = createAsyncThunk("working-order/addDetails", async (_payload, { getState, dispatch }) => {
  const { session, workingOrder } = getState() as RootState;
  const { company } = session;
  const { customerDetails, productDetails, productDetailsList } = workingOrder.entity;
  if (
    company &&
    productDetails.id !== "" &&
    productDetails.description !== "" &&
    productDetails.quantity > 0 &&
    productDetails.price > 0
  ) {
    try {
      let newProducts = [];
      const item = {
        id: productDetails.id,
        code: productDetails.code,
        description: productDetails.description,
        quantity: productDetails.quantity,
        unit: productDetails.unit,
        price: productDetails.price,
        taxRate: productDetails.taxRate,
        taxRateType: productDetails.taxRateType,
        costPrice: productDetails.costPrice,
        instalationPrice: 0,
      };
      if (company?.Modalidad === 1) {
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
  "working-order/removeDetails",
  async (payload: { id: string; pos: number }, { getState, dispatch }) => {
    const { workingOrder } = getState() as RootState;
    const { customerDetails, productDetailsList } = workingOrder.entity;
    const index = productDetailsList.findIndex(item => item.id === payload.id);
    const newProducts = [...productDetailsList.slice(0, index), ...productDetailsList.slice(index + 1)];
    dispatch(setProductDetailsList(newProducts));
    const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
    dispatch(setSummary(summary));
  }
);

export const saveWorkingOrder = createAsyncThunk(
  "working-order/saveWorkingOrder",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token, userId, branchId, companyId } = session;
    const { entity: orderEntity } = workingOrder;
    dispatch(startLoader());
    try {
      const workingOrder = await saveWorkingOrderEntity(token, userId, branchId, companyId, orderEntity);
      if (workingOrder) {
        dispatch(setWorkingOrder(workingOrder));
      }
      dispatch(setStatus("ready"));
      dispatch(
        setMessage({
          message: "Transacción completada satisfactoriamente",
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

export const getWorkingOrderListFirstPage = createAsyncThunk(
  "working-order/getWorkingOrderListFirstPage",
  async (payload: { id: number | null }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId, company } = session;
    dispatch(startLoader());
    try {
      dispatch(setWorkingOrderListPage(1));
      const recordCount = await getWorkingOrderListCount(token, companyId, branchId, false);
      dispatch(setWorkingOrderListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getWorkingOrderListPerPage(
          token,
          companyId,
          branchId,
          false,
          1,
          company?.Modalidad === 1 ? 10 : 100
        );
        dispatch(setWorkingOrderList(newList));
      } else {
        dispatch(setWorkingOrderList([]));
      }
      if (payload.id !== null) dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getWorkingOrderListByPageNumber = createAsyncThunk(
  "working-order/getWorkingOrderListByPageNumber",
  async (payload: { pageNumber: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const newList = await getWorkingOrderListPerPage(token, companyId, branchId, false, payload.pageNumber, 10);
      dispatch(setWorkingOrderListPage(payload.pageNumber));
      dispatch(setWorkingOrderList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const revokeWorkingOrder = createAsyncThunk(
  "working-order/revokeWorkingOrder",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, userId } = session;
    dispatch(startLoader());
    try {
      await revokeWorkingOrderEntity(token, payload.id, userId);
      dispatch(getWorkingOrderListFirstPage({ id: null }));
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

export const openWorkingOrder = createAsyncThunk(
  "working-order/openWorkingOrder",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId, company } = session;
    dispatch(startLoader());
    try {
      const workingOrder = await getWorkingOrderEntity(token, payload.id);
      const customer = await getCustomerEntity(token, workingOrder.customerDetails.id);
      const customerCount = await getCustomerListCount(token, companyId, "");
      const customerList = await getCustomerListPerPage(token, companyId, 1, ROWS_PER_CUSTOMER, "");
      const productCount = await getProductListCount(token, companyId, branchId, true, "", 1);
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, ROWS_PER_PRODUCT, "", 1);
      const vendorList = await getVendorList(token, companyId);
      dispatch(setVendorList(vendorList));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0].CodigoActividad));
      dispatch(
        setWorkingOrder({
          ...workingOrder,
          customerDetails: {
            id: customer.id,
            name: customer.name,
            exonerationType: customer.exonerationType,
            exonerationRef: customer.exonerationRef,
            exoneratedBy: customer.exoneratedBy,
            exonerationDate: customer.exonerationDate,
            exonerationPercentage: customer.exonerationPercentage,
          },
        })
      );
      dispatch(setCustomerListCount(customerCount));
      dispatch(setCustomerList(customerList));
      dispatch(setProductListCount(productCount));
      dispatch(setProductDetailsList(productList));
      dispatch(setActiveSection(21));
      dispatch(setStatus("ready"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const generateInvoice = createAsyncThunk(
  "working-order/generateInvoice",
  async (_payload: { id: number }, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token, userId, branchId, companyId, currencyType } = session;
    const { id, activityCode, paymentDetailsList, vendorId, customerDetails, productDetailsList, summary } =
      workingOrder.entity;
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
        id,
        customerDetails,
        productDetailsList,
        summary,
        ""
      );
      dispatch(setInvoiceId(invoiceId));
      dispatch(getWorkingOrderListFirstPage({ id: null }));
      dispatch(setStatus("converted"));
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

export const generateInvoiceTicket = createAsyncThunk(
  "working-order/generateInvoiceTicket",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token, userCode, device, branchList, branchId, company } = session;
    const { invoiceId } = workingOrder.entity;
    dispatch(startLoader());
    try {
      const invoice = await getInvoiceEntity(token, invoiceId);
      const branchName = branchList.find(x => x.Id === branchId)?.Descripcion ?? "SUCURSAL PRINCIPAL";
      if (company !== null) {
        printInvoice(userCode, company, invoice, branchName, device?.lineWidth ?? 80);
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const generatePDF = createAsyncThunk(
  "working-order/generatePDF",
  async (payload: { id: number; ref: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await generateWorkingOrderPDF(token, payload.id, payload.ref);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const generateWorkingOrderTicket = createAsyncThunk(
  "working-order/generateWorkingOrderTicket",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, printer, userCode, device, branchList, branchId, company } = session;
    dispatch(startLoader());
    try {
      const invoice = await getWorkingOrderEntity(token, payload.id);
      const branchName = branchList.find(x => x.Id === branchId)?.Descripcion ?? "SUCURSAL PRINCIPAL";
      if (printer !== "" && company !== null) {
        printWorkingOrder(userCode, company, invoice, branchName, device?.lineWidth ?? 80);
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

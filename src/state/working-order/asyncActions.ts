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
  setDescription,
  setQuantity,
  setPrice,
  resetProductDetail,
  setProductList,
  setSummary,
  setActivityCode,
  setVendorId,
  setWorkingOrder,
  setInvoiceId,
  setStatus,
  setWorkingOrderListPage,
  setWorkingOrderListCount,
  setWorkingOrderList,
  setServicePointList,
  resetWorkingOrder,
} from "state/working-order/reducer";
import { setVendorList } from "state/session/reducer";
import {
  setCustomerListPage,
  setCustomerListCount,
  setCustomerList,
} from "state/customer/reducer";
import { setProductListPage, setProductListCount } from "state/product/reducer";
import { filterProductList } from "state/product/asyncActions";
import { RootState } from "state/store";
import { getErrorMessage } from "utils/utilities";
import {
  getCustomerListCount,
  getCustomerListPerPage,
  getProductListCount,
  getProductListPerPage,
  getProductEntity,
  getVendorList,
  getCustomerPrice,
  getProductSummary,
  saveWorkingOrderEntity,
  getWorkingOrderListCount,
  getWorkingOrderListPerPage,
  revokeWorkingOrderEntity,
  generateWorkingOrderPDF,
  getWorkingOrderEntity,
  getInvoiceEntity,
  saveInvoiceEntity,
  getServicePointList,
  getCustomerEntity,
} from "utils/domainHelper";
import { defaultCustomerDetails } from "utils/defaults";
import { printWorkingOrder, printInvoice } from "utils/printing";

export const setWorkingOrderParameters = createAsyncThunk(
  "working-order/setWorkingOrderParameters",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, company, token } = session;
    dispatch(startLoader());
    try {
      if (company?.mode === 1) {
        const customerCount = await getCustomerListCount(token, companyId, "");
        const customerList = await getCustomerListPerPage(
          token,
          companyId,
          1,
          ROWS_PER_CUSTOMER,
          ""
        );
        dispatch(setCustomerListPage(1));
        dispatch(setCustomerListCount(customerCount));
        dispatch(setCustomerList(customerList));
      } else {
        const servicePointList = await getServicePointList(
          token,
          companyId,
          branchId,
          true,
          ""
        );
        dispatch(setServicePointList(servicePointList));
      }
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
      dispatch(setProductListPage(1));
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
      dispatch(resetWorkingOrder());
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setCustomerDetails(defaultCustomerDetails));
      dispatch(setActivityCode(company?.economicActivityList[0].code));
      dispatch(setActiveSection(21));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const getProduct = createAsyncThunk(
  "working-order/setWorkingOrderParameters",
  async (
    payload: { id: number; filterType: number },
    { getState, dispatch }
  ) => {
    const { session, ui, workingOrder } = getState() as RootState;
    const { token, company } = session;
    const { taxTypeList } = ui;
    if (company) {
      dispatch(startLoader());
      try {
        const product = await getProductEntity(
          token,
          payload.id,
          1,
          company.id,
          taxTypeList
        );
        if (product) {
          const { taxRate, finalPrice } = getCustomerPrice(
            company,
            workingOrder.entity.customerDetails,
            product
          );
          dispatch(filterProductList({ text: "", type: payload.filterType }));
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
          });
        }
        dispatch(stopLoader());
      } catch (error) {
        dispatch(setMessage({ message: getErrorMessage(error) }));
        dispatch(stopLoader());
        dispatch(setDescription(""));
        dispatch(setQuantity(1));
        dispatch(setPrice(0));
      }
    }
  }
);

export const addDetails = createAsyncThunk(
  "working-order/addDetails",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { company } = session;
    const { customerDetails, productDetails, productDetailList } =
      workingOrder.entity;
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
          unit: productDetails.unit,
          price: productDetails.price,
          taxRate: productDetails.taxRate,
          costPrice: productDetails.costPrice,
          instalationPrice: 0,
        };
        if (company?.mode === 1) {
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
  "working-order/removeDetails",
  async (payload: { id: number; pos: number }, { getState, dispatch }) => {
    const { workingOrder } = getState() as RootState;
    const { customerDetails, productDetailList } = workingOrder.entity;
    const index = productDetailList.findIndex(
      (item, index) => item.id === payload.id && index === payload.pos
    );
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

export const saveWorkingOrder = createAsyncThunk(
  "working-order/saveWorkingOrder",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token, userId, branchId, companyId } = session;
    const { entity: orderEntity } = workingOrder;
    dispatch(startLoader());
    try {
      const workingOrder = await saveWorkingOrderEntity(
        token,
        userId,
        branchId,
        companyId,
        orderEntity
      );
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
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
      const recordCount = await getWorkingOrderListCount(
        token,
        companyId,
        branchId,
        false
      );
      dispatch(setWorkingOrderListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getWorkingOrderListPerPage(
          token,
          companyId,
          branchId,
          false,
          1,
          company?.mode === 1 ? 10 : 100
        );
        dispatch(setWorkingOrderList(newList));
      } else {
        dispatch(setWorkingOrderList([]));
      }
      if (payload.id !== null) dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
      const newList = await getWorkingOrderListPerPage(
        token,
        companyId,
        branchId,
        false,
        payload.pageNumber,
        10
      );
      dispatch(setWorkingOrderListPage(payload.pageNumber));
      dispatch(setWorkingOrderList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
      const customer = await getCustomerEntity(
        token,
        workingOrder.customerDetails.id
      );
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
      dispatch(setActivityCode(company?.economicActivityList[0].code));
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
      dispatch(setProductList(productList));
      dispatch(setActiveSection(21));
      dispatch(setStatus("ready"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const generateInvoice = createAsyncThunk(
  "working-order/generateInvoice",
  async (_payload: { id: number }, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token, userId, branchId, companyId, currencyType } = session;
    const {
      id,
      activityCode,
      paymentDetailsList,
      vendorId,
      customerDetails,
      productDetailList,
      summary,
    } = workingOrder.entity;
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
        productDetailList,
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
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
      const branchName =
        branchList.find((x) => x.id === branchId)?.description ??
        "SUCURSAL PRINCIPAL";
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
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const generateWorkingOrderTicket = createAsyncThunk(
  "working-order/generateWorkingOrderTicket",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, printer, userCode, device, branchList, branchId, company } =
      session;
    dispatch(startLoader());
    try {
      const invoice = await getWorkingOrderEntity(token, payload.id);
      const branchName =
        branchList.find((x) => x.id === branchId)?.description ??
        "SUCURSAL PRINCIPAL";
      if (printer !== "" && company !== null) {
        printWorkingOrder(
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

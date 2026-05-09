import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCategoryList, setProductList, setProductListCount, setProductListPage } from "state/product/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import {
  resetProductDetails,
  resetWorkingOrder,
  setActivityCode,
  setCustomerDetails,
  setInvoiceId,
  setPaymentDetailsList,
  setProductDetailsList,
  setServicePointId,
  setServicePointList,
  setStatus,
  setSummary,
  setVendorId,
  setWorkingOrder,
  setWorkingOrderList,
  setWorkingOrderListCount,
  setWorkingOrderListPage,
} from "state/working-order/reducer";
import { ORDER_STATUS } from "utils/constants";
import { defaultCustomerDetails, defaultPaymentDetails } from "utils/defaults";
import {
  generateWorkingOrderPDF,
  generateWorkingOrderTicketPDF,
  getCustomerPrice,
  getProductCategoryList,
  getProductEntity,
  getProductListCount,
  getProductListPerPage,
  getProductSummary,
  getServicePointEntity,
  getServicePointList as getServicePointListRequest,
  getWorkingOrderEntity,
  getWorkingOrderListCount,
  getWorkingOrderListPerPage,
  printPendingTickets,
  revokeWorkingOrderEntity,
  saveInvoiceEntity,
  saveWorkingOrderEntity,
} from "utils/domainHelper";
import { parseWorkingOrderEntity } from "utils/store/working-order";
import { getErrorMessage, roundNumber } from "utils/utilities";

export const setWorkingOrderParameters = createAsyncThunk(
  "working-order/setWorkingOrderParameters",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { company, vendorList } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(15));
    dispatch(resetWorkingOrder());
    try {
      dispatch(setCustomerDetails(defaultCustomerDetails));
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setPaymentDetailsList([defaultPaymentDetails]));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const addDetails = createAsyncThunk(
  "working-order/addDetails",
  async (payload: { id?: number }, { getState, dispatch }) => {
    const { session, workingOrder, ui } = getState() as RootState;
    const { taxTypeList } = ui;
    const { company, branchId, token } = session;
    const { customerDetails, productDetails, productDetailsList } = workingOrder.entity;
    let loadedProductDetails = productDetails;
    if (company && payload.id) {
      dispatch(startLoader());
      const product = await getProductEntity(token, payload.id, branchId);
      dispatch(stopLoader());
      const { price, taxRate } = getCustomerPrice(
        customerDetails.priceTypeId,
        product,
        company.PrecioVentaIncluyeIVA,
        taxTypeList
      );
      loadedProductDetails = {
        id: product.IdProducto,
        quantity: 1,
        code: "",
        description: product.Descripcion,
        taxRate,
        unit: "UND",
        price,
        costPrice: 0,
        disccountRate: 0,
      };
    }
    if (
      company &&
      loadedProductDetails.id !== 0 &&
      loadedProductDetails.description !== "" &&
      loadedProductDetails.quantity > 0 &&
      loadedProductDetails.price > 0
    ) {
      try {
        let newProducts = null;
        const newItem = {
          id: loadedProductDetails.id,
          orderId: 0,
          code: loadedProductDetails.code,
          description: loadedProductDetails.description,
          quantity: loadedProductDetails.quantity,
          unit: loadedProductDetails.unit,
          price: company.PrecioVentaIncluyeIVA
            ? loadedProductDetails.price
            : roundNumber(loadedProductDetails.price * (1 + loadedProductDetails.taxRate / 100), 2),
          taxRate: loadedProductDetails.taxRate,
          costPrice: loadedProductDetails.costPrice,
          disccountRate: loadedProductDetails.disccountRate,
        };
        newProducts = [...productDetailsList, newItem];
        dispatch(setProductDetailsList(newProducts));
        const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
        dispatch(setSummary(summary));
        dispatch(resetProductDetails());
      } catch (error) {
        dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      }
    }
  }
);

export const updateDetails = createAsyncThunk(
  "working-order/updateDetails",
  async (payload: { pos: number }, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { company } = session;
    const { customerDetails, productDetails, productDetailsList } = workingOrder.entity;
    if (company && productDetails.id) {
      if (company && productDetails.quantity > 0 && productDetails.price > 0) {
        try {
          const index = productDetailsList.findIndex(
            (item, index) => item.id === productDetails.id && index === payload.pos
          );
          if (index >= 0) {
            const newProducts = [
              ...productDetailsList.slice(0, index),
              {
                ...productDetailsList[index],
                description: productDetails.description,
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
  "working-order/removeDetails",
  async (payload: { pos: number }, { getState, dispatch }) => {
    const { workingOrder } = getState() as RootState;
    const { customerDetails, productDetailsList } = workingOrder.entity;
    const index = productDetailsList.findIndex((_item, index) => index === payload.pos);
    const newProducts = [...productDetailsList.slice(0, index), ...productDetailsList.slice(index + 1)];
    dispatch(setProductDetailsList(newProducts));
    const summary = getProductSummary(newProducts, customerDetails.exonerationPercentage);
    dispatch(setSummary(summary));
  }
);

export const saveWorkingOrder = createAsyncThunk(
  "working-order/saveWorkingOrder",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder, ui } = getState() as RootState;
    const { token, userId, branchId, companyId } = session;
    const { entity, servicePointList } = workingOrder;
    dispatch(startLoader());
    try {
      const ids = await saveWorkingOrderEntity(token, userId, branchId, companyId, entity);
      if (ids) {
        const savedEntity = {
          ...entity,
          id: ids.id,
          consecutive: ids.consecutive,
          productDetailsList: entity.productDetailsList.map(details => ({ ...details, orderId: ids.id })),
        };
        dispatch(setWorkingOrder(savedEntity));
        const index = servicePointList.findIndex(item => item.Id === entity.servicePointId);
        const newList = [
          ...servicePointList.slice(0, index),
          {
            ...servicePointList[index],
            Valor: parseInt(ids.id),
          },
          ...servicePointList.slice(index + 1),
        ];
        dispatch(setServicePointList(newList));
      }
      dispatch(setStatus(ORDER_STATUS.READY));
      dispatch(
        setMessage({
          message: "Transacción completada satisfactoriamente",
          type: "INFO",
        })
      );
      dispatch(stopLoader());
      if (entity.servicePointId > 0 && ui.printerServerAddress !== "") {
        await printPendingTickets(
          session.companyId,
          session.branchId,
          entity.id || ids?.id || 0,
          ui.printerServerAddress
        );
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getWorkingOrderListFirstPage = createAsyncThunk(
  "working-order/getWorkingOrderListFirstPage",
  async (payload: { rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(11));
    try {
      dispatch(setWorkingOrderListPage(1));
      const recordCount = await getWorkingOrderListCount(token, companyId, branchId, false);
      dispatch(setWorkingOrderListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getWorkingOrderListPerPage(token, companyId, branchId, false, 1, payload.rowsPerPage);
        dispatch(setWorkingOrderList(newList));
      } else {
        dispatch(setWorkingOrderList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getWorkingOrderListByPageNumber = createAsyncThunk(
  "working-order/getWorkingOrderListByPageNumber",
  async (payload: { pageNumber: number; rowsPerPage: number }, { getState, dispatch }) => {
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
        payload.rowsPerPage
      );
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
    const { session, workingOrder } = getState() as RootState;
    const { token, userId, company } = session;
    const { entity, servicePointList } = workingOrder;
    dispatch(startLoader());
    try {
      await revokeWorkingOrderEntity(token, payload.id, userId);
      if (entity.servicePointId > 0) {
        const index = servicePointList.findIndex(item => item.Id === entity.servicePointId);
        const newList = [
          ...servicePointList.slice(0, index),
          {
            ...servicePointList[index],
            Valor: 0,
          },
          ...servicePointList.slice(index + 1),
        ];
        dispatch(setServicePointList(newList));
      }
      dispatch(resetWorkingOrder());
      if (company?.Modalidad === 2) {
        dispatch(setActiveSection(11));
      }
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

export const openWorkingOrder = createAsyncThunk(
  "working-order/openWorkingOrder",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, vendorList, company } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(15));
    try {
      const workingOrder = await getWorkingOrderEntity(token, payload.id);
      const workingOrderEntity = parseWorkingOrderEntity(workingOrder);
      dispatch(setWorkingOrder(workingOrderEntity));
      dispatch(setServicePointId(0));
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      dispatch(setStatus(ORDER_STATUS.READY));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getServicePointList = createAsyncThunk(
  "working-order/getServicePointList",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(11));
    try {
      const servicePointList = await getServicePointListRequest(token, companyId, branchId, true, "");
      dispatch(setServicePointList(servicePointList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const openServicePoint = createAsyncThunk(
  "working-order/openServicePoint",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session, product } = getState() as RootState;
    const { token, company, vendorList, branchId, companyId } = session;
    const { categoryList } = product;
    dispatch(startLoader());
    dispatch(setActiveSection(15));
    dispatch(resetWorkingOrder());
    try {
      const servicePoint = await getServicePointEntity(token, payload.id);
      if (categoryList.length === 0) {
        const categoryList = await getProductCategoryList(token, companyId);
        dispatch(setCategoryList(categoryList));
      }
      const productCount = await getProductListCount(token, companyId, branchId, true, "", 1);
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, productCount, "", true, 1);
      dispatch(setProductListPage(1));
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
      const workingOrder = servicePoint.IdOrden > 0 ? await getWorkingOrderEntity(token, servicePoint.IdOrden) : null;
      if (workingOrder !== null) {
        const workingOrderEntity = parseWorkingOrderEntity(workingOrder);
        dispatch(setWorkingOrder(workingOrderEntity));
      }
      dispatch(setServicePointId(servicePoint.IdPunto));
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      dispatch(setStatus(ORDER_STATUS.READY));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const generateInvoice = createAsyncThunk(
  "working-order/generateInvoice",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token, userId, branchId, companyId } = session;
    const { servicePointList, entity } = workingOrder;
    const {
      id,
      activityCode,
      paymentDetailsList,
      vendorId,
      currency,
      customerDetails,
      productDetailsList,
      summary,
      servicePointId,
    } = entity;
    dispatch(startLoader());
    try {
      const references = await saveInvoiceEntity(
        token,
        userId,
        companyId,
        branchId,
        activityCode,
        paymentDetailsList,
        currency,
        vendorId,
        id,
        customerDetails,
        productDetailsList,
        summary,
        ""
      );
      dispatch(setInvoiceId(references.id));
      dispatch(setStatus(ORDER_STATUS.CONVERTED));
      if (servicePointId > 0) {
        const index = servicePointList.findIndex(item => item.Id === servicePointId);
        const newList = [
          ...servicePointList.slice(0, index),
          {
            ...servicePointList[index],
            Valor: 0,
          },
          ...servicePointList.slice(index + 1),
        ];
        dispatch(setServicePointList(newList));
      }
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

export const generatePDF = createAsyncThunk(
  "working-order/generatePDF",
  async (payload: { id: number; ref: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      await generateWorkingOrderPDF(token, payload.id);
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
    const { token } = session;
    dispatch(startLoader());
    try {
      await generateWorkingOrderTicketPDF(token, payload.id);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

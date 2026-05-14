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
  setPrintingTicketList,
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
  getPrintingTickets,
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
        additionalInformation: "",
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
          additionalInformation: "",
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
      let orderId = entity.id;
      let savedEntity = { ...entity };
      const ids = await saveWorkingOrderEntity(token, userId, branchId, companyId, entity);
      if (ids) {
        orderId = ids.id;
        savedEntity = {
          ...savedEntity,
          id: ids.id,
          consecutive: ids.consecutive,
        };
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
      savedEntity = {
        ...savedEntity,
        productDetailsList: entity.productDetailsList.map(details => ({ ...details, orderId: orderId })),
      };
      dispatch(setWorkingOrder(savedEntity));
      dispatch(setStatus(ORDER_STATUS.READY));
      let message = {
        message: "Transacción completada satisfactoriamente",
        type: "INFO",
      };
      if (savedEntity.servicePointId > 0 && savedEntity.id > 0 && ui.printerServerAddress !== "") {
        try {
          const pendingTickets = await getPrintingTickets(
            session.token,
            session.companyId,
            session.branchId,
            entity.id,
            true
          );
          if (pendingTickets.length > 0) {
            await printPendingTickets(pendingTickets, ui.printerServerAddress);
          }
        } catch {
          message = {
            message: "No se logró imprimir los tiquetes de la orden. Por favor intente la reimpresión",
            type: "ERROR",
          };
        }
      }
      dispatch(stopLoader());
      dispatch(setMessage(message));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getPrintingTicketList = createAsyncThunk(
  "working-order/printWorkingOrderPendingTickets",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    dispatch(startLoader());
    try {
      const orderPrintingTickets = await getPrintingTickets(
        session.token,
        session.companyId,
        session.branchId,
        workingOrder.entity.id,
        false
      );
      dispatch(setPrintingTicketList(orderPrintingTickets));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const printWorkingOrderTicket = createAsyncThunk(
  "working-order/printWorkingOrderPendingTickets",
  async (payload: { ticketId: number }, { getState, dispatch }) => {
    const { ui, workingOrder } = getState() as RootState;
    dispatch(startLoader());
    try {
      const tickets = workingOrder.printingTicketList.filter(ticket => ticket.IdTiquete === payload.ticketId);
      printPendingTickets(tickets, ui.printerServerAddress)
        .then(() => {
          const newPrintingTicketList = workingOrder.printingTicketList.map(ticket => ({
            ...ticket,
            Impreso: ticket.IdTiquete === payload.ticketId ? true : ticket.Impreso,
          }));
          dispatch(setPrintingTicketList(newPrintingTicketList));
          dispatch(stopLoader());
        })
        .catch((ex: any) => {
          dispatch(stopLoader());
          dispatch(
            setMessage({
              message: ex.message,
              type: "ERROR",
            })
          );
        });
    } catch {
      dispatch(
        setMessage({
          message: "No se logró imprimir los tiquetes de la orden. Por favor intente la reimpresión",
          type: "ERROR",
        })
      );
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
      const workingOrderEntity = parseWorkingOrderEntity(workingOrder, 0);
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
      const productCount = await getProductListCount(token, companyId, branchId, true, "", 1);
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, productCount, "", true, 1);
      dispatch(setProductListPage(1));
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
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
    const { token, company, vendorList, companyId } = session;
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
      const workingOrder = servicePoint.IdOrden > 0 ? await getWorkingOrderEntity(token, servicePoint.IdOrden) : null;
      if (workingOrder !== null) {
        const workingOrderEntity = parseWorkingOrderEntity(workingOrder, servicePoint.IdPunto);
        dispatch(setWorkingOrder(workingOrderEntity));
      }
      dispatch(setServicePointId(servicePoint.IdPunto));
      dispatch(setPaymentDetailsList([defaultPaymentDetails]));
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

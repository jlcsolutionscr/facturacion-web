import { CustomerDetailsType, WorkingOrderProductDetailsType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { getCustomerListFirstPage } from "state/customer/asyncActions";
import { getProductListFirstPage } from "state/product/asyncActions";
import { setCategoryList } from "state/product/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import {
  resetProductDetails,
  resetWorkingOrder,
  setActivityCode,
  setCustomerDetails,
  setInvoiceId,
  setPrintingTicketList,
  setProductDetailsList,
  setServicePointEntity,
  setServicePointId,
  setServicePointList,
  setStatus,
  setSummary,
  setVendorId,
  setWorkingOrder,
  setWorkingOrderList,
  setWorkingOrderListCount,
  setWorkingOrderListPage,
  updatePaymentInfo,
} from "state/working-order/reducer";
import { ORDER_STATUS } from "utils/constants";
import { defaultCustomerDetails, defaultServicePoint } from "utils/defaults";
import {
  generateWorkingOrderPDF,
  generateWorkingOrderTicketPDF,
  getPrintingTickets,
  getProductCategoryList,
  getProductsSummary,
  getServicePointEntity,
  getServicePointList as getServicePointListRequest,
  getWorkingOrderEntity,
  getWorkingOrderListCount,
  getWorkingOrderListPerPage,
  printPendingTickets,
  revokeWorkingOrderEntity,
  saveInvoiceEntity,
  saveServicePointEntity,
  saveWorkingOrderEntity,
} from "utils/domainHelper";
import { getNewProductItem } from "utils/store/product";
import { parseWorkingOrderEntity } from "utils/store/working-order";
import { getErrorMessage } from "utils/utilities";

export const setWorkingOrderParameters = createAsyncThunk(
  "working-order/setWorkingOrderParameters",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { company, vendorList } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(15));
    dispatch(getCustomerListFirstPage({ filterText: "", rowsPerPage: 8 }));
    dispatch(getProductListFirstPage({ filterText: "", type: 2, includeImages: false, rowsPerPage: 8 }));
    dispatch(resetWorkingOrder());
    try {
      dispatch(setCustomerDetails(defaultCustomerDetails));
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const selectCustomer = createAsyncThunk(
  "working-order/selectCustomer",
  async (payload: CustomerDetailsType, { getState, dispatch }) => {
    const { workingOrder } = getState() as RootState;
    const { productDetailsList } = workingOrder.entity;
    try {
      dispatch(setCustomerDetails(payload));
      const summary = getProductsSummary(
        productDetailsList.filter(product => !product.paid && product.inSummary),
        payload.exonerationPercentage
      );
      dispatch(setSummary(summary));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
  }
);

export const addDetails = createAsyncThunk(
  "working-order/addDetails",
  async (payload: { id?: number }, { getState, dispatch }) => {
    const { session, workingOrder, ui } = getState() as RootState;
    const { company, branchId, token } = session;
    const { entity, paymentInfo } = workingOrder;
    const { productDetails, productDetailsList } = entity;
    const { customerDetails, totalSaved } = paymentInfo;
    if (company) {
      if (payload.id) dispatch(startLoader());
      const newProduct = await getNewProductItem(
        token,
        branchId,
        customerDetails.priceTypeId,
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
          let newProducts: WorkingOrderProductDetailsType[] = [];
          const index = productDetailsList.findIndex(
            item => item.id === newProduct.id && item.price === newProduct.price
          );
          if (index >= 0) {
            newProducts = [
              ...productDetailsList.slice(0, index),
              {
                ...newProduct,
                paid: false,
                inSummary: true,
                orderId: productDetailsList[index].orderId,
                quantity: (parseFloat(productDetailsList[index].quantity) + parseFloat(newProduct.quantity)).toString(),
              },
              ...productDetailsList.slice(index + 1),
            ];
          } else {
            newProducts = [...productDetailsList, { ...newProduct, paid: false, inSummary: true, orderId: 0 }];
          }
          dispatch(setProductDetailsList(newProducts));
          const summary = getProductsSummary(
            newProducts.filter(product => !product.paid && product.inSummary),
            customerDetails.exonerationPercentage
          );
          dispatch(setSummary({ ...summary, totalSaved }));
          dispatch(resetProductDetails());
        } catch (error) {
          dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
        }
      }
    }
  }
);

export const updateDetails = createAsyncThunk(
  "working-order/updateDetails",
  async (payload: { pos: number }, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { company } = session;
    const { entity, paymentInfo } = workingOrder;
    const { productDetails, productDetailsList } = entity;
    const { customerDetails } = paymentInfo;
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
            const summary = getProductsSummary(
              newProducts.filter(product => !product.paid && product.inSummary),
              customerDetails.exonerationPercentage
            );
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
    const { entity, paymentInfo } = workingOrder;
    const { productDetailsList } = entity;
    const { customerDetails } = paymentInfo;
    const index = productDetailsList.findIndex((_item, index) => index === payload.pos);
    const newProducts = [...productDetailsList.slice(0, index), ...productDetailsList.slice(index + 1)];
    dispatch(setProductDetailsList(newProducts));
    const summary = getProductsSummary(
      newProducts.filter(product => !product.paid && product.inSummary),
      customerDetails.exonerationPercentage
    );
    dispatch(setSummary(summary));
  }
);

export const saveWorkingOrder = createAsyncThunk(
  "working-order/saveWorkingOrder",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder, ui } = getState() as RootState;
    const { token, userId, branchId, companyId } = session;
    const { entity, paymentInfo, servicePointList } = workingOrder;
    dispatch(startLoader());
    try {
      let orderId = entity.id;
      let savedEntity = { ...entity };
      const ids = await saveWorkingOrderEntity(token, userId, branchId, companyId, entity, paymentInfo);
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
      const totalSaved = entity.productDetailsList.reduce(
        (accumulator, product) => accumulator + parseFloat(product.quantity) * parseFloat(product.price),
        0
      );
      dispatch(setWorkingOrder(savedEntity));
      dispatch(updatePaymentInfo({ ...paymentInfo, totalSaved }));
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
      const entity = await getWorkingOrderEntity(token, payload.id);
      const { workingOrder, paymentInfo } = parseWorkingOrderEntity(entity, company, 0);
      dispatch(setWorkingOrder(workingOrder));
      dispatch(updatePaymentInfo(paymentInfo));
      dispatch(setServicePointId(0));
      dispatch(setVendorId(vendorList[0].Id));
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
  async (payload: { activeFilter: boolean }, { getState, dispatch }) => {
    const { session, product } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(11));
    try {
      const servicePointList = await getServicePointListRequest(token, companyId, branchId, payload.activeFilter, "");
      if (product.list.length <= 8) {
        dispatch(getProductListFirstPage({ filterText: "", type: 2, includeImages: true }));
      }
      dispatch(setServicePointList(servicePointList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getServicePointMaintenance = createAsyncThunk(
  "working-order/getServicePointMaintenance",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    ``;
    dispatch(startLoader());
    try {
      const servicePointList = await getServicePointListRequest(token, companyId, branchId, false, "");
      dispatch(setServicePointList(servicePointList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getServicePoint = createAsyncThunk(
  "working-order/getServicePoint",
  async (payload: { id?: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(19));
    dispatch(resetWorkingOrder());
    try {
      let servicePoint = {
        ...defaultServicePoint,
        IdEmpresa: companyId,
        IdSucursal: branchId,
      };
      if (payload.id) {
        servicePoint = await getServicePointEntity(token, payload.id);
      }
      dispatch(setServicePointEntity(servicePoint));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const saveServicePoint = createAsyncThunk(
  "working-order/saveServicePoint",
  async (_payload, { getState, dispatch }) => {
    const { workingOrder, session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    const { servicePointEntity } = workingOrder;
    dispatch(startLoader());
    try {
      const entity = { ...servicePointEntity, IdEmpresa: companyId, IdSucursal: branchId };
      await saveServicePointEntity(token, entity);
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

export const openServicePoint = createAsyncThunk(
  "working-order/openServicePoint",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session, product } = getState() as RootState;
    const { token, vendorList, company, companyId } = session;
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
      const entity = servicePoint.IdOrden > 0 ? await getWorkingOrderEntity(token, servicePoint.IdOrden) : null;
      if (entity !== null) {
        const { workingOrder, paymentInfo } = parseWorkingOrderEntity(entity, company, 0);
        dispatch(setWorkingOrder(workingOrder));
        dispatch(updatePaymentInfo(paymentInfo));
      }
      dispatch(setServicePointId(servicePoint.IdPunto));
      dispatch(setVendorId(vendorList[0].Id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const setSummaryProductList = createAsyncThunk(
  "working-order/setSummaryProductList",
  async (payload: { inSummary: boolean; index?: number }, { getState, dispatch }) => {
    const { workingOrder } = getState() as RootState;
    const { entity, paymentInfo } = workingOrder;
    const updatedProductList = entity.productDetailsList.map((product, index) => ({
      ...product,
      inSummary:
        payload.index !== undefined
          ? index == payload.index
            ? payload.inSummary
            : product.inSummary
          : payload.inSummary,
    }));
    const summary = getProductsSummary(
      updatedProductList.filter(product => !product.paid && product.inSummary),
      paymentInfo.customerDetails.exonerationPercentage
    );
    dispatch(setProductDetailsList(updatedProductList));
    dispatch(setSummary(summary));
  }
);

export const generateInvoice = createAsyncThunk(
  "working-order/generateInvoice",
  async (_payload, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token, userId, branchId, companyId } = session;
    const { servicePointList, entity, paymentInfo } = workingOrder;
    const { id, vendorId, currency, servicePointId, productDetailsList } = entity;
    const { customerDetails, totalSaved, totalPaid, activityCode, summary, paymentMethodList } = paymentInfo;
    dispatch(startLoader());
    try {
      const summaryProductList = productDetailsList.filter(product => !product.paid && product.inSummary);
      const newTotal = totalPaid + summary.total;
      const closeOrder = newTotal === totalSaved;
      const references = await saveInvoiceEntity(
        token,
        userId,
        companyId,
        branchId,
        activityCode,
        paymentMethodList,
        currency,
        vendorId,
        id,
        customerDetails,
        summaryProductList,
        summary,
        "",
        closeOrder
      );

      dispatch(setInvoiceId({ id: references.id, amount: newTotal }));
      if (closeOrder) {
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

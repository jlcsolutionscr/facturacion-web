import { CustomerDetailsType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
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
import {
  resetProductDetails,
  resetWorkingOrder,
  setActivityCode,
  setCustomerDetails,
  setInvoiceId,
  setPrintingTicketList,
  setPrintingTicketStatus,
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
  getCustomerListCount,
  getCustomerListPerPage,
  getPaymentBankId,
  getPrintingTickets,
  getProductCategoryList,
  getProductListCount,
  getProductListPerPage,
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
  updatePrintedTickets,
} from "utils/domainHelper";
import { getCustomerPrice, getNewProductItem } from "utils/store/product";
import { parseWorkingOrderEntity } from "utils/store/working-order";
import { getErrorMessage } from "utils/utilities";

export const setWorkingOrderParameters = createAsyncThunk(
  "working-order/setWorkingOrderParameters",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, company, companyId, branchId, vendorList } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(15));
    try {
      dispatch(resetWorkingOrder());
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
    const { session, workingOrder, ui, product } = getState() as RootState;
    const { company, branchId, token } = session;
    const { entity, paymentInfo } = workingOrder;
    const { productDetails, productDetailsList } = entity;
    const { customerDetails, totalSaved } = paymentInfo;
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
      if (newProduct) {
        if (
          newProduct.id !== 0 &&
          newProduct.description !== "" &&
          !["0", ""].includes(newProduct.quantity) &&
          !["0", ""].includes(newProduct.price)
        ) {
          try {
            const newProducts = [
              ...productDetailsList,
              {
                ...newProduct,
                paid: false,
                inSummary: true,
                orderId: 0,
              },
            ];
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
      if (ui.localPrinting && savedEntity.servicePointId > 0 && savedEntity.id > 0 && ui.printerServerAddress !== "") {
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

export const updateWorkingOrderTicket = createAsyncThunk(
  "working-order/updateWorkingOrderTicket",
  async (payload: { ticketId: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    dispatch(startLoader());
    try {
      await updatePrintedTickets(session.token, payload.ticketId);
      dispatch(setPrintingTicketStatus({ id: payload.ticketId, status: false }));
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    }
    dispatch(stopLoader());
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
    const { token, vendorList, company, companyId, branchId } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(15));
    try {
      const entity = await getWorkingOrderEntity(token, payload.id);
      dispatch(resetWorkingOrder());
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
      if (product.touchScreenProductList.length <= 0) {
        const recordCount = await getProductListCount(token, companyId, branchId, false, "", 1);
        if (recordCount > 0) {
          const newList = await getProductListPerPage(token, companyId, branchId, false, 1, recordCount, "", true, 1);
          dispatch(setTouchScreenProductList(newList));
        } else {
          dispatch(setTouchScreenProductList([]));
        }
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

export const translateOrderServicePoint = createAsyncThunk(
  "working-order/translateOrderServicePoint",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session, workingOrder } = getState() as RootState;
    const { token } = session;
    const { entity } = workingOrder;
    dispatch(startLoader());
    try {
      const oldServicePointEntity = await getServicePointEntity(token, entity.servicePointId);
      const newServicePointEntity = await getServicePointEntity(token, payload.id);
      await saveServicePointEntity(token, { ...oldServicePointEntity, IdOrden: 0 });
      await saveServicePointEntity(token, { ...newServicePointEntity, IdOrden: entity.id });
      dispatch(setWorkingOrder({ ...entity, servicePointId: payload.id }));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const refreshTouchScreenProductList = createAsyncThunk(
  "working-order/refreshTouchScreenProductList",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, branchId, companyId } = session;
    dispatch(startLoader());
    try {
      const recordCount = await getProductListCount(token, companyId, branchId, false, "", 1);
      if (recordCount > 0) {
        const newList = await getProductListPerPage(token, companyId, branchId, false, 1, recordCount, "", true, 1);
        dispatch(setTouchScreenProductList(newList));
      } else {
        dispatch(setTouchScreenProductList([]));
      }
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
    const { token, userId, branchId, companyId, creditCardBankId, transferBankId } = session;
    const { servicePointList, entity, paymentInfo } = workingOrder;
    const { id, vendorId, servicePointId, productDetailsList } = entity;
    const { customerDetails, totalSaved, totalPaid, activityCode, summary, paymentMethodList } = paymentInfo;
    dispatch(startLoader());
    try {
      const paymentDetailsList = [];
      for (let i = 0; i < paymentMethodList.length; i++) {
        const payment = paymentMethodList[i];
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
      const summaryProductList = productDetailsList.filter(product => !product.paid && product.inSummary);
      const newTotal = totalPaid + summary.total;
      const closeOrder = newTotal === totalSaved;
      const references = await saveInvoiceEntity(
        token,
        userId,
        companyId,
        branchId,
        activityCode,
        paymentDetailsList,
        1,
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

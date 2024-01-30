import { ProductDetailType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
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
import { defaultCustomerDetails, defaultPaymentDetails, defaultProductDetails } from "utils/defaults";
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
  getTaxedPrice,
  getVendorList,
  getWorkingOrderEntity,
  getWorkingOrderListCount,
  getWorkingOrderListPerPage,
  revokeWorkingOrderEntity,
  saveInvoiceEntity,
  saveWorkingOrderEntity,
} from "utils/domainHelper";
import { printInvoice, printWorkingOrder } from "utils/printing";
import { convertToDateString, getErrorMessage, getTaxeRateFromId, roundNumber } from "utils/utilities";

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
        dispatch(setCustomerDetails(defaultCustomerDetails));
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
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0].CodigoActividad));
      dispatch(setActiveSection(21));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getCustomerDetails = createAsyncThunk(
  "working-order/getCustomerDetails",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session, ui } = getState() as RootState;
    const { token } = session;
    const { taxTypeList } = ui;
    dispatch(startLoader());
    try {
      const customer = await getCustomerEntity(token, payload.id);
      dispatch(
        setCustomerDetails({
          id: customer.IdCliente,
          name: customer.Nombre,
          comercialName: customer.NombreComercial,
          email: customer.CorreoElectronico,
          phoneNumber: customer.Telefono,
          exonerationType: customer.IdTipoExoneracion,
          exonerationRef: customer.NumDocExoneracion,
          exoneratedBy: customer.NombreInstExoneracion,
          exonerationDate: customer.FechaEmisionDoc,
          exonerationPercentage: customer.PorcentajeExoneracion,
          priceTypeId: customer.IdTipoPrecio,
          differentiatedTaxRateApply: customer.AplicaTasaDiferenciada,
          taxRate: getTaxeRateFromId(taxTypeList, customer.IdImpuesto),
        })
      );
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getProduct = createAsyncThunk(
  "working-order/getProduct",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session, ui, workingOrder } = getState() as RootState;
    const { token, branchId, company } = session;
    const { taxTypeList } = ui;
    if (company) {
      dispatch(startLoader());
      try {
        const product = await getProductEntity(token, payload.id, branchId);
        if (product) {
          const { price, taxRate } = getCustomerPrice(
            workingOrder.entity.customerDetails.priceTypeId,
            product,
            taxTypeList
          );
          dispatch(
            setProductDetails({
              id: product.IdProducto,
              quantity: 1,
              code: product.Codigo,
              description: product.Descripcion,
              taxRate,
              unit: "UND",
              price,
              costPrice: product.PrecioCosto,
              instalationPrice: 0,
            })
          );
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
      let newProducts = null;
      const { taxRate, price, pricePlusTaxes } = getTaxedPrice(
        productDetails.taxRate,
        productDetails.price,
        company.PrecioVentaIncluyeIVA,
        customerDetails.taxRate
      );
      const item = {
        id: productDetails.id,
        code: productDetails.code,
        description: productDetails.description,
        quantity: productDetails.quantity,
        unit: productDetails.unit,
        price,
        pricePlusTaxes,
        taxRate,
        costPrice: productDetails.costPrice,
        disccountRate: productDetails.disccountRate,
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
    const index = productDetailsList.findIndex((item, index) => item.id === payload.id && index == payload.pos);
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
    const { entity, listPage } = workingOrder;
    dispatch(startLoader());
    try {
      const workingOrder = await saveWorkingOrderEntity(token, userId, branchId, companyId, entity);
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
      dispatch(getWorkingOrderListByPageNumber({ pageNumber: listPage }));
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
    const { session, ui } = getState() as RootState;
    const { token, companyId, branchId, company } = session;
    const { taxTypeList } = ui;
    dispatch(startLoader());
    try {
      const workingOrder = await getWorkingOrderEntity(token, payload.id);
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
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
      dispatch(setVendorList(vendorList));
      const customerDetails = {
        id: workingOrder.IdCliente,
        name: workingOrder.NombreCliente,
        exonerationType: workingOrder.Cliente.IdTipoExoneracion,
        exonerationRef: workingOrder.Cliente.NumDocExoneracion,
        exoneratedBy: workingOrder.Cliente.NumDocExoneracion,
        exonerationPercentage: workingOrder.Cliente.PorcentajeExoneracion,
        exonerationDate: workingOrder.Cliente.FechaEmisionDoc,
        priceTypeId: workingOrder.Cliente.IdTipoPrecio,
        taxRate: getTaxeRateFromId(taxTypeList, workingOrder.Cliente.IdImpuesto),
      };
      const productDetailsList = workingOrder.DetalleOrdenServicio.map((item: ProductDetailType) => ({
        id: item.IdProducto,
        quantity: item.Cantidad,
        code: item.Codigo,
        description: item.Descripcion,
        taxRate: item.PorcentajeIVA,
        unit: "UND",
        price: item.PrecioVenta,
        pricePlusTaxes: roundNumber(item.PrecioVenta * (1 + item.PorcentajeIVA / 100), 2),
        costPrice: item.Producto.PrecioCosto,
      }));
      const summary = getProductSummary(productDetailsList, customerDetails.exonerationPercentage);
      dispatch(
        setWorkingOrder({
          id: workingOrder.IdOrden,
          consecutive: workingOrder.ConsecOrdenServicio,
          date: convertToDateString(workingOrder.Fecha),
          cashAdvance: workingOrder.MontoAdelanto,
          invoiceId: 0,
          status: "ready",
          activityCode: company?.ActividadEconomicaEmpresa[0].CodigoActividad,
          customerDetails,
          productDetails: defaultProductDetails,
          productDetailsList,
          paymentDetailsList: [defaultPaymentDetails],
          vendorId: workingOrder.IdVendedor,
          summary,
          delivery: {
            phone: workingOrder.Telefono,
            address: workingOrder.Direccion,
            description: workingOrder.Descripcion,
            date: workingOrder.FechaEntrega,
            time: workingOrder.HoraEntrega,
            details: workingOrder.OtrosDetalles,
          },
        })
      );
      dispatch(setActiveSection(21));
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
  async (payload: { id: number; ref: number }, { getState, dispatch }) => {
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

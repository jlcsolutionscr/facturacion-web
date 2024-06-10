import { ROWS_PER_CUSTOMER, ROWS_PER_PRODUCT } from "utils/constants";
import { SET_PROFORMA_ATTRIBUTES, SET_LIST_PAGE, SET_LIST_COUNT, SET_LIST, RESET_PROFORMA } from "./types";

import { startLoader, stopLoader, setMessage, setActiveSection } from "store/ui/actions";

import { setCompany } from "store/company/actions";
import { setCustomer, setCustomerListPage, setCustomerListCount, setCustomerList } from "store/customer/actions";
import {
  setProduct,
  filterProductList,
  setProductListPage,
  setProductListCount,
  setProductList,
} from "store/product/actions";

import {
  getCompanyEntity,
  getCustomerListCount,
  getCustomerListPerPage,
  getProductListCount,
  getProductListPerPage,
  getProductEntity,
  getCustomerPrice,
  getProductSummary,
  saveProformaEntity,
  revokeProformaEntity,
  generateProformaPDF,
  getProformaListCount,
  getProformaListPerPage,
} from "utils/domainHelper";

import { defaultCustomer } from "utils/defaults";
import { getTaxeRateFromId } from "utils/utilities";

export const setProformaAttributes = payload => {
  return {
    type: SET_PROFORMA_ATTRIBUTES,
    payload,
  };
};

export const setProformaListPage = page => {
  return {
    type: SET_LIST_PAGE,
    payload: { page },
  };
};

export const setProformaListCount = count => {
  return {
    type: SET_LIST_COUNT,
    payload: { count },
  };
};

export const setProformaList = list => {
  return {
    type: SET_LIST,
    payload: { list },
  };
};

export const resetProforma = () => {
  return {
    type: RESET_PROFORMA,
  };
};

export function setProformaParameters(id) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session;
    const { company } = getState().company;
    dispatch(startLoader());
    try {
      const customerCount = await getCustomerListCount(token, companyId, "");
      const customerList = await getCustomerListPerPage(token, companyId, 1, ROWS_PER_CUSTOMER, "");
      const productCount = await getProductListCount(token, companyId, branchId, true, "", 1);
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, ROWS_PER_PRODUCT, "", 1);
      let companyEntity = company;
      if (companyEntity === null) {
        companyEntity = await getCompanyEntity(token, companyId);
        dispatch(setCompany(companyEntity));
      }
      dispatch(resetProforma());
      dispatch(setCustomer(defaultCustomer));
      dispatch(setCustomerListPage(1));
      dispatch(setCustomerListCount(customerCount));
      dispatch(setCustomerList(customerList));
      dispatch(setProductListPage(1));
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(productList));
      dispatch(setActiveSection(id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

export function getProduct(idProduct, filterType) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    const { company } = getState().company;
    const { customer } = getState().customer;
    const { rentTypeList } = getState().ui;
    dispatch(startLoader());
    try {
      const product = await getProductEntity(token, idProduct, 1);
      let price = product.PrecioVenta1;
      if (customer != null) price = getCustomerPrice(company, customer, product, rentTypeList);
      dispatch(filterProductList("", filterType));
      dispatch(setProformaAttributes({ description: product.Descripcion }));
      dispatch(setProformaAttributes({ quantity: 1 }));
      dispatch(setProformaAttributes({ price }));
      dispatch(setProduct(product));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setProformaAttributes({ description: "" }));
      dispatch(setProformaAttributes({ quantity: 1 }));
      dispatch(setProformaAttributes({ price: 0 }));
      dispatch(setMessage(error.message));
    }
  };
}

export function addDetails() {
  return async (dispatch, getState) => {
    const { rentTypeList } = getState().ui;
    const { company } = getState().company;
    const { customer } = getState().customer;
    const { product } = getState().product;
    const { detailsList, description, quantity, price } = getState().proforma;
    try {
      if (product != null && description !== "" && quantity > 0 && price > 0) {
        let newProducts = null;
        let tasaIva = getTaxeRateFromId(rentTypeList, product.IdImpuesto);
        if (tasaIva > 0 && customer.AplicaTasaDiferenciada)
          tasaIva = getTaxeRateFromId(rentTypeList, customer.IdImpuesto);
        let finalPrice = price;
        if (!company.PrecioVentaIncluyeIVA && tasaIva > 0) finalPrice = price * (1 + tasaIva / 100);
        const item = {
          IdProducto: product.IdProducto,
          Codigo: product.Codigo,
          Descripcion: description,
          Cantidad: quantity,
          PrecioVenta: finalPrice,
          Excento: tasaIva === 0,
          PrecioCosto: product.PrecioCosto,
          CostoInstalacion: 0,
          PorcentajeIVA: tasaIva,
        };
        const index = detailsList.findIndex(item => item.IdProducto === product.IdProducto);
        if (index >= 0) {
          newProducts = [
            ...detailsList.slice(0, index),
            { ...item, Cantidad: item.Cantidad + detailsList[index].Cantidad },
            ...detailsList.slice(index + 1),
          ];
        } else {
          newProducts = [...detailsList, item];
        }
        dispatch(setProformaAttributes({ details: newProducts }));
        const summary = getProductSummary(newProducts, customer.PorcentajeExoneracion);
        dispatch(setProformaAttributes({ summary }));
        dispatch(setProduct(null));
        dispatch(setProformaAttributes({ description: "" }));
        dispatch(setProformaAttributes({ quantity: 1 }));
        dispatch(setProformaAttributes({ price: 0 }));
      }
    } catch (error) {
      const message = error.message ? error.message : error;
      dispatch(setMessage(message));
    }
  };
}

export const removeDetails = id => {
  return (dispatch, getState) => {
    const { customer } = getState().customer;
    const { detailsList } = getState().proforma;
    const index = detailsList.findIndex(item => item.IdProducto === id);
    const newProducts = [...detailsList.slice(0, index), ...detailsList.slice(index + 1)];
    dispatch(setProformaAttributes({ details: newProducts }));
    const summary = getProductSummary(newProducts, customer.PorcentajeExoneracion);
    dispatch(setProformaAttributes({ summary }));
  };
};

export const saveProforma = () => {
  return async (dispatch, getState) => {
    const { token, userId, branchId } = getState().session;
    const { company } = getState().company;
    const { customer } = getState().customer;
    const { detailsList, summary, comment } = getState().proforma;
    dispatch(startLoader());
    try {
      const proformaId = await saveProformaEntity(
        token,
        userId,
        branchId,
        detailsList,
        company,
        customer,
        summary,
        comment
      );
      dispatch(setProformaAttributes({ proformaId, successful: true }));
      dispatch(setMessage("Transacción completada satisfactoriamente", "INFO"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
};

export const getProformaListFirstPage = id => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session;
    dispatch(startLoader());
    try {
      dispatch(setProformaListPage(1));
      const recordCount = await getProformaListCount(token, companyId, branchId, false);
      dispatch(setProformaListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProformaListPerPage(token, companyId, branchId, false, 1, 10);
        dispatch(setProformaList(newList));
      } else {
        dispatch(setProformaList([]));
      }
      if (id) dispatch(setActiveSection(id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
};

export const getProformaListByPageNumber = pageNumber => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session;
    dispatch(startLoader());
    try {
      const newList = await getProformaListPerPage(token, companyId, branchId, false, pageNumber, 10);
      dispatch(setProformaListPage(pageNumber));
      dispatch(setProformaList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
};

export const revokeProforma = proformaId => {
  return async (dispatch, getState) => {
    const { token, userId } = getState().session;
    const { list } = getState().proforma;
    dispatch(startLoader());
    try {
      await revokeProformaEntity(token, proformaId, userId);
      const newList = list.filter(item => item.IdProforma !== proformaId);
      dispatch(setProformaList(newList));
      dispatch(setMessage("Transacción completada satisfactoriamente", "INFO"));
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
};

export const generatePDF = (idInvoice, ref) => {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    dispatch(startLoader());
    try {
      await generateProformaPDF(token, idInvoice, ref);
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
};

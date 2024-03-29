import { ROWS_PER_PRODUCT } from "utils/constants";
import {
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  SET_PRODUCT,
  SET_PRODUCT_TYPE_LIST,
  SET_CATEGORY_LIST,
  SET_PROVIDER_LIST,
  SET_CLASIFICATION_LIST,
  SET_PRODUCT_ATTRIBUTE,
} from "./types";

import { startLoader, stopLoader, setActiveSection, setMessage } from "store/ui/actions";

import {
  getProductListCount,
  getProductListPerPage,
  getProductCategoryList,
  getProductProviderList,
  getProductClasificationList,
  getProductEntity,
  getProductClasification,
  saveProductEntity,
} from "utils/domainHelper";

export const setProductListPage = page => {
  return {
    type: SET_LIST_PAGE,
    payload: { page },
  };
};

export const setProductListCount = count => {
  return {
    type: SET_LIST_COUNT,
    payload: { count },
  };
};

export const setProductList = list => {
  return {
    type: SET_LIST,
    payload: { list },
  };
};

export const setProduct = product => {
  return {
    type: SET_PRODUCT,
    payload: { product },
  };
};

export const setProductTypeList = list => {
  return {
    type: SET_PRODUCT_TYPE_LIST,
    payload: { list },
  };
};

export const setCategoryList = list => {
  return {
    type: SET_CATEGORY_LIST,
    payload: { list },
  };
};

export const setProviderList = list => {
  return {
    type: SET_PROVIDER_LIST,
    payload: { list },
  };
};

export const setClasificationList = list => {
  return {
    type: SET_CLASIFICATION_LIST,
    payload: { list },
  };
};

export const setProductAttribute = (attribute, value) => {
  return {
    type: SET_PRODUCT_ATTRIBUTE,
    payload: { attribute, value },
  };
};

export const getProductListFirstPage = (id, filterText, type, rowsPerPage) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session;
    dispatch(startLoader());
    try {
      dispatch(setProductListPage(1));
      const recordCount = await getProductListCount(token, companyId, branchId, false, 1, filterText, type);
      dispatch(setProductListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProductListPerPage(
          token,
          companyId,
          branchId,
          false,
          1,
          rowsPerPage ?? ROWS_PER_PRODUCT,
          filterText,
          type
        );
        dispatch(setProductList(newList));
      } else {
        dispatch(setProductList([]));
      }
      if (id) dispatch(setActiveSection(id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
};

export const getProductListByPageNumber = (pageNumber, filterText, type, rowsPerPage) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session;
    dispatch(startLoader());
    try {
      const productList = await getProductListPerPage(
        token,
        companyId,
        branchId,
        false,
        pageNumber,
        rowsPerPage ?? ROWS_PER_PRODUCT,
        filterText,
        type
      );
      dispatch(setProductListPage(pageNumber));
      dispatch(setProductList(productList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
};

export function openProduct(idProduct) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session;
    dispatch(startLoader());
    try {
      let list = await getProductCategoryList(token, companyId);
      dispatch(setCategoryList(list));
      list = await getProductProviderList(token, companyId);
      dispatch(setProviderList(list));
      let product;
      if (idProduct) {
        product = await getProductEntity(token, idProduct, branchId);
      } else {
        product = {
          IdEmpresa: companyId,
          IdProducto: 0,
          Tipo: 1,
          IdLinea: "",
          Codigo: "",
          CodigoProveedor: "",
          CodigoClasificacion: "",
          IdProveedor: "",
          Descripcion: "",
          PrecioCosto: 0,
          PrecioVenta1: 0,
          PrecioVenta2: 0,
          PrecioVenta3: 0,
          PrecioVenta4: 0,
          PrecioVenta5: 0,
          IdImpuesto: 8,
          Observacion: "",
          Marca: "",
          Activo: true,
        };
      }
      dispatch(setProduct(product));
      dispatch(setActiveSection(23));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

export function filterProductList(text, type, rowsPerPage) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session;
    dispatch(startLoader());
    try {
      dispatch(setProductListPage(1));
      const productCount = await getProductListCount(token, companyId, branchId, true, text, type);
      const newList = await getProductListPerPage(
        token,
        companyId,
        branchId,
        true,
        1,
        rowsPerPage ?? ROWS_PER_PRODUCT,
        text,
        type
      );
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

export function filterClasificationList(text) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    dispatch(startLoader());
    try {
      const list = await getProductClasificationList(token, text);
      dispatch(setClasificationList(list));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

export function getProduct(idProduct) {
  return async (dispatch, getState) => {
    const { token, branchId } = getState().session;
    dispatch(startLoader());
    try {
      const product = await getProductEntity(token, idProduct, branchId);
      dispatch(setProduct(product));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setProduct(null));
      dispatch(setMessage(error.message));
    }
  };
}

export function validateProductCode(code) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    const { rentTypeList } = getState().ui;
    try {
      dispatch(setProductAttribute("CodigoClasificacion", code));
      if (code.length === 13) {
        dispatch(startLoader());
        const clasification = await getProductClasification(token, code);
        if (clasification) {
          let taxType = rentTypeList.find(elm => elm.Valor === clasification.Impuesto).Id;
          dispatch(setProductAttribute("IdImpuesto", taxType));
        } else {
          dispatch(
            setMessage(
              "El código CABYS ingresado no se encuentra registrado en el sistema. Por favor verifique su información. . ."
            )
          );
          dispatch(setProductAttribute("IdImpuesto", 8));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

export function saveProduct() {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    const { product } = getState().product;
    dispatch(startLoader());
    try {
      await saveProductEntity(token, product);
      dispatch(setMessage("Transacción completada satisfactoriamente", "INFO"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

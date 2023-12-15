import { createAsyncThunk } from "@reduxjs/toolkit";

import { ROWS_PER_PRODUCT } from "utils/constants";
import {
  setProductListPage,
  setProductListCount,
  setProductList,
  setProduct,
  setCategoryList,
  setProviderList,
  setClasificationList,
  setProductAttribute,
} from "state/product/reducer";
import {
  startLoader,
  stopLoader,
  setActiveSection,
  setMessage,
} from "state/ui/reducer";
import { RootState } from "state/store";

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
import { getErrorMessage } from "utils/utilities";
import { defaultProduct } from "utils/defaults";

export const getProductListFirstPage = createAsyncThunk(
  "product/getProductListFirstPage",
  async (
    payload: {
      id: number;
      filterText: string;
      type: number;
      rowsPerPage: number;
    },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      dispatch(setProductListPage(1));
      const recordCount = await getProductListCount(
        token,
        companyId,
        branchId,
        false,
        payload.filterText,
        payload.type
      );
      dispatch(setProductListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getProductListPerPage(
          token,
          companyId,
          branchId,
          false,
          1,
          payload.rowsPerPage ?? ROWS_PER_PRODUCT,
          payload.filterText,
          payload.type
        );
        dispatch(setProductList(newList));
      } else {
        dispatch(setProductList([]));
      }
      if (payload.id) dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const getProductListByPageNumber = createAsyncThunk(
  "product/getProductListByPageNumber",
  async (
    payload: {
      id: number;
      filterText: string;
      type: number;
      pageNumber: number;
      rowsPerPage: number;
    },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { token, companyId, branchId } = session;
    dispatch(startLoader());
    try {
      const productList = await getProductListPerPage(
        token,
        companyId,
        branchId,
        false,
        payload.pageNumber,
        payload.rowsPerPage ?? ROWS_PER_PRODUCT,
        payload.filterText,
        payload.type
      );
      dispatch(setProductListPage(payload.pageNumber));
      dispatch(setProductList(productList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { ui, session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    const { taxTypeList } = ui;
    dispatch(startLoader());
    try {
      let list = await getProductCategoryList(token, companyId);
      dispatch(setCategoryList(list));
      list = await getProductProviderList(token, companyId);
      dispatch(setProviderList(list));
      let product;
      if (payload.id) {
        product = await getProductEntity(
          token,
          payload.id,
          branchId,
          companyId,
          taxTypeList
        );
      } else {
        product = defaultProduct;
      }
      dispatch(setProduct(product));
      dispatch(setActiveSection(23));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const filterProductList = createAsyncThunk(
  "product/filterProductList",
  async (
    payload: { text: string; type: number; rowsPerPage?: number },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    dispatch(startLoader());
    try {
      dispatch(setProductListPage(1));
      const productCount = await getProductListCount(
        token,
        companyId,
        branchId,
        true,
        payload.text,
        payload.type
      );
      const newList = await getProductListPerPage(
        token,
        companyId,
        branchId,
        true,
        1,
        payload.rowsPerPage ?? ROWS_PER_PRODUCT,
        payload.text,
        payload.type
      );
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const filterClasificationList = createAsyncThunk(
  "product/filterClasificationList",
  async (payload: { text: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      const list = await getProductClasificationList(token, payload.text);
      dispatch(setClasificationList(list));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const validateProductCode = createAsyncThunk(
  "product/validateCustomerIdentifier",
  async (payload: { code: string }, { getState, dispatch }) => {
    const { session, ui } = getState() as RootState;
    const { token } = session;
    const { taxTypeList } = ui;
    try {
      dispatch(setProductAttribute({ attribute: "code", value: payload.code }));
      if (payload.code.length === 13) {
        dispatch(startLoader());
        const clasification = await getProductClasification(
          token,
          payload.code
        );
        if (clasification != null) {
          const taxTypeId = taxTypeList?.find(
            (elm) => elm.value === clasification?.value
          );
          dispatch(
            setProductAttribute({
              attribute: "taxTypeId",
              value: taxTypeId?.id,
            })
          );
        } else {
          dispatch(
            setMessage(
              "El código CABYS ingresado no se encuentra registrado en el sistema. Por favor verifique su información. . ."
            )
          );
          dispatch(setProductAttribute({ attribute: "taxTypeId", value: 8 }));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const saveProduct = createAsyncThunk(
  "product/saveProduct",
  async (_payload, { getState, dispatch }) => {
    const { product, session } = getState() as RootState;
    const { token } = session;
    const { entity: productEntity } = product;
    dispatch(startLoader());
    try {
      await saveProductEntity(token, productEntity);
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
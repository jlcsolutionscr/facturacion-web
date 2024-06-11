import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  openProductDialog,
  setCategoryList,
  setClasificationList,
  setProductAttribute,
  setProductList,
  setProductListCount,
  setProductListPage,
  setProviderList,
} from "state/product/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { defaultProduct } from "utils/defaults";
import {
  getProductCategoryList,
  getProductClasification,
  getProductClasificationList,
  getProductEntity,
  getProductListCount,
  getProductListPerPage,
  getProductProviderList,
  saveProductEntity,
} from "utils/domainHelper";
import { getErrorMessage } from "utils/utilities";

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
          payload.rowsPerPage,
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
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getProductListByPageNumber = createAsyncThunk(
  "product/getProductListByPageNumber",
  async (
    payload: {
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
        payload.rowsPerPage,
        payload.filterText,
        payload.type
      );
      dispatch(setProductListPage(payload.pageNumber));
      dispatch(setProductList(productList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const openProduct = createAsyncThunk(
  "product/openProduct",
  async (payload: { id?: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    dispatch(startLoader());
    try {
      let list = await getProductCategoryList(token, companyId);
      dispatch(setCategoryList(list));
      list = await getProductProviderList(token, companyId);
      dispatch(setProviderList(list));
      let product;
      if (payload.id) {
        product = await getProductEntity(token, payload.id, branchId);
      } else {
        product = defaultProduct;
      }
      dispatch(openProductDialog(product));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const filterProductList = createAsyncThunk(
  "product/filterProductList",
  async (payload: { filterText: string; type: number; rowsPerPage: number }, { getState, dispatch }) => {
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
        payload.filterText,
        payload.type
      );
      const newList = await getProductListPerPage(
        token,
        companyId,
        branchId,
        true,
        1,
        payload.rowsPerPage,
        payload.filterText,
        payload.type
      );
      dispatch(setProductListCount(productCount));
      dispatch(setProductList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const filterClasificationList = createAsyncThunk(
  "product/filterClasificationList",
  async (payload: { filterText: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    try {
      const list = await getProductClasificationList(token, payload.filterText);
      dispatch(setClasificationList(list));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const validateProductCode = createAsyncThunk(
  "product/validateProductCode",
  async (payload: { code: string }, { getState, dispatch }) => {
    const { session, ui } = getState() as RootState;
    const { token } = session;
    const { taxTypeList } = ui;
    try {
      dispatch(setProductAttribute({ attribute: "code", value: payload.code }));
      if (payload.code.length === 13) {
        dispatch(startLoader());
        const clasification = await getProductClasification(token, payload.code);
        if (clasification != null) {
          const taxTypeId = taxTypeList?.find(elm => elm.Valor === clasification?.value);
          dispatch(
            setProductAttribute({
              attribute: "IdImpuesto",
              value: taxTypeId?.Id,
            })
          );
        } else {
          dispatch(
            setMessage(
              "El código CABYS ingresado no se encuentra registrado en el sistema. Por favor verifique su información. . ."
            )
          );
          dispatch(setProductAttribute({ attribute: "IdImpuesto", value: 8 }));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const saveProduct = createAsyncThunk("product/saveProduct", async (_payload, { getState, dispatch }) => {
  const { product, session } = getState() as RootState;
  const { token, companyId } = session;
  const { entity } = product;
  dispatch(startLoader());
  try {
    const productEntity = { ...entity, IdEmpresa: companyId };
    await saveProductEntity(token, productEntity);
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
});

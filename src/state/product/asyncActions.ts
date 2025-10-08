import { createAsyncThunk } from "@reduxjs/toolkit";

import { setProductDetails as setInvoiceProduct } from "state/invoice/reducer";
import {
  setCategoryList,
  setClasificationList,
  setProduct,
  setProductAttribute,
  setProductList,
  setProductListCount,
  setProductListPage,
  setProviderList,
} from "state/product/reducer";
import { setProductDetails as setProformaProduct } from "state/proforma/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { setProductDetails as setWorkingOrderProduct } from "state/working-order/reducer";
import { FORM_TYPE } from "utils/constants";
import { defaultProduct, defaultProductDetails } from "utils/defaults";
import {
  getCustomerPrice,
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
    if (payload.id) dispatch(setActiveSection(payload.id));
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
    dispatch(setActiveSection(13));
    try {
      let product = {
        ...defaultProduct,
        IdEmpresa: companyId,
      };
      dispatch(setProduct(product));
      const categoryList = await getProductCategoryList(token, companyId);
      dispatch(setCategoryList(categoryList));
      const providerlist = await getProductProviderList(token, companyId);
      dispatch(setProviderList(providerlist));
      product = {
        ...product,
        IdLinea: categoryList[0].Id,
      };
      if (payload.id) {
        product = await getProductEntity(token, payload.id, branchId);
      }
      dispatch(setProduct(product));
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
    const { taxTypeList } = ui;
    try {
      dispatch(setProductAttribute({ attribute: "CodigoClasificacion", value: payload.code }));
      if (payload.code.length === 13) {
        dispatch(startLoader());
        const codeEntity = await getProductClasification(session.token, payload.code);
        if (codeEntity) {
          const taxTypeId = taxTypeList?.find(elm => elm.Valor === codeEntity.value);
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

export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (payload: { id: number; type: string }, { getState, dispatch }) => {
    const { session, invoice, ui } = getState() as RootState;
    const { token, branchId, company } = session;
    const { taxTypeList } = ui;
    if (company) {
      dispatch(startLoader());
      const action =
        payload.type === FORM_TYPE.INVOICE
          ? setInvoiceProduct
          : payload.type === FORM_TYPE.PROFORMA
            ? setProformaProduct
            : setWorkingOrderProduct;
      try {
        const product = await getProductEntity(token, payload.id, branchId);
        if (product) {
          const { price, taxRate } = getCustomerPrice(
            invoice.entity.customerDetails.priceTypeId,
            product,
            company.PrecioVentaIncluyeIVA,
            taxTypeList
          );
          dispatch(
            action({
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
        dispatch(stopLoader());
        dispatch(action(defaultProductDetails));
        dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      }
    }
  }
);

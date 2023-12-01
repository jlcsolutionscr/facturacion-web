import {
  SET_ISSUER_DETAILS,
  SET_PRODUCT_DETAILS,
  SET_DETAILS_LIST,
  SET_SUMMARY,
  SET_EXONERATION_DETAILS,
  SET_ACTIVITY_CODE,
  SET_SUCCESSFUL,
  RESET_RECEIPT,
} from "./types";

import { startLoader, stopLoader, setActiveSection, setMessage } from "store/ui/actions";

import {
  getCompanyEntity,
  getProductSummary,
  getCustomerByIdentifier,
  getProductClasification,
  saveReceiptEntity,
} from "utils/domainHelper";

import { setCompany } from "store/company/actions";

import { roundNumber } from "utils/utilities";

export const setIssuerDetails = (attribute, value) => {
  return {
    type: SET_ISSUER_DETAILS,
    payload: { attribute, value },
  };
};

export const setProductDetails = (attribute, value) => {
  return {
    type: SET_PRODUCT_DETAILS,
    payload: { attribute, value },
  };
};

export const setDetailsList = details => {
  return {
    type: SET_DETAILS_LIST,
    payload: { details },
  };
};

export const setSummary = summary => {
  return {
    type: SET_SUMMARY,
    payload: { summary },
  };
};

export const setExonerationDetails = (attribute, value) => {
  return {
    type: SET_EXONERATION_DETAILS,
    payload: { attribute, value },
  };
};

export const setActivityCode = code => {
  return {
    type: SET_ACTIVITY_CODE,
    payload: { code },
  };
};

export const setSuccessful = () => {
  return {
    type: SET_SUCCESSFUL,
  };
};

export const resetReceipt = () => {
  return {
    type: RESET_RECEIPT,
  };
};

export function setReceiptParameters(id) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session;
    const { company } = getState().company;
    dispatch(startLoader());
    try {
      let companyEntity = company;
      if (companyEntity === null) {
        companyEntity = await getCompanyEntity(token, companyId);
        dispatch(setCompany(companyEntity));
      }
      dispatch(resetReceipt());
      dispatch(setActivityCode(companyEntity.ActividadEconomicaEmpresa[0].CodigoActividad));
      dispatch(setActiveSection(id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

export function validateCustomerIdentifier(identifier) {
  return async (dispatch, getState) => {
    const { token, companyId } = getState().session;
    const { issuer } = getState().receipt;
    try {
      dispatch(setIssuerDetails("id", identifier));
      if (issuer.idType === 0 && identifier.length === 9) {
        dispatch(startLoader());
        const customer = await getCustomerByIdentifier(token, companyId, identifier);
        if (customer) {
          dispatch(setIssuerDetails("name", customer.Nombre));
        } else {
          dispatch(setIssuerDetails("name", ""));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setIssuerDetails("name", ""));
      dispatch(setMessage(error.message));
    }
  };
}

export function validateProductCode(code) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    const { rentTypeList } = getState().ui;
    try {
      dispatch(setProductDetails("code", code));
      if (code.length === 13) {
        dispatch(startLoader());
        const clasification = await getProductClasification(token, code);
        if (clasification) {
          let taxType = rentTypeList.find(elm => elm.Valor === clasification.Impuesto).Id;
          dispatch(setProductDetails("taxType", taxType));
        } else {
          dispatch(
            setMessage(
              "El código CABYS ingresado no se encuentra registrado en el sistema. Por favor verifique su información. . ."
            )
          );
          dispatch(setProductDetails("taxType", 8));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
}

export function addDetails() {
  return (dispatch, getState) => {
    const { rentTypeList } = getState().ui;
    const { exoneration, product, detailsList } = getState().receipt;
    try {
      if (
        product != null &&
        product.code &&
        product.taxType &&
        product.description !== "" &&
        product.quantity > 0 &&
        product.price > 0
      ) {
        let newProducts = null;
        let taxParam = rentTypeList.find(elm => elm.Id === product.taxType).Valor;
        const item = {
          Cantidad: product.quantity,
          Codigo: product.code,
          Descripcion: product.description,
          IdImpuesto: product.taxType,
          PorcentajeIVA: taxParam,
          UnidadMedida: product.unit,
          PrecioVenta: roundNumber(product.price * (1 + taxParam / 100), 2),
        };
        newProducts = [...detailsList, item];
        dispatch(setDetailsList(newProducts));
        const summary = getProductSummary(newProducts, exoneration.percentage);
        dispatch(setSummary(summary));
        dispatch(setProductDetails("code", ""));
        dispatch(setProductDetails("description", ""));
        dispatch(setProductDetails("taxType", 8));
        dispatch(setProductDetails("unit", "UND"));
        dispatch(setProductDetails("quantity", 1));
        dispatch(setProductDetails("price", 0));
      }
    } catch (error) {
      const message = error.message ? error.message : error;
      dispatch(setMessage(message));
    }
  };
}

export const removeDetails = id => {
  return (dispatch, getState) => {
    const { exoneration, detailsList } = getState().receipt;
    const index = detailsList.findIndex(item => item.IdProducto === id);
    const newProducts = [...detailsList.slice(0, index), ...detailsList.slice(index + 1)];
    dispatch(setDetailsList(newProducts));
    const summary = getProductSummary(newProducts, exoneration.percentage);
    dispatch(setSummary(summary));
  };
};

export const saveReceipt = () => {
  return async (dispatch, getState) => {
    const { token, userId, branchId } = getState().session;
    const { company } = getState().company;
    const { activityCode, issuer, exoneration, detailsList, summary } = getState().receipt;
    dispatch(startLoader());
    try {
      await saveReceiptEntity(
        token,
        userId,
        branchId,
        activityCode,
        company,
        issuer,
        exoneration,
        detailsList,
        summary
      );
      dispatch(setSuccessful(true));
      dispatch(setMessage("Transacción completada satisfactoriamente", "INFO"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setMessage(error.message));
    }
  };
};

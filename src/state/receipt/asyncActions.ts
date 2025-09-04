import { createAsyncThunk } from "@reduxjs/toolkit";

import { setAvailableEconomicActivityList } from "state/company/reducer";
import {
  resetProductDetails,
  resetReceipt,
  setActivityCode,
  setIssuerDetails,
  setProductDetails,
  setProductDetailsList,
  setSuccessful,
  setSummary,
} from "state/receipt/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { getCustomerData, getProductClasification, getProductSummary, saveReceiptEntity } from "utils/domainHelper";
import { getErrorMessage, getIdFromRateValue, roundNumber } from "utils/utilities";

export const setReceiptParameters = createAsyncThunk(
  "receipt/setReceiptParameters",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { company } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(payload.id));
    try {
      dispatch(resetReceipt());
      dispatch(setActivityCode(company?.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const validateCustomerIdentifier = createAsyncThunk(
  "receipt/validateCustomerIdentifier",
  async (payload: { identifier: string }, { getState, dispatch }) => {
    const { receipt } = getState() as RootState;
    const { issuer } = receipt.entity;
    try {
      dispatch(setIssuerDetails({ attribute: "id", value: payload.identifier }));
      if (
        (issuer.typeId === 0 && payload.identifier.length === 9) ||
        (issuer.typeId === 1 && payload.identifier.length === 10) ||
        (issuer.typeId > 1 && payload.identifier.length >= 11)
      ) {
        dispatch(startLoader());
        const customerData = await getCustomerData(payload.identifier);
        const availableEconomicActivityList = customerData.actividades.map(
          (actividad: { codigo: string; descripcion: string }) => ({
            Id: parseInt(actividad.codigo),
            Descripcion: `${actividad.codigo} - ${actividad.descripcion}`,
          })
        );
        dispatch(setAvailableEconomicActivityList(availableEconomicActivityList));
        dispatch(setIssuerDetails({ attribute: "name", value: customerData.nombre }));
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(setIssuerDetails({ attribute: "name", value: "" }));
      dispatch(stopLoader());
    }
  }
);

export const validateProductCode = createAsyncThunk(
  "receipt/validateProductCode",
  async (payload: { code: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    try {
      dispatch(setProductDetails({ attribute: "code", value: payload.code }));
      if (payload.code.length === 13) {
        dispatch(startLoader());
        const codeEntity = await getProductClasification(session.token, payload.code);
        if (codeEntity) {
          dispatch(setProductDetails({ attribute: "taxRate", value: codeEntity.value }));
          dispatch(setProductDetails({ attribute: "description", value: codeEntity.description }));
        } else {
          dispatch(
            setMessage(
              "El código CABYS ingresado no se encuentra registrado en el sistema. Por favor verifique su información. . ."
            )
          );
          dispatch(setProductDetails({ attribute: "taxRate", value: 13 }));
          dispatch(setProductDetails({ attribute: "description", value: "" }));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const addDetails = createAsyncThunk("receipt/addDetails", async (_payload, { getState, dispatch }) => {
  const { receipt, session, ui } = getState() as RootState;
  const { company } = session;
  const { taxTypeList } = ui;
  const { exoneration, productDetails, productDetailsList } = receipt.entity;
  if (
    company &&
    productDetails.code !== "" &&
    productDetails.description !== "" &&
    productDetails.quantity > 0 &&
    productDetails.price > 0
  ) {
    if (productDetailsList.findIndex(item => item.code === productDetails.code) >= 0) {
      dispatch(
        setMessage({
          message: "El próducto o servicio ya está agregado al detalle!",
        })
      );
    } else {
      const item = {
        id: crypto.randomUUID(),
        code: productDetails.code,
        description: productDetails.description,
        quantity: productDetails.quantity,
        taxRateType: getIdFromRateValue(taxTypeList, productDetails.taxRate),
        taxRate: productDetails.taxRate,
        unit: "UND",
        price: productDetails.price,
        pricePlusTaxes: roundNumber(productDetails.price * (1 + productDetails.taxRate / 100), 2),
        costPrice: 0,
        disccountRate: 0,
      };
      const newProducts = [...productDetailsList, item];
      dispatch(setProductDetailsList(newProducts));
      const summary = getProductSummary(newProducts, exoneration.percentage);
      dispatch(setSummary(summary));
      dispatch(resetProductDetails());
    }
  }
});

export const removeDetails = createAsyncThunk(
  "receipt/removeDetails",
  async (payload: { id: string }, { getState, dispatch }) => {
    const { receipt } = getState() as RootState;
    const { exoneration, productDetailsList } = receipt.entity;
    const index = productDetailsList.findIndex(item => item.id === payload.id);
    const newProducts = [...productDetailsList.slice(0, index), ...productDetailsList.slice(index + 1)];
    dispatch(setProductDetailsList(newProducts));
    const summary = getProductSummary(newProducts, exoneration.percentage);
    dispatch(setSummary(summary));
  }
);

export const saveReceipt = createAsyncThunk("receipt/saveReceipt", async (_payload, { getState, dispatch }) => {
  const { session, receipt } = getState() as RootState;
  const { token, userId, branchId, companyId } = session;
  if (companyId) {
    dispatch(startLoader());
    try {
      await saveReceiptEntity(token, userId, branchId, companyId, receipt.entity);
      dispatch(setSuccessful());
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
});

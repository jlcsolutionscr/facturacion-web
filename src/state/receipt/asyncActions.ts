import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "state/store";
import {
  setIssuerDetails,
  resetProductDetail,
  setProductDetails,
  setProductList,
  setSummary,
  setActivityCode,
  setSuccessful,
  resetReceipt,
} from "state/receipt/reducer";
import {
  startLoader,
  stopLoader,
  setActiveSection,
  setMessage,
} from "state/ui/reducer";
import {
  getProductSummary,
  getCustomerByIdentifier,
  getProductClasification,
  saveReceiptEntity,
} from "utils/domainHelper";

import { getErrorMessage, roundNumber } from "utils/utilities";

export const setReceiptParameters = createAsyncThunk(
  "receipt/setReceiptParameters",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { company } = session;
    dispatch(startLoader());
    try {
      dispatch(resetReceipt());
      dispatch(
        setActivityCode(company?.ActividadEconomicaEmpresa[0].CodigoActividad)
      );
      dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const validateCustomerIdentifier = createAsyncThunk(
  "receipt/validateCustomerIdentifier",
  async (payload: { identifier: string }, { getState, dispatch }) => {
    const { session, receipt } = getState() as RootState;
    const { token, companyId } = session;
    const { issuer } = receipt.entity;
    try {
      dispatch(
        setIssuerDetails({ attribute: "id", value: payload.identifier })
      );
      if (issuer.typeId === 0 && payload.identifier.length === 9) {
        dispatch(startLoader());
        const customer = await getCustomerByIdentifier(
          token,
          companyId,
          payload.identifier
        );
        if (customer) {
          dispatch(
            setIssuerDetails({ attribute: "name", value: customer.name })
          );
        } else {
          dispatch(setIssuerDetails({ attribute: "name", value: "" }));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(setIssuerDetails({ attribute: "name", value: "" }));
      dispatch(stopLoader());
    }
  }
);

export const validateProductCode = createAsyncThunk(
  "receipt/validateCustomerIdentifier",
  async (payload: { code: string }, { getState, dispatch }) => {
    const { session, ui } = getState() as RootState;
    const { token } = session;
    const { taxTypeList } = ui;
    try {
      dispatch(setProductDetails({ attribute: "code", value: payload.code }));
      if (payload.code.length === 13) {
        dispatch(startLoader());
        const clasification = await getProductClasification(
          token,
          payload.code
        );
        if (clasification != null) {
          const taxType = taxTypeList?.find(
            (elm) => elm.value === clasification?.value
          );
          dispatch(
            setProductDetails({ attribute: "taxTypeId", value: taxType?.id })
          );
        } else {
          dispatch(
            setMessage(
              "El código CABYS ingresado no se encuentra registrado en el sistema. Por favor verifique su información. . ."
            )
          );
          dispatch(setProductDetails({ attribute: "taxTypeId", value: 8 }));
        }
        dispatch(stopLoader());
      }
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const addDetails = createAsyncThunk(
  "receipt/addDetails",
  async (_payload, { getState, dispatch }) => {
    const { receipt } = getState() as RootState;
    const { exoneration, productDetails, productDetailList } = receipt.entity;
    if (
      productDetails.code !== "" &&
      productDetails.description !== "" &&
      productDetails.quantity > 0 &&
      productDetails.price > 0
    ) {
      if (
        productDetailList.findIndex(
          (item) => item.code === productDetails.code
        ) >= 0
      ) {
        dispatch(
          setMessage({
            message: "El próducto o servicio ya está agregado al detalle!",
          })
        );
      } else {
        let newProducts = null;
        const item = {
          quantity: productDetails.quantity,
          code: productDetails.code,
          description: productDetails.description,
          taxRate: productDetails.taxRate,
          unit: "UND",
          price: roundNumber(
            (productDetails.price * (1 + productDetails.taxRate)) / 100,
            2
          ),
        };
        newProducts = [...productDetailList, item];
        dispatch(setProductList(newProducts));
        const summary = getProductSummary(newProducts, exoneration.percentage);
        dispatch(setSummary(summary));
        dispatch(resetProductDetail());
      }
    }
  }
);

export const removeDetails = createAsyncThunk(
  "receipt/removeDetails",
  async (payload: { code: string }, { getState, dispatch }) => {
    const { receipt } = getState() as RootState;
    const { exoneration, productDetailList } = receipt.entity;
    const index = productDetailList.findIndex(
      (item) => item.code === payload.code
    );
    const newProducts = [
      ...productDetailList.slice(0, index),
      ...productDetailList.slice(index + 1),
    ];
    dispatch(setProductList(newProducts));
    const summary = getProductSummary(newProducts, exoneration.percentage);
    dispatch(setSummary(summary));
  }
);

export const saveReceipt = createAsyncThunk(
  "receipt/saveReceipt",
  async (_payload, { getState, dispatch }) => {
    const { session, receipt } = getState() as RootState;
    const { token, userId, branchId, company } = session;
    if (company) {
      dispatch(startLoader());
      try {
        await saveReceiptEntity(
          token,
          userId,
          branchId,
          company,
          receipt.entity
        );
        dispatch(setSuccessful());
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
  }
);

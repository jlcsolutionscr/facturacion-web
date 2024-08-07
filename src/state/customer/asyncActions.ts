import { CustomerType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  resetCustomer,
  setCustomer,
  setCustomerAttribute,
  setCustomerList,
  setCustomerListCount,
  setCustomerListPage,
} from "state/customer/reducer";
import { setCustomerDetails as setInvoiceCustomer } from "state/invoice/reducer";
import { setCustomerDetails as setProformaCustomer } from "state/proforma/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { setCustomerDetails as setWorkingOrderCustomer } from "state/working-order/reducer";
import { FORM_TYPE } from "utils/constants";
import { defaultCustomer, defaultCustomerDetails } from "utils/defaults";
import {
  getCustomerByIdentifier,
  getCustomerEntity,
  getCustomerListCount,
  getCustomerListPerPage,
  saveCustomerEntity,
} from "utils/domainHelper";
import { getErrorMessage } from "utils/utilities";

export const getCustomerListFirstPage = createAsyncThunk(
  "customer/getCustomerListFirstPage",
  async (payload: { id: number; filterText: string; rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    if (payload.id) dispatch(setActiveSection(payload.id));
    dispatch(startLoader());
    try {
      dispatch(setCustomerListPage(1));
      const recordCount = await getCustomerListCount(token, companyId, payload.filterText);
      dispatch(setCustomerListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getCustomerListPerPage(token, companyId, 1, payload.rowsPerPage, payload.filterText);
        dispatch(setCustomerList(newList));
      } else {
        dispatch(setCustomerList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getCustomerListByPageNumber = createAsyncThunk(
  "customer/getCustomerListByPageNumber",
  async (payload: { filterText: string; pageNumber: number; rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    try {
      const newList = await getCustomerListPerPage(
        token,
        companyId,
        payload.pageNumber,
        payload.rowsPerPage,
        payload.filterText
      );
      dispatch(setCustomerListPage(payload.pageNumber));
      dispatch(setCustomerList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const openCustomer = createAsyncThunk(
  "customer/openCustomer",
  async (payload: { idCustomer?: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    dispatch(setActiveSection(11));
    try {
      let customer = { ...defaultCustomer, IdEmpresa: companyId };
      dispatch(setCustomer(customer));
      if (payload.idCustomer) {
        customer = await getCustomerEntity(token, payload.idCustomer);
        dispatch(setCustomer(customer));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const validateCustomerIdentifier = createAsyncThunk(
  "customer/validateCustomerIdentifier",
  async (payload: { identifier: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    try {
      const customer: CustomerType = await getCustomerByIdentifier(token, companyId, payload.identifier);
      if (customer) {
        if (customer.IdCliente > 0) {
          dispatch(setMessage("Ya existe un cliente con la identificación ingresada"));
        } else {
          dispatch(
            setCustomerAttribute({
              attribute: "Nombre",
              value: customer.Nombre,
            })
          );
        }
      } else {
        dispatch(setCustomerAttribute({ attribute: "Nombre", value: "" }));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setCustomerAttribute({ attribute: "Nombre", value: "" }));
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const saveCustomer = createAsyncThunk("customer/saveCustomer", async (_payload, { getState, dispatch }) => {
  const { session, customer } = getState() as RootState;
  const { token } = session;
  const { entity: customerEntity } = customer;
  dispatch(startLoader());
  try {
    await saveCustomerEntity(token, customerEntity);
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

export const getCustomer = createAsyncThunk(
  "customer/getCustomer",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    dispatch(resetCustomer());
    try {
      const customer = await getCustomerEntity(token, payload.id);
      dispatch(setCustomer(customer));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const filterCustomerList = createAsyncThunk(
  "customer/filterCustomerList",
  async (payload: { filterText: string; rowsPerPage: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    try {
      dispatch(setCustomerListPage(1));
      const recordCount = await getCustomerListCount(token, companyId, payload.filterText);
      dispatch(setCustomerListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getCustomerListPerPage(token, companyId, 1, payload.rowsPerPage, payload.filterText);
        dispatch(setCustomerList(newList));
      } else {
        dispatch(setCustomerList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const getCustomerDetails = createAsyncThunk(
  "customer/getCustomerDetails",
  async (payload: { id: number; type: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token } = session;
    dispatch(startLoader());
    const action =
      payload.type === FORM_TYPE.INVOICE
        ? setInvoiceCustomer
        : payload.type === FORM_TYPE.PROFORMA
        ? setProformaCustomer
        : setWorkingOrderCustomer;
    try {
      const customer = await getCustomerEntity(token, payload.id);
      dispatch(
        action({
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
        })
      );
      dispatch(stopLoader());
    } catch (error) {
      dispatch(action(defaultCustomerDetails));
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

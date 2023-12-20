import { createAsyncThunk } from "@reduxjs/toolkit";

import { ROWS_PER_CUSTOMER } from "utils/constants";
import {
  setCustomerListPage,
  setCustomerListCount,
  setCustomerList,
  setCustomer,
  setCustomerAttribute,
  resetCustomer,
} from "state/customer/reducer";
import {
  startLoader,
  stopLoader,
  setActiveSection,
  setMessage,
} from "state/ui/reducer";
import {
  getCustomerListCount,
  getCustomerListPerPage,
  getCustomerEntity,
  getCustomerByIdentifier,
  saveCustomerEntity,
} from "utils/domainHelper";
import { RootState } from "state/store";
import { getErrorMessage } from "utils/utilities";
import { CustomerType } from "types/domain";

export const getCustomerListFirstPage = createAsyncThunk(
  "customer/getCustomerListFirstPage",
  async (
    payload: { id: number; filterText: string; rowsPerPage: number },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    try {
      dispatch(setCustomerListPage(1));
      const recordCount = await getCustomerListCount(
        token,
        companyId,
        payload.filterText
      );
      dispatch(setCustomerListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getCustomerListPerPage(
          token,
          companyId,
          1,
          payload.rowsPerPage ?? ROWS_PER_CUSTOMER,
          payload.filterText
        );
        dispatch(setCustomerList(newList));
      } else {
        dispatch(setCustomerList([]));
      }
      if (payload.id) dispatch(setActiveSection(payload.id));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const getCustomerListByPageNumber = createAsyncThunk(
  "customer/getCustomerListByPageNumber",
  async (
    payload: { filterText: string; pageNumber: number; rowsPerPage?: number },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    try {
      const newList = await getCustomerListPerPage(
        token,
        companyId,
        payload.pageNumber,
        payload.rowsPerPage ?? ROWS_PER_CUSTOMER,
        payload.filterText
      );
      dispatch(setCustomerListPage(payload.pageNumber));
      dispatch(setCustomerList(newList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const openCustomer = createAsyncThunk(
  "customer/openCustomer",
  async (payload: { idCustomer: number }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    try {
      let customer;
      if (payload.idCustomer) {
        customer = await getCustomerEntity(token, payload.idCustomer);
      } else {
        customer = {
          IdCliente: 0,
          IdEmpresa: companyId,
          IdTipoIdentificacion: 0,
          Identificacion: "",
          Nombre: "",
          NombreComercial: "",
          Direccion: "",
          Telefono: "",
          Fax: "",
          CorreoElectronico: "",
          IdTipoPrecio: 1,
          AplicaTasaDiferenciada: false,
          IdImpuesto: 8,
          IdTipoExoneracion: 1,
          NumDocExoneracion: "",
          NombreInstExoneracion: "",
          FechaEmisionDoc: "01/01/2000",
          PorcentajeExoneracion: 0,
        };
      }
      dispatch(setCustomer(customer));
      dispatch(setActiveSection(22));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
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
      const customer: CustomerType = await getCustomerByIdentifier(
        token,
        companyId,
        payload.identifier
      );
      if (customer) {
        if (customer.IdCliente > 0) {
          dispatch(
            setMessage("Ya existe un cliente con la identificación ingresada")
          );
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
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const saveCustomer = createAsyncThunk(
  "customer/saveCustomer",
  async (_payload, { getState, dispatch }) => {
    const { session, customer } = getState() as RootState;
    const { token } = session;
    const { entity: customerEntity } = customer;
    dispatch(startLoader());
    try {
      await saveCustomerEntity(token, customerEntity);
      dispatch(
        setMessage({
          error: "Transacción completada satisfactoriamente",
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
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const filterCustomerList = createAsyncThunk(
  "customer/filterCustomerList",
  async (
    payload: { filterText: string; rowsPerPage?: number },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    try {
      dispatch(setCustomerListPage(1));
      const recordCount = await getCustomerListCount(
        token,
        companyId,
        payload.filterText
      );
      dispatch(setCustomerListCount(recordCount));
      if (recordCount > 0) {
        const newList = await getCustomerListPerPage(
          token,
          companyId,
          1,
          payload.rowsPerPage ?? ROWS_PER_CUSTOMER,
          payload.filterText
        );
        dispatch(setCustomerList(newList));
      } else {
        dispatch(setCustomerList([]));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

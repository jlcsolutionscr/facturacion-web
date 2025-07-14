import { CustomerType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setAvailableEconomicActivityList } from "state/company/reducer";
import { setCustomer, setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
import { setCustomerDetails as setInvoiceCustomer } from "state/invoice/reducer";
import { setCustomerDetails as setProformaCustomer } from "state/proforma/reducer";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { setCustomerDetails as setWorkingOrderCustomer } from "state/working-order/reducer";
import { FORM_TYPE } from "utils/constants";
import { defaultCustomer, defaultCustomerDetails } from "utils/defaults";
import {
  getCustomerByIdentifier,
  getCustomerData,
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
      dispatch(setAvailableEconomicActivityList([]));
      if (payload.idCustomer) {
        customer = await getCustomerEntity(token, payload.idCustomer);
        const customerData = await getCustomerData(customer.Identificacion);
        const availableEconomicActivityList = customerData.actividades.map(
          (actividad: { codigo: string; descripcion: string }) => ({
            Id: parseInt(actividad.codigo),
            Descripcion: actividad.descripcion,
          })
        );
        dispatch(setCustomer(customer));
        dispatch(setAvailableEconomicActivityList(availableEconomicActivityList));
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
  async (payload: { idType: number; identifier: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { token, companyId } = session;
    dispatch(startLoader());
    dispatch(setAvailableEconomicActivityList([]));
    try {
      const customerData = await getCustomerData(payload.identifier);
      console.log("Data", customerData);
      const availableEconomicActivityList = customerData.actividades.map(
        (actividad: { codigo: string; descripcion: string }) => ({
          Id: parseInt(actividad.codigo),
          Descripcion: actividad.descripcion,
        })
      );
      dispatch(setAvailableEconomicActivityList(availableEconomicActivityList));
      const customer: CustomerType = await getCustomerByIdentifier(token, companyId, payload.identifier);
      if (customer?.IdCliente > 0) {
        dispatch(setCustomer(customer));
        dispatch(setMessage({ message: "Ya existe un cliente con la identificación ingresada. . ." }));
      } else {
        dispatch(
          setCustomer({
            ...defaultCustomer,
            IdTipoIdentificacion: payload.idType,
            Identificacion: payload.identifier,
            Nombre: customerData.nombre,
          })
        );
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: "No se logró obtener información del cliente. . .", type: "ERROR" }));
      dispatch(
        setCustomer({
          ...defaultCustomer,
          IdTipoIdentificacion: payload.idType,
          Identificacion: payload.identifier,
        })
      );
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
          activityCode: customer.CodigoActividad,
          exonerationType: customer.IdTipoExoneracion,
          exonerationRef: customer.NumDocExoneracion,
          exonerationRef2: customer.ArticuloExoneracion,
          exonerationRef3: customer.IncisoExoneracion,
          exoneratedById: customer.IdNombreInstExoneracion,
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

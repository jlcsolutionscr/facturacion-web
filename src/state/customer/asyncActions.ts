import { CustomerEntityType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setAvailableEconomicActivityList } from "state/company/reducer";
import { setCustomer, setCustomerList, setCustomerListCount, setCustomerListPage } from "state/customer/reducer";
import { selectCustomer as setInvoiceCustomer } from "state/invoice/asyncActions";
import { selectCustomer as setProformaCustomer } from "state/proforma/asyncActions";
import { RootState } from "state/store";
import { setActiveSection, setMessage, startLoader, stopLoader } from "state/ui/reducer";
import { selectCustomer as setWorkingOrderCustomer } from "state/working-order/asyncActions";
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
        payload.rowsPerPage - 1,
        payload.filterText
      );
      dispatch(setCustomerListPage(payload.pageNumber));
      dispatch(setCustomerList([{ Id: 1, Descripcion: "CLIENTE DE CONTADO" }, ...newList]));
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
    const { token } = session;
    dispatch(setActiveSection(12));
    dispatch(startLoader());
    try {
      if (payload.idCustomer) {
        const customer = await getCustomerEntity(token, payload.idCustomer);
        if (!customer) {
          dispatch(setMessage({ message: "El cliente que intenta acceder con existe", type: "ERROR" }));
          dispatch(stopLoader());
          return;
        }
        dispatch(setCustomer(customer));
      } else {
        dispatch(setCustomer(defaultCustomer));
        dispatch(setAvailableEconomicActivityList([]));
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
    const { token, company, companyId } = session;
    if (
      (payload.idType === 0 && payload.identifier.length === 9) ||
      (payload.idType === 1 && payload.identifier.length === 10) ||
      (payload.idType > 1 && payload.identifier.length >= 11)
    ) {
      dispatch(startLoader());
      let customerName = defaultCustomer.Nombre;
      let economicActivityCode = "";
      const alertMessage = { message: "", type: "INFO" };
      const customer: CustomerEntityType = await getCustomerByIdentifier(token, companyId, payload.identifier);
      if (customer?.IdCliente > 0) {
        dispatch(setCustomer(customer));
        alertMessage.message =
          "Ya existe un cliente con la identificación ingresada. Por favor verifique la información. . .";
      }
      try {
        const customerData = await getCustomerData(payload.identifier);
        customerName = customerData.name;
        if (!company?.RegimenSimplificado) {
          if (customerData.economicActivityList.length === 0) {
            alertMessage.message = "El cliente no posee ninguna actividad económica activa registrada en Hacienda. . .";
            alertMessage.type = "ERROR";
          } else if (customerData.economicActivityList.length === 1) {
            economicActivityCode = customerData.economicActivityList[0].Llave;
            alertMessage.message = "Identificación validada satisfactoriamente. . .";
          } else {
            let economicActivityCodes = "";
            customerData.economicActivityList.forEach(activity => {
              if (economicActivityCodes !== "") economicActivityCodes += ", ";
              economicActivityCodes += activity.Llave;
            });
            alertMessage.message =
              "El cliente posee las siguientes actividades económicas: " +
              economicActivityCodes +
              ". Ingrese la actividad correspondiente.";
          }
        } else {
          alertMessage.message = "Identificación validada satisfactoriamente. . .";
        }
      } catch {
        alertMessage.message = "No se logró obtener información de Hacienda para la identificación ingresada. . .";
        alertMessage.type = "ERROR";
      }
      dispatch(
        setCustomer({
          ...defaultCustomer,
          IdEmpresa: companyId,
          IdTipoIdentificacion: payload.idType,
          Identificacion: payload.identifier,
          Nombre: customerName,
          CodigoActividad: economicActivityCode,
        })
      );
      if (alertMessage.message !== "") dispatch(setMessage(alertMessage));
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
    const { token, company } = session;
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
      if (!company?.RegimenSimplificado && customer.IdCliente > 1 && customer.CodigoActividad === "")
        dispatch(
          setMessage({
            message:
              "El cliente no tiene asignada una actividad ecónomica y se generará un tiquete electrónico en caso de continuar!",
            type: "INFO",
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

import { EconomicActivityType, LlaveDescriptionType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  setAvailableEconomicActivityList,
  setBranch,
  setCompany,
  setCompanyAttribute,
  setCredentials,
  setLogo,
  setReportResults,
} from "state/company/reducer";
import { setCompany as setSessionCompany } from "state/session/reducer";
import { RootState } from "state/store";
import {
  setActiveSection,
  setCantonList,
  setDistritoList,
  setMessage,
  startLoader,
  stopLoader,
} from "state/ui/reducer";
import { defaultCredentials } from "utils/defaults";
import {
  getBranchEntity,
  getCantonList,
  getCompanyEntity,
  getCredentialsEntity,
  getDistritoList,
  getReportData,
  saveCompanyEntity,
  sendReportEmail,
  validateCertificate,
  validateCredentials,
} from "utils/domainHelper";
import { ExportDataToXls, getErrorMessage } from "utils/utilities";

export const getCompany = createAsyncThunk("company/getCompany", async (_payload, { getState, dispatch }) => {
  const { session } = getState() as RootState;
  const { companyId, branchId, token } = session;
  dispatch(startLoader());
  dispatch(setAvailableEconomicActivityList([]));
  try {
    dispatch(setActiveSection(1));
    const company = await getCompanyEntity(token, companyId);
    const credentials = await getCredentialsEntity(token, company.IdEmpresa);
    const branch = await getBranchEntity(token, companyId, branchId);
    const cantonList = await getCantonList(token, company.IdProvincia);
    const distritoList = await getDistritoList(token, company.IdProvincia, company.IdCanton);
    //Disabled Hacienda company information request until service get back online
    /*try {
      const companyData = await getCustomerData(company.Identificacion);
      dispatch(setAvailableEconomicActivityList(companyData.economicActivityList));
    } catch {
      dispatch(
        setMessage({
          message: "Se produjo un error al obtener la información de la empresa en el Ministerio de Hacienda!",
          type: "ERROR",
        })
      );
    }*/
    dispatch(setCompany(company));
    dispatch(setBranch({ branch, updated: false }));
    dispatch(
      setCredentials({
        credentials: credentials !== null ? credentials : defaultCredentials,
      })
    );
    dispatch(setCantonList(cantonList));
    dispatch(setDistritoList(distritoList));
    dispatch(stopLoader());
  } catch (error) {
    dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    dispatch(stopLoader());
  }
});

export const saveCompany = createAsyncThunk(
  "company/saveCompany",
  async (payload: { certificate: string }, { getState, dispatch }) => {
    const { session, company } = getState() as RootState;
    const { token } = session;
    const { entity: companyEntity, logo, credentials, credentialsChanged, branchUpdated, branchEntity } = company;
    dispatch(startLoader());
    try {
      if (!companyEntity?.RegimenSimplificado) {
        if (credentials == null) throw new Error("Los credenciales de Hacienda deben ingresarse");
        if (
          credentials.UsuarioHacienda === "" ||
          credentials.ClaveHacienda === "" ||
          credentials.NombreCertificado === "" ||
          credentials.PinCertificado === ""
        )
          throw new Error("Los credenciales de Hacienda no pueden contener valores nulos");
        await validateCredentials(token, credentials.UsuarioHacienda, credentials.ClaveHacienda);
        if (payload.certificate !== "")
          await validateCertificate(token, credentials.PinCertificado, payload.certificate);
      }
      await saveCompanyEntity(
        token,
        companyEntity,
        logo,
        branchUpdated ? branchEntity : undefined,
        credentialsChanged ? credentials : undefined
      );
      dispatch(setSessionCompany(companyEntity));
      dispatch(setLogo(undefined));
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
);

export const addActivity = createAsyncThunk(
  "company/addActivity",
  async (payload: { id: string }, { getState, dispatch }) => {
    const { company } = getState() as RootState;
    const { entity: companyEntity, availableEconomicActivityList } = company;
    const activity = availableEconomicActivityList.find((x: LlaveDescriptionType) => x.Llave === payload.id);
    if (!activity) {
      dispatch(
        setMessage({
          message: "La actividad económica seleccionada no existe",
          type: "INFO",
        })
      );
    } else {
      if (companyEntity) {
        const list = [
          ...companyEntity.ActividadEconomicaEmpresa,
          {
            IdEmpresa: companyEntity.IdEmpresa,
            CodigoActividad: activity.Llave,
            Descripcion: activity.Descripcion,
          },
        ];
        dispatch(
          setCompanyAttribute({
            attribute: "ActividadEconomicaEmpresa",
            value: list,
          })
        );
      }
    }
  }
);

export const removeActivity = createAsyncThunk(
  "company/removeActivity",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { company } = getState() as RootState;
    const { entity } = company;

    if (entity) {
      const list = entity.ActividadEconomicaEmpresa.filter(
        (item: EconomicActivityType) => item.CodigoActividad !== payload.id
      );
      dispatch(
        setCompanyAttribute({
          attribute: "ActividadEconomicaEmpresa",
          value: list,
        })
      );
    }
  }
);

export const generateReport = createAsyncThunk(
  "company/generateReport",
  async (payload: { reportName: string; startDate: string; endDate: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    dispatch(startLoader());
    dispatch(setReportResults({ list: [], summary: null }));
    try {
      const list = await getReportData(
        token,
        payload.reportName,
        companyId,
        branchId,
        payload.startDate,
        payload.endDate
      );
      if (list.length > 0) {
        const summary = {
          startDate: payload.startDate,
          endDate: payload.endDate,
        };
        dispatch(setReportResults({ list, summary }));
      } else {
        dispatch(
          setMessage({
            message: "No existen registros para el rango de fecha seleccionado.",
            type: "INFO",
          })
        );
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const exportReport = createAsyncThunk(
  "company/exportReport",
  async (payload: { reportName: string; startDate: string; endDate: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    dispatch(startLoader());
    try {
      const list = await getReportData(
        token,
        payload.reportName,
        companyId,
        branchId,
        payload.startDate,
        payload.endDate
      );
      if (list.length > 0) {
        const fileName = payload.reportName.replaceAll(" ", "_");
        ExportDataToXls(fileName, payload.reportName, list);
      } else {
        dispatch(
          setMessage({
            message: "No existen registros para el rango de fecha seleccionado.",
            type: "INFO",
          })
        );
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

export const sendReportToEmail = createAsyncThunk(
  "company/exportReport",
  async (payload: { reportName: string; startDate: string; endDate: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    dispatch(startLoader());
    try {
      await sendReportEmail(token, companyId, branchId, payload.reportName, payload.startDate, payload.endDate);
      dispatch(
        setMessage({
          message: "Reporte enviado al correo satisfactoriamente",
          type: "INFO",
        })
      );
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
      dispatch(stopLoader());
    }
  }
);

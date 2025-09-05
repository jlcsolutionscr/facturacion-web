import { EconomicActivityType, IdDescriptionType } from "types/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  setAvailableEconomicActivityList,
  setCompany,
  setCompanyAttribute,
  setCompanyLogo,
  setCredentials,
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
  getCantonList,
  getCompanyEntity,
  getCompanyLogo,
  getCredentialsEntity,
  getCustomerData,
  getDistritoList,
  getReportData,
  saveCompanyEntity,
  saveCompanyLogo,
  saveCredentialsEntity,
  sendReportEmail,
  updateCredentialsEntity,
  validateCertificate,
  validateCredentials,
} from "utils/domainHelper";
import { ExportDataToXls, getErrorMessage } from "utils/utilities";

export const getCompany = createAsyncThunk("company/getCompany", async (_payload, { getState, dispatch }) => {
  const { session } = getState() as RootState;
  const { companyId, token } = session;
  dispatch(startLoader());
  try {
    dispatch(setActiveSection(1));
    const company = await getCompanyEntity(token, companyId);
    const credentials = await getCredentialsEntity(token, company.IdEmpresa);
    const cantonList = await getCantonList(token, company.IdProvincia);
    const distritoList = await getDistritoList(token, company.IdProvincia, company.IdCanton);
    const companyData = await getCustomerData(company.Identificacion);
    dispatch(setCompany(company));
    dispatch(
      setCredentials({
        credentials: credentials !== null ? credentials : defaultCredentials,
        newCredentials: credentials === null,
      })
    );
    dispatch(setAvailableEconomicActivityList(companyData.economicActivityList));
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
    const { entity: companyEntity, credentials, newCredentials, credentialsChanged } = company;
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
      await saveCompanyEntity(token, companyEntity);
      if (!companyEntity?.RegimenSimplificado && credentialsChanged) {
        if (newCredentials)
          await saveCredentialsEntity(
            token,
            companyEntity.IdEmpresa,
            credentials.UsuarioHacienda,
            credentials.ClaveHacienda,
            credentials.NombreCertificado,
            credentials.PinCertificado,
            payload.certificate
          );
        else
          await updateCredentialsEntity(
            token,
            companyEntity.IdEmpresa,
            credentials.UsuarioHacienda,
            credentials.ClaveHacienda,
            credentials.NombreCertificado,
            credentials.PinCertificado,
            payload.certificate
          );
      }
      dispatch(setSessionCompany(companyEntity));
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

export const saveLogo = createAsyncThunk(
  "company/saveLogo",
  async (payload: { logo: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, token } = session;
    dispatch(startLoader());
    try {
      if (payload.logo !== "") {
        await saveCompanyLogo(token, companyId, payload.logo);
      }
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

export const getLogo = createAsyncThunk("company/getLogo", async (_payload, { getState, dispatch }) => {
  const { session } = getState() as RootState;
  const { companyId, token } = session;
  dispatch(startLoader());
  dispatch(setActiveSection(3));
  try {
    const logo = await getCompanyLogo(token, companyId);
    dispatch(setCompanyLogo(`data:image/png;base64,${logo}`));
    dispatch(stopLoader());
  } catch (error) {
    dispatch(setMessage({ message: getErrorMessage(error), type: "ERROR" }));
    dispatch(stopLoader());
  }
});

export const addActivity = createAsyncThunk(
  "company/addActivity",
  async (payload: { id: number }, { getState, dispatch }) => {
    const { company } = getState() as RootState;
    const { entity: companyEntity, availableEconomicActivityList } = company;
    const activity = availableEconomicActivityList.find((x: IdDescriptionType) => x.Id === payload.id);
    if (!activity) {
      dispatch(
        setMessage({
          message: "La actividad económica seleccionada no está existe",
          type: "INFO",
        })
      );
    } else {
      if (companyEntity) {
        const list = [
          ...companyEntity.ActividadEconomicaEmpresa,
          {
            IdEmpresa: companyEntity.IdEmpresa,
            CodigoActividad: activity.Id,
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

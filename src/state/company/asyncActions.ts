import { createAsyncThunk } from "@reduxjs/toolkit";

import { setCompany as setSessionCompany } from "state/session/reducer";
import {
  setCompany,
  setCompanyLogo,
  setCredentials,
  setEconomicActivityList,
  setCompanyAttribute,
  setReportResults,
} from "state/company/reducer";
import {
  setActiveSection,
  startLoader,
  stopLoader,
  setMessage,
  setCantonList,
  setDistritoList,
  setBarrioList,
} from "state/ui/reducer";
import {
  getCompanyEntity,
  getCantonList,
  getDistritoList,
  getBarrioList,
  getEconomicActivities,
  saveCompanyEntity,
  getCredentialsEntity,
  validateCredentials,
  validateCertificate,
  saveCredentialsEntity,
  updateCredentialsEntity,
  getCompanyLogo,
  saveCompanyLogo,
  getReportData,
  sendReportEmail,
} from "utils/domainHelper";

import { ExportDataToXls, getErrorMessage } from "utils/utilities";
import { RootState } from "state/store";
import { EconomicActivityType } from "types/domain";

export const getCompany = createAsyncThunk(
  "company/getCompany",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, token } = session;
    dispatch(startLoader());
    try {
      dispatch(setActiveSection(1));
      const company = await getCompanyEntity(token, companyId);
      const credentials = await getCredentialsEntity(token, company.IdEmpresa);
      const cantonList = await getCantonList(token, company.IdProvincia);
      const distritoList = await getDistritoList(
        token,
        company.IdProvincia,
        company.IdCanton
      );
      const barrioList = await getBarrioList(
        token,
        company.IdProvincia,
        company.IdCanton,
        company.IdDistrito
      );
      const activityList = await getEconomicActivities(
        token,
        company.Identificacion
      );
      dispatch(setCompany(company));
      dispatch(setCredentials(credentials));
      dispatch(setCantonList(cantonList));
      dispatch(setDistritoList(distritoList));
      dispatch(setBarrioList(barrioList));
      dispatch(setEconomicActivityList(activityList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const saveCompany = createAsyncThunk(
  "company/saveCompany",
  async (payload: { certificate: string }, { getState, dispatch }) => {
    const { session, company } = getState() as RootState;
    const { token } = session;
    const {
      entity: companyEntity,
      credentials,
      credentialsNew,
      credentialsChanged,
    } = company;
    dispatch(startLoader());
    try {
      if (!companyEntity?.simplifyRegimen) {
        if (credentials == null)
          throw new Error("Los credenciales de Hacienda deben ingresarse");
        if (
          credentials.user === "" ||
          credentials.password === "" ||
          credentials.certificate === "" ||
          credentials.certificatePin === ""
        )
          throw new Error(
            "Los credenciales de Hacienda no pueden contener valores nulos"
          );
        await validateCredentials(
          token,
          credentials.user,
          credentials.password
        );
        if (payload.certificate !== "")
          await validateCertificate(
            token,
            credentials.certificatePin,
            payload.certificate
          );
      }
      await saveCompanyEntity(token, company);
      if (!companyEntity?.simplifyRegimen && credentialsChanged) {
        if (credentialsNew)
          await saveCredentialsEntity(
            token,
            companyEntity?.id,
            credentials.user,
            credentials.password,
            credentials.certificate,
            credentials.certificatePin,
            payload.certificate
          );
        else
          await updateCredentialsEntity(
            token,
            companyEntity?.id,
            credentials.user,
            credentials.password,
            credentials.certificate,
            credentials.certificatePin,
            payload.certificate
          );
      }
      dispatch(setSessionCompany(companyEntity));
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

export const getLogo = createAsyncThunk(
  "company/getLogo",
  async (_payload, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { companyId, token } = session;
    dispatch(startLoader());
    try {
      const logo = await getCompanyLogo(token, companyId);
      dispatch(setCompanyLogo(logo));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const addActivity = createAsyncThunk(
  "company/addActivity",
  async (payload: { code: string }, { getState, dispatch }) => {
    const { company } = getState() as RootState;
    const { entity: companyEntity, economicActivityList } = company;
    const activity = economicActivityList.find(
      (x: EconomicActivityType) => x.code === payload.code
    );
    if (!activity) {
      dispatch(
        setMessage({
          error: "La actividad económica seleccionada no está asignada",
          type: "INFO",
        })
      );
    } else {
      if (companyEntity) {
        const list = [
          ...companyEntity.economicActivityList,
          {
            companyId: companyEntity.id,
            code: activity.code,
            description: activity.description,
          },
        ];
        dispatch(
          setCompanyAttribute({ field: "economicActivities", value: list })
        );
      }
    }
  }
);

export const removeActivity = createAsyncThunk(
  "company/removeActivity",
  async (payload: { code: string }, { getState, dispatch }) => {
    const { session } = getState() as RootState;
    const { company } = session;
    if (company) {
      const list = company.economicActivityList.filter(
        (item: EconomicActivityType) => item.code !== payload.code
      );
      dispatch(
        setCompanyAttribute({ field: "economicActivities", value: list })
      );
    }
  }
);

export const generateReport = createAsyncThunk(
  "company/generateReport",
  async (
    payload: { reportName: string; startDate: string; endDate: string },
    { getState, dispatch }
  ) => {
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
            error: "No existen registros para el rango de fecha seleccionado.",
            type: "INFO",
          })
        );
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const exportReport = createAsyncThunk(
  "company/exportReport",
  async (
    payload: { reportName: string; startDate: string; endDate: string },
    { getState, dispatch }
  ) => {
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
            error: "No existen registros para el rango de fecha seleccionado.",
            type: "INFO",
          })
        );
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage({ message: getErrorMessage(error) }));
      dispatch(stopLoader());
    }
  }
);

export const sendReportToEmail = createAsyncThunk(
  "company/exportReport",
  async (
    payload: { reportName: string; startDate: string; endDate: string },
    { getState, dispatch }
  ) => {
    const { session } = getState() as RootState;
    const { companyId, branchId, token } = session;
    dispatch(startLoader());
    try {
      await sendReportEmail(
        token,
        companyId,
        branchId,
        payload.reportName,
        payload.startDate,
        payload.endDate
      );
      dispatch(
        setMessage({
          error: "Reporte enviado al correo satisfactoriamente",
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
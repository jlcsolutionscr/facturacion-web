import {
  SET_COMPANY,
  SET_COMPANY_LOGO,
  SET_COMPANY_ATTRIBUTE,
  SET_CREDENTIALS,
  SET_ECONOMIC_ACTIVITY_LIST,
  SET_CREDENTIALS_ATTRIBUTE,
  SET_REPORT_RESULTS,
} from "./types";

import { setCompany as setSessionCompany } from "store/session/actions";

import {
  setActiveSection,
  startLoader,
  stopLoader,
  setMessage,
  setCantonList,
  setDistritoList,
  setBarrioList,
} from "store/ui/actions";

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

import { ExportDataToXls } from "utils/utilities";

export const setCompany = company => {
  return {
    type: SET_COMPANY,
    payload: { company },
  };
};

export const setCompanyLogo = image => {
  return {
    type: SET_COMPANY_LOGO,
    payload: { image },
  };
};

export const setCredentials = credentials => {
  return {
    type: SET_CREDENTIALS,
    payload: { credentials },
  };
};

export const setEconomicActivityList = list => {
  return {
    type: SET_ECONOMIC_ACTIVITY_LIST,
    payload: { list },
  };
};

export const setCompanyAttribute = (attribute, value) => {
  return {
    type: SET_COMPANY_ATTRIBUTE,
    payload: { attribute, value },
  };
};

export const setCredentialsAttribute = (attribute, value) => {
  return {
    type: SET_CREDENTIALS_ATTRIBUTE,
    payload: { attribute, value },
  };
};

export const setReportResults = (list, summary) => {
  return {
    type: SET_REPORT_RESULTS,
    payload: { list, summary },
  };
};

export function getCompany() {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session;
    dispatch(startLoader());
    try {
      dispatch(setActiveSection(1));
      const company = await getCompanyEntity(token, companyId);
      const credentials = await getCredentialsEntity(token, company.IdEmpresa);
      const cantonList = await getCantonList(token, company.IdProvincia);
      const distritoList = await getDistritoList(token, company.IdProvincia, company.IdCanton);
      const barrioList = await getBarrioList(token, company.IdProvincia, company.IdCanton, company.IdDistrito);
      const activityList = await getEconomicActivities(token, company.Identificacion);
      dispatch(setCompany(company));
      dispatch(setCredentials(credentials));
      dispatch(setCantonList(cantonList));
      dispatch(setDistritoList(distritoList));
      dispatch(setBarrioList(barrioList));
      dispatch(setEconomicActivityList(activityList));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function saveCompany(certificate) {
  return async (dispatch, getState) => {
    const { token } = getState().session;
    const { company, credentials, credentialsNew, credentialsChanged } = getState().company;
    dispatch(startLoader());
    try {
      if (!company.RegimenSimplificado) {
        if (credentials == null) throw new Error("Los credenciales de Hacienda deben ingresarse");
        if (
          credentials.UsuarioHacienda === undefined ||
          credentials.ClaveHacienda === undefined ||
          credentials.NombreCertificado === undefined ||
          credentials.PinCertificado === undefined
        )
          throw new Error("Los credenciales de Hacienda no pueden contener valores nulos");
        await validateCredentials(token, credentials.UsuarioHacienda, credentials.ClaveHacienda);
        if (certificate !== "") await validateCertificate(token, credentials.PinCertificado, certificate);
      }
      await saveCompanyEntity(token, company);
      if (!company.RegimenSimplificado && credentialsChanged) {
        if (credentialsNew)
          await saveCredentialsEntity(
            token,
            company.IdEmpresa,
            credentials.UsuarioHacienda,
            credentials.ClaveHacienda,
            credentials.NombreCertificado,
            credentials.PinCertificado,
            certificate
          );
        else
          await updateCredentialsEntity(
            token,
            company.IdEmpresa,
            credentials.UsuarioHacienda,
            credentials.ClaveHacienda,
            credentials.NombreCertificado,
            credentials.PinCertificado,
            certificate
          );
      }
      dispatch(setSessionCompany(company));
      dispatch(setMessage("Transacción completada satisfactoriamente", "INFO"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function saveLogo(logo) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session;
    dispatch(startLoader());
    try {
      if (logo !== "") {
        await saveCompanyLogo(token, companyId, logo);
      }
      dispatch(setMessage("Transacción completada satisfactoriamente", "INFO"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function getLogo() {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session;
    dispatch(startLoader());
    try {
      const logo = await getCompanyLogo(token, companyId);
      dispatch(setCompanyLogo(logo));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function addActivity(code) {
  return async (dispatch, getState) => {
    const { company, economicActivities } = getState().company;
    if (company.ActividadEconomicaEmpresa.find(x => x.CodigoActividad === code)) {
      dispatch(setMessage("No existen registros para el rango de fecha seleccionado.", "INFO"));
    } else {
      const description = economicActivities.find(x => x.Id === code).Descripcion;
      const list = [
        ...company.ActividadEconomicaEmpresa,
        { IdEmpresa: company.IdEmpresa, CodigoActividad: code, Descripcion: description },
      ];
      dispatch(setCompanyAttribute("ActividadEconomicaEmpresa", list));
    }
  };
}

export function removeActivity(code) {
  return async (dispatch, getState) => {
    const { company } = getState().company;
    const list = company.ActividadEconomicaEmpresa.filter(item => item.CodigoActividad !== code);
    dispatch(setCompanyAttribute("ActividadEconomicaEmpresa", list));
  };
}

export function generateReport(reportName, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session;
    dispatch(startLoader());
    dispatch(setReportResults([], null));
    try {
      const list = await getReportData(token, reportName, companyId, branchId, startDate, endDate);
      if (list.length > 0) {
        const summary = {
          startDate,
          endDate,
        };
        dispatch(setReportResults(list, summary));
      } else {
        dispatch(setMessage("No existen registros para el rango de fecha seleccionado.", "INFO"));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function exportReport(reportName, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session;
    dispatch(startLoader());
    try {
      const list = await getReportData(token, reportName, companyId, branchId, startDate, endDate);
      if (list.length > 0) {
        const fileName = reportName.replaceAll(" ", "_");
        ExportDataToXls(fileName, reportName, list);
      } else {
        dispatch(setMessage("No existen registros para el rango de fecha seleccionado.", "INFO"));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

export function sendReportToEmail(reportName, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session;
    dispatch(startLoader());
    try {
      await sendReportEmail(token, companyId, branchId, reportName, startDate, endDate);
      dispatch(setMessage("Reporte enviado al correo satisfactoriamente", "INFO"));
      dispatch(stopLoader());
    } catch (error) {
      dispatch(setMessage(error.message));
      dispatch(stopLoader());
    }
  };
}

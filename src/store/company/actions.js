import {
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_REPORT_RESULTS
} from './types'

import {
  setActiveSection,
  startLoader,
  stopLoader,
  setMessage,
  setCantonList,
  setDistritoList,
  setBarrioList
} from 'store/ui/actions'

import {
  getCompanyEntity,
  getCantonList,
  getDistritoList,
  getBarrioList,
  saveCompanyEntity,
  saveCompanyCertificate,
  saveCompanyLogo,
  getReportData,
  sendReportEmail
} from 'utils/domainHelper'

import { ExportDataToXls } from 'utils/utilities'

export const setCompany = (company) => {
  return {
    type: SET_COMPANY,
    payload: { company }
  }
}

export const setCompanyAttribute = (attribute, value) => {
  return {
    type: SET_COMPANY_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const setReportResults = (list, summary) => {
  return {
    type: SET_REPORT_RESULTS,
    payload: { list, summary }
  }
}

export function getCompany () {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    try {
      dispatch(setActiveSection(1))
      const company = await getCompanyEntity(token, companyId)
      const cantonList = await getCantonList(token, company.IdProvincia)
      const distritoList = await getDistritoList(token, company.IdProvincia, company.IdCanton)
      const barrioList = await getBarrioList(token, company.IdProvincia, company.IdCanton, company.IdDistrito)
      dispatch(setCompany(company))
      dispatch(setCantonList(cantonList))
      dispatch(setDistritoList(distritoList))
      dispatch(setBarrioList(barrioList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveCompany (certificate) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().company
    dispatch(startLoader())
    try {
      await saveCompanyEntity(token, company)
      if (certificate !== '') {
        await saveCompanyCertificate(token, company.IdEmpresa, certificate)
      }
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveLogo (logo) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    try {
      if (logo !== '') {
        await saveCompanyLogo(token, companyId, logo)
      }
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function generateReport (reportName, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    dispatch(startLoader())
    dispatch(setReportResults([], null))
    try {
      const list = await getReportData(token, reportName, companyId, branchId, startDate, endDate)
      const summary = {
        startDate,
        endDate
      }
      dispatch(setReportResults(list, summary))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function exportReport (reportName, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    dispatch(startLoader())
    try {
      const list = await getReportData(token, reportName, companyId, branchId, startDate, endDate)
      const fileName = reportName.replaceAll(" ", "_")
      ExportDataToXls(fileName, reportName, list)
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function sendReportToEmail (reportName, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    dispatch(startLoader())
    try {
      await sendReportEmail(token, companyId, branchId, reportName, startDate, endDate)
      dispatch(setMessage('Reporte enviado al correo satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error))
      dispatch(stopLoader())
      
    }
  }
}

import {
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_REPORT_RESULTS
} from './types'

import {
  setActiveSection,
  startLoader,
  stopLoader,
  setErrorMessage,
  setCantonList,
  setDistritoList,
  setBarrioList,
  setBranchList
} from 'store/ui/actions'

import {
  getCompanyEntity,
  getCantonList,
  getDistritoList,
  getBarrioList,
  saveCompanyEntity,
  saveCompanyCertificate,
  saveCompanyLogo,
  getBranchList,
  getReportData
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
    dispatch(setErrorMessage(''))
    try {
      dispatch(setActiveSection(1))
      const company = await getCompanyEntity(companyId, token)
      const cantonList = await getCantonList(1, token)
      const distritoList = await getDistritoList(1, 1, token)
      const barrioList = await getBarrioList(1, 1, 1, token)
      dispatch(setCompany(company))
      dispatch(setCantonList(cantonList))
      dispatch(setDistritoList(distritoList))
      dispatch(setBarrioList(barrioList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveCompany (certificate) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().company
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      await saveCompanyEntity(company, token)
      if (certificate !== '') {
        await saveCompanyCertificate(company.IdEmpresa, certificate, token)
      }
      dispatch(setActiveSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveLogo (logo) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      if (logo !== '') {
        await saveCompanyLogo(companyId, logo, token)
      }
      dispatch(setActiveSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function setReportsParameters () {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const list = await getBranchList(companyId, token)
      dispatch(setActiveSection(20))
      dispatch(setBranchList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function generateReport (idBranch, reportType, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    dispatch(setReportResults([], null))
    try {
      const list = await getReportData(reportType, companyId, idBranch, startDate, endDate, token)
      let taxes = 0
      let total = 0
      if (reportType !== 5) {
        list.forEach(item => {
          taxes += item.Impuesto
          total += item.Total
        })
      }
      const summary = {
        startDate,
        endDate,
        taxes,
        total
      }
      dispatch(setReportResults(list, summary))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function exportReport (idBranch, reportType, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const list = await getReportData(reportType, companyId, idBranch, startDate, endDate, token)
      const fileName = reportType === 1
        ? 'documentos_electronicos_generados'
        : 'documentos_electronicos_recibidos'
      const reportName = reportType === 1
        ? 'Documentos electrónicos generados'
        : 'Documentos electrónicos recibidos'
      ExportDataToXls(fileName, reportName, list)
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}
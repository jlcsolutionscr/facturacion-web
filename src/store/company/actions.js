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
    dispatch(setMessage(''))
    try {
      dispatch(setActiveSection(1))
      const company = await getCompanyEntity(token, companyId)
      const cantonList = await getCantonList(token, 1)
      const distritoList = await getDistritoList(token, 1, 1)
      const barrioList = await getBarrioList(token, 1, 1, 1)
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
    dispatch(setMessage(''))
    try {
      await saveCompanyEntity(token, company)
      if (certificate !== '') {
        await saveCompanyCertificate(token, company.IdEmpresa, certificate)
      }
      dispatch(setActiveSection(0))
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
    dispatch(setMessage(''))
    try {
      if (logo !== '') {
        await saveCompanyLogo(token, companyId, logo)
      }
      dispatch(setActiveSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function generateReport (reportType, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    dispatch(startLoader())
    dispatch(setMessage(''))
    dispatch(setReportResults([], null))
    try {
      const list = await getReportData(token, reportType, companyId, branchId, startDate, endDate)
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
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function exportReport (reportType, startDate, endDate) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    dispatch(startLoader())
    dispatch(setMessage(''))
    try {
      const list = await getReportData(token, reportType, companyId, branchId, startDate, endDate)
      const fileName = reportType === 1
        ? 'documentos_electronicos_generados'
        : 'documentos_electronicos_recibidos'
      const reportName = reportType === 1
        ? 'Documentos electrónicos generados'
        : 'Documentos electrónicos recibidos'
      ExportDataToXls(fileName, reportName, list)
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

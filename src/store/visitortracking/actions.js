import {
  SET_ACTIVE_SECTION,
  SET_VISITOR_SESSION,
  SET_COMPANY_LIST,
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_BRANCH_LIST,
  SET_BRANCH,
  SET_BRANCH_ATTRIBUTE,
  SET_EMPLOYEE_LIST,
  SET_EMPLOYEE,
  SET_EMPLOYEE_ATTRIBUTE,
  SET_REGISTRY_LIST,
  SET_REGISTRY,
  SET_REPORT_RESULTS
} from './types'

import { startLoader, stopLoader, setErrorMessage } from 'store/ui/actions'

import {
  getCompanyList,
  getCompanyEntity,
  saveCompanyEntity,
  getBranchList,
  getBranchEntity,
  saveBranchEntity,
  getEmployeeList,
  getEmployeeEntity,
  saveEmployeeEntity,
  getRegistryList,
  getRegistryEntity,
  activateRegistration,
  getReportData
} from 'utils/visitorTrackingHelper'

import { ExportDataToXls } from 'utils/utilities'

export const setActiveSection = (pageId) => {
  return {
    type: SET_ACTIVE_SECTION,
    payload: { pageId }
  }
}

export const setVisitorSession = (companyId, companyIdentifier, companyName) => {
  return {
    type: SET_VISITOR_SESSION,
    payload: { companyId, companyIdentifier, companyName }
  }
}

export const setCompanyList = (list) => {
  return {
    type: SET_COMPANY_LIST,
    payload: { list }
  }
}

export const setCompany = (entity) => {
  return {
    type: SET_COMPANY,
    payload: { entity }
  }
}

export const setCompanyAttribute = (attribute, value) => {
  return {
    type: SET_COMPANY_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const setBranchList = (list) => {
  return {
    type: SET_BRANCH_LIST,
    payload: { list }
  }
}

export const setBranch = (entity) => {
  return {
    type: SET_BRANCH,
    payload: { entity }
  }
}

export const setBranchAttribute = (attribute, value) => {
  return {
    type: SET_BRANCH_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const setEmployeeList = (list) => {
  return {
    type: SET_EMPLOYEE_LIST,
    payload: { list }
  }
}

export const setEmployee = (entity) => {
  return {
    type: SET_EMPLOYEE,
    payload: { entity }
  }
}

export const setEmployeeAttribute = (attribute, value) => {
  return {
    type: SET_EMPLOYEE_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const setRegistryList = (list) => {
  return {
    type: SET_REGISTRY_LIST,
    payload: { list }
  }
}

export const setRegistry = (entity) => {
  return {
    type: SET_REGISTRY,
    payload: { entity }
  }
}

export const setReportResults = (list, summary) => {
  return {
    type: SET_REPORT_RESULTS,
    payload: { list, summary }
  }
}

export function setCompanyListParameters () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      dispatch(setActiveSection(1))
      const list = await getCompanyList(token)
      dispatch(setCompanyList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function setCompanyParameters () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      const entity = await getCompanyEntity(companyId, token)
      dispatch(setCompany(entity))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function getCompany (companyId) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      const entity = await getCompanyEntity(companyId, token)
      dispatch(setCompany(entity))
      const list = await getBranchList(entity.Id, token)
      dispatch(setBranchList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveCompany () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().visitortracking
    dispatch(startLoader())
    try {
      await saveCompanyEntity(company, token)
      dispatch(setCompany(null))
      dispatch(setActiveSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function setBranchParameters () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      dispatch(setActiveSection(3))
      const list = await getBranchList(companyId, token)
      dispatch(setBranchList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function getBranch (branchId) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      const entity = await getBranchEntity(companyId, branchId, token)
      dispatch(setBranch(entity))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveBranch () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { branch } = getState().visitortracking
    dispatch(startLoader())
    try {
      await saveBranchEntity(branch, token)
      dispatch(setCompany(null))
      dispatch(setBranch(null))
      dispatch(setActiveSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function setEmployeeParameters () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      dispatch(setActiveSection(4))
      const list = await getEmployeeList(companyId, token)
      dispatch(setEmployeeList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function getEmployee (employeeId) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      const entity = await getEmployeeEntity(companyId, employeeId, token)
      dispatch(setEmployee(entity))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveEmployee () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { employee } = getState().visitortracking
    dispatch(startLoader())
    try {
      await saveEmployeeEntity(employee, token)
      dispatch(setEmployee(null))
      dispatch(setActiveSection(0))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function setRegistryParameters () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      dispatch(setActiveSection(5))
      const list = await getRegistryList(companyId, token)
      dispatch(setRegistryList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function getRegistry (registryId) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      const entity = await getRegistryEntity(companyId, registryId, token)
      dispatch(setCompany(entity))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveRegistry (registry) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      await activateRegistration(registry, token)
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
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      dispatch(setActiveSection(6))
      const list = await getBranchList(companyId, token)
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
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
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
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      const list = await getReportData(reportType, companyId, idBranch, startDate, endDate, token)
      const fileName = reportType === 1
        ? 'facturas_generadas'
        : reportType === 2
          ? 'notas_credito_generadas'
          : reportType === 3
            ? 'facturas_recibidas'
            : 'notas_credito_recibidas'
      const reportName = reportType === 1
        ? 'Reporte de facturas generadas'
        : reportType === 2
          ? 'Reporte de notas de crédito generadas'
          : reportType === 3
            ? 'Reporte de facturas recibidas'
            : reportType === 4
              ? 'Reporte de notas de crédito Recibidas'
              : 'Reporte resumen de movimientos del período'
      ExportDataToXls(fileName, reportName, list)
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

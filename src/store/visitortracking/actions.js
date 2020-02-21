import {
  SET_ACTIVE_SECTION,
  SET_VISITOR_SESSION,
  SET_COMPANY_LIST,
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_BRANCH_LIST,
  SET_BRANCH,
  SET_BRANCH_ATTRIBUTE,
  SET_USER_LIST,
  SET_USER,
  SET_ROLE_LIST,
  ADD_USER_ROLE,
  REMOVE_USER_ROLE,
  SET_USER_ATTRIBUTE,
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
  getRoleList,
  getCompanyEntity,
  saveCompanyEntity,
  getBranchList,
  getBranchEntity,
  saveBranchEntity,
  getUserList,
  getUserEntity,
  saveUserEntity,
  getEmployeeList,
  getEmployeeEntity,
  saveEmployeeEntity,
  GetPendingRegistryList,
  RegistryApproval,
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

export const setUserList = (list) => {
  return {
    type: SET_USER_LIST,
    payload: { list }
  }
}

export const setUser = (entity) => {
  return {
    type: SET_USER,
    payload: { entity }
  }
}

export const setRoleList = (list) => {
  return {
    type: SET_ROLE_LIST,
    payload: { list }
  }
}

export const addUserRole = (id, description) => {
  return {
    type: ADD_USER_ROLE,
    payload: { id, description }
  }
}

export const removeUserRole = (id) => {
  return {
    type: REMOVE_USER_ROLE,
    payload: { id }
  }
}

export const setUserAttribute = (attribute, value) => {
  return {
    type: SET_USER_ATTRIBUTE,
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

export function setCompanyAdminParameters () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      dispatch(setActiveSection(1))
      const companyList = await getCompanyList(token)
      dispatch(setCompanyList(companyList))
      const roleList = await getRoleList(token)
      dispatch(setRoleList(roleList))
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
    dispatch(setActiveSection(2))
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
      const branchList = await getBranchList(entity.Id, token)
      dispatch(setBranchList(branchList))
      const userList = await getUserList(entity.Identifier, token)
      dispatch(setUserList(userList))
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
      if (!company.Id) {
        const companyList = await getCompanyList(token)
        dispatch(setCompanyList(companyList))
      }
      dispatch(setCompany(null))
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
    dispatch(setActiveSection(3))
    try {
      const list = await getBranchList(companyId, token)
      dispatch(setBranchList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function getBranch (companyId, branchId) {
  return async (dispatch, getState) => {
    const { token } = getState().session
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

export function saveBranch (companyId, isNew) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { branch } = getState().visitortracking
    dispatch(startLoader())
    try {
      await saveBranchEntity(branch, companyId, isNew, token)
      if (isNew) {
        const list = await getBranchList(companyId, token)
        dispatch(setBranchList(list))
      }
      dispatch(setBranch(null))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function getUser (userId) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      const entity = await getUserEntity(userId, token)
      dispatch(setUser(entity))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function saveUser (isNew) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { user, company } = getState().visitortracking
    dispatch(startLoader())
    try {
      await saveUserEntity(user, company.Identifier, token)
      if (isNew) {
        const list = await getUserList(company.Identifier, token)
        dispatch(setUserList(list))
      }
      dispatch(setUser(null))
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
    dispatch(setActiveSection(4))
    try {
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
    const { employee, companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      await saveEmployeeEntity(employee, companyId, token)
      if (!employee.Id) {
        const list = await getEmployeeList(companyId, token)
        dispatch(setEmployeeList(list))
      }
      dispatch(setEmployee(null))
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
    dispatch(setActiveSection(5))
    try {
      const list = await GetPendingRegistryList(companyId, token)
      dispatch(setRegistryList(list))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function activateRegistry (registryId) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { companyId } = getState().visitortracking
    dispatch(startLoader())
    try {
      await RegistryApproval(registryId, token)
      const list = await GetPendingRegistryList(companyId, token)
      dispatch(setRegistryList(list))
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
    dispatch(setActiveSection(6))
    try {
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
      let count = list.length
      const summary = {
        startDate,
        endDate,
        count
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

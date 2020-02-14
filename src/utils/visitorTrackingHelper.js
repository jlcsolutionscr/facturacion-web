import { encryptString, getWithResponse, post, postWithResponse } from './utilities'
const SERVICE_URL = process.env.VT_SERVICE_URL
const ADMIN_URL = `${SERVICE_URL}/webservice`

export async function visitorLogin(username, password, identifier) {
  try {
    const ecryptedPass = encryptString(password)
    const endpoint = ADMIN_URL + '/userlogin?username=' + username + '&password=' + ecryptedPass + '&identifier=' + identifier
    const user = await getWithResponse(endpoint, '')
    return user
  } catch (e) {
    throw e
  }
}

export async function getCompanyList(token) {
  try {
    const data = '{"MethodName": "GetCompanyList"}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

export async function getCompanyEntity(companyId, token) {
  try {
    const data = '{"MethodName": "GetCompany", "Parameters": {"CompanyId": ' + companyId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const entity = await postWithResponse(endpoint, data, token)
    return entity
  } catch (e) {
    throw e
  }
}

export async function saveCompanyEntity(entity, token) {
  try {
    const data = '{"MethodName": "UpdateCompany", "Entity": ' + JSON.stringify(entity) + '}'
    console.log('saveCompanyEntity', data)
    const endpoint = ADMIN_URL + '/messagenoresponse'
    await postWithResponse(endpoint, data, token)
  } catch (e) {
    throw e
  }
}

export async function getBranchList(companyId, token) {
  try {
    const data = '{"MethodName": "GetBranchList", "Parameters": {"CompanyId" :' + companyId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

export async function getBranchEntity(companyId, branchId, token) {
  try {
    const data = '{"MethodName": "GetBranch", "Parameters": {"CompanyId" :' + companyId + ', "BranchId": ' + branchId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const entity = await postWithResponse(endpoint, data, token)
    return entity
  } catch (e) {
    throw e
  }
}

export async function saveBranchEntity(entity, token) {
  try {
    const data = '{"MethodName": "UpdateCompany", "Entity": ' + JSON.stringify(entity) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    await postWithResponse(endpoint, data, token)
  } catch (e) {
    throw e
  }
}

export async function getEmployeeList(companyId, token) {
  try {
    const data = '{"MethodName": "UpdateCompany", "Entity": ' + JSON.stringify(companyId) + '}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const entity = await postWithResponse(endpoint, data, token)
    return entity
  } catch (e) {
    throw e
  }
}

export async function getEmployeeEntity(companyId, employeeId, token) {
  try {
    const data = '{"MethodName":"UpdateCompany", "Entity": ' + JSON.stringify(companyId) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    const user = await postWithResponse(endpoint, data, token)
    return user
  } catch (e) {
    throw e
  }
}

export async function saveEmployeeEntity(entity, token) {
  try {
    const data = '{"MethodName":"UpdateCompany", "Entity": ' + JSON.stringify(entity) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    const user = await postWithResponse(endpoint, data, token)
    return user
  } catch (e) {
    throw e
  }
}

export async function getRegistryList(companyId, token) {
  try {
    const data = '{"MethodName":"UpdateCompany", "Entity": ' + JSON.stringify(companyId) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    const user = await postWithResponse(endpoint, data, token)
    return user
  } catch (e) {
    throw e
  }
}

export async function getRegistryEntity(companyId, registryId, token) {
  try {
    const data = '{"MethodName":"UpdateCompany", "Entity": ' + JSON.stringify(companyId) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    const user = await postWithResponse(endpoint, data, token)
    return user
  } catch (e) {
    throw e
  }
}

export async function activateRegistration(entity, token) {
  try {
    const data = '{"MethodName":"UpdateCompany", "Entity": ' + JSON.stringify(entity) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    const user = await postWithResponse(endpoint, data, token)
    return user
  } catch (e) {
    throw e
  }
}

export async function getReportData(reportType, companyId, idBranch, startDate, endDate, token) {
  try {
    const data = '{"MethodName":"UpdateCompany", "Entity": ' + JSON.stringify(reportType) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    const user = await postWithResponse(endpoint, data, token)
    return user
  } catch (e) {
    throw e
  }
}

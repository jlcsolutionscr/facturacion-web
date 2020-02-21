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
    let data = ''
    if (entity.Id)
      data = '{"MethodName": "UpdateCompany", "Entity": ' + JSON.stringify(entity) + '}'
    else
      data = '{"MethodName": "AddCompany", "Entity": ' + JSON.stringify(entity) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    await post(endpoint, data, token)
  } catch (e) {
    throw e
  }
}

export async function getBranchList(companyId, token) {
  try {
    const data = '{"MethodName": "GetBranchList", "Parameters": {"CompanyId": ' + companyId + '}}'
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
    const data = '{"MethodName": "GetBranch", "Parameters": {"CompanyId": ' + companyId + ', "BranchId": ' + branchId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const entity = await postWithResponse(endpoint, data, token)
    return entity
  } catch (e) {
    throw e
  }
}

export async function saveBranchEntity(entity, companyId, isNew, token) {
  try {
    entity = { ...entity, CompanyId: companyId}
    let data = ''
    if (!isNew)
      data = '{"MethodName": "UpdateBranch", "Entity": ' + JSON.stringify(entity) + '}'
    else
      data = '{"MethodName": "AddBranch", "Entity": ' + JSON.stringify(entity) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    await post(endpoint, data, token)
  } catch (e) {
    throw e
  }
}

export async function getUserList(companyIdentifier, token) {
  try {
    const data = '{"MethodName": "GetUserList", "Parameters": {"CompanyIdentifier": ' + companyIdentifier + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

export async function getUserEntity(userId, token) {
  try {
    const data = '{"MethodName": "GetUser", "Parameters": {"UserId": ' + userId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    let entity = await postWithResponse(endpoint, data, token)
    entity = { ...entity, Password: ''}
    return entity
  } catch (e) {
    throw e
  }
}

export async function saveUserEntity(entity, identifier, token) {
  try {
    entity = { ...entity, Password: encryptString(entity.Password) }
    let data = ''
    if (entity.Id)
      data = '{"MethodName": "UpdateUser", "Entity": ' + JSON.stringify(entity) + '}'
    else {
      entity = { ...entity, Identifier: identifier }
      data = '{"MethodName": "AddUser", "Entity": ' + JSON.stringify(entity) + '}'
    }
    const endpoint = ADMIN_URL + '/messagenoresponse'
    await post(endpoint, data, token)
  } catch (e) {
    throw e
  }
}

export async function getRoleList(token) {
  try {
    const data = '{"MethodName": "GetRoleList"}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

export async function getEmployeeList(companyId, token) {
  try {
    const data = '{"MethodName": "GetEmployeeList", "Parameters": {"CompanyId": ' + companyId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

export async function getEmployeeEntity(companyId, employeeId, token) {
  try {
    const data = '{"MethodName": "GetEmployee", "Parameters": {"CompanyId": ' + companyId + ', "EmployeeId": ' + employeeId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const entity = await postWithResponse(endpoint, data, token)
    return entity
  } catch (e) {
    throw e
  }
}

export async function saveEmployeeEntity(entity, companyId, token) {
  try {
    let data = ''
    if (entity.Id)
      data = '{"MethodName": "UpdateEmployee", "Entity": ' + JSON.stringify(entity) + '}'
    else {
      entity = { ...entity, CompanyId: companyId }
      data = '{"MethodName": "AddEmployee", "Entity": ' + JSON.stringify(entity) + '}'
    }
    const endpoint = ADMIN_URL + '/messagenoresponse'
    await post(endpoint, data, token)
  } catch (e) {
    throw e
  }
}

export async function getCustomerList(companyId, token) {
  try {
    const data = '{"MethodName": "GetCustomerList", "Parameters": {"CompanyId": ' + companyId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

export async function getCustomerEntity(companyId, employeeId, token) {
  try {
    const data = '{"MethodName": "GetCustomer", "Parameters": {"CompanyId": ' + companyId + ', "CustomerId": ' + employeeId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const entity = await postWithResponse(endpoint, data, token)
    return entity
  } catch (e) {
    throw e
  }
}

export async function saveCustomerEntity(entity, token) {
  try {
    const data = '{"MethodName": "UpdateCustomer", "Entity": ' + JSON.stringify(entity) + '}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    await post(endpoint, data, token)
  } catch (e) {
    throw e
  }
}

export async function GetPendingRegistryList(companyId, token) {
  try {
    const data = '{"MethodName": "GetPendingRegistryList", "Parameters": {"CompanyId": ' + companyId + '}}'
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

export async function RegistryApproval(registryId, token) {
  try {
    const data = '{"MethodName": "RegistryApproval", "Parameters": {"RegistryId": ' + registryId + '}}'
    const endpoint = ADMIN_URL + '/messagenoresponse'
    const user = await postWithResponse(endpoint, data, token)
    return user
  } catch (e) {
    throw e
  }
}

export async function getReportData(reportType, companyId, branchId, startDate, endDate, token) {
  try {
    let data
    if (reportType === 1)
      data = '{"MethodName": "GetVisitorActivityList", "Parameters": {"CompanyId": ' + companyId + ', "BranchId": ' + branchId + ', "StartDate": "' + startDate + '", "EndDate": "' + endDate + '"}}'
    else
      throw new Error('Reporte no está parametrizado')
    const endpoint = ADMIN_URL + '/messagewithresponse'
    const list = await postWithResponse(endpoint, data, token)
    if (list === null) return []
    return list
  } catch (e) {
    throw e
  }
}

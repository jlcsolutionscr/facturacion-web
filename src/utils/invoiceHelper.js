import { encryptString, downloadFile, getWithResponse, post } from './utilities'
const SERVICE_URL = process.env.REACT_APP_SERVER_URL
const APP_URL = `${SERVICE_URL}/PuntoventaWCF.svc`

export async function downloadWindowsApp() {
  try {
    const endpointURL = APP_URL + '/descargaractualizacion'
    await downloadFile(endpointURL)
  } catch (e) {
    throw e
  }
}

export async function invoiceLogin(user, password, id) {
  try {
    const ecryptedPass = encryptString(password)
    const endpoint = APP_URL + '/validarcredenciales?usuario=' + user + '&clave=' + ecryptedPass + '&id=' + id
    const company = await getWithResponse(endpoint, '')
    return company
  } catch (e) {
    throw e
  }
}

export async function getCompanyEntity(idCompany, token) {
  try {
    const endpoint = APP_URL + '/obtenerempresa?idempresa=' + idCompany
    const response = await getWithResponse(endpoint, token)
    if (response === null) return []
    return response
  } catch {
    throw new Error('Error al comunicarse con el servicio web. Intente más tarde. . .')
  }
}

export async function saveCompanyEntity(entity, token) {
  try {
    const datos = '{"Entidad": ' + JSON.stringify(entity) + '}'
    const endpoint = APP_URL + '/actualizarempresa'
    await post(endpoint, datos, token)
  } catch (e) {
    throw e
  }
}

export async function saveCompanyLogo(idCompany, strLogo, token) {
  try {
    const datos = '{"Id": ' + idCompany + ', "Datos": ' + JSON.stringify(strLogo) + '}'
    const endpoint = APP_URL + '/actualizarlogoempresa'
    await post(endpoint, datos, token)
  } catch (e) {
    throw e
  }
}

export async function saveCompanyCertificate(idCompany, strCertificate, token) {
  try {
    const datos = '{"Id": ' + idCompany + ', "Datos": ' + JSON.stringify(strCertificate) + '}'
    const endpoint = APP_URL + '/actualizarcertificadoempresa'
    await post(endpoint, datos, token)
  } catch (e) {
    throw e
  }
}

export async function getCantonList(idProvincia, token) {
  try {
    const response = await getWithResponse(APP_URL + '/obtenerlistadocantones?idprovincia=' + idProvincia, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getDistritoList(idProvincia, idCanton, token) {
  try {
    const response = await getWithResponse(APP_URL + '/obtenerlistadodistritos?idprovincia=' + idProvincia + '&idcanton=' + idCanton, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getBarrioList(idProvincia, idCanton, idDistrito, token) {
  try {
    const response = await getWithResponse(APP_URL + '/obtenerlistadobarrios?idprovincia=' + idProvincia + '&idcanton=' + idCanton + '&iddistrito=' + idDistrito, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getBranchList(idCompany, token) {
  try {
    const response = await getWithResponse(APP_URL + '/obtenerlistadosucursales?idempresa=' + idCompany, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getReportData(reportType, idCompany, idBranch, startDate, endDate, token) {
  try {
    const response = await getWithResponse(APP_URL + '/obtenerdatosreporte?tipo=' + reportType + '&idempresa=' + idCompany + '&idsucursal=' + idBranch + '&fechainicial=' + startDate + '&fechafinal=' + endDate, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

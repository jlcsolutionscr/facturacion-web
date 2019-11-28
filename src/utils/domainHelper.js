import { downloadFile, getWithResponse, post } from './utilities'
import CryptoJS from 'crypto-js'
const API_SERVICE = process.env.API_SERVICE
const DOWNLOAD_URL = `${API_SERVICE}/PuntoventaWCF.svc`
const ADMIN_URL = `${API_SERVICE}/AdministracionWCF.svc`

export async function downloadWindowsApp() {
  try {
    const endpointURL = DOWNLOAD_URL + '/descargaractualizacion'
    await downloadFile(endpointURL)
  } catch (e) {
    throw e
  }
}

export async function validateCredentials(user, password, id) {
  try {
    const ecryptedPass = encryptString(password)
    const endpoint = ADMIN_URL + '/validarcredenciales?usuario=' + user + '&clave=' + ecryptedPass + '&id=' + id
    const company = await getWithResponse(endpoint, '')
    return company
  } catch (e) {
    throw e
  }
}

export async function getCompanyEntity(idCompany, token) {
  try {
    const endpoint = ADMIN_URL + '/obtenerempresa?idempresa=' + idCompany
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
    const endpoint = ADMIN_URL + '/actualizarempresa'
    await post(endpoint, datos, token)
  } catch (e) {
    throw e
  }
}

export async function saveCompanyLogo(idCompany, strLogo, token) {
  try {
    const datos = '{"Id": ' + idCompany + ', "Datos": ' + JSON.stringify(strLogo) + '}'
    const endpoint = ADMIN_URL + '/actualizarlogoempresa'
    await post(endpoint, datos, token)
  } catch (e) {
    throw e
  }
}

export async function saveCompanyCertificate(idCompany, strCertificate, token) {
  try {
    const datos = '{"Id": ' + idCompany + ', "Datos": ' + JSON.stringify(strCertificate) + '}'
    const endpoint = ADMIN_URL + '/actualizarcertificadoempresa'
    await post(endpoint, datos, token)
  } catch (e) {
    throw e
  }
}

export async function getCantonList(idProvincia, token) {
  try {
    const response = await getWithResponse(ADMIN_URL + '/obtenerlistadocantones?idprovincia=' + idProvincia, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getDistritoList(idProvincia, idCanton, token) {
  try {
    const response = await getWithResponse(ADMIN_URL + '/obtenerlistadodistritos?idprovincia=' + idProvincia + '&idcanton=' + idCanton, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getBarrioList(idProvincia, idCanton, idDistrito, token) {
  try {
    const response = await getWithResponse(ADMIN_URL + '/obtenerlistadobarrios?idprovincia=' + idProvincia + '&idcanton=' + idCanton + '&iddistrito=' + idDistrito, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getReportData(reportType, idCompany, startDate, endDate, token) {
  try {
    const response = await getWithResponse(ADMIN_URL + '/obtenerdatosreporte?tipo=' + reportType + '&idempresa=' + idCompany + '&fechainicial=' + startDate + '&fechafinal=' + endDate, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

function encryptString(plainText) {
  const phrase = 'Po78]Rba[%J=[14[*'
  const data = CryptoJS.enc.Utf8.parse(plainText)
  const passHash = CryptoJS.enc.Utf8.parse(phrase)
  const iv = CryptoJS.enc.Utf8.parse('@1B2c3D4e5F6g7H8')
  const saltKey = CryptoJS.enc.Utf8.parse('S@LT&KEY')
  const key128Bits1000Iterations = CryptoJS.PBKDF2(passHash, saltKey, { keySize: 256 / 32, iterations: 1000 })
  const encrypted = CryptoJS.AES.encrypt(data, key128Bits1000Iterations, { mode: CryptoJS.mode.CBC, iv: iv, padding: CryptoJS.pad.ZeroPadding })
  const encryptedText = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  return encryptedText
}

import { downloadFile, get, getWithResponse, post, postWithResponse } from './utilities'
import CryptoJS from 'crypto-js'
const API_SERVICE = process.env.API_SERVICE

export async function downloadWindowsApp() {
  try {
    const endpointURL = API_SERVICE + '/descargaractualizacion'
    await downloadFile(endpointURL)
  } catch (e) {
    throw e.message
  }
}

export async function validateCredentials(user, password, id) {
  try {
    const ecryptedPass = encryptString(password)
    const endpoint = API_SERVICE + "/validarcredenciales?usuario=" + user + "&clave=" + ecryptedPass + "&id=" + id
    const company = await getWithResponse(endpoint)
    return company
  } catch (e) {
    throw e.message
  }
}

export async function getCompanyEntity(idCompany) {
  try {
    const endpoint = API_SERVICE + "/obtenerempresa?idempresa=" + idCompany
    const response = await getWithResponse(endpoint)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getCompanyBranchList(idCompany) {
  try {
    const endpoint = API_SERVICE + "/obtenerlistadosucursales?idempresa=" + idCompany
    const response = await getWithResponse(endpoint)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getCompanyTerminalList(idCompany, idBranch) {
  try {
    const endpoint = API_SERVICE + "/obtenerlistadoterminales?idempresa=" + idCompany + "&idsucursal=" + idBranch
    const response = await getWithResponse(endpoint)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function addCompanyEntity(entity, token) {
  try {
    const strData = entity
    const data = "{NombreMetodo: 'AgregarEmpresa', Entidad: " + strData + "}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function updateCompanyEntity(entity, token) {
  try {
    const strData = entity
    const data = "{NombreMetodo: 'ActualizarEmpresa', Entidad: '" + strData + "'}"
    await post(API_SERVICE + "/ejecutarconsulta", token, data)
  } catch (e) {
    throw e.message
  }
}

export async function saveCompanyLogo(idCompany, strLogo, token) {
  try {
    const data = "{NombreMetodo: 'ActualizarLogoEmpresa', Parametros: {Id: " + idCompany + ", Datos: '" + strLogo + "'}}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function removeCompanyLogo(idCompany, token) {
  try {
    const endpoint = API_SERVICE + "/removerlogoempresa?idempresa=" + idCompany
    await get(endpoint, token)
  } catch (e) {
    throw e.message
  }
}

export async function updateCompanyCertificate(idCompany, strCertificate, token) {
  try {
    const data = "{NombreMetodo: 'ActualizarCertificadoEmpresa', Parametros: {Id: " + idCompany + ", Datos: '" + strCertificate + "'}}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function updateCompanyBranch(entity, token) {
  try {
    const strData = entity
    const data = "{NombreMetodo: 'ActualizarSucursalPorEmpresa', Entidad: '" + strData + "'}"
    await post(API_SERVICE + "/ejecutarconsulta", token, data)
  } catch (e) {
    throw e.message
  }
}

export async function updateCompanyTerminal(entity, token) {
  try {
    const strData = entity
    const data = "{NombreMetodo: 'ActualizarTerminalPorSucursal', Entidad: '" + strData + "'}"
    await post(API_SERVICE + "/ejecutarconsulta", token, data)
  } catch (e) {
    throw e.message
  }
}

export async function getProvinciaList(token) {
  try {
    const response = await getWithResponse(API_SERVICE + "/obtenerlistadoprovincias", token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getCantonList(idProvincia, token) {
  try {
    const response = await getWithResponse(API_SERVICE + "/obtenerlistadocantones?idprovincia=" + idProvincia, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getDistritoList(idProvincia, idCanton, token) {
  try {
    const response = await getWithResponse(API_SERVICE + "/obtenerlistadodistritos?idprovincia=" + idProvincia + "&idcanton=" + idCanton, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getBarrioList(idProvincia, idCanton, idDistrito, token) {
  try {
    const response = await getWithResponse(API_SERVICE + "/obtenerlistadobarrios?idprovincia=" + idProvincia + "&idcanton=" + idCanton + "&iddistrito=" + idDistrito, token)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
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

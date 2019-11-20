const API_SERVICE = process.env.API_SERVICE
import { get, getWithResponse, post, postWithResponse } from './utilities'

export async function validateCredentials(user, password, id) {
  try {
    const ecryptedPass = encryptString(password)
    const endpoint = API_SERVICE + "/validarcredenciales?usuario=" + user + "&clave=" + ecryptedPass + "&identificacion=" + id
    company = await getWithResponse(endpoint)
    return company
  } catch (e) {
    throw e.message
  }
}

export async function getCompanyEntity(deviceId) {
  try {
    const endpoint = API_SERVICE + "/obtenerempresa?idempresa=" + deviceId
    const response = await getWithResponse(endpoint)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function saveCompanyEntity(entity) {
  try {
    const strData = entity
    const data = "{NombreMetodo: 'ActualizarEmpresa', Entidad: " + strData + "}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function saveCompanyLogo(idCompany, strLogo) {
  try {
    const strData = entity
    const data = "{NombreMetodo: 'ActualizarLogoEmpresa', Parametros: {IdEmpresa: " + idCompany + ", Logotipo: " + strLogo + "}}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProvinciaList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoProvincias'}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getCantonList(token, idProvincia) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoCantones', Parametros: {IdProvincia: " + idProvincia + "}}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getDistritoList(token, idProvincia, idCanton) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoDistritos', Parametros: {IdProvincia: " + idProvincia + ", IdCanton: " + idCanton + "}}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getBarrioList(token, idProvincia, idCanton, idDistrito) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoBarrios', Parametros: {IdProvincia: " + idProvincia + ", IdCanton: " + idCanton + ", IdDistrito: " + idDistrito + "}}"
    const response = await postWithResponse(API_SERVICE + "/ejecutarconsulta", token, data)
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

import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
import xmlParser from 'react-xml-parser'
import CryptoJS from 'crypto-js'
import QRCode from 'qrcode'

export function encryptString(plainText) {
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

export function formatCurrency (number, decPlaces=2, decSep='.', thouSep=',') {
  const decIndex = number.toString().indexOf(decSep)
  let decValue = decIndex > 0 ? number.toString().substring(1 + decIndex, 1 + decIndex + decPlaces) : ''
  if (decValue.length < decPlaces) decValue += '0'.repeat(decPlaces - decValue.length)
  const integerValue = decIndex > 0 ? number.toString().substring(0, decIndex) : number.toString()
  return integerValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thouSep}`) + decSep + decValue
}

export function roundNumber(number, places) {
  return +(Math.round(number + 'e+' + places) + 'e-' + places)
}

export function arrayToString (byteArray) {
  return String.fromCharCode.apply(null, byteArray)
}

export function xmlToObject (value) {
  const parser = new xmlParser()
  const text = String.fromCharCode.apply(null, value)
  const xml = parser.parseFromString(text)
  let result = {}
  for (let node of xml.children) parseNode(node, result)
  return result
}

function parseNode(xmlNode, result) {
  if (xmlNode.name === '#text') {
    let v = xmlNode.value
    if (v.trim()) result['#text'] = v
    return
  }
  if (xmlNode.value !== '' ) {
    result[xmlNode.name] = xmlNode.value
  } else {
    result[xmlNode.name] = {}
  }
  for (let node of xmlNode.children) parseNode(node, result[xmlNode.name])
}

export function ExportDataToXls(filename, title, data) {
  try {
    const wb = XLSX.utils.book_new()
    wb.Props = {
      Title: title,
      Subject: title,
      Author: 'JLC Solutions CR',
      CreatedDate: new Date()
    }
    wb.SheetNames.push('Test Sheet')
    const ws_data = []
    ws_data.push(['TIPO','EMISOR/RECEPTOR', 'IDENTIFICACION', 'FECHA', 'CONSECUTIVO', 'SUBTOTAL', 'IMPUESTO', 'TOTAL'])
    data.forEach(item => {
      ws_data.push([item.TipoDocumento, item.Nombre, item.Identificacion, item.Fecha, item.Consecutivo, item.Total - item.Impuesto, item.Impuesto, item.Total])
    })
    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    wb.Sheets['Test Sheet'] = ws
    const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'array'})
    saveAs(new Blob([wbout],{type:'application/octet-stream'}), filename + '.xlsx')
  } catch (error) {
    throw error
  }
}

export async function downloadQRCodeImage(accessCode) {
  try {
    const options = {
      width: 400
    }
    const data = await QRCode.toDataURL(accessCode, options)
    saveAs(dataURLtoBlob(data), accessCode + '.png')
  } catch (error) {
    throw error
  }
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?)/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  while(n--){
      u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {type:mime})
}

export async function getWithResponse(endpointURL, token) {
  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (token !== null) {
      headers.Authorization = 'bearer ' + token
    }
    const response = await fetch(endpointURL, {
      method: 'GET',
      headers,
    })
    if (!response.ok) {
      let error = ''
      try {
        error = await response.json()
      } catch {
        error =
          'Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos.'
      }
      throw new Error(error)
    } else {
      const data = await response.json()
      if (data !== '') {
        return JSON.parse(data)
      } else {
        return null
      }
    }
  } catch (error) {
    throw error
  }
}

export async function post(endpointURL, token, datos) {
  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (token !== '') {
      headers.Authorization = 'bearer ' + token
    }
    const response = await fetch(endpointURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(datos),
    })
    if (!response.ok) {
      let error = ''
      try {
        error = await response.json()
      } catch {
        error =
          'Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos.'
      }
      throw new Error(error)
    }
  } catch (error) {
    throw error
  }
}

export async function postWithResponse(endpointURL, token, datos) {
  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (token !== '') {
      headers.Authorization = 'bearer ' + token
    }
    const response = await fetch(endpointURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(datos),
    })
    if (!response.ok) {
      let error = ''
      try {
        error = await response.json()
      } catch {
        error =
          'Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos.'
      }
      throw new Error(error)
    } else {
      const data = await response.json()
      if (data !== '') {
        return JSON.parse(data)
      } else {
        return null
      }
    }
  } catch (error) {
    throw error
  }
}

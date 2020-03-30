import axios from 'axios'
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
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

export function formatCurrency (number) {
  const decPlaces = 2
  const decSep = '.'
  const thouSep = ','
  const decIndex = number.toString().indexOf(decSep)
  const sign = number < 0 ? '-' : ''
  let decValue = decIndex > 0 ? number.toString().substring(1 + decIndex, 1 + decIndex + decPlaces) : ''
  if (decValue.length < decPlaces) decValue += '0'.repeat(decPlaces - decValue.length)
  const integerValue = decIndex > 0 ? number.toString().substring(0, decIndex) : number.toString()
  return sign + integerValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1'+thouSep) + decSep + decValue
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
    ws_data.push(['TIPO','EMISOR/RECEPTOR', 'FECHA', 'CONSECUTIVO', 'IMPUESTO', 'TOTAL'])
    data.forEach(item => {
      ws_data.push([item.TipoDocumento, item.Nombre, item.Fecha, item.Consecutivo, item.Impuesto, item.Total])
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
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

export function downloadFile (endpointURL) {
  return new Promise((resolve, reject) => {
    axios.get(endpointURL, {responseType: 'blob'})
      .then(async (response) => {
        const blob = new Blob([response.data], {type: 'application/octet-stream'})
        saveAs(blob, 'puntoventaJLC.msi')
        resolve(true)
      })
      .catch(error => {
        reject(error.message)
      })
  })
}

export async function getWithResponse(endpointURL, token) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    const response = await axios.get(endpointURL, {
      headers
    })
    if (response.data !== '') {
      return JSON.parse(response.data)
    } else {
      return null
    }
  } catch (error) {
    const message = error.response ? error.response.data ? error.response.data : error.response : error.message ? error.message : ''
    throw new Error(message)
  }
}

export async function post(endpointURL, datos, token) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    await axios({
      method: 'post',
      url: endpointURL,
      headers,
      data: JSON.stringify(datos)
    })
  } catch (error) {
    const message = error.response ? error.response.data ? error.response.data : error.response : error.message ? error.message : ''
    throw new Error(message)
  }
}

export async function postWithResponse(endpointURL, datos, token) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    const response = await axios({
      method: 'post',
      url: endpointURL,
      headers,
      data: JSON.stringify(datos)
    })
    if (response.data !== '') {
      return JSON.parse(response.data)
    } else {
      return null
    }
  } catch (error) {
    const message = error.response ? error.response.data ? error.response.data : error.response : error.message ? error.message : ''
    throw new Error(message)
  }
}

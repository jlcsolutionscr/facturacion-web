import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
import xmlParser from 'react-xml-parser'
import CryptoJS from 'crypto-js'

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
    wb.SheetNames.push('Datos')
    const ws_data = []
    const columns = Object.entries(data[0]).map(key => key[0])
    ws_data.push(columns.map(key => key))
    data.forEach(row => {
      ws_data.push(columns.map(key => row[key]))
    })
    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    wb.Sheets['Datos'] = ws
    const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'array'})
    saveAs(new Blob([wbout],{type:'application/octet-stream'}), filename + '.xlsx')
  } catch (error) {
    throw error
  }
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

export function createTicket(userCode, company, invoice, branchName) {
  const header = {
    date: invoice.Fecha,
    user: userCode,
    title: 'TIQUETE DE FACTURA',
    companyTitle: company.NombreComercial,
    location: company.Direccion,
    telephone1: company.Telefono1,
    companyName: company.NombreEmpresa,
    identifier: company.Identificacion,
    email: company.CorreoNotificacion,
    branchName: branchName,
    docType: invoice.Cliente.IdCliente === 1 ? 'TIQUETE ELECTRONICO' : 'FACTURA ELECTRONICA',
    consec1: invoice.IdDocElectronico !== null ? invoice.IdDocElectronico.substring(0, 25) : null,
    consec2: invoice.IdDocElectronico !== null ? invoice.IdDocElectronico.substring(25) : null,
    invoiceId: invoice.ConsecFactura,
    invoiceDate: invoice.Fecha,
    vendorName: userCode,
    customerName: invoice.Cliente.Nombre,
    customerPhone: invoice.Cliente.Telefono
  }
  const payments = invoice.DesglosePagoFactura.map(row => (
    {id: row.IdFormaPago, description: row.FormaPago.Descripcion, amount: row.MontoLocal}
  ))
  const details = invoice.DetalleFactura.map(row => (
    {id: row.IdConsecutivo, quantity: row.Cantidad, description: row.Descripcion, amount: row.PrecioVenta, exempt: row.Excento ? 'E' : 'G'}
  ))
  const footer = {
    subTotal: invoice.Total - invoice.Impuesto,
    discount: 0,
    taxes: invoice.Impuesto,
    total: invoice.Total,
    payment: invoice.MontoPagado,
    change: invoice.MontoPagado - invoice.Total,
    observations: invoice.TextoAdicional
  }
  const ticket = {
    header,
    payments,
    details,
    footer
  }
  return ticket
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

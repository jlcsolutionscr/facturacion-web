import axios from 'axios'
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'

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
    let taxes = 0
    let total = 0
    ws_data.push(['EMISOR/RECEPTOR', 'FECHA', 'CONSECUTIVO', 'IMPUESTO', 'TOTAL'])
    data.forEach(item => {
      taxes += item.Impuesto
      total += item.Total
      ws_data.push([item.Nombre, item.Fecha, item.Consecutivo, item.Impuesto, item.Total])
    })
    ws_data.push([null, null, null, taxes, total])
    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    wb.Sheets['Test Sheet'] = ws
    const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'array'})
    saveAs(new Blob([wbout],{type:'application/octet-stream'}), filename + '.xlsx')
  } catch (error) {
    const message = error.response.data ? error.response.data : error.message
    throw new Error(message)
  }
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
    const message = error.response.data ? error.response.data : error.message
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
    const message = error.response.data ? error.response.data : error.message
    throw new Error(message)
  }
}

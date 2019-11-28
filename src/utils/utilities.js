import axios from 'axios'
import { saveAs } from 'file-saver'

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

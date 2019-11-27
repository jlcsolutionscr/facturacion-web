import axios from 'axios'
import { saveAs } from 'file-saver'

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

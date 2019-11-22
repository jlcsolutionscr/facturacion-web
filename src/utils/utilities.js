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

export async function get(endpointURL, token) {
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    try {
      await axios.get(endpointURL, {
        headers
      })
    } catch (error) {
      throw new Error(error.response.data)
    }
  } catch (error) {
    throw error
  }
}

export async function getWithResponse(endpointURL, token) {
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    try {
      const response = await axios.get(endpointURL, {
        headers
      })
      if (response.data !== '') {
        return JSON.parse(response.data)
      } else {
        return null
      }
    }
    catch (error) {
      throw new Error(error.response.data)
    }
  } catch (error) {
    throw error
  }
}

export async function post(endpointURL, token, datos) {
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    try {
      await axios.post(endpointURL, {
        headers
      })
    } catch (error) {
      throw new Error(error.response.data)
    }
  } catch (error) {
    throw error
  }
}

export async function postWithResponse(endpointURL, token, datos) {
  try {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    try {
      const response = await axios.post(endpointURL, {
        headers,
        body: JSON.stringify(datos)
      })
      if (response.data !== '') {
        return JSON.parse(response.data)
      } else {
        return null
      }
    }
    catch (error) {
      throw new Error(error.response.data)
    }
  } catch (error) {
    throw error
  }
}

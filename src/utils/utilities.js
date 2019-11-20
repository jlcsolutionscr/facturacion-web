import axios from 'axios'
import { saveAs } from 'file-saver'

export async function downloadWindowsApp (endpointURL) {
  axios.get(endpointURL, {responseType: 'blob'})
    .then(async (response) => {
      const blob = new Blob([response.data], {type: 'application/octet-stream'})
      await saveAs(blob, 'puntoventaJLC.msi')
    })
    .catch(error => {
      throw error.message
    })
}

export async function get(endpointURL) {
  try {
    const response = await axios.get(endpointURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      let error = ""
      try {
        error = await response.json()
      }
      catch {
        error = "Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos."
      }
      throw new Error(error)
    }
  } catch (error) {
    throw error
  }
}

export async function getWithResponse(endpointURL) {
  try {
    const response = await axios.get(endpointURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      let error = ""
      try {
        error = await response.json()
      }
      catch {
        error = "Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos."
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
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    const response = await axios.post(endpointURL, {
      headers
    })
    if (!response.ok) {
      let error = ""
      try {
        error = await response.json()
      }
      catch {
        error = "Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos."
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
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token !== '') headers['Authorization'] = 'bearer ' + token
    const response = await axios.post(endpointURL, {
      headers
    })
    if (!response.ok) {
      let error = ""
      try {
        error = await response.json()
      }
      catch {
        error = "Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos."
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

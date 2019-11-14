import axios from 'axios'
import { saveAs } from 'file-saver'

export async function downloadWindowsApp () {
  axios.get('https://jlcsolutionscr.com/production/PuntoventaWCF.svc/descargaractualizacion', {responseType: 'blob'})
    .then(async (response) => {
      const blob = new Blob([response.data], {type: 'application/octet-stream'})
      await saveAs(blob, 'puntoventaJLC.msi')
    })
    .catch(error => {
      throw error.message
    })
}
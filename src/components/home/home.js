import React, { PureComponent } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'

import Loader from '../loader'
import Menu from '../menu'

import styles from './home.css'

class Home extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      message: 'Descargando',
      loading: false
    }
  }

  downloadFile () {
    this.setState({ loading: true })
    axios.get('https://jlcsolutionscr.com/puntoventa/PuntoventaWCF.svc/descargaractualizacion',
    {responseType: 'blob'})
      .then((response) => {
        const blob = new Blob([response.data], {type: "application/octet-stream"})
        saveAs(blob, 'puntoventaJLC.msi')
        this.setState({ loading: false })
      });
  }
  
  render () {
    return (
      <div id='id_app_content' className="home">
        {this.state.loading && <Loader loaderText={this.state.message} isLoaderActive={this.state.loading}/>}
        <Menu onClick={this.downloadFile.bind(this)}/>
      </div>
    )
  }
}

export default Home

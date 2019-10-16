import React, { PureComponent } from 'react'

import axios from 'axios'
import FileDownload from 'js-file-download'

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
    axios.get('https://jlcsolutionscr.com/puntoventa/PuntoventaWCF.svc/descargaractualizacion')
      .then((response) => {
      FileDownload(response.data, 'puntoventaJLC.msi')
      this.setState({ loading: false })
      });
  }
  
  render () {
    return (
      <div id='id_app_content' className="home">
        <Loader loaderText={this.state.message} isLoaderActive={this.state.loading}/>
        <Menu onClick={this.downloadFile.bind(this)}/>
      </div>
    )
  }
}

export default Home

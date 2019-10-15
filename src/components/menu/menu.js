import React, { PureComponent } from 'react'

import logo from '../../assets/logo.png'
import styles from './menu.css'

class Menu extends PureComponent {
  render () {
    return (
      <div className='menu'>
        <div className='menu_header'>
          <img src={logo} className='menu_logo' alt="logo" />
          <div>
            <p className='title_text' >JLC Solutions CR</p>
            <p className='subtitle_text' >Software Development Company</p>
          </div>
        </div>
        <div className='menu_body'>
          <div className='one_row'>
            <p>Ultima versión del archivo de instalación del sistema: </p>
            <button className='one_row_button' onClick={this.props.onClick}>Descargar</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Menu

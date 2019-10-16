import React from 'react'
import PropTypes from 'prop-types'
import styles from './loader.css'

function Loader ({ loaderText, isLoaderActive }) {
  const style = isLoaderActive ? 'hidden' : 'shown'
  return (
    <div id='id_loader' className='loader__background' style={{style}}>
      <div className='loader__container'>
        <div className='loader__text'>{loaderText}</div>
        <div className='loader__dots__div'>
          <div className='loader__dots' />
          <div className='loader__dots' />
          <div className='loader__dots' />
        </div>
      </div>
    </div>
  )
}

Loader.propTypes = {
  isLoaderActive: PropTypes.bool,
  loaderText: PropTypes.string
}

export default Loader

import React from 'react'
import PropTypes from 'prop-types'
import './loader.css'

function Loader ({ loaderText, isLoaderActive }) {
  const divStyle = { display: isLoaderActive ? 'block' : 'none' }
  return (
    <div id='id_loader' className="loaderBackground" style={divStyle}>
      <div className="loaderContainer">
        <div className="loaderText">{loaderText}</div>
        <div className="loaderDotsDiv">
          <div className="loaderDots bounce1" />
          <div className="loaderDots bounce2" />
          <div className="loaderDots" />
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

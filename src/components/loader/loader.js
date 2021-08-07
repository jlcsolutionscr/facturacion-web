import React from 'react'
import PropTypes from 'prop-types'
import './loader.css'

function Loader ({ loaderText, isLoaderOpen }) {
  const divStyle = { display: isLoaderOpen ? 'block' : 'none' }
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
  isLoaderOpen: PropTypes.bool,
  loaderText: PropTypes.string
}

export default Loader

import React from 'react'
import PropTypes from 'prop-types'
import styles from './loader.css'

function Loader ({ loaderText, isLoaderActive }) {
  const divStyle = { display: isLoaderActive ? 'block' : 'none' }
  return (
    <div id='id_loader' className={styles.loader__background} style={divStyle}>
      <div className={styles.loader__container}>
        <div className={styles.loader__text}>{loaderText}</div>
        <div className={styles.loader__dots__div}>
          <div className={`${styles.loader__dots} ${styles.bounce1}`} />
          <div className={`${styles.loader__dots} ${styles.bounce2}`} />
          <div className={styles.loader__dots} />
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

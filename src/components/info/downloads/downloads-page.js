import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { downloadWindowsAppFromWebSite } from 'store/ui/actions'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { CloudDownloadIcon } from 'utils/iconsHelper'
import MobileAppQRCodeImage from 'assets/img/mobile-app-QR-code.png'
import { createStyle } from 'components/info/styles'

const styles = {
  columns: {
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    backgroundColor: '#E2EBF1',
    height: '40px',
    boxShadow: '6px 6px 10px #888888'
  },
  image: {
    width: '15%',
    boxShadow: '6px 6px 10px #888888'
  }
}

function DownloadsPage(props) {
  const classes = createStyle()

  const downloadFile = () => {
    props.downloadWindowsAppFromWebSite()
  }
  return (
    <div id='id_download_page' className={classes.container}>
      <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
        Productos disponibles
      </Typography>
      <div style={{textAlign: 'center', width: '100%'}}>
        <Typography className={classes.subTitle} paragraph>
          La aplicación para sistemas Windows le permite gestionar sus operaciones mediante una aplicación ágil, segura y eficiente
        </Typography>
        <Button variant='contained' style={styles.button} startIcon={<CloudDownloadIcon />} onClick={() => downloadFile()}>
          Descargar
        </Button>
        <Typography className={classes.subTitle} paragraph>
          Instale nuestra aplicación para dispositivos Android disponible en la Google App Store mediante el siguiente enlace
        </Typography>
        <img src={MobileAppQRCodeImage} style={styles.image} alt='not available' />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    downloadError: state.ui.downloadError
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ downloadWindowsAppFromWebSite }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsPage)

import React from 'react'
import { connect } from 'react-redux'

import { downloadWindowsAppFromWebSite } from '../../store/ui/actions'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { CloudDownloadIcon } from '../../icons/icon'
import { createStyle } from '../styles'

const style = {
  columns: {
    marginLeft: '5%',
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    backgroundColor: 'white',
    marginLeft: '2%',
    height: '40px'
  }
}

function DownloadsPage(props) {
  const classes = createStyle()

  const downloadFile = () => {
    props.downloadWindowsAppFromWebSite()
  }
  return (
    <div id='id_download_page' className={classes.root} style={{height: window.innerHeight - 364}}>
      {props.downloadError != '' &&
        <Typography style={{textAlign: 'center', margin: '2%'}} className={classes.paragraphError} component="p">
          props.downloadError
        </Typography>
      }
      <Typography style={{textAlign: 'center', marginBottom: '2%'}} className={classes.title} color="textSecondary" component="p">
        Nuestros productos
      </Typography>
      <div style={style.columns}>
        <Typography className={classes.paragraphList} paragraph>
          Aplicación Windows: Le permite gestionar sus operaciones mediante una aplicación ágil, segura y eficiente
        </Typography>
        <Button variant="contained" style={style.button} startIcon={<CloudDownloadIcon />} onClick={() => downloadFile()}>
          Descargar
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    downloadError: state.ui.downloadError
  }
}

const mapDispatchToProps = { downloadWindowsAppFromWebSite }

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsPage)

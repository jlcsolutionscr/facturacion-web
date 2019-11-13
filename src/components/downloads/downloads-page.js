import React from 'react'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

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

function DownloadsPage() {
  const classes = createStyle()
  return (
    <div id='id_download_page' className={classes.root} style={{height: window.innerHeight - 364}}>
      <Typography style={{textAlign: 'center', marginBottom: '2%'}} className={classes.title} color="textSecondary" component="p">
        Nuestros productos
      </Typography>
      <div style={style.columns}>
        <Typography className={classes.paragraphList} paragraph>
          Aplicación Windows: Le permite gestionar sus operaciones mediante una aplicación ágil, segura y eficiente
        </Typography>
        <Button variant="contained" style={style.button} startIcon={<CloudDownloadIcon />}>
          Descargar
        </Button>
      </div>
    </div>
  )
}

export default DownloadsPage

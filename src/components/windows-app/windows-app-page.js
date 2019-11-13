import React from 'react'

import Typography from '@material-ui/core/Typography'
import { createStyle } from '../styles'

function WindowsAppPage() {
  const classes = createStyle()
  return (
    <div id='id_windows_app_page' style={{height: window.innerHeight - 364}} className={classes.root}>
      <Typography style={{textAlign: 'center', marginBottom: '2%'}} className={classes.title} color="textSecondary" component="p">
        Under construction
      </Typography>
    </div>
  )
}

export default WindowsAppPage

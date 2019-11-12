import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import MobileAppCard from './mobile-app-card'
import PlatformCard from './platform-card'
import WindowsAppCard from './windows-app-card'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: '4%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FAFAFA'
  }
}))

function HomePage() {
  const classes = useStyles()
  return (
    <div id='id_app_content' className={classes.root}>
      <MobileAppCard />
      <WindowsAppCard />
      <PlatformCard />
    </div>
  )
}

export default HomePage

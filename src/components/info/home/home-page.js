import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import MobileAppCard from './mobile-app-card'
import PlatformCard from './platform-card'
import WindowsAppCard from './windows-app-card'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: '2%',
    padding: '4%'
  }
}))

function HomePage(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={10}>
          <Grid item xs>
            <MobileAppCard onClick={props.onClick} />
          </Grid>
          <Grid item xs>
            <WindowsAppCard onClick={props.onClick}/>
          </Grid>
          <Grid item xs>
            <PlatformCard onClick={props.onClick}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomePage

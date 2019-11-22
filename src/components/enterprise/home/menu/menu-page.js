import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    height: 'inherit'
  },
  button: {
    width: '20%',
    padding: '15px 20px',
    backgroundColor: 'rgba(0,0,0,0.65)',
    color: 'white',
    borderColor: 'white',
    border: '0.6px solid',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.45)',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    }
  },
}))

function HomePage(props) {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid container align='center' spacing={3}>
        <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.onClick(1)}>Actualice su información</Button>
        </Grid>
        <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.onClick(2)}>Incluya su logotipo</Button>
        </Grid>
        <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.onClick(3)}>Configure su usuario ATV</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default HomePage

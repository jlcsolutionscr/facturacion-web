import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    borderRadius: '8px',
    overflowY: 'auto',
    marginLeft: '150px',
    marginRight: '150px',
    padding: '25px',
    maxHeight: `${window.innerHeight - 302}px`,
    backgroundColor: 'rgba(255,255,255,0.55)'
  },
  errorLabel: {
    fontFamily: '"Exo 2", sans-serif',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(15),
    color: 'red',
    fontWeight: '700',
    marginBottom: '20px'
  },
  subTitle: {
    fontFamily: '"Exo 2", sans-serif',
    color: 'green',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(35),
    fontWeight: 500,
    marginBottom: '100px'
  },
  button: {
    padding: '5px 15px',
    backgroundColor: '#239BB5',
    color: 'white',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: '#29A4B4',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    }
  },
  imagePreview: {
    textAlign: 'center',
    height: '160px',
    width: '350px'
  }
}))

function ReportsPage(props) {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      {props.reportsPageError !== '' && <Typography className={classes.errorLabel} color='textSecondary' component='p'>
        {props.reportsPageError}
      </Typography>}
      <Typography className={classes.subTitle} style={{fontWeight: '700'}} color='textSecondary' component='p'>
        Page under construction.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button variant='contained' className={classes.button} onClick={() => props.setActiveHomeSection(0)}>
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default ReportsPage

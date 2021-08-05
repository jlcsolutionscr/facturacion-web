import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import {
  setActiveSection,
} from 'store/billing/actions'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    marginTop: '50px',
    marginLeft: '30px',
    padding: '50px 30px 0 30px',
    '@media (max-width:414px)': {
      marginTop: '5px',
      marginLeft: '5px',
      padding: '10px'
    },
    '@media (max-width:360px)': {
      marginLeft: '0'
    }
  },
  text: {
    fontFamily: 'RussoOne',
    fontStyle: 'normal',
    fontSize: theme.typography.pxToRem(20),
    textShadow: '4px 4px 6px rgba(0,0,0,0.15)',
    '@media (max-width:630px)': {
      fontSize: theme.typography.pxToRem(18)
    },
    '@media (max-width:500px)': {
      fontSize: theme.typography.pxToRem(17)
    },
    '@media (max-width:414px)': {
      fontSize: theme.typography.pxToRem(16)
    }
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
  }
}))

function UnderConstructionPage({ setActiveSection }) {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item>
          <p className={classes.text}>
            Esta página se encuentra en desarrollo
          </p>
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' className={classes.button} onClick={() => setActiveSection(0)}>
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setActiveSection,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(UnderConstructionPage)
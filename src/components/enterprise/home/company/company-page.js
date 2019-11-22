import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { authenticateSession } from 'store/session/actions'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { ErrorIcon } from 'utils/iconsHelper'
import Button from '@material-ui/core/Button'
import Loader from 'components/loader/loader'

function CompanyPage(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [id, setId] = useState('')
  const handleOnChange = field => (event) => {
    if (field === 'username') setUsername(event.target.value)
    if (field === 'password') setPassword(event.target.value)
    if (field === 'id') setId(event.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13 && username !== '' && password !== '') {
      handleOnClick()
    }
  }

  const handleOnClick = () => {
    props.authenticateSession(username, password, id)
  }

  const useStyles = makeStyles(theme => ({
    root: {
      height: `${window.innerHeight}px`,
      backgroundColor: '#EFF7F7'
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1)
    },
    margin: {
      margin: theme.spacing(1)
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    icon: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    }
  }))
  const classes = useStyles()
  const isSubmitButtonDisabled = username === '' || password === '' || id === ''

  return (
    <Grid container component='main'>
      <Grid item xs={12} sm={6} md={3} classes={{root: classes.root}} component={Paper} elevation={6} square>
        <form className={classes.form} noValidate>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Código usuario'
            name='username'
            value={username}
            onChange={handleOnChange('username')}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Contraseña'
            type='password'
            id='password'
            value={password}
            onChange={handleOnChange('password')}
            onKeyDown={handleKeyPress}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='id'
            label='Identificación'
            id='id'
            value={id}
            onChange={handleOnChange('id')}
            onKeyDown={handleKeyPress}
          />
          <Button
            disabled={isSubmitButtonDisabled}
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleOnClick}>
            Ingresar
          </Button>
        </form>
      </Grid>
      <Loader isLoaderActive={props.isLoaderActive} loaderText={props.loaderText} />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={props.loginError !== ''}
        autoHideDuration={6000} >
        <SnackbarContent
          className={classes.error}
          aria-describedby='client-snackbar'
          message={
            <span id='client-snackbar' className={classes.message}>
              <ErrorIcon className={classes.icon} />
              {props.loginError}
            </span>
          }
        />
      </Snackbar>
    </Grid>
  )
}

export default CompanyPage
              
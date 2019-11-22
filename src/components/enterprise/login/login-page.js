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
import Link from '@material-ui/core/Link'
import { ErrorIcon } from 'utils/iconsHelper'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Loader from 'components/loader/loader'
import LogoImage from 'assets/img/login-logo.png'
import BackgroundImage from 'assets/img/login-background.jpg'

function LoginPage(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [id, setId] = useState('')
  const handleOnChange = field => (event) => {
    if (field === 'username') setUsername(event.target.value)
    if (field === 'password') setPassword(event.target.value)
    if (field === 'id') setId(event.target.value)
  }

  const handleOnClick = () => {
    props.authenticateSession(username, password, id)
  }

  const _renderSignInView = () => {
    const useStyles = makeStyles(theme => ({
      root: {
        height: `${window.innerHeight}px`,
        backgroundColor: '#EFF7F7'
      },
      image: {
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'top'
      },
      avatar: {
        margin: theme.spacing(3),
        width: '180px',
        height: '180px',
        backgroundColor: '#00729f'
      },
      paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      logo: {
        position: 'relative',
        marginTop: '20px',
        marginLeft: '10px'
      },
      logoImage: {
        height: '200px',
        width: '200px'
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
    const preventDefault = event => event.preventDefault()

    return (
      <Grid container component='main'>
        <Grid item xs={12} sm={6} md={3} classes={{root: classes.root}} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <img src={LogoImage} style={{width: '80%'}} alt='not available' />
            </Avatar>
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
              />
              <Box mt={5}>
                <Button
                  disabled={isSubmitButtonDisabled}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleOnClick}>
                  Ingresar
                </Button>
              </Box>
              <Grid container>
              <Grid item xs={12} style={{marginTop: '5%', textAlign: 'center'}}>
                <Link onClick={preventDefault} variant="body2">
                  Olvido su contraseña?
                </Link>
              </Grid>
            </Grid>
            </form>
          </div>
        </Grid>
        <Grid item xs={false} sm={6} md={9} className={classes.image} />
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

  return (
    <>
      {_renderSignInView()}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoaderActive: state.ui.isLoaderActive,
    loaderText: state.ui.loaderText,
    loginError: state.session.loginError
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ authenticateSession }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

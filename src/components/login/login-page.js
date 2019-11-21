import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { ErrorIcon } from 'utils/iconsHelper'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/styles'
import Loader from 'components/loader/loader'
import LogoImage from 'assets/img/login-logo.png'
import BackgroundImage from 'assets/img/login-background.jpg'

const styles = theme => ({
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
})

export class LoginPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      snackbarOpen: true
    }
  }

  render () {
    return (
      <>
        {this._renderSignInView()}
      </>
    )
  }

  handleOnChange = field => (event) => {
    if (field === 'username') this.setState({ username: event.target.value })
    if (field === 'password') this.setState({ password: event.target.value })
    this.setState({ snackbarOpen: false })
  }

  handleKeyPress =(e) => {
    if (e.keyCode === 13 && this.state.username !== '' && this.state.password !== '') {
      this.handleOnClick()
    }
  }

  handleOnClick = () => {
    this.props.loginUser(this.state.username, this.state.password)
    this.setState({
      username: '',
      password: '',
      snackbarOpen: true
    })
  }

  _renderSignInView () {
    const { classes } = this.props
    const isSubmitButtonDisabled = this.state.username === '' || this.state.password === ''
    const isLoginFailure = this.props.authenticationError !== ''

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
                label='Username'
                name='username'
                value={this.state.username}
                onChange={this.handleOnChange('username')}
                onKeyDown={this.handleKeyPress}
                autoFocus
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                value={this.state.password}
                onChange={this.handleOnChange('password')}
                onKeyDown={this.handleKeyPress}
              />
              <Box mt={5}>
                <Button
                  disabled={isSubmitButtonDisabled}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.handleOnClick}>
                  Inicio
                </Button>
              </Box>
            </form>
          </div>
        </Grid>
        <Grid item xs={false} sm={6} md={9} className={classes.image} />
        <Loader isLoaderActive={this.props.isLoaderActive} loaderText={this.props.loaderText} />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={isLoginFailure && this.state.snackbarOpen}
          autoHideDuration={6000} >
          <SnackbarContent
            className={classes.error}
            aria-describedby='client-snackbar'
            message={
              <span id='client-snackbar' className={classes.message}>
                <ErrorIcon className={classes.icon} />
                {this.props.authenticationError}
              </span>
            }
          />
        </Snackbar>
      </Grid>
    )
  }
}

export default withStyles(styles)(LoginPage)

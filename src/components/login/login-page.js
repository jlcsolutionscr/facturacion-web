import React, { Component } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { ErrorIcon } from 'utils/iconsHelper'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/styles'
import Loader from 'components/loader/loader'
import Logo from 'assets/img/Logo.png'

const styles = theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(http://blog.digitalglobe.com/wp-content/uploads/2018/02/maxar_linkedin_cover-1024x512.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  avatar: {
    margin: theme.spacing(3),
    width: '180px',
    height: '180px',
    backgroundColor: theme.palette.secondary.main
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
  submit: {
    margin: theme.spacing(3, 0, 2)
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
      <Grid container component='main' className={classes.root}>
        <CssBaseline />
        <Grid item xs={12} sm={6} md={3} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <img src={Logo} style={{marginLeft: '10%', width: '35%'}} alt='not available' />
            </Avatar>
            <Typography component='h1' variant='h5'>
              JLC Solutions
            </Typography>
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
                  className={classes.submit}
                  disabled={isSubmitButtonDisabled}
                  id='id_action_signin_proceed'
                  variant='contained'
                  label='Sign In'
                  fullWidth
                  onClick={this.handleOnClick}
                  color='secondary' />
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

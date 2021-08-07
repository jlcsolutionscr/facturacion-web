import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { ErrorIcon } from 'utils/iconsHelper'
import { makeStyles } from '@material-ui/core/styles'

import Loader from 'components/loader'
import LoginPage from './login/login-page'
import HomePage from './invoice/home-page'

import { setErrorMessage } from 'store/ui/actions'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    height: `${window.innerHeight}px`
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  }
}))

function RoutingPage({ authenticated, errorMessage, isLoaderOpen, loaderText, setErrorMessage}) {
  const classes = useStyles()
  const component = !authenticated ? <LoginPage /> : <HomePage />
  return (
    <div className={classes.container}>
      <Loader isLoaderOpen={isLoaderOpen} loaderText={loaderText} />
      {component}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={errorMessage !== ''}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <SnackbarContent
          className={classes.error}
          aria-describedby='client-snackbar'
          message={
            <span id='client-snackbar' className={classes.message}>
              <ErrorIcon className={classes.icon} />
              {errorMessage}
            </span>
          }
        />
      </Snackbar>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.session.authenticated,
    isLoaderOpen: state.ui.isLoaderOpen,
    loaderText: state.ui.loaderText,
    errorMessage: state.ui.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setErrorMessage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RoutingPage)

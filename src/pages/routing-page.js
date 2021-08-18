import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ThemeProvider } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { ErrorIcon, InfoIcon } from 'utils/iconsHelper'
import { makeStyles } from '@material-ui/core/styles'

import Loader from 'components/loader'
import useWindowSize from 'hooks/use-window-size'
import LoginPage from './login/login-page'
import HomePage from './invoice/home-page'

import { setMessage } from 'store/ui/actions'
import { darkTheme, lightTheme } from "utils/muiThemeProvider"

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex'
  },
  error: {
    backgroundColor: theme.palette.error.normal
  },
  info: {
    backgroundColor: theme.palette.info.normal
  },
  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  }
}))

function RoutingPage({ authenticated, message, messageType, isLoaderOpen, loaderText, setMessage}) {
  const classes = useStyles()
  const size = useWindowSize()
  const [isDarkMode, setDarkMode] = React.useState(false)
  const width = size.width > 320 ? size.width : 320
  const component = !authenticated ? <LoginPage isDarkMode={isDarkMode} setDarkMode={setDarkMode} /> : <HomePage width={width} />
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div id='main_container' className={classes.container} style={{height: `${size.height}px`, width: `${size.width}px`}}>
        <Loader isLoaderOpen={isLoaderOpen} loaderText={loaderText} />
        {component}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={message !== ''}
          autoHideDuration={6000}
          onClose={() => setMessage('')}
        >
          <SnackbarContent
            className={messageType === 'ERROR' ? classes.error : classes.info}
            aria-describedby='client-snackbar'
            message={
              <span id='client-snackbar' className={classes.message}>
                {messageType === 'ERROR' ? <ErrorIcon className={classes.icon} /> : <InfoIcon className={classes.icon} />}
                {message}
              </span>
            }
          />
        </Snackbar>
      </div>
    </ThemeProvider>
  )
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.session.authenticated,
    isLoaderOpen: state.ui.isLoaderOpen,
    loaderText: state.ui.loaderText,
    message: state.ui.message,
    messageType: state.ui.messageType
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setMessage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RoutingPage)

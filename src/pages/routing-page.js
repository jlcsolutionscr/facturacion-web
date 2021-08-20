import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ThemeProvider } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
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
  snackbarMessage: {
    width: '100%'
  },
  snackbarError: {
    backgroundColor: props => props.isDarkMode ? '#b23c17' : '#ab003c'
  },
  snackbarInfo: {
    backgroundColor: props => props.isDarkMode ? '#2196f3' : '#1c54b2'
  },
  message: {
    color: props => props.isDarkMode ? '#FFF' : '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    width: '32px',
    height: '32px',
    opacity: 0.9
  }
}))

function RoutingPage({ authenticated, message, messageType, isLoaderOpen, loaderText, setMessage}) {
  const size = useWindowSize()
  const [isDarkMode, setDarkMode] = React.useState(false)
  const classes = useStyles({isDarkMode: isDarkMode})
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
          TransitionComponent={Slide}
          autoHideDuration={6000}
          open={message !== ''}
          onClose={() => setMessage('')}
        >
          <SnackbarContent
            classes={{
              root: messageType === 'ERROR' ? classes.snackbarError : classes.snackbarInfo,
              message: classes.snackbarMessage
            }}
            message={
              <div className={classes.message} id='client-snackbar'>
                <span>{message}</span>
                {messageType === 'ERROR' ? <ErrorIcon className={classes.icon} /> : <InfoIcon className={classes.icon} />}
              </div>
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

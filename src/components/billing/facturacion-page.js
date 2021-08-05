import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loader from 'components/loader/loader'
import LoginPage from 'components/billing/login/login-page'
import InvoiceHomePage from 'components/billing/home/home-page'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import { setErrorMessage } from 'store/ui/actions'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    height: `${window.innerHeight}px`
  },
  errorLabel: {
    fontFamily: '"Exo 2", sans-serif',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(15),
    color: 'red',
    fontWeight: '700',
    marginBottom: '20px'
  }
}))

function FacturacionPage({ authenticated, errorMessage, isLoaderActive, loaderText, setErrorMessage}) {
  const classes = useStyles()
  const component = !authenticated ? <LoginPage /> : <InvoiceHomePage />
  const open = errorMessage !== ''
  return (
    <div className={classes.container}>
      <Loader isLoaderActive={isLoaderActive} loaderText={loaderText} />
      <Dialog open={open}>
        <DialogTitle id="simple-dialog-title">Error en el procesamiento de la petición</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorMessage('')} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      {component}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.session.authenticated,
    productId: state.session.productId,
    isLoaderActive: state.ui.isLoaderActive,
    loaderText: state.ui.loaderText,
    errorMessage: state.ui.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setErrorMessage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FacturacionPage)

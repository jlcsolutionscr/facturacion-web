import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import LoginPage from 'components/facturacion/login/login-page'
import InvoiceHomePage from 'components/facturacion/home/home-page'
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
    display: 'flex'
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

function FacturacionPage(props) {
  const classes = useStyles()
  const component = !props.authenticated ? <LoginPage {...props} /> : <InvoiceHomePage />
  const open = props.errorMessage !== ''
  return (
    <div className={classes.container}>
      <Dialog open={open}>
        <DialogTitle id="simple-dialog-title">Error en el procesamiento de la petición</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setErrorMessage('')} color="primary" autoFocus>
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
    errorMessage: state.ui.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setErrorMessage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FacturacionPage)

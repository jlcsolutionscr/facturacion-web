import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setBranchId, setPaymentId, saveInvoice, resetInvoice } from 'store/invoice/actions'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

import { formatCurrency } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'white',
    padding: '10px'
  },
  summary: {
    flexDirection: 'column',
    maxWidth: '300px',
    textAlign: 'center'
  },
  details: {
    marginTop: '10px',
    textAlign: 'left'
  },
  summaryTitle: {
    marginTop: '20px',
    fontWeight: '700',
    color: 'black'
  },
  columnRight: {
    textAlign: 'right'
  },
  summaryRow: {
    color: 'black'
  },
  centered: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'center'
  }
}))

function StepThreeScreen({
  value,
  index,
  branchId,
  branchList,
  summary,
  paymentId,
  successful,
  setBranchId,
  setPaymentId,
  saveInvoice,
  resetInvoice}) {
  const { gravado, exonerado, excento, subTotal, impuesto, total } = summary
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [value])
  const buttonDisabled = total === 0
  let paymentMethods = [{Id: 1, Descripcion: 'EFECTIVO'}, {Id: 2, Descripcion: 'TARJETA'}, {Id: 3, Descripcion: 'CHEQUE'}, {Id: 4, Descripcion: 'TRANSFERENCIA'}]
  const paymentItems = paymentMethods.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const branchItems = branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const handleOnPress = () => {
    if (!successful) {
      saveInvoice()
    } else {
      resetInvoice()
    }
  }
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={`${classes.summary} ${classes.centered}`}>
          <InputLabel className={classes.summaryTitle}>RESUMEN DE FACTURA</InputLabel>
          <Grid container spacing={3} className={classes.details}>
            <Grid item xs={6}>
            <InputLabel className={classes.summaryRow}>Gravado</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(gravado)}</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Exonerado</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(exonerado)}</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Excento</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(excento)}</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>SubTotal</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(subTotal)}</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Impuesto</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(impuesto)}</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Total</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(total)}</InputLabel>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.centered}>
            <FormControl style={{maxWidth: '400px', textAlign: 'left'}}>
              <InputLabel id='demo-simple-select-label'>Seleccione la sucursal:</InputLabel>
              <Select
                id='Sucursal'
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
              >
                {branchItems}
              </Select>
            </FormControl>
          </Grid>
        <Grid item xs={12} className={classes.centered}>
          <FormControl style={{width: '215px', textAlign: 'left'}}>
            <InputLabel id='demo-simple-select-label'>Seleccione la forma de pago:</InputLabel>
            <Select
              id='Sucursal'
              value={paymentId}
              onChange={(event) => setPaymentId(event.target.value)}
            >
              {paymentItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <Button disabled={buttonDisabled} variant='contained' className={classes.button} onClick={handleOnPress}>
            {successful ? 'Nueva factura': 'Generar'}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    paymentId: state.invoice.paymentId,
    branchId: state.invoice.branchId,
    summary: state.invoice.summary,
    successful: state.invoice.successful,
    branchList: state.ui.branchList,
    error: state.invoice.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setBranchId,
    setPaymentId,
    saveInvoice,
    resetInvoice
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepThreeScreen)

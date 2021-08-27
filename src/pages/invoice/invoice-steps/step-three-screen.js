import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import {
  setPaymentId,
  setComment,
  saveInvoice,
  resetInvoice,
  generateInvoiceTicket,
  setTicket
} from 'store/invoice/actions'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'

import Button from 'components/button'
import TextField from 'components/text-field'
import Ticket from 'components/ticket'
import { formatCurrency } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: '2%',
    backgroundColor: theme.palette.background.pages
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
    color: theme.palette.text.primary
  },
  columnRight: {
    textAlign: 'right'
  },
  summaryRow: {
    color: theme.palette.text.primary
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
  summary,
  paymentId,
  comment,
  successful,
  invoiceId,
  ticket,
  setPaymentId,
  setComment,
  saveInvoice,
  resetInvoice,
  generateInvoiceTicket,
  setTicket,
  setValue
}) {
  const { gravado, exonerado, excento, subTotal, impuesto, total } = summary
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [value])
  const buttonDisabled = total === 0
  let paymentMethods = [{Id: 1, Descripcion: 'EFECTIVO'}, {Id: 2, Descripcion: 'TARJETA'}, {Id: 3, Descripcion: 'CHEQUE'}, {Id: 4, Descripcion: 'TRANSFERENCIA'}]
  const paymentItems = paymentMethods.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const handleOnPress = () => {
    if (!successful) {
      saveInvoice()
    } else {
      resetInvoice()
      setValue(0)
    }
  }
  const handleOnPrintButton = () => {
    generateInvoiceTicket(invoiceId)
  }
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={successful}
            label='Observaciones'
            id='Observacion'
            value={comment}
            fullWidth
            variant='outlined'
            onChange={(event) => setComment(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={`${classes.summary} ${classes.centered}`}>
          <InputLabel className={classes.summaryTitle}>RESUMEN DE FACTURA</InputLabel>
          <Grid container spacing={2} className={classes.details}>
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
          <FormControl style={{width: '215px', textAlign: 'left'}}>
            <InputLabel id='demo-simple-select-label'>Seleccione la forma de pago:</InputLabel>
            <Select
              disabled={successful}
              id='Sucursal'
              value={paymentId}
              onChange={(event) => setPaymentId(event.target.value)}
            >
              {paymentItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <Button disabled={buttonDisabled} label={successful ? 'Nueva factura': 'Generar'} onClick={handleOnPress} />
        </Grid>
        {successful && <Grid item xs={12} className={classes.centered}>
          <Button disabled={buttonDisabled} label='Imprimir' onClick={handleOnPrintButton} />
        </Grid>}
      </Grid>
      <Dialog id="print-dialog" onClose={() => setTicket(null)} open={ticket !== null}>
        <Ticket data={ticket} />
      </Dialog>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    invoiceId: state.invoice.invoiceId,
    paymentId: state.invoice.paymentId,
    summary: state.invoice.summary,
    comment: state.invoice.comment,
    successful: state.invoice.successful,
    ticket: state.invoice.ticket,
    branchList: state.ui.branchList,
    error: state.invoice.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setPaymentId,
    setComment,
    saveInvoice,
    resetInvoice,
    generateInvoiceTicket,
    setTicket
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepThreeScreen)

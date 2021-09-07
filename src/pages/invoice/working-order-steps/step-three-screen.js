import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import {
  setDeliveryAttribute,
  setPaymentId,
  saveWorkingOrder,
  generateWorkingOrderTicket,
  generateInvoice,
  generateInvoiceTicket
} from 'store/working-order/actions'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import Button from 'components/button'
import TextField from 'components/text-field'
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
  },
  left: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'flex-start'
  }
  ,
  right: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'flex-end'
  }
}))

function StepThreeScreen({
  value,
  index,
  summary,
  paymentId,
  deliveryPhone,
  deliveryAddress,
  deliveryDescription,
  deliveryDate,
  deliveryTime,
  deliveryDetails,
  workingOrderId,
  status,
  setDeliveryAttribute,
  setPaymentId,
  saveWorkingOrder,
  generateWorkingOrderTicket,
  generateInvoice,
  generateInvoiceTicket,
  setValue
}) {
  const { gravado, exonerado, excento, subTotal, impuesto, total } = summary
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [value])
  const fieldDisabled = status === 'converted'
  const buttonDisabled = total === 0 || status === 'ready' || status === 'converted'
  let paymentMethods = [{Id: 1, Descripcion: 'EFECTIVO'}, {Id: 2, Descripcion: 'TARJETA'}, {Id: 3, Descripcion: 'CHEQUE'}, {Id: 4, Descripcion: 'TRANSFERENCIA'}]
  const paymentItems = paymentMethods.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const handleOnPrintClick = () => {
    if (status === 'converted') {
      generateInvoiceTicket()
    } else {
      generateWorkingOrderTicket(workingOrderId)
    }
  }
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Teléfono'
            id='Telefono'
            value={deliveryPhone}
            onChange={(event) => setDeliveryAttribute('phone', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Dirección'
            id='Direccion'
            value={deliveryAddress}
            onChange={(event) => setDeliveryAttribute('address', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Descripción'
            id='ThreeDescripcion'
            value={deliveryDescription}
            onChange={(event) => setDeliveryAttribute('description', event.target.value)}
          />
        </Grid>
        <Grid item xs={6} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Fecha de entrega'
            id='FechaDeEntrega'
            value={deliveryDate}
            onChange={(event) => setDeliveryAttribute('date', event.target.value)}
          />
        </Grid>
        <Grid item xs={6} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Hora de entrega'
            id='HoraDeEntrega'
            value={deliveryTime}
            onChange={(event) => setDeliveryAttribute('time', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={status === 'converted'}
            label='Observaciones'
            id='Observaciones'
            value={deliveryDetails}
            onChange={(event) => setDeliveryAttribute('details', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={`${classes.summary} ${classes.centered}`}>
          <InputLabel className={classes.summaryTitle}>RESUMEN DE ORDEN SERVICIO</InputLabel>
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
        {status === 'on-progress' && <Grid item xs={12} className={classes.centered}>
          <Button 
            disabled={buttonDisabled}
            label={workingOrderId > 0 ? 'Actualizar' : 'Agregar'}
            onClick={() => saveWorkingOrder()}
          />
        </Grid>}
        {(status === 'ready' || status === 'converted') && <Grid item xs={12} className={classes.centered}>
          <Button label={status === 'ready' ? 'Imprimir Orden' : 'Imprimir Factura'} onClick={handleOnPrintClick} />
        </Grid>}
        {status === 'ready' && <Grid item xs={12} className={classes.centered}>
          <FormControl style={{width: '215px', textAlign: 'left'}}>
            <InputLabel id='demo-simple-select-label'>Seleccione la forma de pago:</InputLabel>
            <Select
              id='forma-Pago'
              value={paymentId}
              onChange={(event) => setPaymentId(event.target.value)}
            >
              {paymentItems}
            </Select>
          </FormControl>
        </Grid>}
        {status === 'ready' && <Grid item xs={12} className={classes.centered}>
          <Button label='Facturar' onClick={() => generateInvoice()} />
        </Grid>}
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    workingOrderId: state.workingOrder.workingOrderId,
    status: state.workingOrder.status,
    summary: state.workingOrder.summary,
    paymentId: state.workingOrder.paymentId,
    deliveryPhone: state.workingOrder.deliveryPhone,
    deliveryAddress: state.workingOrder.deliveryAddress,
    deliveryDescription: state.workingOrder.deliveryDescription,
    deliveryDate: state.workingOrder.deliveryDate,
    deliveryTime: state.workingOrder.deliveryTime,
    deliveryDetails: state.workingOrder.deliveryDetails,
    ticket: state.workingOrder.ticket,
    branchList: state.ui.branchList,
    error: state.workingOrder.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setDeliveryAttribute,
    setPaymentId,
    saveWorkingOrder,
    generateWorkingOrderTicket,
    generateInvoice,
    generateInvoiceTicket
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepThreeScreen)

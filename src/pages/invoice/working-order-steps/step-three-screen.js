import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import {
  setDeliveryPhone,
  setDeliveryAddress,
  setDeliveryDescription,
  setDeliveryDate,
  setDeliveryTime,
  setDeliveryDetails,
  saveWorkingOrder,
  resetWorkingOrder,
  generateWorkingOrderTicket
} from 'store/working-order/actions'

import { loadInvoiceFromWorkingOrder } from 'store/invoice/actions'

import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'

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
  deliveryPhone,
  deliveryAddress,
  deliveryDescription,
  deliveryDate,
  deliveryTime,
  deliveryDetails,
  successful,
  workingOrderId,
  status,
  setDeliveryPhone,
  setDeliveryAddress,
  setDeliveryDescription,
  setDeliveryDate,
  setDeliveryTime,
  setDeliveryDetails,
  saveWorkingOrder,
  resetWorkingOrder,
  generateWorkingOrderTicket,
  loadInvoiceFromWorkingOrder,
  setValue
}) {
  const { gravado, exonerado, excento, subTotal, impuesto, total } = summary
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [value])
  const buttonDisabled = total === 0 || status === 'ready'
  const handleOnSaveButtonClick = () => {
    if (!successful) {
      saveWorkingOrder()
    } else {
      resetWorkingOrder()
      setValue(0)
    }
  }
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={successful}
            label='Teléfono'
            id='Telefono'
            value={deliveryPhone}
            fullWidth
            variant='outlined'
            onChange={(event) => setDeliveryPhone(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={successful}
            label='Dirección'
            id='Direccion'
            value={deliveryAddress}
            fullWidth
            variant='outlined'
            onChange={(event) => setDeliveryAddress(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={successful}
            label='Descripción'
            id='ThreeDescripcion'
            value={deliveryDescription}
            fullWidth
            variant='outlined'
            onChange={(event) => setDeliveryDescription(event.target.value)}
          />
        </Grid>
        <Grid item xs={6} className={classes.centered}>
          <TextField
            disabled={successful}
            label='Fecha de entrega'
            id='FechaDeEntrega'
            value={deliveryDate}
            fullWidth
            variant='outlined'
            onChange={(event) => setDeliveryDate(event.target.value)}
          />
        </Grid>
        <Grid item xs={6} className={classes.centered}>
          <TextField
            disabled={successful}
            label='Hora de entrega'
            id='HoraDeEntrega'
            value={deliveryTime}
            fullWidth
            variant='outlined'
            onChange={(event) => setDeliveryTime(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={successful}
            label='Observaciones'
            id='Observaciones'
            value={deliveryDetails}
            fullWidth
            variant='outlined'
            onChange={(event) => setDeliveryDetails(event.target.value)}
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
        <Grid item xs={12} className={classes.centered}>
          <Button disabled={buttonDisabled} label={successful ? 'Nueva orden': workingOrderId > 0 ? 'Actualizar' : 'Agregar'} onClick={handleOnSaveButtonClick} />
        </Grid>
        {status === 'ready' && <Grid item xs={6} className={classes.right}>
          <Button label='Imprimir' onClick={() => generateWorkingOrderTicket(workingOrderId)} />
        </Grid>}
        {status === 'ready' && <Grid item xs={6} className={classes.left}>
          <Button label='Facturar' onClick={() => loadInvoiceFromWorkingOrder()} />
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
    deliveryPhone: state.workingOrder.deliveryPhone,
    deliveryAddress: state.workingOrder.deliveryAddress,
    deliveryDescription: state.workingOrder.deliveryDescription,
    deliveryDate: state.workingOrder.deliveryDate,
    deliveryTime: state.workingOrder.deliveryTime,
    deliveryDetails: state.workingOrder.deliveryDetails,
    successful: state.workingOrder.successful,
    ticket: state.workingOrder.ticket,
    branchList: state.ui.branchList,
    error: state.workingOrder.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setDeliveryPhone,
    setDeliveryAddress,
    setDeliveryDescription,
    setDeliveryDate,
    setDeliveryTime,
    setDeliveryDetails,
    saveWorkingOrder,
    resetWorkingOrder,
    generateWorkingOrderTicket,
    loadInvoiceFromWorkingOrder
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepThreeScreen)

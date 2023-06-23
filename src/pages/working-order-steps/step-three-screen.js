import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setDeliveryAttribute } from 'store/working-order/actions'

import Grid from '@material-ui/core/Grid'

import TextField from 'components/text-field'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: '2%',
    backgroundColor: theme.palette.background.pages
  }
}))

function StepThreeScreen({
  value,
  index,
  delivery,
  status,
  setDeliveryAttribute,
}) {
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    if (value === 2) myRef.current.scrollTo(0, 0)
  }, [value])
  const fieldDisabled = status === 'converted'
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Teléfono'
            id='Telefono'
            value={delivery.phone}
            onChange={(event) => setDeliveryAttribute('phone', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Dirección'
            id='Direccion'
            value={delivery.address}
            onChange={(event) => setDeliveryAttribute('address', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Descripción'
            id='ThreeDescripcion'
            value={delivery.description}
            onChange={(event) => setDeliveryAttribute('description', event.target.value)}
          />
        </Grid>
        <Grid item xs={6} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Fecha de entrega'
            id='FechaDeEntrega'
            value={delivery.date}
            onChange={(event) => setDeliveryAttribute('date', event.target.value)}
          />
        </Grid>
        <Grid item xs={6} className={classes.centered}>
          <TextField
            disabled={fieldDisabled}
            label='Hora de entrega'
            id='HoraDeEntrega'
            value={delivery.time}
            onChange={(event) => setDeliveryAttribute('time', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={status === 'converted'}
            label='Observaciones'
            id='Observaciones'
            value={delivery.details}
            onChange={(event) => setDeliveryAttribute('details', event.target.value)}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    status: state.workingOrder.status,
    delivery: state.workingOrder.delivery
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setDeliveryAttribute }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepThreeScreen)

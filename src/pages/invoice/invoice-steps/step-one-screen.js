import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import LabelField from 'components/label-field'
import { getCustomer } from 'store/customer/actions'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: '2%',
    backgroundColor: theme.palette.background.pages
  }
}))

function StepOneScreen({index, value, customer, customerList, successful, getCustomer}) {
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [value])
  const menuItems = customerList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={7}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Seleccione un cliente</InputLabel>
            <Select
              disabled={successful}
              value={customer ? customer.IdCliente : ''}
              onChange={(event) => getCustomer(event.target.value)}
            >
              {menuItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Nombre del cliente'
            value={customer ? customer.Nombre : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Nombre comercial'
            value={customer ? customer.NombreComercial : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Correo electrónico'
            value={customer ? customer.CorreoElectronico : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Tipo de exoneración'
            value={customer ? customer.ParametroExoneracion.Descripcion : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Código del documento'
            value={customer ? customer.NumDocExoneracion : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Nombre de la institución'
            value={customer ? customer.NombreInstExoneracion : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Fecha de emisión'
            value={customer ? customer.FechaEmisionDoc : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Porcentaje de exoneración'
            value={customer ? customer.PorcentajeExoneracion : ''}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    customer: state.customer.customer,
    customerList: state.customer.customerList,
    successful: state.invoice.successful
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getCustomer }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepOneScreen)

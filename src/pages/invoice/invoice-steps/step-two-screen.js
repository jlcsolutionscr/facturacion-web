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
import { setActiveSection } from 'store/ui/actions'
import { getCustomer } from 'store/customer/actions'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'white',
    padding: '10px'
  }
}))

function StepTwoScreen({index, value, customer, customerList, setActiveSection, getCustomer}) {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const classes = useStyles()
  const menuItems = customerList.map(item => { return <MenuItem key={item.IdCliente} value={item.IdCliente}>{item.Nombre}</MenuItem> })
  return (
    <div className={classes.container} hidden={value !== index}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={9} md={7}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Seleccione un cliente</InputLabel>
            <Select value={customer ? customer.IdCliente : 0} onChange={(event) => getCustomer(event.target.value)}>
              {menuItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Nombre del cliente'
            value={customer ? customer.NombreComercial || customer.Nombre : ''}
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
    customerList: state.customer.customerList
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setActiveSection, getCustomer }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepTwoScreen)

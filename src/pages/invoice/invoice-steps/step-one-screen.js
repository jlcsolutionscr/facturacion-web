import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

import LabelField from 'components/label-field'
import { setActiveSection } from 'store/ui/actions'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'rgba(255,255,255,0.65)',
    padding: '10px'
  }
}))

function StepOneScreen({index, value, customer, customerList, setActiveSection}) {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const classes = useStyles()
  const menuItems = customerList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.NombreCliente}</MenuItem> })
  return (
    <div className={classes.container} hidden={value !== index}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel id='demo-simple-select-label'>Seleccione un cliente</InputLabel>
            <Select value={customer ? customer.Id : 0}>
              {menuItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Nombre del cliente'
            value={customer ? customer.NombreCliente : ''}
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
        <Grid item xs={5} sm={3} md={2}>
          <Button variant='contained' className={classes.button} onClick={() => setActiveSection(0)}>
            Regresar
          </Button>
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
  return bindActionCreators({ setActiveSection }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepOneScreen)

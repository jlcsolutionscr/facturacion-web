import React from 'react';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import TextField from 'components/text-field'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'rgba(255,255,255,0.65)',
    padding: '10px'
  }
}))

function StepOneScreen({index, value, customerList, customer, setParameters, setCompanyAttribute}) {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const classes = useStyles()
  let customers = customerList.map(item => {
    return { id: item.Id, name: item.Descripcion }
  })
  customers = [{id: 1, name: 'CLIENTE DE CONTADO'}, ...customer]
  const menuItems = customers.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Nombre}</MenuItem> })
  return (
    <div className={classes.container} hidden={value !== index}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <FormControl>
            <InputLabel id='demo-simple-select-label'>Seleccione un cliente</InputLabel>
            <Select>
              {menuItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Nombre del cliente'
            fullWidth
            variant='outlined'
            value={customer ? customer.NombreCliente : ''}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Tipo de exoneración'
            fullWidth
            variant='outlined'
            value={customer ? customer.NombreCliente : ''}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Código del documento'
            fullWidth
            variant='outlined'
            value={customer ? customer.NombreCliente : ''}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Nombre de la institución'
            fullWidth
            variant='outlined'
            value={customer ? customer.NombreCliente : ''}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Fecha de emisión'
            fullWidth
            variant='outlined'
            value={customer ? customer.NombreCliente : ''}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Porcentaje de exoneración'
            fullWidth
            variant='outlined'
            value={customer ? customer.NombreCliente : ''}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    customer: state.invoice.customer,
    customerList: state.customer.customerList
  }
}

export default connect(mapStateToProps, null)(StepOneScreen)

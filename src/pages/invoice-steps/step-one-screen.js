import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { convertToDateString } from 'utils/utilities'

import Grid from '@material-ui/core/Grid'

import LabelField from 'components/label-field'
import TextField from 'components/text-field'
import ListDropdown from 'components/list-dropdown'
import { getCustomer, setCustomerAttribute, filterCustomerList } from 'store/customer/actions'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: '2%',
    backgroundColor: theme.palette.background.pages
  }
}))

let delayTimer = null

function StepOneScreen({
  index,
  value,
  customer,
  customerList,
  successful,
  filterCustomerList,
  getCustomer,
  setCustomerAttribute
}) {
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [value])
  const [filter, setFilter] = React.useState('')
  const handleOnFilterChange = (event) => {
    setFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      filterCustomerList(event.target.value)
    }, 500)
  }
  const handleItemSelected = (item) => {
    getCustomer(item.Id)
    setFilter('')
  }
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={7}>
          <ListDropdown
            disabled={successful}
            label='Seleccione un cliente'
            items={customerList}
            value={filter}
            onItemSelected={handleItemSelected}
            onChange={handleOnFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            value={customer.Nombre}
            label='Nombre del cliente'
            onChange={(event) => setCustomerAttribute('Nombre', event.target.value)}
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
            label='Correo electr??nico'
            value={customer ? customer.CorreoElectronico : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Tipo de exoneraci??n'
            value={customer ? customer.IdTipoExoneracion : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='C??digo del documento'
            value={customer ? customer.NumDocExoneracion : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Nombre de la instituci??n'
            value={customer ? customer.NombreInstExoneracion : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Fecha de emisi??n'
            value={customer ? convertToDateString(customer.FechaEmisionDoc) : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label='Porcentaje de exoneraci??n'
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
    customerList: state.customer.list,
    successful: state.invoice.successful
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getCustomer, setCustomerAttribute, filterCustomerList }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepOneScreen)

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'

import LabelField from 'components/label-field'
import TextField from 'components/text-field'
import ListDropdown from 'components/list-dropdown'
import { getCustomer, setCustomerAttribute, filterCustomerList } from 'store/customer/actions'
import { setStatus } from 'store/working-order/actions'

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
  status,
  filterCustomerList,
  getCustomer,
  setStatus,
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
    setStatus('on-progress')
    setFilter('')
  }
  const handleCustomerNameChange = (event) => {
    setCustomerAttribute('Nombre', event.target.value)
    setStatus('on-progress')
  }
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={7}>
          <ListDropdown
            disabled={status === 'converted'}
            label='Seleccione un cliente'
            items={customerList}
            value={filter}
            onItemSelected={handleItemSelected}
            onChange={handleOnFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={status === 'converted'}
            required
            value={customer.Nombre}
            label='Nombre del cliente'
            onChange={handleCustomerNameChange}
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
            value={customer ? customer.FechaEmisionDoc : ''}
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
    status: state.workingOrder.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getCustomer, filterCustomerList, setCustomerAttribute, setStatus }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepOneScreen)

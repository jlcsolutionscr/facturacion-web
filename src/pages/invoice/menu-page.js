import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {  getCompany } from 'store/company/actions'
import { setInvoiceParameters, getInvoiceListFirstPage } from 'store/invoice/actions'
import { logOut } from 'store/session/actions'
import { setBranchId } from 'store/session/actions'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(theme => ({
  branches: {
    width: '320px',
    padding: '4px 0 10px 0',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: '8px'
  },
  button: {
    width: '320px',
    padding: '15px 20px',
    backgroundColor: 'rgba(0,0,0,0.65)',
    color: 'white',
    borderColor: 'white',
    border: '0.6px solid',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.45)',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    },
    '@media (max-width:414px)': {
      width: '100%',
      maxWidth: '360px'
    }
  },
}))

function MenuPage({
  permissions,
  getCompany,
  branchId,
  branchList,
  setBranchId,
  setActiveSection,
  setInvoiceParameters,
  getInvoiceListFirstPage,
  logOut
}) {
  const classes = useStyles()
  const updateCompanyInfo = permissions.filter(role => [1, 61].includes(role.IdRole)).length > 0
  const manageCustomers = permissions.filter(role => role.IdRole === 100).length > 0
  const manageProducts = permissions.filter(role => role.IdRole === 103).length > 0
  const generateInvoice = permissions.filter(role => role.IdRole === 203).length > 0
  const manageDocuments = permissions.filter(role => role.IdRole === 402).length > 0
  const reportingMenu = permissions.filter(role => [1, 2, 57].includes(role.IdRole)).length > 0
  const branchItems = branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  return (
    <Grid container align='center' spacing={2} >
      {branchItems.length > 1 && <Grid item xs={12}>
        <div  className={classes.branches}>
          <FormControl className={classes.form}>
            <InputLabel id='demo-simple-select-label'>Seleccione la sucursal:</InputLabel>
            <Select
              id='Sucursal'
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
            >
              {branchItems}
            </Select>
          </FormControl>
        </div>
      </Grid>}
      {updateCompanyInfo && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => getCompany()}>Actualizar empresa</Button>
      </Grid>}
      {updateCompanyInfo && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => setActiveSection(2)}>Agregar logotipo</Button>
      </Grid>}
      {manageCustomers && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => setActiveSection(3)}>Catálogo de clientes</Button>
      </Grid>}
      {manageProducts && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => setActiveSection(4)}>Catálogo de productos</Button>
      </Grid>}
      {generateInvoice && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => setInvoiceParameters(5)}>Facturar</Button>
      </Grid>}
      {generateInvoice && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => getInvoiceListFirstPage(6)}>Facturas electrónicas</Button>
      </Grid>}
      {manageDocuments && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => setActiveSection(7)}>Documentos electrónicos</Button>
      </Grid>}
      {reportingMenu && <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => setActiveSection(20)}>Menu de reportes</Button>
      </Grid>}
      <Grid item xs={12}>
        <Button classes={{root: classes.button}} onClick={() => logOut()}>Cerrar sesión</Button>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.session.permissions,
    branchId: state.session.branchId,
    branchList: state.session.branchList
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    logOut,
    setActiveSection,
    setBranchId,
    getCompany,
    setInvoiceParameters,
    getInvoiceListFirstPage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage)

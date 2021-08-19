import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {  getCompany } from 'store/company/actions'
import { setCustomerParameters } from 'store/customer/actions'
import { setInvoiceParameters, getInvoiceListFirstPage } from 'store/invoice/actions'
import { getDocumentListFirstPage } from 'store/document/actions'
import { logOut } from 'store/session/actions'
import { setBranchId } from 'store/session/actions'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 'auto'
  },
  branches: {
    maxWidth: '500px',
    padding: '4px 0 10px 0',
    backgroundColor: theme.palette.background.table,
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    marginTop: '25px',
    width: '280px',
    padding: '15px',
    backgroundColor: 'rgba(0,0,0,0.75)',
    color: 'white',
    borderColor: 'white',
    border: '0.6px solid',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.65)',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    },
    '&:disabled': {
      color: 'rgba(255,255,255,0.65)',
      backgroundColor: 'rgba(0,0,0,0.55)'
    },
    '@media (max-width:600px)': {
      marginTop: '10px',
      padding: '8px'
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
  setCustomerParameters,
  setInvoiceParameters,
  getInvoiceListFirstPage,
  getDocumentListFirstPage,
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
    <Grid className={classes.root} container align='center'>
      {branchItems.length > 1 && <Grid item xs={12}>
        <div className={classes.branches}>
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
      <Grid item xs={12} sm={6}>
        <Button disabled={!updateCompanyInfo} classes={{root: classes.button}} onClick={() => getCompany()}>Actualizar empresa</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!updateCompanyInfo} classes={{root: classes.button}} onClick={() => setActiveSection(2)}>Agregar logotipo</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!manageCustomers} classes={{root: classes.button}} onClick={() => setCustomerParameters(3)}>Catálogo de clientes</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!manageProducts} classes={{root: classes.button}} onClick={() => setActiveSection(4)}>Catálogo de productos</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!generateInvoice} classes={{root: classes.button}} onClick={() => setInvoiceParameters(5)}>Facturar</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!generateInvoice} classes={{root: classes.button}} onClick={() => getInvoiceListFirstPage(6)}>Facturas electrónicas</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!manageDocuments} classes={{root: classes.button}} onClick={() => getDocumentListFirstPage(7)}>Documentos electrónicos</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!reportingMenu} classes={{root: classes.button}} onClick={() => setActiveSection(20)}>Menu de reportes</Button>
      </Grid>
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
    setCustomerParameters,
    setInvoiceParameters,
    getInvoiceListFirstPage,
    getDocumentListFirstPage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage)

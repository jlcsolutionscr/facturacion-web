import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {  getCompany } from 'store/company/actions'
import { getCustomerListFirstPage } from 'store/customer/actions'
import { getProductListFirstPage } from 'store/product/actions'
import { setInvoiceParameters, getInvoiceListFirstPage } from 'store/invoice/actions'
import { setReceiptParameters } from 'store/receipt/actions'
import { getDocumentListFirstPage } from 'store/document/actions'
import { getWorkingOrderListFirstPage } from 'store/working-order/actions'
import { setBranchId } from 'store/session/actions'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '640px',
    margin: '20px auto auto auto'
  },
  branches: {
    backgroundColor: theme.palette.background.branchPicker,
    borderRadius: theme.shape.borderRadius,
    padding: '5px 0 5px 0',
    '@media (max-width:600px)': {
      maxWidth: '350px'
    },
    '@media (max-width:414px)': {
      maxWidth: '100%'
    }
  },
  formControl: {
    maxWidth: '590px',
    minWidth: '200px'
  },
  branchText: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(18),
    fontStyle: 'italic',
    fontWeight: 600,
    marginBottom: 0,
    '@media (max-width:600px)': {
      fontSize: theme.typography.pxToRem(16)
    },
    '@media (max-width:414px)': {
      fontSize: theme.typography.pxToRem(14)
    }
  },
  button: {
    marginTop: '25px',
    width: '270px',
    padding: '13px',
    backgroundColor: theme.palette.background.button,
    color: 'rgba(255,255,255,0.85)',
    borderRadius: '25px',
    border: '1px solid #FFFFFF',
    boxShadow: '3px 3px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      color: '#FFF',
      backgroundColor: theme.palette.background.hoveredButton,
      boxShadow: '4px 4px 6px rgba(0,0,0,0.55)'
    },
    '&:disabled': {
      color: 'rgba(255,255,255,0.65)',
      backgroundColor: '#595959'
    },
    '@media (max-width:600px)': {
      marginTop: '10px',
      padding: '8px'
    },
    '@media (max-width:414px)': {
      width: '100%',
      marginTop: '2px',
      border: 'none',
      borderRadius: '2px',
      boxShadow: 'none',
      padding: '10px 0',
      '&:hover': {
        boxShadow: 'none'
      }
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
  getCustomerListFirstPage,
  getProductListFirstPage,
  setInvoiceParameters,
  setReceiptParameters,
  getInvoiceListFirstPage,
  getDocumentListFirstPage,
  getWorkingOrderListFirstPage
}) {
  const classes = useStyles()
  const updateCompanyInfo = permissions.filter(role => [1, 61].includes(role.IdRole)).length > 0
  const manageCustomers = permissions.filter(role => [1, 100].includes(role.IdRole)).length > 0
  const manageProducts = permissions.filter(role => [1, 103].includes(role.IdRole)).length > 0
  const generateInvoice = permissions.filter(role => [1, 203].includes(role.IdRole)).length > 0
  const manageDocuments = permissions.filter(role => [1, 402].includes(role.IdRole)).length > 0
  const reportingMenu = permissions.filter(role => [1, 2, 57].includes(role.IdRole)).length > 0
  const generateWorkingOrder = permissions.filter(role => [1, 201].includes(role.IdRole)).length > 0
  const switchBrand = permissions.filter(role => [1, 2, 48].includes(role.IdRole)).length > 0
  const branchItems = branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  return (
    <Grid className={classes.root} container align='center'>
      <Grid item xs={12}>
        <div className={classes.branches}>
          {branchList.length > 1 && switchBrand 
            ? <FormControl className={classes.formControl}>
              <InputLabel>Seleccione la sucursal:</InputLabel>
              <Select
                id='Sucursal'
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
              >
                {branchItems}
              </Select>
            </FormControl>
            : <Typography className={classes.branchText} align='center' paragraph>
              {`Sucursal: ${branchList.find(branch => branch.Id === branchId).Descripcion}`}
            </Typography>}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!updateCompanyInfo} classes={{root: classes.button}} onClick={() => getCompany()}>Actualizar empresa</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!updateCompanyInfo} classes={{root: classes.button}} onClick={() => setActiveSection(2)}>Agregar logotipo</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!manageCustomers} classes={{root: classes.button}} onClick={() => getCustomerListFirstPage(3, '', 8)}>Catálogo de clientes</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!manageProducts} classes={{root: classes.button}} onClick={() => getProductListFirstPage(4, '', 2, 7)}>Catálogo de productos</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!generateInvoice} classes={{root: classes.button}} onClick={() => setInvoiceParameters(5)}>Facturar</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!generateInvoice} classes={{root: classes.button}} onClick={() => setReceiptParameters(6)}>Factura de compra</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!generateInvoice} classes={{root: classes.button}} onClick={() => getInvoiceListFirstPage(7)}>Facturas electrónicas</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!manageDocuments} classes={{root: classes.button}} onClick={() => getDocumentListFirstPage(8)}>Documentos electrónicos</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!generateWorkingOrder} classes={{root: classes.button}} onClick={() => getWorkingOrderListFirstPage(9)}>Ordenes de servicio</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!reportingMenu} classes={{root: classes.button}} onClick={() => setActiveSection(20)}>Menu de reportes</Button>
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
    setActiveSection,
    setBranchId,
    getCompany,
    getCustomerListFirstPage,
    getProductListFirstPage,
    setInvoiceParameters,
    setReceiptParameters,
    getInvoiceListFirstPage,
    getDocumentListFirstPage,
    getWorkingOrderListFirstPage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage)

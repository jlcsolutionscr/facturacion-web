import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    paddingTop: '50px',
    height: 'inherit'
  },
  button: {
    width: '30%',
    padding: '15px 20px',
    backgroundColor: 'rgba(0,0,0,0.65)',
    color: 'white',
    borderColor: 'white',
    border: '0.6px solid',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.45)',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    }
  },
}))

function MenuPage(props) {
  const updateCompanyInfo = props.rolesPerUser.filter(role => [1, 61].includes(role.IdRole)).length > 0
  const manageCustomers = props.rolesPerUser.filter(role => role.IdRole = 100).length > 0
  const manageProducts = props.rolesPerUser.filter(role => role.IdRole = 103).length > 0
  const generateInvoice = props.rolesPerUser.filter(role => role.IdRole = 203).length > 0
  const manageDocuments = props.rolesPerUser.filter(role => role.IdRole = 402).length > 0
  const reportingMenu = props.rolesPerUser.filter(role => [1, 2, 57].includes(role.IdRole)).length > 0
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid container align='center' spacing={3} >
        {updateCompanyInfo && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.getCompany()}>Actualice la información de su empresa</Button>
        </Grid>}
        {updateCompanyInfo && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setActiveSection(2)}>Agregue el logotipo de su empresa</Button>
        </Grid>}
        {manageCustomers && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setActiveSection(3)}>Gestione su catálogo de clientes</Button>
        </Grid>}
        {manageProducts && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setActiveSection(4)}>Gestione su catálogo de productos</Button>
        </Grid>}
        {generateInvoice && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setActiveSection(5)}>Generar factura electrónica</Button>
        </Grid>}
        {generateInvoice && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setActiveSection(6)}>Gestione sus facturas electrónicas</Button>
        </Grid>}
        {manageDocuments && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setActiveSection(7)}>Gestione sus documentos electrónicos</Button>
        </Grid>}
        {reportingMenu && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setReportsParameters()}>Acceda al menu de reportes</Button>
        </Grid>}
        <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.logOut()}>Cerrar sesión</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default MenuPage

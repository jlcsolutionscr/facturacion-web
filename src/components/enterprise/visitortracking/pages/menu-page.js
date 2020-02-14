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
    width: '20%',
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
  let isAdministrator = false
  let updateCompanyInfo = false
  let updateBranchInfo = false
  let updateEmployeeInfo = false
  let activateRegistry = false
  let reportingMenu = false
  props.rolesPerUser.forEach(item => {
    if (item.RoleId === 1) isAdministrator = true
    if (item.RoleId === 2) updateCompanyInfo = true
    if (item.RoleId === 3) updateBranchInfo = true
    if (item.RoleId === 4) updateEmployeeInfo = true
    if (item.RoleId === 5) activateRegistry = true
    if (item.RoleId === 6) reportingMenu = true
  })
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid container align='center' spacing={3} >
        {isAdministrator && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setCompanyListParameters()}>Mantenimiento de empresas</Button>
        </Grid>}
        {updateCompanyInfo && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setCompanyParameters()}>Actualice su información</Button>
        </Grid>}
        {updateBranchInfo && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setBranchParameters()}>Actualice la información de sus sucursales</Button>
        </Grid>}
        {updateEmployeeInfo && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setEmployeeParameters()}>Actualice la información de sus empleados</Button>
        </Grid>}
        {activateRegistry && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setRegistryParameters()}>Active los registros de sus clientes</Button>
        </Grid>}
        {reportingMenu && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setReportsParameters()}>Menu de reportes</Button>
        </Grid>}
        <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.logOut()}>Cerrar sesión</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default MenuPage

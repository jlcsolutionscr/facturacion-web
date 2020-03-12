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
  let updateUserInfo = false
  let updateBranchInfo = false
  let updateEmployeeInfo = false
  let updateServiceInfo = false
  let activateRegistry = false
  let reportingMenu = false
  props.rolesPerUser.forEach(item => {
    if (item.RoleId === 1) isAdministrator = true
    if (item.RoleId === 2) updateCompanyInfo = true
    if (item.RoleId === 3) updateUserInfo = true
    if (item.RoleId === 4) updateBranchInfo = true
    if (item.RoleId === 5) updateEmployeeInfo = true
    if (item.RoleId === 6) updateServiceInfo = true
    if (item.RoleId === 7) activateRegistry = true
    if (item.RoleId === 8) reportingMenu = true
  })
  const classes = useStyles()
  const items = isAdministrator
    ? (<Grid container align='center' spacing={3} >
      <Grid item xs={12}>
        <Button classes={{root: classes.button}} style={{width: '25%'}} onClick={() => props.setCompanyAdminParameters()}>Mantenimiento de empresas</Button>
      </Grid>
      <Grid item xs={12}>
        <Button classes={{root: classes.button}} style={{width: '25%'}} onClick={() => props.logOut()}>Cerrar sesión</Button>
      </Grid>
    </Grid>)
    : (<Grid container align='center' spacing={3} >
        <Grid item xs={6} style={{textAlign: 'right'}}>
          {updateCompanyInfo && <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setCompanyParameters()}>Actualice  su empresa</Button>}
        </Grid>
        <Grid item xs={6} style={{textAlign: 'left'}}>
          {updateUserInfo && <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setUserParameters()}>Actualice sus usuarios</Button>}
        </Grid>
        <Grid item xs={6} style={{textAlign: 'right'}}>
          {updateBranchInfo && <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setBranchParameters()}>Actualice sus sucursales</Button>}
        </Grid>
        <Grid item xs={6} style={{textAlign: 'left'}}>
          {updateEmployeeInfo && <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setEmployeeParameters()}>Actualice sus empleados</Button>}
        </Grid>
        <Grid item xs={6} style={{textAlign: 'right'}}>
          {updateServiceInfo && <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setServiceParameters()}>Actualice sus servicios</Button>}
        </Grid>
        <Grid item xs={6} style={{textAlign: 'left'}}>
          {activateRegistry && <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setRegistryParameters()}>Activar registros pendientes</Button>}
        </Grid>
        <Grid item xs={6} style={{textAlign: 'right'}}>
          {reportingMenu && <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setReportsParameters()}>Menu de reportes</Button>}
        </Grid>
        <Grid item xs={6} style={{textAlign: 'left'}}>
        <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.logOut()}>Cerrar sesión</Button>
        </Grid>
      </Grid>)
  return (
    <div className={classes.container}>
      {items}
    </div>
  )
}

export default MenuPage

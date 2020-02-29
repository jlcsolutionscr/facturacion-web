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
    if (item.RoleId === 4) updateCompanyInfo = true
    if (item.RoleId === 5) updateUserInfo = true
    if (item.RoleId === 6) updateBranchInfo = true
    if (item.RoleId === 7) updateEmployeeInfo = true
    if (item.RoleId === 8) updateServiceInfo = true
    if (item.RoleId === 9) activateRegistry = true
    if (item.RoleId === 10) reportingMenu = true
  })
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid container align='center' spacing={3} >
        {isAdministrator && <Grid item xs={12}>
          <Button classes={{root: classes.button}} style={{width: '25%'}} onClick={() => props.setCompanyAdminParameters()}>Mantenimiento de empresas</Button>
        </Grid>}
        {updateCompanyInfo && <Grid item xs={6} style={{textAlign: 'right'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setCompanyParameters()}>Actualice  su empresa</Button>
        </Grid>}
        {updateUserInfo && <Grid item xs={6} style={{textAlign: 'left'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setUserParameters()}>Actualice sus usuarios</Button>
        </Grid>}
        {updateBranchInfo && <Grid item xs={6} style={{textAlign: 'right'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setBranchParameters()}>Actualice sus sucursales</Button>
        </Grid>}
        {updateEmployeeInfo && <Grid item xs={6} style={{textAlign: 'left'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setEmployeeParameters()}>Actualice sus empleados</Button>
        </Grid>}
        {updateServiceInfo && <Grid item xs={6} style={{textAlign: 'right'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setServiceParameters()}>Actualice sus servicios</Button>
        </Grid>}
        {activateRegistry && <Grid item xs={6} style={{textAlign: 'left'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setRegistryParameters()}>Activar registros pendientes</Button>
        </Grid>}
        {reportingMenu && <Grid item xs={6} style={{textAlign: 'right'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.setReportsParameters()}>Menu de reportes</Button>
        </Grid>}
        <Grid item xs={6} style={{textAlign: 'left'}}>
          <Button classes={{root: classes.button}} style={{width: '50%'}} onClick={() => props.logOut()}>Cerrar sesión</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default MenuPage

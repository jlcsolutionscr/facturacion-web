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
  let updateCompanyInfo = false
  let reportingMenu = false
  const isAdministrator = props.rolesPerUser.filter(role => role.IdRole === 1).length > 0
  const isAccounting = props.rolesPerUser.filter(role => role.IdRole === 2).length > 0
  if (isAdministrator) {
    updateCompanyInfo = true
    reportingMenu = true
  } else if(isAccounting) {
    reportingMenu = true
  } else {
    props.rolesPerUser.forEach(item => {
      if (item.IdRole === 57) reportingMenu = true
      if (item.IdRole === 61) updateCompanyInfo = true
    })
  }
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid container align='center' spacing={3} >
        {updateCompanyInfo && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.getCompany()}>Actualice la información de su empresa</Button>
        </Grid>}
        {updateCompanyInfo && <Grid item xs={12}>
          <Button classes={{root: classes.button}} onClick={() => props.setActiveSection(2)}>Agregue un logotipo a su empresa</Button>
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

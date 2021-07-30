import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import MobileAppCard from './mobile-app-card'
import PlatformCard from './platform-card'
import WindowsAppCard from './windows-app-card'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
    marginBottom: '7%',
    padding: '0 5%'
  },
  subTitle: {
    marginTop: theme.spacing(2),
    fontSize: theme.typography.pxToRem(20),
    color: 'inherit'
  },
  intro: {
    marginTop: theme.spacing(4),
    fontSize: theme.typography.pxToRem(18)
  },
  items: {
    marginTop: theme.spacing(2),
    marginLeft: '3%',
    fontSize: theme.typography.pxToRem(18)
  },
  subItems: {
    marginTop: theme.spacing(3),
    marginLeft: '6%',
    fontSize: theme.typography.pxToRem(18)
  }
}))

function HomePage(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2} xs={12}>
      <Grid item xs={12}>
        <Typography component='h1' variant='h4' align='center' color='textPrimary' gutterBottom>
          Nuestra plataforma de gestión y facturación
        </Typography>
        <Typography className={classes.intro}>
          Nuestra aplicación para móviles le permite de una forma rápida y desde cualquier lugar confeccionar su factura electrónica y gestionar las facturas ya emitidas.
        </Typography>
        <Typography className={classes.items}>
          Nuestra aplicación para Windows le permite gestionar todos los movimientos de su empresa mediante los siguientes módulos:
        </Typography>
        <Typography className={classes.subItems}>
          Catalogo de clientes, líneas, proveedores y productos
        </Typography>
        <Typography className={classes.subItems}>
          Facturación electrónica
        </Typography>
        <Typography className={classes.subItems}>
          Manejo de inventarios y detalle de movimientos (CARDEX)
        </Typography>
        <Typography className={classes.subItems}>
          Módulo para compras
        </Typography>
        <Typography className={classes.subItems}>
          Generación de proformas que se convierten en factura con solo un click
        </Typography>
        <Typography className={classes.subItems}>
          Ordenes de servicio para gestionar trabajos en progreso
        </Typography>
        <Typography className={classes.subItems}>
          Reportes de movimientos entrantes y salientes
        </Typography>
        <Typography className={classes.subItems}>
          Reportes de anulación de transacciones
        </Typography>
        <Typography className={classes.subItems}>
          Reporte exclusivo para declaración del IVA.
        </Typography>
        <Typography className={classes.intro} style={{marginBottom: '2%'}}>
          Conozca más de nuestros productos explorando las siguientes fichas técnicas
        </Typography>
      </Grid>
      <Grid item>
        <Grid container justifyContent='center' spacing={10}>
          <Grid item xs={10} sm={8} md={6}>
            <MobileAppCard onClick={props.onClick} />
          </Grid>
          <Grid item xs={10} sm={8} md={6}>
            <WindowsAppCard onClick={props.onClick}/>
          </Grid>
          <Grid item xs={10} sm={8} md={6}>
            <PlatformCard onClick={props.onClick}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomePage

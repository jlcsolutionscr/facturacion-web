import React from 'react'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import appImage from '../../../assets/img/mobile-app.jpeg'
import { createStyle } from './styles'

export default function MobileAppCard() {
  const classes = createStyle()
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={appImage}
      />
      <CardContent>
        <Typography className={classes.cardHeader} color="textSecondary" component="p">
          Aplicación Android
        </Typography>
        <Typography className={classes.title} color="textSecondary" component="p">
          Utiliza nuestra aplicación móbil ya disponible en la tienda de Google Store
        </Typography>
        <Typography className={classes.pTop} paragraph>
          Esta herramienta le permite realizar la gestión de sus documentos electrónicos desde cualquier sitio donde usted se encuentre
        </Typography>
      </CardContent>
    </Card>
  )
}

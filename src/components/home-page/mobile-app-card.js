import React from 'react'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import appImage from '../../assets/img/mobile-app.jpeg'
import { createStyle } from '../styles'

export default function MobileAppCard(props) {
  const classes = createStyle()
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={appImage}
      />
      <CardContent>
        <Typography className={classes.title} color='textSecondary' component='p'>
          Aplicación Android
        </Typography>
        <Typography className={classes.subTitle} paragraph>
          Utiliza nuestra aplicación móbil ya disponible en la tienda de Google Store.
          Esta herramienta le permite realizar la gestión de sus documentos electrónicos desde cualquier sitio donde usted se encuentre.
        </Typography>
      </CardContent>
      <CardActions>
        <Button classes={{root: classes.button}} onClick={() => props.onClick(1)}>CONOZCA MAS</Button>
      </CardActions>
    </Card>
  )
}

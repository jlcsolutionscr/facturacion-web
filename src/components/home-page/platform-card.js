import React from 'react'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import appImage from '../../assets/img/plataforma.png'
import { createStyle } from '../styles'

export default function PlatformCard(props) {
  const classes = createStyle()
  return (
    <Card style={{marginLeft: '5%'}} className={classes.card}>
      <CardMedia
        className={classes.media}
        image={appImage}
      />
      <CardContent>
        <Typography className={classes.title} color="textSecondary" component="p">
          Plataforma de servicios
        </Typography>
        <Typography className={classes.subTitle} color="textSecondary" component="p">
          Nuestro servicio web implementado en la nube y accesible desde cualquiera de nuestras aplicaciones
        </Typography>
        <Typography className={classes.paragraphTop} paragraph>
          Le brinda almacenamiento global y resguardo de su información con respaldo periódicos
        </Typography>
        <Typography className={classes.paragraph} paragraph>
          Nuestro buzón para recibir sus facturas de gastos le permite agilizar su proceso de recepción de documentos: recepcion@jlcsolutionscr.com (IVA acreditable) y recepciongasto@jlcsolutionscr.com
        </Typography>
      </CardContent>
      <CardActions>
        <Button classes={{root: classes.button}} onClick={() => props.onClick(3)}>CONOZCA MAS</Button>
      </CardActions>
    </Card>
  )
}

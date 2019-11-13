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
          Nuestro servicio web implementado en la nube y accesible desde cualquiera de nuestras aplicaciones, desarrollado con tecnología .NET Framework de Microsoft con un rendimiento optimizado para responder a sus necesidades de negocio de la mejor forma.
        </Typography>
      </CardContent>
      <CardActions>
        <Button classes={{root: classes.button}} onClick={() => props.onClick(3)}>CONOZCA MAS</Button>
      </CardActions>
    </Card>
  )
}

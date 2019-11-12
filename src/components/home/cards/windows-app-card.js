import React from 'react'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import appImage from '../../../assets/img/windows-app.jpeg'
import { createStyle } from './styles'

export default function WindowsAppCard() {
  const classes = createStyle()
  return (
    <Card style={{marginLeft: '5%'}} className={classes.card}>
      <CardMedia
        className={classes.media}
        image={appImage}
      />
      <CardContent>
        <Typography className={classes.cardHeader} color="textSecondary" component="p">
          Aplicacion Windows
        </Typography>
        <Typography className={classes.title} color="textSecondary" component="p">
          Aplicación de escritorio desarrollada con la última tecnología .NET Framework disponible
        </Typography>
        <Typography className={classes.pTop} paragraph>
          Administre su negocio mediante nuestra aplicación de escritorio para Windows la cual le permite llevar el control de su negocio de forma ágil y segura
        </Typography>
      </CardContent>
    </Card>
  )
}

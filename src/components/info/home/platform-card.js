import React from 'react'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import appImage from 'assets/img/plataforma.png'
import { createStyle } from 'components/info/styles'

export default function PlatformCard(props) {
  const classes = createStyle()
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={appImage}
      />
      <CardContent>
        <Typography className={classes.subTitle} style={{fontWeight: '700'}} color='textSecondary' component='p'>
          Plataforma de servicios
        </Typography>
        <Typography className={classes.paragraph} paragraph>
          Nuestro servicio web implementado en la nube le garantiza la seguridad de su información.
        </Typography>
      </CardContent>
      <CardActions>
        <Button classes={{root: classes.button}} onClick={() => props.onClick(3)}>CONOZCA MAS</Button>
      </CardActions>
    </Card>
  )
}

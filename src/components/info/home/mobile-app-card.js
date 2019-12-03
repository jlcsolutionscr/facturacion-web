import React from 'react'

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import appImage from 'assets/img/mobile-app.jpeg'
import { createStyle } from 'components/info/styles'

export default function MobileAppCard(props) {
  const classes = createStyle()
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={appImage}
      />
      <CardContent>
        <Typography className={classes.subTitle} style={{fontWeight: '700'}} color='textSecondary' component='p'>
          Aplicación Android
        </Typography>
        <Typography className={classes.paragraph} paragraph>
          Facture desde cualquier lugar. Disponible en la tienda de Google App Store.
        </Typography>
      </CardContent>
      <CardActions>
        <Button classes={{root: classes.button}} onClick={() => props.onClick(2)}>CONOZCA MAS</Button>
      </CardActions>
    </Card>
  )
}

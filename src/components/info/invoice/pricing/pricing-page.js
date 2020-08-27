import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'
import { StarIcon } from 'utils/iconsHelper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: '2%',
    paddingBottom: '4%',
    paddingLeft: '5%',
    paddingRight: '5%',
    backgroundColor: 'white'
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(2, 0, 6)
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2)
  },
  priceLabel: {
    fontSize: '2.5rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.6rem'
    }
  },
  restLabel: {
    fontSize: '1.6rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem'
    }
  }
}))

const tiers = [
  {
    title: '50 documentos',
    price: '10,000.00',
    description: ['1 usuario', '50 documentos electrónicos', '1 terminal (Android o Windows)', 'Soporte técnico', 'Recepción de gastos límitados'],
    monthlyPayment: false
  },
  {
    title: '100 documentos',
    price: '17,500.00',
    description: ['1 usuario', '100 documentos electrónicos', '1 terminal (Android o Windows)', 'Soporte técnico', 'Recepción de gastos límitados'],
    monthlyPayment: false
  },
  {
    title: 'PYMES 1 *',
    subheader: 'Most popular',
    price: '5,000.00',
    description: ['Usuarios ilimitados', '300 documentos electrónicos por mes', '2 terminales (Android o Windows)', 'Recepción de gastos ilimitados', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'PYMES 2 *',
    price: '7,500.00',
    description: ['Usuarios ilimitados', '750 documentos electrónicos por mes', '2 terminales (Android o Windows)', 'Recepción de gastos ilimitados', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'EMPRESARIAL 1 *',
    price: '10,000.00',
    description: ['Usuarios ilimitados', '1,000 documentos electrónicos por mes', '4 terminales (Android o Windows)', 'Recepción de gastos ilimitados', 'Inventario, CxC, CxP, Traslados de mercancía', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'EMPRESARIAL 2 *',
    price: '15,000.00',
    description: ['Usuarios ilimitados', '1,750 documentos electrónicos por mes', '6 terminales (Android o Windows)', 'Recepción de gastos ilimitados', 'ERP Completo', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'EMPRESARIAL 3 *',
    price: '20,000.00',
    description: ['Usuarios ilimitados', '2,500 documentos electrónicos por mes', '8 terminales (Android o Windows)', 'Recepción de gastos ilimitados', 'ERP Completo', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'EMPRESARIAL 4 *',
    price: '50,000.00',
    description: ['Usuarios ilimitados', '10,000 facturas por mes', 'Terminales ilimitadas (Android o Windows)', 'Recepción de gastos ilimitados', 'ERP Completo', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'EMPRESARIAL PRO *',
    price: '100,000.00',
    description: ['Usuarios ilimitados', 'Facturas ilimitadas', 'Terminales ilimitadas (Android o Windows)', 'Recepción de gastos ilimitados', 'ERP Completo', 'Soporte técnico'],
    monthlyPayment: true
  }
]

function PricingPage() {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        <Typography component='h1' variant='h3' align='center' color='textPrimary' gutterBottom>
          Nuestros planes
        </Typography>
      </Container>
      <Container maxWidth='md' component='main'>
        <Grid container spacing={5} alignItems='flex-end'>
          {tiers.map(tier => (
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={6}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={tier.subheader ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography className={classes.priceLabel} color='textPrimary'>
                      {tier.price}
                    </Typography>
                    <Typography className={classes.restLabel} color='textPrimary'>
                      + I.V.A.
                    </Typography>
                    {tier.monthlyPayment && <Typography variant='h6' color='textSecondary'>
                      /mensual
                    </Typography>}
                  </div>
                  <ul>
                    {tier.description.map(line => (
                      <Typography component='li' variant='subtitle1' align='left' key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant} color='primary'>
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography style={{marginTop: '50px'}} component='h1' variant='h6' align='center' color='textPrimary' gutterBottom>
          * Al adquirir un plan anual recibirá un descuento equivalente a dos mensualidades.
        </Typography>
      </Container>
    </div>
  )
}

export default PricingPage

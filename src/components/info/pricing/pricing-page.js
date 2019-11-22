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
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(2, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  }
}))

const tiers = [
  {
    title: 'SP 20',
    price: '5,000.00',
    description: ['1 Usuario', '20 Facturas', 'Recepción de gastos', 'Soporte técnico'],
    monthlyPayment: false
  },
  {
    title: 'SP 50',
    price: '10,000.00',
    description: ['1 Usuario', '50 Facturas', 'Recepción de gastos', 'Soporte técnico'],
    monthlyPayment: false
  },
  {
    title: 'PYMES 1',
    subheader: 'Most popular',
    price: '5,000.00',
    description: ['10 Usuarios', '200 Facturas por mes', 'Recepción de gastos', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'PYMES 2',
    price: '10,000.00',
    description: ['Usuarios ilimitados', '500 Facturas por mes', 'Recepción de gastos', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'PYMES 3',
    price: '17,500.00',
    description: ['Usuarios ilimitados', '1,000 Facturas', 'Recepción de gastos', 'Soporte técnico'],
    monthlyPayment: true
  },
  {
    title: 'PYMES PRO',
    price: '30,000.00',
    description: ['Usuarios ilimitados', 'Facturas ilimitadas', 'Recepción de gastos', 'Soporte técnico'],
    monthlyPayment: true
  }
]

function PricingPage() {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
          Nuestros planes
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
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
                    <Typography component="h2" variant="h4" color="textPrimary">
                      {tier.price}
                    </Typography>
                    {tier.monthlyPayment && <Typography variant="h6" color="textSecondary">
                      /mensual
                    </Typography>}
                  </div>
                  <ul>
                    {tier.description.map(line => (
                      <Typography component="li" variant="subtitle1" align="left" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant} color="primary">
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  )
}

export default PricingPage

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import BannerImage from 'assets/img/banner.jpg'
import ButtonCard from './button-card'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: '2%',
    padding: '4%'
  },
  titleContainer: {
    backgroundImage: `url(${BannerImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `100% 78%`,
    minWidth: `${window.innerWidth / 8 * 7}px`,
    height: '245px',
    top: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    zIndex: 100,
  },
  h2: {
    paddingTop: '40px',
    color: '#247BA0',
    fontFamily: 'RussoOne',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(65),
    textShadow: '6px 6px 6px rgba(0,0,0,0.85)'
  },
  h4: {
    marginTop: theme.spacing(1),
    color: '#E2EBF1',
    fontFamily: 'RussoOne',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(25),
    textShadow: '3px 3px 4px rgba(0,0,0,0.85)'
  }
}))

function HomePage(props) {
  const classes = useStyles();
  return (
    <div id='id_app_content' className={classes.root} >
      <div className={classes.titleContainer}>
        <Typography classes={{h2: classes.h2}} variant='h2' align='center' component='h2'>
          JLC Solutions
        </Typography>
        <Typography classes={{h4: classes.h4}} variant='h4' align='center' component='h4'>
          A software development company
        </Typography>
      </div>
      <div style={{marginTop: '205px'}}>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={8}>
              <Grid item xs={4}>
                <ButtonCard
                  title='Datos de su empresa'
                  description='Mantenga actualizada la información de su empresa.'
                  buttonText='Actualizar'
                />
              </Grid>
              <Grid item xs={4}>
                <ButtonCard
                  title='Logotipo personalizado'
                  description='Incluya el logotipo de su empresa e incremente su visibilidad.'
                  buttonText='Adicionar'
                />
              </Grid>
              <Grid item xs={4}>
                <ButtonCard
                  title='Configure su usuario ATV'
                  description='Valide sus credenciales y certificado para iniciar su facturación.'
                  buttonText='Configurar'
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default HomePage

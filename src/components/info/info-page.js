import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveInfoSection } from 'store/ui/actions'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Loader from 'components/loader/loader'
import HomePage from 'components/info/home/home-page'
import MobileAppPage from 'components/info/mobile-app/mobile-app-page'
import WindowsAppPage from 'components/info/windows-app/windows-app-page.js'
import PlatformPage from 'components/info/platform/platform-page'
import PricingPage from 'components/info/pricing/pricing-page'
import DownloadsPage from 'components/info/downloads/downloads-page'

import BannerImage from 'assets/img/banner.jpg'

function Copyright() {
  return (
    <Typography variant='body2' color='inherit' align='center'>
      {'Copyright ©JLC Solutions CR ' + new Date().getFullYear() + '.'}
    </Typography>
  )
}

const footers = [
  {
    title: 'Aplicaciones disponibles',
    description: ['Aplicación de escritorio Windows', 'Aplicación para dispositivos mobiles Android', 'Disponibles en nuestra sección de DESCARGAS']
  },
  {
    title: 'Nuestros servicios',
    description: ['Facturación electrónica', 'Registro de visitas de clientes', 'Buzón de recepción de gastos']
  }
]

function InfoPage(props) {
  const useStyles = makeStyles(theme => ({
    titleContainer: {
      backgroundImage: `url(${BannerImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `100% 100%`,
      backgroundColor: `white`,
      position: 'fixed',
      top: '0',
      right: '0',
      left: '0',
      zIndex: 100,
      paddingBottom: '20px',
      minWidth: '320px',
      [theme.breakpoints.down('xs')]: {
        marginBottom: '112px',
        backgroundColor: `white`,
      }
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      color: 'white',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      backgroundColor: 'rgba(0,0,0,0.65)',
      minWidth: '320px',
      [theme.breakpoints.down('xs')]: {
        backgroundColor: 'white',
        position: 'fixed',
        top: '105px',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }
    },
    body: {
      marginTop: '252px',
      minWidth: '320px',
    },
    menuButton: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: theme.spacing(16),
      backgroundColor: 'rgba(255,255,255,0.25)',
      '&:disabled': {
        color: 'rgba(255,255,255,0.65)',
        backgroundColor: 'rgba(255,255,255,0.15)'
      },
      [theme.breakpoints.down('xs')]: {
        borderRadius: '8px',
        backgroundColor: 'rgba(0,0,0,0.65)',
        '&:disabled': {
          color: 'rgba(255,255,255,0.65)',
          backgroundColor: 'rgba(0,0,0,0.45)'
        },
        '&:hover': {
          color: 'black',
          backgroundColor: 'rgba(0,0,0,0.15)'
        },
      },
    },
    hideButton: {
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },
    panelBottom: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      backgroundColor: '#262626',
      color: 'white',
      marginTop: '20px',
      paddingBottom: '20px',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },
    mobileBottom: {
      textAlign: 'center',
      display: 'none',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      backgroundColor: '#262626',
      color: 'white',
      paddingTop: '15px',
      [theme.breakpoints.down('xs')]: {
        display: 'block'
      }
    },
    h2: {
      marginTop: theme.spacing(2),
      color: '#247BA0',
      fontFamily: 'RussoOne',
      fontStyle: 'italic',
      fontSize: theme.typography.pxToRem(66),
      textShadow: '6px 6px 6px rgba(0,0,0,0.85)',
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.pxToRem(40),
        marginTop: '10px'
      }
    },
    h4: {
      marginTop: theme.spacing(1),
      color: '#E2EBF1',
      fontFamily: 'RussoOne',
      fontStyle: 'italic',
      fontSize: theme.typography.pxToRem(22),
      textShadow: '3px 3px 4px rgba(0,0,0,0.85)',
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.pxToRem(16),
      }
    },
    footer: {
      color: 'inherit'
    }
  }))
  const classes = useStyles()

  const toggleCurrentPage = (pageId) => {
    props.setActiveInfoSection(pageId)
    window.scrollTo(0, 0)
  }
  return (
    <div id='id_app_content'>
      <Loader isLoaderActive={props.isLoaderActive} loaderText={props.loaderText} />
      <div className={classes.titleContainer}>
        <div className={classes.toolbar}>
          <Button disabled={props.activeInfoSection === 0} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(0)}>Inicio</Button>
          <Button disabled={props.activeInfoSection === 1} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(1)}>Planes</Button>
          <Button disabled={props.activeInfoSection === 2} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(2)}>Android App</Button>
          <Button disabled={props.activeInfoSection === 3} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(3)}>Windows App</Button>
          <Button disabled={props.activeInfoSection === 4} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(4)}>Plataforma</Button>
          <div className={classes.hideButton}>
            <Button disabled={props.activeInfoSection === 5} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(5)}>Descargas</Button>
          </div>
        </div>
        <div className={classes.header}>
          <Typography classes={{h2: classes.h2}} variant='h2' align='center' component='h2'>
            JLC Solutions
          </Typography>
          <Typography classes={{h4: classes.h4}} variant='h4' align='center' component='h4'>
            A software development company
          </Typography>
        </div>
      </div>
      <div className={classes.body}>
        {props.activeInfoSection === 0 && <HomePage onClick={toggleCurrentPage} />}
        {props.activeInfoSection === 1 && <PricingPage />}
        {props.activeInfoSection === 2 && <MobileAppPage />}
        {props.activeInfoSection === 3 && <WindowsAppPage />}
        {props.activeInfoSection === 4 && <PlatformPage />}
        {props.activeInfoSection === 5 && <DownloadsPage />}
        <div className={classes.panelBottom}>
          <Container className={classes.footer}>
            <Grid container spacing={8} justifyContent='space-evenly'>
              {footers.map(footer => (
                <Grid item key={footer.title}>
                  <Typography variant='h6' color='inherit' gutterBottom>
                    {footer.title}
                  </Typography>
                  <ul>
                    {footer.description.map(item => (
                      <li key={item}>
                        <Typography variant='subtitle1' color='inherit'>
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Grid>
              ))}
              <Grid item key='Contactenos'>
                <Typography variant='h6' color='inherit' gutterBottom>
                  Contactenos
                </Typography>
                <ul>
                  <li key='1'>
                    <Link href='' onClick={() => props.history.push('/privacypolicy')} variant='subtitle1' color='inherit'>
                      Policitas de Privacidad
                    </Link>
                  </li>
                  <li key='2'>
                    <Typography variant='subtitle1' color='inherit'>
                      ventas@jlcsolutionscr.com
                    </Typography>
                  </li>
                  <li key='3'>
                    <Typography variant='subtitle1' color='inherit'>  
                      whatsapp: (506) 8334-8641
                    </Typography>
                  </li>
                </ul>
              </Grid>
            </Grid>
            <Box mt={1}>
              <Copyright />
            </Box>
          </Container>
        </div>
        <div className={classes.mobileBottom}>
          <Grid container spacing={2} justifyContent='space-evenly'>
            <Grid item xs={12}>
              <Typography variant='h6' color='inherit'>
                Contactenos: ventas@jlcsolutionscr.com
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' color='inherit'>
                Whatsapp: (506) 8334-8641
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' color='inherit'>
                <Copyright />
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoaderActive: state.ui.isLoaderActive,
    loaderText: state.ui.loaderText,
    activeInfoSection: state.ui.activeInfoSection
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setActiveInfoSection }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPage)

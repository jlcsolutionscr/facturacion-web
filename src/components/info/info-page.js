import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveInfoSection } from 'store/ui/actions'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
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
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        JLC Solutions CR
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
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
  },
  {
    title: 'Contactenos',
    description: ['ventas@jlcsolutionscr.com', 'whatsapp: (506) 8334-8641']
  },
]

function InfoPage(props) {
  const useStyles = makeStyles(theme => ({
    titleContainer: {
      backgroundImage: `url(${BannerImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `100% 78%`,
      minWidth: `${window.innerWidth / 8 * 7.5}px`,
      height: '185px',
      top: 0,
      left: 0,
      right: 0,
      position: 'fixed',
      paddingTop: '60px',
      zIndex: 100,
    },
    appBar: {
      backgroundColor: 'rgba(0,0,0,0.65)',
      color: 'white'
    },
    menuButton: {
      marginRight: theme.spacing(2),
      width: theme.spacing(17),
      backgroundColor: 'rgba(255,255,255,0.25)',
      '&:disabled': {
        color: 'rgba(255,255,255,0.65)',
        backgroundColor: 'rgba(255,255,255,0.15)'
      }
    },
    panelBottom: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      backgroundColor: '#262626',
      color: 'white',
      height: '220px'
    },
    h2: {
      marginTop: theme.spacing(2),
      color: '#247BA0',
      fontFamily: 'RussoOne',
      fontStyle: 'italic',
      fontSize: theme.typography.pxToRem(66),
      textShadow: '6px 6px 6px rgba(0,0,0,0.85)',
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.pxToRem(15),
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
        fontSize: theme.typography.pxToRem(5),
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

  const redirectToLoginPage = () => {
    props.history.push(`/enterprise`)
  }

  return (
    <div id='id_app_content' className={classes.root} >
      <Loader isLoaderActive={props.isLoaderActive} loaderText={props.loaderText} />
      <div className={classes.titleContainer}>
        <AppBar classes={{colorDefault: classes.appBar}} color='default'>
          <Toolbar>
            <div style={{marginLeft: '8%'}}>
              <Button disabled={props.activeInfoSection === 0} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(0)}>Inicio</Button>
              <Button disabled={props.activeInfoSection === 1} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(1)}>Planes</Button>
              <Button disabled={props.activeInfoSection === 2} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(2)}>App Android</Button>
              <Button disabled={props.activeInfoSection === 3} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(3)}>App Windows</Button>
              <Button disabled={props.activeInfoSection === 4} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(4)}>Plataforma</Button>
              <Button disabled={props.activeInfoSection === 5} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(5)}>Descargas</Button>

            </div>
            <div style={{width: '26%', textAlign: 'end'}}>
              <Button className={classes.menuButton} style={{backgroundColor: 'white'}} disableRipple onClick={() => redirectToLoginPage()}>Iniciar sesión</Button>
            </div>
          </Toolbar>
        </AppBar>
        <Typography classes={{h2: classes.h2}} variant='h2' align='center' component='h2'>
          JLC Solutions
        </Typography>
        <Typography classes={{h4: classes.h4}} variant='h4' align='center' component='h4'>
          A software development company
        </Typography>
      </div>
      <div style={{marginTop: '205px'}}>
        {props.activeInfoSection === 0 && <HomePage onClick={toggleCurrentPage} />}
        {props.activeInfoSection === 1 && <PricingPage />}
        {props.activeInfoSection === 2 && <MobileAppPage />}
        {props.activeInfoSection === 3 && <WindowsAppPage />}
        {props.activeInfoSection === 4 && <PlatformPage />}
        {props.activeInfoSection === 5 && <DownloadsPage />}
        <div className={classes.panelBottom}>
          <Container className={classes.footer}>
            <Grid container spacing={8} justify='space-evenly'>
              {footers.map(footer => (
                <Grid item key={footer.title}>
                  <Typography variant='h6' color='inherit' gutterBottom>
                    {footer.title}
                  </Typography>
                  <ul>
                    {footer.description.map(item => (
                      <li key={item}>
                        <Link href='#' variant='subtitle1' color='inherit'>
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Grid>
              ))}
            </Grid>
            <Box mt={1}>
              <Copyright />
            </Box>
          </Container>
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

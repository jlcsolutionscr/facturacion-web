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
import HomePage from 'components/info/invoice/home/home-page'
import MobileAppPage from 'components/info/invoice/mobile-app/mobile-app-page'
import WindowsAppPage from 'components/info/invoice/windows-app/windows-app-page.js'
import PlatformPage from 'components/info/invoice/platform/platform-page'
import PricingPage from 'components/info/invoice/pricing/pricing-page'
import DownloadsPage from 'components/info/invoice/downloads/downloads-page'

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
      backgroundSize: `100% 78%`,
      minWidth: `${window.innerWidth / 8 * 7.5}px`,
      height: '185px',
      top: 0,
      left: 0,
      right: 0,
      position: 'fixed',
      paddingTop: '60px',
      zIndex: 100,
      [theme.breakpoints.down('xs')]: {
        paddingTop: '10px',
        height: '145px'
      }
    },
    header: {
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },
    headerMobile: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        marginLeft:'5%',
        paddingTop: '140px',
        display: 'block'
      }
    },
    body: {
      marginTop: '205px',
      [theme.breakpoints.down('xs')]: {
        marginTop: '10px'
      }
    },
    appBar: {
      backgroundColor: 'rgba(0,0,0,0.65)',
      color: 'white'
    },
    menuButton: {
      marginRight: theme.spacing(2),
      width: theme.spacing(16),
      backgroundColor: 'rgba(255,255,255,0.25)',
      '&:disabled': {
        color: 'rgba(255,255,255,0.65)',
        backgroundColor: 'rgba(255,255,255,0.15)'
      },
      [theme.breakpoints.down('xs')]: {
        color: 'white',
        borderRadius: '8px',
        backgroundColor: 'rgba(0,0,0,0.65)',
        width: 'auto',
        '&:disabled': {
          color: 'gray',
          backgroundColor: 'rgba(0,0,0,0.15)'
        }
      }
    },
    panelBottom: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      backgroundColor: '#262626',
      color: 'white',
      height: '220px',
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
      height: '100px',
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

  const redirectToLoginPage = () => {
    props.history.push('/enterprise')
  }
  return (
    <div id='id_app_content' className={classes.root} >
      <Loader isLoaderActive={props.isLoaderActive} loaderText={props.loaderText} />
      <div className={classes.titleContainer}>
        <AppBar classes={{colorDefault: classes.appBar}} color='default'>
          <div className={classes.header}>
            <Toolbar>
              <div style={{marginLeft: '6%'}}>
                <Button disabled={props.activeInfoSection === 0} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(0)}>Inicio</Button>
                <Button disabled={props.activeInfoSection === 1} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(1)}>Planes</Button>
                <Button disabled={props.activeInfoSection === 2} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(2)}>App Android</Button>
                <Button disabled={props.activeInfoSection === 3} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(3)}>App Windows</Button>
                <Button disabled={props.activeInfoSection === 4} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(4)}>Plataforma</Button>
                <Button disabled={props.activeInfoSection === 5} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(5)}>Descargas</Button>
              </div>
              <div style={{width: '30%', textAlign: 'end'}}>
                <Button className={classes.menuButton} style={{backgroundColor: 'white', width: 130}} disableRipple onClick={() => redirectToLoginPage()}>Iniciar sesión</Button>
              </div>
            </Toolbar>
          </div>
        </AppBar>
        <Typography classes={{h2: classes.h2}} variant='h2' align='center' component='h2'>
          JLC Solutions
        </Typography>
        <Typography classes={{h4: classes.h4}} variant='h4' align='center' component='h4'>
          A software development company
        </Typography>
      </div>
      <div className={classes.headerMobile}>
        <Button disabled={props.activeInfoSection === 0} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(0)}>Inicio</Button>
        <Button disabled={props.activeInfoSection === 1} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(1)}>Planes</Button>
        <Button disabled={props.activeInfoSection === 2} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(2)}>Android</Button>
        <Button disabled={props.activeInfoSection === 3} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(3)}>Windows</Button>
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
            <Grid container spacing={8} justify='space-evenly'>
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
          <Grid container spacing={2} justify='space-evenly'>
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

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setMenuDrawerOpen, setMenuPage } from 'store/ui/actions'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Loader from 'components/loader/loader'
import HomePage from 'components/home/home-page'
import MobileAppPage from 'components/mobile-app/mobile-app-page'
import WindowsAppPage from 'components/windows-app/windows-app-page.js'
import PlatformPage from 'components/platform/platform-page'
import DownloadsPage from 'components/downloads/downloads-page'

import BannerImage from 'assets/img/banner1.jpg'

function App(props) {
  const useStyles = makeStyles(theme => ({
    root: {
      height: '500px'
    },
    appBar: {
      backgroundColor: 'rgba(0,0,0,0.65)',
      color: 'white'
    },
    menuButton: {
      marginRight: theme.spacing(2),
      width: theme.spacing(17),
      backgroundColor: 'rgba(255,255,255,0.25)'
    },
    titleContainer: {
      backgroundImage: `url(${BannerImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `100% 78%`,
      minWidth: `${window.innerWidth / 8 * 7}px`,
      height: '205px',
      top: 0,
      left: 0,
      right: 0,
      position: 'fixed',
      paddingTop: '60px',
      zIndex: 100,
    },
    panelBottom: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      backgroundColor: '#262626',
      color: 'white',
      height: '150px'
    },
    h2: {
      marginTop: theme.spacing(2),
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
  const classes = useStyles()

  const toggleCurrentPage = (pageId) => {
    props.setMenuPage(pageId)
    window.scrollTo(0, 0)
  }

  const style = {
    root: {
      minWidth: `${window.innerWidth / 8 * 7}px`
    }
  }
  return (
    <div id='id_app_content' style={style.root} >
      <div className={classes.root}>
        <Loader isLoaderActive={props.isLoaderActive} loaderText={props.loaderText} />
        <div className={classes.titleContainer}>
          <AppBar classes={{colorDefault: classes.appBar}} color='default'>
            <Toolbar>
              <div style={{marginLeft: '8%'}}>
                <Button disabled={props.activeMenuPage === 0} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(0)}>Inicio</Button>
                <Button disabled={props.activeMenuPage === 1} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(1)}>App Android</Button>
                <Button disabled={props.activeMenuPage === 2} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(2)}>App Windows</Button>
                <Button disabled={props.activeMenuPage === 3} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(3)}>Plataforma</Button>
                <Button disabled={props.activeMenuPage === 4} className={classes.menuButton} color='inherit' onClick={() => toggleCurrentPage(4)}>Descargas</Button>
              </div>
              <div style={{width: '37%', textAlign: 'end'}}>
                <Button className={classes.menuButton} style={{backgroundColor: 'white'}} disableRipple>Iniciar sesión</Button>
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
          {props.activeMenuPage === 0 && <HomePage onClick={toggleCurrentPage} />}
          {props.activeMenuPage === 1 && <MobileAppPage />}
          {props.activeMenuPage === 2 && <WindowsAppPage />}
          {props.activeMenuPage === 3 && <PlatformPage />}
          {props.activeMenuPage === 4 && <DownloadsPage />}
          <div className={classes.panelBottom}/>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoaderActive: state.ui.isLoaderActive,
    loaderText: state.ui.loaderText,
    menuPageTitle: state.ui.menuPageTitle,
    activeMenuPage: state.ui.activeMenuPage
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setMenuDrawerOpen, setMenuPage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

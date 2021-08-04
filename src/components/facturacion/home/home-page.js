import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import BannerImage from 'assets/img/menu-background.jpg'
import LogoImage from 'assets/img/company-logo.png'

import Loader from 'components/loader/loader'
import MenuPage from './pages/menu-page'
import CompanyPage from './pages/company-page'
import LogoPage from './pages/logo-page'
import UnderConstructionPage from './pages/under-construction'
import ReportsPage from './pages/reports-page'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: `${window.innerWidth / 8 * 7.5}px`,
    height: `${window.innerHeight}px`,
    backgroundImage: `url(${BannerImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `120% ${window.innerHeight}px`,
    overflowY: 'hidden',
    overflowX: 'hidden'
  },
  titleContainer: {
    backgroundImage: `url(${LogoImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '105px 105px',
    backgroundPosition: '55% 0px',
    backgroundColor: 'transparent',
    paddingTop: '110px',
    paddingLeft: '10px',
    marginBottom: '40px',
    width: '210px',
    height: '85px',
    position: 'absolute',
    top: '30px',
    left: '35px'
  },
  h2: {
    fontFamily: 'RussoOne',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(30),
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)'
  },
  h4: {
    marginTop: '8px',
    color: '#E2EBF1',
    fontFamily: 'RussoOne',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(11.5),
    textShadow: '2px 2px 3px rgba(0,0,0,0.85)'
  },
  title: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(40),
    fontStyle: 'italic',
    fontWeight: 600,
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)',
    marginBottom: 0
  },
  subTitle: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(35),
    fontStyle: 'italic',
    fontWeight: 500,
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)',
    marginBottom: 0
  }
}))

function HomePage({ activeSection, companyName, companyIdentifier, isLoaderActive, loaderText }) {
  const classes = useStyles()
  const title = companyName
  const identification = companyIdentifier.length === 9
    ? companyIdentifier.substring(0,1) + '-' + companyIdentifier.substring(1,5) + '-' + companyIdentifier.substring(5)
    : companyIdentifier.length === 10
      ? companyIdentifier.substring(0,1) + '-' + companyIdentifier.substring(1,4) + '-' + companyIdentifier.substring(4)
      : companyIdentifier
  return (
    <div id='id_enterprise_content' className={classes.root} >
      <Loader isLoaderActive={isLoaderActive} loaderText={loaderText} />
      <div className={classes.titleContainer}>
        <Typography classes={{h2: classes.h2}} variant='h2' component='h2'>
          JLC Solutions
        </Typography>
        <Typography classes={{h4: classes.h4}} variant='h4' component='h4'>
          A software development company
        </Typography>
      </div>
      <div style={{marginTop: '50px'}}>
        <Typography className={classes.title} align='center' paragraph>
          {title}
        </Typography>
        <Typography className={classes.title} align='center' paragraph>
          {identification}
        </Typography>
        {activeSection > 0 && <Typography className={classes.subTitle} align='center' paragraph>
          {activeSection === 1
            ? 'Actualización de datos'
            : activeSection === 2
              ? 'Ingreso de su logotipo'
              : activeSection === 3
                ? 'Generación de reportes'
                : 'Página en construcción'}
        </Typography>}
      </div>
      <div style={{paddingTop: '20px', height: `${window.innerHeight - 261}px`}}>
        {activeSection === 0 && <MenuPage />}
        {activeSection === 1 && <CompanyPage />}
        {activeSection === 2 && <LogoPage />}
        {activeSection === 3 && <UnderConstructionPage />}
        {activeSection === 4 && <UnderConstructionPage />}
        {activeSection === 5 && <UnderConstructionPage />}
        {activeSection === 6 && <UnderConstructionPage />}
        {activeSection === 7 && <UnderConstructionPage />}
        {activeSection === 20 && <ReportsPage />}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoaderActive: state.ui.isLoaderActive,
    loaderText: state.ui.loaderText,
    activeSection: state.invoice.activeSection,
    companyName: state.invoice.companyName,
    companyIdentifier: state.invoice.companyIdentifier
  }
}

export default connect(mapStateToProps, null)(HomePage)

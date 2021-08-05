import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import BannerImage from 'assets/img/menu-background.jpg'
import LogoImage from 'assets/img/company-logo.png'

import MenuPage from './pages/menu-page'
import CompanyPage from './pages/company-page'
import LogoPage from './pages/logo-page'
import UnderConstructionPage from './pages/under-construction'
import BillingPage from './pages/billing-page'
import ReportsPage from './pages/reports-page'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundImage: `url(${BannerImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `110% 100%`
  },
  header: {
    flex: '0 1 auto',
    paddingTop: '70px',
    paddingBottom: '40px',
    '@media (max-width:960px)': {
      paddingTop: '0',
      paddingBottom: '10px'
    },
    '@media (max-width:414px)': {
      paddingBottom: '0'
    }
  },
  body: {
    display: 'flex',
    flex: '1 1 auto',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: '20px',
    marginBottom: '40px',
    marginLeft: '100px',
    marginRight: '100px',
    '@media (max-width:960px)': {
      marginLeft: '50px',
      marginRight: '50px'
    },
    '@media (max-width:600px)': {
      marginLeft: '15px',
      marginRight: '15px',
    },
    '@media (max-width:414px)': {
      paddingBottom: '5px',
      marginBottom: '5px',
      marginLeft: '10px',
      marginRight: '10px',
    }
  },
  banner: {
    backgroundImage: `url(${LogoImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '105px 105px',
    backgroundPosition: '50% 0px',
    backgroundColor: 'transparent',
    paddingTop: '110px',
    paddingLeft: '10px',
    position: 'absolute',
    top: '30px',
    left: '0',
    '@media (max-width:960px)': {
      backgroundSize: '85px 85px',
      marginBottom: '15px',
      position: 'relative',
      paddingTop: '90px',
      paddingLeft: '0',
      top: '10px',
      left: '0',
      textAlign: 'center',
      width: 'auto'
    },
    '@media (max-width:414px)': {
      backgroundSize: '65px 65px',
      paddingTop: '70px',
    }
  },
  h2: {
    fontFamily: 'RussoOne',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(30),
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)',
    '@media (max-width:630px)': {
      fontSize: theme.typography.pxToRem(25)
    },
    '@media (max-width:500px)': {
      fontSize: theme.typography.pxToRem(22)
    },
    '@media (max-width:414px)': {
      fontSize: theme.typography.pxToRem(20)
    }
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
    marginBottom: 0,
    '@media (max-width:630px)': {
      fontSize: theme.typography.pxToRem(30)
    },
    '@media (max-width:500px)': {
      fontSize: theme.typography.pxToRem(25)
    },
    '@media (max-width:414px)': {
      fontSize: theme.typography.pxToRem(20)
    }
  },
  subTitle: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(35),
    fontStyle: 'italic',
    fontWeight: 500,
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)',
    marginBottom: 0,
    '@media (max-width:630px)': {
      fontSize: theme.typography.pxToRem(25),
    }
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
    <div id='id_home_page' className={classes.root} >
      <div className={classes.header}>
        <div className={classes.banner}>
          <Typography classes={{h2: classes.h2}} variant='h2' component='h2'>
            JLC Solutions
          </Typography>
          <Typography classes={{h4: classes.h4}} variant='h4' component='h4'>
            A software development company
          </Typography>
        </div>
        <div>
          <Typography className={classes.title} align='center' paragraph>
            {title}
          </Typography>
          <Typography className={classes.title} align='center' paragraph>
            {identification}
          </Typography>
        </div>
      </div>
      <div className={classes.body}>
        {activeSection === 0 && <MenuPage />}
        {activeSection === 1 && <CompanyPage />}
        {activeSection === 2 && <LogoPage />}
        {activeSection === 3 && <UnderConstructionPage />}
        {activeSection === 4 && <UnderConstructionPage />}
        {activeSection === 5 && <BillingPage />}
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

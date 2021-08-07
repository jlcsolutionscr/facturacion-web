import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Header from 'components/header'

import MenuPage from './menu-page'
import CompanyPage from './company-page'
import LogoPage from './logo-page'
import UnderConstructionPage from './under-construction'
import ReportsPage from './reports-page'
import BannerImage from 'assets/img/menu-background.jpg'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundImage: `url(${BannerImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `110% 100%`
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
  }
}))

function HomePage({ activeSection, companyName, companyIdentifier }) {
  const classes = useStyles()
  return (
    <div id='id_home_page' className={classes.root} >
      <Header companyName={companyName} companyIdentifier={companyIdentifier} />
      <div className={classes.body}>
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
    isLoaderOpen: state.ui.isLoaderOpen,
    loaderText: state.ui.loaderText,
    activeSection: state.ui.activeSection,
    companyName: state.session.companyName,
    companyIdentifier: state.session.companyIdentifier
  }
}

export default connect(mapStateToProps, null)(HomePage)

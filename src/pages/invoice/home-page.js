import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Header from 'components/header'
import BannerImage from 'assets/img/menu-background.jpg'
import MenuPage from './menu-page'
import CompanyPage from './company-page'
import LogoPage from './logo-page'
import InvoicePage from './invoice-page'
import UnderConstructionPage from './under-construction'
import ReportsPage from './reports-page'

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
    margin: '0 15% 2% 15%',
    '@media (max-width:1280px)': {
      margin: '0 8% 2% 8%',
    },
    '@media (max-width:600px)': {
      margin: '0 3% 2% 3%'
    }
  }
}))

function HomePage({ activeSection, companyName, companyIdentifier, width }) {
  const classes = useStyles()
  return (
    <div id='id_home_page' className={classes.root} style={{minWidth: `${width}px`}}>
      <Header companyName={companyName} companyIdentifier={companyIdentifier} />
      <div className={classes.body}>
        {activeSection === 0 && <MenuPage />}
        {activeSection === 1 && <CompanyPage />}
        {activeSection === 2 && <LogoPage />}
        {activeSection === 3 && <UnderConstructionPage />}
        {activeSection === 4 && <UnderConstructionPage />}
        {activeSection === 5 && <InvoicePage />}
        {activeSection === 6 && <UnderConstructionPage />}
        {activeSection === 7 && <UnderConstructionPage />}
        {activeSection === 20 && <ReportsPage width={width} />}
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

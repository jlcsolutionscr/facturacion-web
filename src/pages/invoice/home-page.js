import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Header from 'components/header'
import BannerImage from 'assets/img/menu-background.jpg'
import MenuPage from './menu-page'
import CompanyPage from './company-page'
import LogoPage from './logo-page'
import InvoicePage from './invoice-page'
import InvoiceListPage from './invoice-list-page'
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
    margin: '40px 10% 20px 10%',
    '@media (max-width:960px)': {
      margin: '0px 15px 15px 15px',
    },
    '@media (max-width:600px)': {
      margin: '0px 10px 10px 10px',
    },
    '@media (max-width:414px)': {
      margin: '0px 5px 5px 5px'
    }
  }
}))

function HomePage({ activeSection, companyName, companyIdentifier, width }) {
  const classes = useStyles()
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSection])
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
        {activeSection === 6 && <InvoiceListPage />}
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
    companyIdentifier: state.session.companyIdentifier,
    branchList: state.session.branchList,
    branchId: state.session.branchId
  }
}

export default connect(mapStateToProps, null)(HomePage)

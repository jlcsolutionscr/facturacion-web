import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { logout } from 'store/session/actions'

import Header from 'components/header'
import MenuPage from './menu-page'
import CompanyPage from './company-page'
import LogoPage from './logo-page'
import CustomerListPage from './customer-list-page'
import CustomerPage from './customer-page'
import ProductListPage from './product-list-page'
import ProductPage from './product-page'
import InvoicePage from './invoice-page'
import ReceiptPage from './receipt-page'
import WorkingOrderListPage from './working-order-list-page'
import RestaurantOrderListPage from './restaurant-order-list-page'
import WorkingOrderPage from './working-order-page'
import RestaurantOrderPage from './restaurant-order-page'
import InvoiceListPage from './invoice-list-page'
import DocumentListPage from './document-list-page'
import ReportsPage from './reports-page'
import BannerImage from 'assets/img/home-background.webp'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '@media (max-width:414px)': {
      backgroundImage: 'none',
      backgroundColor: '#FFF'
    }
  },
  body: {
    backgroundImage: `url(${BannerImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `100% 100%`,
    display: 'flex',
    flex: '1 1 auto',
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#FFF',
    padding: '0px 10% 20px 10%',
    '@media (max-width:960px)': {
      padding: '0 16px 16px 16px',
    },
    '@media (max-width:600px)': {
      padding: '0 13px 13px 13px',
    },
    '@media (max-width:414px)': {
      backgroundImage: `none`,
      padding: '0 10px 10px 10px'
    }
  }
}))

function HomePage({ activeSection, mode, companyName, companyIdentifier, width, isDarkMode, toggleDarkMode, logout }) {
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [activeSection])
  return (
    <div id='id_home_page' className={classes.root} style={{minWidth: `${width}px`}}>
      <Header companyName={companyName} companyIdentifier={companyIdentifier} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} logOut={logout} />
      <div ref={myRef} className={classes.body}>
        {activeSection === 0 && <MenuPage />}
        {activeSection === 1 && <CompanyPage />}
        {activeSection === 2 && <LogoPage />}
        {activeSection === 3 && <CustomerListPage />}
        {activeSection === 4 && <ProductListPage />}
        {activeSection === 5 && <InvoicePage />}
        {activeSection === 6 && <ReceiptPage />}
        {activeSection === 7 && <InvoiceListPage />}
        {activeSection === 8 && <DocumentListPage />}
        {activeSection === 9 ? mode === 1 ? <WorkingOrderListPage /> : <RestaurantOrderListPage /> : null}
        {activeSection === 20 && <ReportsPage width={width} />}
        {activeSection === 21 ? mode === 1 ? <WorkingOrderPage /> : <RestaurantOrderPage /> : null}
        {activeSection === 22 && <CustomerPage />}
        {activeSection === 23 && <ProductPage />}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoaderOpen: state.ui.isLoaderOpen,
    loaderText: state.ui.loaderText,
    activeSection: state.ui.activeSection,
    mode: state.session.company.Modalidad,
    companyName: state.session.company.NombreComercial || state.session.company.NombreEmpresa,
    companyIdentifier: state.session.company.Identificacion,
    branchList: state.session.branchList,
    branchId: state.session.branchId
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ logout }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveHomeSection } from 'store/ui/actions'
import { logOut } from 'store/session/actions'

import {
  getCompany,
  updateCantonList,
  updateDistritoList,
  updateBarrioList,
  setReportsParameters,
  setCompanyAttribute,
  saveCompany,
  saveLogo,
  generateReport,
  exportReport
} from 'store/company/actions'

import Typography from '@material-ui/core/Typography'
import BannerImage from 'assets/img/menu-background.jpg'
import LogoImage from 'assets/img/company-logo.png'

import Loader from 'components/loader/loader'
import MenuPage from './menu/menu-page'
import CompanyPage from './company/company-page'
import LogoPage from './company/logo-page'
import ReportsPage from './company/reports-page'

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

function HomePage(props) {
  const classes = useStyles()
  const title = props.companyName
  const identification = props.companyIdentifier.length === 9
    ? props.companyIdentifier.substring(0,1) + '-' + props.companyIdentifier.substring(1,5) + '-' + props.companyIdentifier.substring(5)
    : props.companyIdentifier.length === 10
      ? props.companyIdentifier.substring(0,1) + '-' + props.companyIdentifier.substring(1,4) + '-' + props.companyIdentifier.substring(4)
      : props.companyIdentifier
  return (
    <div id='id_enterprise_content' className={classes.root} >
      <Loader isLoaderActive={props.isLoaderActive} loaderText={props.loaderText} />
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
        {props.activeHomeSection > 0 && <Typography className={classes.subTitle} align='center' paragraph>
          {props.activeHomeSection === 1
            ? 'Actualización de datos'
            : props.activeHomeSection === 2
              ? 'Actualización de logotipo'
              : 'Generación de reportes'}
        </Typography>}
      </div>
      <div style={{paddingTop: '20px', height: `${window.innerHeight - 261}px`}}>
        {props.activeHomeSection === 0 && <MenuPage {...props} />}
        {props.activeHomeSection === 1 && <CompanyPage {...props} />}
        {props.activeHomeSection === 2 && <LogoPage {...props} />}
        {props.activeHomeSection === 3 && <ReportsPage {...props} />}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoaderActive: state.ui.isLoaderActive,
    loaderText: state.ui.loaderText,
    activeHomeSection: state.ui.activeHomeSection,
    companyName: state.company.companyName,
    companyIdentifier: state.company.companyIdentifier,
    rolesPerUser: state.session.rolesPerUser,
    company: state.company.company,
    cantonList: state.company.cantonList,
    distritoList: state.company.distritoList,
    barrioList: state.company.barrioList,
    branchList: state.company.branchList,
    reportResults: state.company.reportResults,
    reportSummary: state.company.reportSummary,
    companyPageError: state.company.companyPageError,
    logoPageError: state.company.logoPageError,
    reportsPageError: state.company.reportsPageError
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    logOut,
    setActiveHomeSection,
    getCompany,
    updateCantonList,
    updateDistritoList,
    updateBarrioList,
    setReportsParameters,
    setCompanyAttribute,
    saveCompany,
    saveLogo,
    generateReport,
    exportReport
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

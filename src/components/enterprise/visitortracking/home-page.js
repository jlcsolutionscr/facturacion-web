import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { logOut } from 'store/session/actions'

import {
  setActiveSection,
  setCompany,
  setCompanyAdminParameters,
  setCompanyParameters,
  getCompany,
  setCompanyAttribute,
  saveCompany,
  setBranch,
  setBranchParameters,
  getBranch,
  saveBranch,
  setBranchAttribute,
  setUser,
  addUserRole,
  removeUserRole,
  getUser,
  saveUser,
  setUserAttribute,
  setEmployee,
  setEmployeeParameters,
  getEmployee,
  setEmployeeAttribute,
  saveEmployee,
  setRegistryParameters,
  activateRegistry,
  setReportsParameters,
  generateReport,
  downloadQRCode
} from 'store/visitortracking/actions'

import Typography from '@material-ui/core/Typography'
import BannerImage from 'assets/img/menu-background.jpg'
import LogoImage from 'assets/img/company-logo.png'

import Loader from 'components/loader/loader'
import MenuPage from './pages/menu-page'
import AdminPage from './pages/admin-page'
import CompanyPage from './pages/company-page'
import BranchPage from './pages/branch-page'
import EmployeePage from './pages/employee-page'
import RegistryPage from './pages/registry-page'
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

function HomePage(props) {
  const classes = useStyles()
  const title = props.companyName !== '' ? props.companyName : 'Usuario administrador'
  const identification = props.companyIdentifier.length === 9
    ? props.companyIdentifier.substring(0,1) + '-' + props.companyIdentifier.substring(1,5) + '-' + props.companyIdentifier.substring(5)
    : props.companyIdentifier.length === 10
      ? props.companyIdentifier.substring(0,1) + '-' + props.companyIdentifier.substring(1,4) + '-' + props.companyIdentifier.substring(4)
      : props.companyIdentifier.length > 0
        ? props.companyIdentifier
        : 'Modo mantenimiento'
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
        {props.activeSection > 0 && <Typography className={classes.subTitle} align='center' paragraph>
          {props.activeSection === 1
            ? 'Administrar datos de empresas'
            : props.activeSection === 2
              ? 'Actualización de la empresa'
              : props.activeSection === 3
                ? 'Actualización de las sucursales'
                : props.activeSection === 4
                  ? 'Actualización de empleados'
                  : props.activeSection === 5
                  ? 'Activación de registros de clientes'
                  : 'Generación de reportes'}
        </Typography>}
      </div>
      <div style={{paddingTop: '20px', height: `${window.innerHeight - 261}px`}}>
        {props.activeSection === 0 && <MenuPage {...props} />}
        {props.activeSection === 1 && <AdminPage {...props} />}
        {props.activeSection === 2 && <CompanyPage {...props} />}
        {props.activeSection === 3 && <BranchPage {...props} />}
        {props.activeSection === 4 && <EmployeePage {...props} />}
        {props.activeSection === 5 && <RegistryPage {...props} />}
        {props.activeSection === 6 && <ReportsPage {...props} />}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoaderActive: state.ui.isLoaderActive,
    loaderText: state.ui.loaderText,
    activeSection: state.visitortracking.activeSection,
    companyId: state.visitortracking.companyId,
    companyName: state.visitortracking.companyName,
    companyIdentifier: state.visitortracking.companyIdentifier,
    rolesPerUser: state.session.rolesPerUser,
    companyList: state.visitortracking.companyList,
    roleList: state.visitortracking.roleList,
    company: state.visitortracking.company,
    branchList: state.visitortracking.branchList,
    branch: state.visitortracking.branch,
    userList: state.visitortracking.userList,
    user: state.visitortracking.user,
    employeeList: state.visitortracking.employeeList,
    employee: state.visitortracking.employee,
    customerList: state.visitortracking.customerList,
    customer: state.visitortracking.customer,
    registryList: state.visitortracking.registryList,
    registry: state.visitortracking.registry,
    reportResults: state.visitortracking.reportResults,
    reportSummary: state.visitortracking.reportSummary
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    logOut,
    setActiveSection,
    setCompanyAdminParameters,
    setCompany,
    setCompanyParameters,
    getCompany,
    setCompanyAttribute,
    saveCompany,
    setBranch,
    setBranchParameters,
    getBranch,
    setBranchAttribute,
    saveBranch,
    setUser,
    addUserRole,
    removeUserRole,
    setUserAttribute,
    getUser,
    saveUser,
    setEmployee,
    setEmployeeParameters,
    getEmployee,
    setEmployeeAttribute,
    saveEmployee,
    setRegistryParameters,
    activateRegistry,
    setReportsParameters,
    generateReport,
    downloadQRCode
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

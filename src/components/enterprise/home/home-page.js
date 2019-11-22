import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveHomeSection } from 'store/session/actions'

import Typography from '@material-ui/core/Typography'
import BannerImage from 'assets/img/menu-background.jpg'
import LogoImage from 'assets/img/company-logo.png'

import MenuPage from './menu/menu-page'
import CompanyPage from './company/company-page'
import CertificatePage from './company/certificate-page'

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
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)'
  },
  subTitle: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(35),
    fontStyle: 'italic',
    fontWeight: 500,
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)'
  },
}))

function HomePage(props) {
  const classes = useStyles()
  const title = props.company.NombreComercial ? props.company.NombreComercial : props.company.NombreEmpresa
  let identification = props.company.Identificacion
  if (props.company) {
    const id = props.company.Identificacion
    identification = props.company.IdTipoIdentificacion === 0
      ? id.substring(0,1) + '-' + id.substring(1,5) + '-' + id.substring(5)
      : props.company.IdTipoIdentificacion === 1
        ? id.substring(0,1) + '-' + id.substring(1,4) + '-' + id.substring(4)
        : id
  }
  return (
    <div id='id_enterprise_content' className={classes.root} >
      <div className={classes.titleContainer}>
        <Typography classes={{h2: classes.h2}} variant='h2' component='h2'>
          JLC Solutions
        </Typography>
        <Typography classes={{h4: classes.h4}} variant='h4' component='h4'>
          A software development company
        </Typography>
      </div>
      <div style={{marginTop: '70px'}}>
        <Typography className={classes.title} align='center' paragraph>
          {title}
        </Typography>
        <Typography className={classes.subTitle} align='center' paragraph>
          {identification}
        </Typography>
      </div>
      <div style={{paddingTop: '40px', height: `${window.innerHeight - 261}px`}}>
        {props.activeHomeSection === 0 && <MenuPage company={props.company} onClick={props.setActiveHomeSection} />}
        {props.activeHomeSection === 1 && <CompanyPage company={props.company} />}
        {props.activeHomeSection === 2 && <CertificatePage company={props.company} />}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    activeHomeSection: state.session.activeHomeSection,
    company: state.session.company
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setActiveHomeSection }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

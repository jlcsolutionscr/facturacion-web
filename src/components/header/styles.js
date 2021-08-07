import { makeStyles, createStyles } from '@material-ui/core/styles'
import LogoImage from 'assets/img/company-logo.png'

export const createStyle = makeStyles(theme => createStyles({
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
  }
}))
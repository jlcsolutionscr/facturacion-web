import { makeStyles, createStyles } from '@material-ui/core/styles'
import LogoImage from 'assets/img/company-logo.png'
import LogoDarkImage from 'assets/img/company-logo-dark.png'

export const createStyle = makeStyles(theme => createStyles({
  header: {
    flex: '0 1 auto',
    paddingTop: '0',
    paddingBottom: '10px',
    '@media (max-width:960px)': {
      paddingBottom: '0'
    },
    '@media (max-width:600px)': {
      paddingBottom: '10px'
    },
    '@media (max-width:414px)': {
      backgroundImage: 'linear-gradient(to bottom, rgba(8, 65, 92,0.2), rgba(8, 65, 92,0.7), rgba(8, 65, 92, 1))'
    }
  },
  banner: {
    backgroundImage: `url(${LogoImage})`,
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    backgroundSize: '105px 105px',
    backgroundPosition: '10px 0',
    top: '10px',
    left: '0',
    height: '105px',
    width: '100%',
    '@media (max-width:600px)': {
      backgroundSize: '95px 95px',
      height: '95px'
    },
    '@media (max-width:414px)': {
      backgroundImage: `url(${LogoDarkImage})`,
      backgroundSize: '75px 75px',
      height: '75px'
    }
  },
  text: {
    textAlign: 'left',
    margin: '30px 0 0 120px',
    '@media (max-width:600px)': {
      margin: '30px 0 0 110px'
    },
    '@media (max-width:414px)': {
      margin: '20px 0 10px 90px',
      color: 'rgba(0,0,0,0.65)'
    }
  },
  h2: {
    fontFamily: 'RussoOne',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(25),
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)',
    '@media (max-width:600px)': {
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
    fontSize: theme.typography.pxToRem(15),
    textShadow: '2px 2px 3px rgba(0,0,0,0.85)',
    '@media (max-width:600px)': {
      fontSize: theme.typography.pxToRem(13)
    },
    '@media (max-width:414px)': {
      fontSize: theme.typography.pxToRem(11)
    }
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    top: '40px',
    '@media (max-width:960px)': {
      position: 'relative',
      top: '0px'
    }
  },
  companyText: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(30),
    fontStyle: 'italic',
    fontWeight: 600,
    textShadow: '4px 4px 6px rgba(0,0,0,0.45)',
    marginBottom: 0,
    '@media (max-width:600px)': {
      fontSize: theme.typography.pxToRem(23)
    },
    '@media (max-width:414px)': {
      fontSize: theme.typography.pxToRem(20),
      color: 'rgba(255,255,255,0.85)'
    }
  }
}))
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import {
  setActiveSection,
  saveLogo
} from 'store/billing/actions'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    marginTop: '50px',
    marginLeft: '30px',
    padding: '50px 30px 0 30px',
    '@media (max-width:414px)': {
      marginTop: '5px',
      marginLeft: '5px',
      padding: '10px'
    },
    '@media (max-width:360px)': {
      marginLeft: '0'
    }
  },
  errorLabel: {
    fontFamily: '"Exo 2", sans-serif',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(15),
    color: 'red',
    fontWeight: '700',
    marginBottom: '20px'
  },
  button: {
    padding: '5px 15px',
    backgroundColor: '#239BB5',
    color: 'white',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: '#29A4B4',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    }
  },
  imagePreview: {
    textAlign: 'center',
    height: '160px',
    width: '350px',
    '@media (max-width:460px)': {
      width: '100%'
    }
  }
}))

function LogoPage({ errorMessage, setActiveSection, saveLogo }) {
  const classes = useStyles()
  const [logo, setLogo] = React.useState('')
  const [filename, setFilename] = React.useState('')
  const handleImageChange = event => {
    event.preventDefault()
    let reader = new FileReader()
    let file = event.target.files[0]
    reader.onloadend = () => {
      setLogo(reader.result)
      setFilename(file.name)
    }
    reader.readAsDataURL(file)
  }
  const handleSaveButton = () => {
    const logoBase64 = logo.substring(logo.indexOf(',') + 1)
    saveLogo(logoBase64)
  }
  const imagePreview = logo !== '' ? (<img style={{height: '100%', width: '100%', border: '1px solid'}} src={logo} alt='Seleccione un archivo'/>) : (<div style={{height: '100%', width: '100%', border: '1px solid'}}/>)
  return (
    <div className={classes.container}>
      {errorMessage !== '' && <Typography className={classes.errorLabel} style={{fontWeight: '700'}} color='textSecondary' component='p'>
        {errorMessage}
      </Typography>}
      <Grid container spacing={3}>
      <Grid item xs={6} sm={6}>
          <TextField
            disabled={true}
            value={filename}
            id='Logotipo'
            fullWidth
            variant='outlined'
          />
        </Grid>
        <Grid item xs={2} sm={2}>
          <input
            accept='png/*'
            style={{display: 'none'}}
            id='contained-button-file'
            multiple
            type='file'
            onChange={handleImageChange}
          />
          <label htmlFor='contained-button-file'>
            <Button
              component='span'
              variant='contained'
              className={classes.button}
              style={{marginTop: '11px'}}
            >
              Seleccionar
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className={classes.imagePreview}>
            {imagePreview}
          </div>
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button variant='contained' disabled={logo === ''} className={classes.button} onClick={() => handleSaveButton()}>
            Actualizar
          </Button>
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button variant='contained' className={classes.button} onClick={() => setActiveSection(0)}>
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return { errorMessage: state.ui.errorMessage }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({setActiveSection, saveLogo}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoPage)

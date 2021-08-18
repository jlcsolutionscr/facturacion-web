import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'

import { saveLogo } from 'store/company/actions'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import Button from 'components/button'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: 'hidden',
    margin: '0 auto auto auto',
    padding: '20px',
    '@media (max-width:960px)': {
      padding: '15px'
    },
    '@media (max-width:600px)': {
      padding: '10px'
    },
    '@media (max-width:414px)': {
      padding: '5px'
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
  imagePreview: {
    borderRadius: theme.shape.borderRadius,
    border: '1px solid rgba(0, 0, 0, 0.23)',
    textAlign: 'center',
    height: '160px',
    width: '350px',
    '@media (max-width:460px)': {
      width: '100%'
    }
  }
}))

function LogoPage({ setActiveSection, saveLogo }) {
  const classes = useStyles()
  const [logo, setLogo] = React.useState('')
  const [filename, setFilename] = React.useState('')
  const inputFile = React.useRef(null)
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
  const imagePreview = logo !== '' ? (<img style={{height: '100%', width: '100%', border: 'none'}} src={logo} alt='Seleccione un archivo'/>) : (<div style={{height: '100%', width: '100%', border: 'none'}}/>)
  return (
    <div className={classes.root}>
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
            ref={inputFile}
            multiple
            type='file'
            onChange={handleImageChange}
          />
          <Button style={{marginTop: '11px'}} label='Seleccionar' onClick={() => inputFile.current.click()} />
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className={classes.imagePreview}>
            {imagePreview}
          </div>
        </Grid>
        <Grid item xs={5} sm={3}>
          <Button disabled={logo === ''} label='Actualizar' onClick={() => handleSaveButton()} />
        </Grid>
        <Grid item xs={5} sm={3}>
          <Button label='Regresar' onClick={() => setActiveSection(0)} />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return { message: state.ui.message }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({setActiveSection, saveLogo}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoPage)

import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    borderRadius: '8px',
    overflowY: 'auto',
    marginLeft: '150px',
    marginRight: '150px',
    padding: '25px',
    maxHeight: `${window.innerHeight - 302}px`,
    backgroundColor: 'rgba(255,255,255,0.55)'
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
    width: '350px'
  }
}))

function LogoPage(props) {
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
    props.saveLogo(logoBase64)
  }
  const imagePreview = logo !== '' ? (<img style={{height: '100%', width: '100%', border: '1px solid'}} src={logo} alt='Seleccione un archivo'/>) : (<div style={{height: '100%', width: '100%', border: '1px solid'}}/>)
  return (
    <div className={classes.container}>
      {props.logoPageError !== '' && <Typography className={classes.errorLabel} style={{fontWeight: '700'}} color='textSecondary' component='p'>
        {props.logoPageError}
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
        <Grid item xs={2}>
          <Button variant='contained' disabled={logo === ''} className={classes.button} onClick={() => handleSaveButton()}>
            Actualizar
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => props.setActiveHomeSection(0)}>
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default LogoPage

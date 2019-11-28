import React from 'react'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from 'components/custom/custom-textfield'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
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
  }
}))

function CompanyPage(props) {
  const classes = useStyles()
  const [certificate, setCertificate] = React.useState('')
  let disabled = true
  if (props.company != null) {
    disabled = props.company.NombreEmpresa === ''
      || props.company.Identificacion === ''
      || props.company.CodigoActividad === ''
      || props.company.Direccion === ''
      || props.company.Telefono === ''
      || props.company.CorreoNotificacion === ''
  }
  const handleChange = event => {
    props.setCompanyAttribute(event.target.id, event.target.value)
  }
  const handleSelectChange = (id, value) => {
    if (id === 'IdProvincia') {
      props.updateCantonList(value)
    } else if (id === 'IdCanton') {
      props.updateDistritoList(props.company.IdProvincia, value)
    } else if (id === 'IdDistrito') {
      props.updateBarrioList(props.company.IdProvincia, props.company.IdCanton, value)
    } else {
      props.setCompanyAttribute(id, value)
    }
  }
  const handleCertificateChange = event => {
    event.preventDefault()
    let reader = new FileReader()
    let file = event.target.files[0]
    props.setCompanyAttribute('NombreCertificado', file.name)
    reader.onloadend = () => {
      const certificateBase64 = reader.result.substring(reader.result.indexOf(',') + 1)
      setCertificate(certificateBase64)
    }
    reader.readAsDataURL(file)
  }
  const cantonList = props.cantonList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const distritoList = props.distritoList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const barrioList = props.barrioList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  return (
    <div className={classes.container}>
      {props.companyPageError !== '' && <Typography className={classes.errorLabel} style={{fontWeight: '700'}} color='textSecondary' component='p'>
        {props.companyPageError}
      </Typography>}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            id='NombreComercial'
            value={props.company ? props.company.NombreComercial : ''}
            label='Nombre comercial'
            fullWidth
            autoComplete='lname'
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id='CodigoActividad'
            value={props.company ? props.company.CodigoActividad : ''}
            label='Codigo actividad'
            fullWidth
            variant='outlined'
            inputProps={{maxLength: 6}}
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id='demo-simple-select-label'>Provincia</InputLabel>
            <Select
              id='IdProvincia'
              value={props.company ? props.company.IdProvincia : 1}
              onChange={(event) => handleSelectChange('IdProvincia', event.target.value)}
            >
              <MenuItem value={1}>SAN JOSE</MenuItem>
              <MenuItem value={2}>ALAJUELA</MenuItem>
              <MenuItem value={3}>CARTAGO</MenuItem>
              <MenuItem value={4}>HEREDIA</MenuItem>
              <MenuItem value={5}>GUANACASTE</MenuItem>
              <MenuItem value={6}>PUNTARENAS</MenuItem>
              <MenuItem value={7}>LIMON</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id='demo-simple-select-label'>Cantón</InputLabel>
            <Select
              id='IdCanton'
              value={props.company && cantonList.length > 0 ? props.company.IdCanton : ''}
              onChange={(event) => handleSelectChange('IdCanton', event.target.value)}
            >
              {cantonList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id='demo-simple-select-label'>Distrito</InputLabel>
            <Select
              id='IdDistrito'
              value={props.company && distritoList.length > 0 ? props.company.IdDistrito : ''}
              onChange={(event) => handleSelectChange('IdDistrito', event.target.value)}
            >
              {distritoList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id='demo-simple-select-label'>Barrio</InputLabel>
            <Select
              id='IdBarrio'
              value={props.company && barrioList.length > 0 ? props.company.IdBarrio : ''}
              onChange={(event) => handleSelectChange('IdBarrio', event.target.value)}
            >
              {barrioList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Direccion'
            value={props.company ? props.company.Direccion : ''}
            label='Dirección'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Telefono'
            value={props.company ? props.company.Telefono : ''}
            label='Teléfono'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='CorreoNotificacion'
            value={props.company ? props.company.CorreoNotificacion : ''}
            label='Correo para notificaciones'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            disabled={props.company ? props.company.RegimenSimplificado : true}
            id='UsuarioHacienda'
            value={props.company ? props.company.UsuarioHacienda : ''}
            label='Usuario ATV'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            disabled={props.company ? props.company.RegimenSimplificado : true}
            id='ClaveHacienda'
            value={props.company ? props.company.ClaveHacienda : ''}
            label='Clave ATV'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={10} sm={10}>
          <TextField
            disabled
            id='NombreCertificado'
            value={props.company ? props.company.NombreCertificado : ''}
            label='Llave criptográfica'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={2} sm={2}>
          <input
            accept='p12/*'
            style={{display: 'none'}}
            id='contained-button-file'
            multiple
            type='file'
            onChange={handleCertificateChange}
          />
          <label htmlFor='contained-button-file'>
            <Button
              disabled={props.company ? props.company.RegimenSimplificado : true}
              component='span'
              variant='contained'
              className={classes.button}
              style={{marginTop: '11px'}}
            >
              Cargar
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            disabled={props.company ? props.company.RegimenSimplificado : true}
            id='PinCertificado'
            value={props.company ? props.company.PinCertificado : ''}
            label='Pin de llave criptográfica'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => props.saveCompany(certificate)}>
            Guardar
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

export default CompanyPage
              
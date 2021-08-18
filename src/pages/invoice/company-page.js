import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import {
  setActiveSection,
  updateCantonList,
  updateDistritoList,
  updateBarrioList
} from 'store/ui/actions'

import {
  setCompanyAttribute,
  saveCompany,
} from 'store/company/actions'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import TextField from 'components/text-field'
import Button from 'components/button'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: 'auto',
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
  }
}))

function CompanyPage({company, cantonList, distritoList, barrioList, setCompanyAttribute, updateCantonList, updateDistritoList, updateBarrioList, saveCompany, setActiveSection}) {
  const classes = useStyles()
  const [certificate, setCertificate] = React.useState('')
  const inputFile = React.useRef(null)
  let disabled = true
  if (company != null) {
    disabled = company.NombreEmpresa === ''
      || company.Identificacion === ''
      || company.CodigoActividad === ''
      || company.Direccion === ''
      || company.Telefono1 === ''
      || company.CorreoNotificacion === ''
  }
  const handleChange = event => {
    setCompanyAttribute(event.target.id, event.target.value)
  }
  const handleSelectChange = (id, value) => {
    if (id === 'IdProvincia') {
      setCompanyAttribute('IdProvincia', value)
      updateCantonList(value)
    } else if (id === 'IdCanton') {
      setCompanyAttribute('IdCanton', value)
      updateDistritoList(company.IdProvincia, value)
    } else if (id === 'IdDistrito') {
      setCompanyAttribute('IdDistrito', value)
      updateBarrioList(company.IdProvincia, company.IdCanton, value)
    } else {
      setCompanyAttribute(id, value)
    }
  }
  const handleCertificateChange = event => {
    event.preventDefault()
    let reader = new FileReader()
    let file = event.target.files[0]
    setCompanyAttribute('NombreCertificado', file.name)
    reader.onloadend = () => {
      const certificateBase64 = reader.result.substring(reader.result.indexOf(',') + 1)
      setCertificate(certificateBase64)
    }
    reader.readAsDataURL(file)
  }
  const cantonItems = cantonList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const distritoItems = distritoList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  const barrioItems = barrioList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            id='NombreComercial'
            value={company ? company.NombreComercial : ''}
            label='Nombre comercial'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id='CodigoActividad'
            value={company ? company.CodigoActividad : ''}
            label='Codigo actividad'
            fullWidth
            variant='outlined'
            inputProps={{maxLength: 6}}
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Provincia</InputLabel>
            <Select
              id='IdProvincia'
              value={company ? company.IdProvincia : 1}
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
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Cantón</InputLabel>
            <Select
              id='IdCanton'
              value={company && cantonItems.length > 0 ? company.IdCanton : ''}
              onChange={(event) => handleSelectChange('IdCanton', event.target.value)}
            >
              {cantonItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Distrito</InputLabel>
            <Select
              id='IdDistrito'
              value={company && distritoItems.length > 0 ? company.IdDistrito : ''}
              onChange={(event) => handleSelectChange('IdDistrito', event.target.value)}
            >
              {distritoItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Barrio</InputLabel>
            <Select
              id='IdBarrio'
              value={company && barrioItems.length > 0 ? company.IdBarrio : ''}
              onChange={(event) => handleSelectChange('IdBarrio', event.target.value)}
            >
              {barrioItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Direccion'
            value={company ? company.Direccion : ''}
            label='Dirección'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Telefono1'
            value={company ? company.Telefono1 : ''}
            label='Teléfono 1'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id='Telefono2'
            value={company ? company.Telefono2 : ''}
            label='Teléfono 2'
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
            value={company ? company.CorreoNotificacion : ''}
            label='Correo para notificaciones'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            disabled={company ? company.RegimenSimplificado : true}
            id='UsuarioHacienda'
            value={company ? company.UsuarioHacienda : ''}
            label='Usuario ATV'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            disabled={company ? company.RegimenSimplificado : true}
            id='ClaveHacienda'
            value={company ? company.ClaveHacienda : ''}
            label='Clave ATV'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={8} sm={9} md={10}>
          <TextField
            disabled
            id='NombreCertificado'
            value={company ? company.NombreCertificado : ''}
            label='Llave criptográfica'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={1}>
          <input
            accept='p12/*'
            style={{display: 'none'}}
            id='contained-button-file'
            ref={inputFile}
            multiple
            type='file'
            onChange={handleCertificateChange}
          />
          <Button disabled={company ? company.RegimenSimplificado : true} label='Cargar' onClick={() => inputFile.current.click()} />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            disabled={company ? company.RegimenSimplificado : true}
            id='PinCertificado'
            value={company ? company.PinCertificado : ''}
            label='Pin de llave criptográfica'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            disabled={disabled}
            label='Guardar'
            onClick={() => saveCompany(certificate)}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            disabled={company ? company.RegimenSimplificado : true}
            label='Regresar'
            onClick={() => setActiveSection(0)}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    company: state.company.company,
    cantonList: state.ui.cantonList,
    distritoList: state.ui.distritoList,
    barrioList: state.ui.barrioList
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setActiveSection,
    updateCantonList,
    updateDistritoList,
    updateBarrioList,
    setCompanyAttribute,
    saveCompany
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyPage)
              
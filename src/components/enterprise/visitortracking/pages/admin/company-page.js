import React from 'react'

import Grid from '@material-ui/core/Grid'
import TextField from 'components/custom/custom-textfield'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  form: {
    width: '40%',
    minWidth: '350px',
    marginTop: theme.spacing(1)
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
  let disabled = true
  if (props.company != null) {
    disabled = props.company.CompanyName === ''
      || props.company.Identifier === ''
      || props.company.CompanyAddress === ''
      || props.company.PhoneNumber === ''
      || props.company.PromotionAt === null
      || props.company.PromotionDescription === ''
      || props.company.PromotionMessage === ''
  }
  const handleClose = () => {
    props.setCompany(null)
    props.setBranch(null)
    props.setActiveSection(0)
  }
  const handleNewCompanyClick = () => {
    props.setCompany(null)
    props.setBranch(null)
  }
  const companyList = props.companyList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
        <FormControl className={classes.form} disabled={props.companyList.Count === 0}>
          <InputLabel id='demo-simple-select-label'>Seleccione una empresa</InputLabel>
          <Select
            id='CompanyId'
            value={props.company && props.company.Id > 0 ? props.company.Id : ''}
            onChange={(event) => props.getCompany(event.target.value)}
          >
            {companyList}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='CompanyName'
          value={props.company && props.company.CompanyName ? props.company.CompanyName : ''}
          label='Nombre empresa'
          fullWidth
          autoComplete='lname'
          variant='outlined'
          onChange={(event) => props.setCompanyAttribute('CompanyName', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='Identifier'
          value={props.company && props.company.Identifier ? props.company.Identifier : ''}
          label='Identificación'
          fullWidth
          variant='outlined'
          inputProps={{maxLength: 12}}
          numericFormat
          onChange={(event) => props.setCompanyAttribute('Identifier', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='CompanyAddress'
          value={props.company && props.company.CompanyAddress ? props.company.CompanyAddress : ''}
          label='Dirección'
          fullWidth
          variant='outlined'
          onChange={(event) => props.setCompanyAttribute('CompanyAddress', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='PhoneNumber'
          value={props.company && props.company.PhoneNumber  ? props.company.PhoneNumber : ''}
          label='Teléfono'
          fullWidth
          variant='outlined'
          inputProps={{maxLength: 8}}
          numericFormat
          onChange={(event) => props.setCompanyAttribute('PhoneNumber', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='PromotionAt'
          value={props.company && props.company.PromotionAt ? props.company.PromotionAt : ''}
          label='Cantidad de visitas'
          fullWidth
          variant='outlined'
          numericFormat
          onChange={(event) => props.setCompanyAttribute('PromotionAt', event.target.value !== '' ? parseInt(event.target.value) : null)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='PromotionDescription'
          value={props.company && props.company.PromotionDescription ? props.company.PromotionDescription : ''}
          label='Descripción de la promoción'
          fullWidth
          variant='outlined'
          onChange={(event) => props.setCompanyAttribute('PromotionDescription', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='PromotionMessage'
          value={props.company && props.company.PromotionMessage ? props.company.PromotionMessage : ''}
          label='Mensaje para el cliente'
          fullWidth
          variant='outlined'
          onChange={(event) => props.setCompanyAttribute('PromotionMessage', event.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => props.saveCompany()}>
          {props.company && props.company.Id ? 'Actualizar' : 'Agregar'}
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' className={classes.button} onClick={() => handleNewCompanyClick()}>
          Nuevo
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' className={classes.button} onClick={() => handleClose()}>
          Regresar
        </Button>
      </Grid>
    </Grid>
  )
}

export default CompanyPage

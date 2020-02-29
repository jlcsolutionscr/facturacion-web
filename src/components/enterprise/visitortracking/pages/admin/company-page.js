import React from 'react'

import Grid from '@material-ui/core/Grid'
import TextField from 'components/custom/custom-textfield'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
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
  const handleDateChange = (value) => {
    const day = (value.getDate() < 10 ? '0' : '') + value.getDate()
    const month = value.getMonth()+1 < 10 ? '0'+(value.getMonth()+1) : value.getMonth()+1
    const newDate = value.getFullYear()+'-'+month+'-'+day+'T23:59:59'
    props.setCompanyAttribute('ExpiresAt', newDate)
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
  const expirationDate = props.company && props.company.ExpiresAt ? new Date(props.company.ExpiresAt.substring(0,4), props.company.ExpiresAt.substring(5,7) - 1, props.company.ExpiresAt.substring(8,10)) : new Date()
  const companyList = props.companyList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
        <FormControl className={classes.form} disabled={props.companyList.Count === 0}>
          <InputLabel id='demo-simple-select-label'>Seleccione un elemento</InputLabel>
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={3} sm={3}>
            <DatePicker
              label='Fecha contrato'
              format='dd/MM/yyyy'
              value={expirationDate}
              onChange={(value) => handleDateChange(value)}
              animateYearScrolling
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12} sm={12}>
        <FormControl className={classes.form}>
          <InputLabel id="demo-simple-select-label">Seleccione la zona horaria</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={props.company && props.company.UtcTimeFactor  ? props.company.UtcTimeFactor : ''}
            onChange={(event) => props.setCompanyAttribute('UtcTimeFactor', event.target.value)}
          >
            <MenuItem value={0}>GMT</MenuItem>
            <MenuItem value={1}>GMT+1:00</MenuItem>
            <MenuItem value={2}>GMT+2:00</MenuItem>
            <MenuItem value={3}>GMT+3:00</MenuItem>
            <MenuItem value={4}>GMT+4:00</MenuItem>
            <MenuItem value={5}>GMT+5:00</MenuItem>
            <MenuItem value={6}>GMT+6:00</MenuItem>
            <MenuItem value={7}>GMT+7:00</MenuItem>
            <MenuItem value={8}>GMT+8:00</MenuItem>
            <MenuItem value={9}>GMT+9:00</MenuItem>
            <MenuItem value={10}>GMT+10:00</MenuItem>
            <MenuItem value={11}>GMT+11:00</MenuItem>
            <MenuItem value={12}>GMT+12:00</MenuItem>
            <MenuItem value={-11}>GMT-11:00</MenuItem>
            <MenuItem value={-10}>GMT-10:00</MenuItem>
            <MenuItem value={-9}>GMT-09:00</MenuItem>
            <MenuItem value={-8}>GMT-08:00</MenuItem>
            <MenuItem value={-7}>GMT-07:00</MenuItem>
            <MenuItem value={-6}>GMT-06:00</MenuItem>
            <MenuItem value={-5}>GMT-05:00</MenuItem>
            <MenuItem value={-4}>GMT-04:00</MenuItem>
            <MenuItem value={-3}>GMT-03:00</MenuItem>
            <MenuItem value={-2}>GMT-02:00</MenuItem>
            <MenuItem value={-1}>GMT-01:00</MenuItem>
          </Select>
        </FormControl>
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

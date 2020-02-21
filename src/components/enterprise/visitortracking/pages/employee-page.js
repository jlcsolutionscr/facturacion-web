import React from 'react'

import Grid from '@material-ui/core/Grid'
import TextField from 'components/custom/custom-textfield'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
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
    backgroundColor: 'rgba(255,255,255,0.65)'
  },
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

function EmployeePage(props) {
  const classes = useStyles()
  let disabled = true
  if (props.employee != null) {
    disabled = !props.employee.Name
      || !props.employee.MobileNumber
      || props.employee.Name === ''
      || props.employee.MobileNumber === ''
  }
  const handleClose = () => {
    props.setEmployee(null)
    props.setActiveSection(0)
  }
  const employeeList = props.employeeList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <FormControl className={classes.form} disabled={props.employeeList.length === 0}>
            <InputLabel id='demo-simple-select-label'>Seleccione un empleado</InputLabel>
            <Select
              id='EmployeeId'
              value={props.employee && props.employee.Id ? props.employee.Id : ''}
              onChange={(event) => props.getEmployee(event.target.value)}
            >
              {employeeList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Id'
            value={props.employee && props.employee.Id ? props.employee.Id : ''}
            label='Id'
            disabled
            fullWidth
            autoComplete='lname'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Name'
            value={props.employee && props.employee.Name ? props.employee.Name : ''}
            label='Nombre'
            fullWidth
            autoComplete='lname'
            variant='outlined'
            onChange={(event) => props.setEmployeeAttribute('Name', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='MobileNumber'
            value={props.employee && props.employee.MobileNumber ? props.employee.MobileNumber : ''}
            label='Teléfono'
            fullWidth
            variant='outlined'
            inputProps={{maxLength: 8}}
            numericFormat
            onChange={(event) => props.setEmployeeAttribute('MobileNumber', event.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => props.saveEmployee()}>
            {props.employee && props.employee.Id ? 'Actualizar' : 'Agregar'}
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => props.setEmployee(null)}>
            Nuevo
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => handleClose()}>
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default EmployeePage

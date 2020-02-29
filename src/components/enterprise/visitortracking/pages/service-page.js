import React from 'react'

import Grid from '@material-ui/core/Grid'
import TextField from 'components/custom/custom-textfield'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
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

function ServicePage(props) {
  const classes = useStyles()
  let disabled = true
  if (props.service != null) disabled = !props.service.Description
  const handleClose = () => {
    props.setService(null)
    props.setActiveSection(0)
  }
  const employeeList = props.serviceList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <FormControl className={classes.form} disabled={props.serviceList.length === 0}>
            <InputLabel id='demo-simple-select-label'>Seleccione un elemento</InputLabel>
            <Select
              id='ServiceId'
              value={props.service && props.service.Id ? props.service.Id : ''}
              onChange={(event) => props.getService(event.target.value)}
            >
              {employeeList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Id'
            value={props.service && props.service.Id ? props.service.Id : ''}
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
            id='Description'
            value={props.service && props.service.Description ? props.service.Description : ''}
            label='Descripción'
            fullWidth
            autoComplete='lname'
            variant='outlined'
            onChange={(event) => props.setServiceAttribute('Description', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
          control={
            <Switch
            id='Active'
            checked={props.service && props.service.Active ? props.service.Active : false}
            onChange={(event) => props.setServiceAttribute('Active', event.target.checked)} />
          }
            label="Activo"
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => props.saveService()}>
            {props.service && props.service.Id ? 'Actualizar' : 'Agregar'}
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => props.setService(null)}>
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

export default ServicePage

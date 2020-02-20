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

function BranchPage(props) {
  const classes = useStyles()
  let disabled = true
  if (props.branch != null) {
    disabled = props.branch.Id === ''
      || props.branch.Description === ''
      || props.branch.Address === ''
      || props.branch.PhoneNumber === ''
  }
  const branchList = props.branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  const handleClose = () => {
    props.setBranch(null)
    props.setActiveSection(0)
  }
  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <FormControl className={classes.form} disabled={props.branchList.length === 0}>
            <InputLabel id='demo-simple-select-label'>Seleccione una sucursal</InputLabel>
            <Select
              id='BranchId'
              value={props.branch && props.branch.Id ? props.branch.Id : ''}
              onChange={(event) => props.getBranch(props.companyId, event.target.value)}
            >
              {branchList}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Id'
            value={props.branch && props.branch.Id ? props.branch.Id : ''}
            label='Consecutivo'
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
            value={props.branch && props.branch.Description ? props.branch.Description : ''}
            label='Nombre'
            disabled={!props.branch}
            fullWidth
            autoComplete='lname'
            variant='outlined'
            onChange={(event) => props.setBranchAttribute('Description', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='Address'
            value={props.branch && props.branch.Address ? props.branch.Address : ''}
            label='Dirección'
            disabled={!props.branch}
            fullWidth
            variant='outlined'
            onChange={(event) => props.setBranchAttribute('Address', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id='PhoneNumber'
            value={props.branch && props.branch.PhoneNumber ? props.branch.PhoneNumber : ''}
            label='Teléfono'
            disabled={!props.branch}
            fullWidth
            variant='outlined'
            inputProps={{maxLength: 8}}
            numericFormat
            onChange={(event) => props.setBranchAttribute('PhoneNumber', event.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => props.saveBranch(props.companyId, false)}>
            Guardar
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

export default BranchPage

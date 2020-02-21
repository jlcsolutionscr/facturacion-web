import React from 'react'

import Grid from '@material-ui/core/Grid'
import TextField from 'components/custom/custom-textfield'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
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

function BranchPage(props) {
  const classes = useStyles()
  const [isBranchNew, setIsBranchNew] = React.useState(true)
  let disabled = true
  if (props.branch != null) {
    disabled = props.company.Id === ''
      || props.company.Description === ''
      || props.company.Address === ''
      || props.company.PhoneNumber === ''
  }
  const handleBranchIdChange = (value) => {
    setIsBranchNew(false)
    props.getBranch(props.company.Id, value)
  }
  const handleSaveBranchClick = () => {
    props.saveBranch(props.company.Id, isBranchNew)
    setIsBranchNew(false)
  }
  const handleNewBranchClick = () => {
    props.setBranch(null)
    setIsBranchNew(true)
  }
  const branchList = props.branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <FormControl className={classes.form} disabled={props.branchList.length === 0}>
          <InputLabel id='demo-simple-select-label'>Seleccione una sucursal</InputLabel>
          <Select
            id='BranchId'
            value={props.branch && props.branch.Id ? props.branch.Id : ''}
            onChange={(event) => handleBranchIdChange(event.target.value)}
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
          disabled={!isBranchNew}
          fullWidth
          autoComplete='lname'
          variant='outlined'
          onChange={(event) => props.setBranchAttribute('Id', event.target.value !== '' ? parseInt(event.target.value) : null)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='Description'
          value={props.branch && props.branch.Description ? props.branch.Description : ''}
          label='Nombre'
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
          fullWidth
          variant='outlined'
          inputProps={{maxLength: 8}}
          numericFormat
          onChange={(event) => props.setBranchAttribute('PhoneNumber', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <FormControlLabel
        control={
          <Switch
          id='Active'
          checked={props.branch && props.branch.Active ? props.branch.Active : false}
          onChange={(event) => props.setBranchAttribute('Active', event.target.checked)} />
        }
          label="Activa"
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='AccessCode'
          value={props.branch && props.branch.AccessCode ? props.branch.AccessCode : ''}
          label='AccessCode'
          disabled
          fullWidth
          autoComplete='lname'
          variant='outlined'
        />
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => handleSaveBranchClick()}>
          {isBranchNew ? 'Agregar' : 'Actualizar'}
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' className={classes.button} onClick={() => handleNewBranchClick()}>
          Nuevo
        </Button>
      </Grid>
    </Grid>
  )
}

export default BranchPage
              
import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography'
import TextField from 'components/custom/custom-textfield'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'rgba(255,255,255,0.65)',
    padding: '10px'
  }
}))

function StepOneScreen({index, value, customerList, setCompanyAttribute}) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const classes = useStyles()
  const clientes = customerList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Nombre}</MenuItem> })
  const handleChange = event => {
    setCompanyAttribute(event.target.id, event.target.value)
  }
  return (
    <div className={classes.container} hidden={value !== index}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <FormControl>
            <InputLabel id='demo-simple-select-label'>Seleccione un cliente</InputLabel>
            <Select
              id='IdProvincia'
            >
              {clientes}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Nombre del cliente'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Tipo de exoneración'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Código del documento'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Nombre de la institución'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Fecha de emisión'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label='Porcentaje de exoneración'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    customerList: [
      {Id: 1, Nombre: 'Jason Lopez Cordoba'},
      {Id: 2, Nombre: 'Ivette Raquel Salguero Salazar'},
      {Id: 3, Nombre: 'Joseph Lopez Salguero'}
    ]
  }
}

export default connect(mapStateToProps, null)(StepOneScreen)

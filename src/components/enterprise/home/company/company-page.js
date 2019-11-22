import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    overflowY: 'auto',
    marginLeft: '150px',
    marginRight: '150px',
    padding: '25px',
    maxHeight: `${window.innerHeight - 320}px`,
    backgroundColor: 'rgba(255,255,255,0.75)'
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
  return (
    <div className={classes.container}>
      <Typography component="h1" variant="h5" gutterBottom align='center'>
        Actualice la información de su empresa
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="NombreEmpresa"
            value={props.company.NombreEmpresa}
            label="Nombre de empresa"
            fullWidth
            autoComplete="fname"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="NombreComercial"
            value={props.company.NombreComercial}
            label="Nombre comercial"
            fullWidth
            autoComplete="lname"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Tipo de identificación</InputLabel>
            <Select
              id="IdTipoIdentificacion"
              value={props.company.IdTipoIdentificacion}
              label="Tipo de identificación"
            >
              <MenuItem value={0}>Identificación física</MenuItem>
              <MenuItem value={1}>Identificación jurídica</MenuItem>
              <MenuItem value={2}>DIMEX</MenuItem>
              <MenuItem value={3}>DITE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="Identificacion"
            value={props.company.Identificacion}
            label="Identificación"
            fullWidth
            autoComplete="lname"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id="CodigoActividad"
            value={props.company.CodigoActividad}
            label="Codigo actividad"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Provincia</InputLabel>
            <Select
              id="IdProvincia"
              value={props.company.IdProvincia}
            >
              <MenuItem value={1}>San José</MenuItem>
              <MenuItem value={2}>Cartago</MenuItem>
              <MenuItem value={3}>Heredia</MenuItem>
              <MenuItem value={4}>Alajuela</MenuItem>
              <MenuItem value={5}>Puntarenas</MenuItem>
              <MenuItem value={6}>Guanacaste</MenuItem>
              <MenuItem value={7}>Limón</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Cantón</InputLabel>
            <Select
              id="IdCanton"
              value={props.company.IdCanton}
            >
              <MenuItem value={6}>Aserri</MenuItem>
              <MenuItem value={1}>Identificación jurídica</MenuItem>
              <MenuItem value={2}>DIMEX</MenuItem>
              <MenuItem value={3}>DITE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Distrito</InputLabel>
            <Select
              id="IdDistrito"
              value={props.company.IdDistrito}
            >
              <MenuItem value={0}>Identificación física</MenuItem>
              <MenuItem value={1}>Aserrí</MenuItem>
              <MenuItem value={2}>DIMEX</MenuItem>
              <MenuItem value={3}>DITE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Barrio</InputLabel>
            <Select
              id="IdBarrio"
              value={props.company.IdBarrio}
            >
              <MenuItem value={4}>Barrio Corazón de Jesús</MenuItem>
              <MenuItem value={1}>Identificación jurídica</MenuItem>
              <MenuItem value={2}>DIMEX</MenuItem>
              <MenuItem value={3}>DITE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="Direccion"
            value={props.company.Direccion}
            label="Dirección"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="Telefono"
            value={props.company.Telefono}
            label="Teléfono"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="CorreoNotificacion"
            value={props.company.CorreoNotificacion}
            label="Correo para notificaciones"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' className={classes.button} onClick={() => console.log('Guardado')}>
            Guardar
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default CompanyPage
              
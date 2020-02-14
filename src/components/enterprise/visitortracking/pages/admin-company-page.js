import React from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
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
  errorLabel: {
    fontFamily: '"Exo 2", sans-serif',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(15),
    color: 'red',
    fontWeight: '700',
    marginTop: '20px'
  },
  form: {
    width: '100%',
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

function AdminCompanyPage(props) {
  const classes = useStyles()
  const [activeTab, setActiveTab] = React.useState(0)
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
  const companyList = props.companyList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  const branchList = props.branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  return (
    <div className={classes.container}>
      <Tabs
        value={activeTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, value) => setActiveTab(value)}
      >
        <Tab label="Empresa" />
        <Tab label="Sucursales" disabled={props.company === null || props.company.Id === undefined} />
      </Tabs>
      {activeTab === 0 && <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl className={classes.form}>
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
            Guardar
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => handleClose()}>
            Regresar
          </Button>
        </Grid>
      </Grid>}
      {activeTab === 1 && <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl className={classes.form}>
            <InputLabel id='demo-simple-select-label'>Seleccione una sucursal</InputLabel>
            <Select
              id='BranchId'
              value={props.branch && props.branch.Id ? props.branch.Id : ''}
              onChange={(event) => props.setBranchAttribute('CompanyId', event.target.value)}
            >
              {branchList}
            </Select>
          </FormControl>
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
                onChange={(event) => props.setBranchAttribute('Active', event.target.checked)}
                value="checkedA" />
            }
            label="Activa"
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => props.saveBranch()}>
            Guardar
          </Button>
        </Grid>
      </Grid>}
    </div>
  )
}

export default AdminCompanyPage
              
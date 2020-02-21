import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from 'components/custom/custom-textfield'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { DeleteIcon } from '../../../../../utils/iconsHelper'

const useStyles = makeStyles(theme => ({
  form: {
    width: '40%',
    minWidth: '350px',
    marginTop: theme.spacing(1)
  },
  subTitle: {
    marginTop: theme.spacing(2),
    fontSize: theme.typography.pxToRem(16),
    color: 'inherit'
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

function UserPage(props) {
  const classes = useStyles()
  const [isUserNew, setIsUserNew] = React.useState(true)
  const [selectedRole, setSelectedRole] = React.useState(null)
  let disabled = true
  if (props.user != null) disabled = props.user.Username === '' || props.user.Password === ''
  const handleUserIdChange = (value) => {
    setIsUserNew(false)
    props.getUser(value)
  }
  const handleSaveUserClick = () => {
    props.saveUser(isUserNew)
    setIsUserNew(false)
  }
  const handleNewUserClick = () => {
    props.setUser(null)
    setIsUserNew(true)
  }
  const addRoleDisabled = !selectedRole || (props.user && props.user.RoleList.filter(role => (role.Id === selectedRole.Id)).length > 0)
  const userList = props.userList.map((item, index) => { return <MenuItem key={index} value={item.Id}>{item.Description}</MenuItem> })
  const roleList = props.roleList.map((item, index) => { return <MenuItem key={index} value={item.Id}>{item.Description}</MenuItem> })
  const roleperUserList = props.user && props.user.RoleList.map((item, index) => { return <Grid item xs={6} sm={6} key={index}>
    <ListItem>
      <ListItemText
        primary={item.Description}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => props.removeUserRole(item.Id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  </Grid>})
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <FormControl className={classes.form} disabled={props.userList.length === 0}>
        <InputLabel id='demo-simple-select-label'>Seleccione un usuario</InputLabel>
        <Select
            id='UserId'
            value={props.user && props.user.Id ? props.user.Id : ''}
            onChange={(event) => handleUserIdChange(event.target.value)}
        >
            {userList}
        </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='Username'
          value={props.user && props.user.Username ? props.user.Username : ''}
          label='Codigo usuario'
          disabled={!isUserNew}
          fullWidth
          autoComplete='lname'
          variant='outlined'
          onChange={(event) => props.setUserAttribute('Username', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          required
          id='Password'
          value={props.user && props.user.Password ? props.user.Password : ''}
          label='Contraseña'
          fullWidth
          autoComplete='lname'
          variant='outlined'
          onChange={(event) => props.setUserAttribute('Password', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <FormControl className={classes.form} disabled={props.userList.length === 0}>
        <InputLabel id='demo-simple-select-label'>Seleccione un role</InputLabel>
        <Select
            id='RoleId'
            value={selectedRole ? selectedRole.Id : ''}
            onChange={(event, child) => setSelectedRole({Id: child.props.value, Description: child.props.children})}
        >
            {roleList}
        </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Grid item xs={4}>
          <Button variant='contained' disabled={addRoleDisabled} className={classes.button} onClick={() => props.addUserRole(selectedRole.Id, selectedRole.Description)}>
            Agregar Role
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Typography className={classes.subTitle} paragraph>
          Roles asignados al usuario
        </Typography>
        {roleperUserList && <List dense={false}>
          {roleperUserList}
        </List>}
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' disabled={disabled} className={classes.button} onClick={() => handleSaveUserClick()}>
          {isUserNew ? 'Agregar' : 'Actualizar'}
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' className={classes.button} onClick={() => handleNewUserClick()}>
          Nuevo
        </Button>
      </Grid>
    </Grid>
  )
}

export default UserPage
              
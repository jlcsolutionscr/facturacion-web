import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { CheckIcon } from '../../../../utils/iconsHelper'

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
  button: {
    padding: '5px 15px',
    backgroundColor: '#239BB5',
    color: 'white',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: '#29A4B4',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    }
  },
  imagePreview: {
    textAlign: 'center',
    height: '160px',
    width: '350px'
  }
}))

function LogoPage(props) {
  const classes = useStyles()
  const registryList = props.registryList.map((item, index) => { return <Grid item xs={8} sm={8} key={index}>
    <ListItem>
      <ListItemText
        primary={item.CustomerName}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => props.activateRegistry(item.RegistryId)}>
          <CheckIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  </Grid>})
  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography className={classes.subTitle} paragraph>
            Registros de clientes pendientes de aprobar
          </Typography>
          {registryList && <List dense={false}>
            {registryList}
          </List>}
        </Grid>
        <Grid item xs={12} sm={12}>
          <Grid item xs={2}>
            <Button variant='contained' className={classes.button} onClick={() => props.setActiveSection(0)}>
              Rgresar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default LogoPage

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ListIcon } from '../../icons/icon'

import Loader from '../loader'

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: 10
  },
  title: {
    flexGrow: 1
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
})

function Home() {
  const classes = useStyles()
  const [state, setState] = React.useState({
    loading: false,
    drawerOpen: false
  })

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setState({ ...state, drawerOpen: open })
  }

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div id='id_app_content' className={classes.root}>
      {state.loading && <Loader loaderText={this.state.message} isLoaderActive={state.loading}/>}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <ListIcon style={{size: 10}}/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Página de inicio
          </Typography>
          <Button color="inherit">Cerrar sessión</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={state.drawerOpen} onClose={toggleDrawer(false)}>
        {sideList('left')}
      </Drawer>
    </div>
  )
}

export default Home

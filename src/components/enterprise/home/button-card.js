import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    backgroundColor: 'rgba(0,0,0,0.55)',
    color: 'white',
    boxShadow: '10px 10px 10px #888888'
  },
  button: {
    backgroundColor: '#247BA0',
    color: 'white',
    height: '35px'
  }
}))

function ButtonCard(props) {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <Typography variant="h5" component="h3" style={{marginBottom: '15px'}}>
        {props.title}
      </Typography>
      <Typography component="p" style={{marginBottom: '15px'}}>
        {props.description}
      </Typography>
      <div style={{width: '100%', textAlign: 'end'}}>
        <Button className={classes.button} variant='outlined'>{props.buttonText}</Button>
      </div>
    </Paper>
  )
}

export default ButtonCard

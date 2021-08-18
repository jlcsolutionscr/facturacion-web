import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  button: {
    padding: '5px 15px',
    backgroundColor: '#239BB5',
    color: 'white',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: '#E0E0E0',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    }
  }
}))
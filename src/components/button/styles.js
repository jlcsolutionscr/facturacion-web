import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  button: {
    padding: '5px 15px',
    backgroundColor: theme.palette.background.button,
    color: theme.palette.primary.buttonText,
    boxShadow: '3px 3px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      color: theme.palette.primary.hoveredButtonText,
      backgroundColor: theme.palette.background.hoveredButton,
      boxShadow: '4px 4px 6px rgba(0,0,0,0.55)'
    },
    '&:disabled': {
      color: theme.palette.primary.disabledButtonText,
      backgroundColor: theme.palette.background.disabledButton
    }
  }
}))
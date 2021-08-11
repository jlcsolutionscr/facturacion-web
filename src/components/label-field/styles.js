import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  container: {
    border: 'none',
    margin: '0',
    display: 'inline-flex',
    padding: '0',
    position: 'relative',
    minWidth: '0',
    flexDirection: 'column',
    verticalAlign: 'top',
    width: '100%'
  },
  label: {
    backgroundColor: 'white',
    transform: 'translate(14px, -6px) scale(0.75)',
    transformOrigin: 'top left',
    zIndex: '1',
    top: '0',
    left: '0',
    position: 'absolute',
    display: 'block',
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: '400',
    lineHeight: '1',
    letterSpacing: '0.00938em',
    paddingInlineStart: '5px',
    paddingInlineEnd: '7px'
  },
  root: {
    color: 'rgba(0, 0, 0, 0.87)',
    cursor: 'text',
    display: 'inline-flex',
    position: 'relative',
    boxSizing: 'border-box',
    alignItems: 'center',
    borderRadius: '4px',
    width: '100%',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderStyle: 'solid',
    borderWidth: '1px',
    "&:focus": {
      borderColor: '#3F51B5'
    }
  },
  input: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: '400',
    lineHeight: '1.1876em',
    letterSpacing: '0.00938em',
    fontSize: '1rem',
    color: 'currentColor',
    width: '100%',
    border: '0',
    height: '1.1876em',
    margin: '0',
    display: 'block',
    padding: '18.5px 14px',
    minWidth: '0',
    background: 'none',
    boxSizing: 'content-box',
    textRendering: 'auto',
    "&:focus + label": {
      color: '#3F51B5'
    }
  }
}))
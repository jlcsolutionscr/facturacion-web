import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  container: {
    border: 'none',
    margin: '5px 0 0 0',
    display: 'inline-flex',
    padding: '0',
    position: 'relative',
    minWidth: '0',
    flexDirection: 'column',
    verticalAlign: 'top',
    width: '100%'
  },
  font: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '400',
    letterSpacing: '0.00938em',
    fontSize: '1rem',
  },
  label: {
    backgroundColor: theme.palette.background.pages,
    transform: 'translate(14px, -6px) scale(0.75)',
    transformOrigin: 'top left',
    zIndex: '1',
    top: '0',
    left: '0',
    position: 'absolute',
    display: 'block',
    color: 'rgba(0, 0, 0, 0.57)',
    lineHeight: '1',
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
    width: '100%'
  },
  input: {
    color: theme.palette.text.primary,
    lineHeight: '1.1876em',
    width: '100%',
    height: '1.1876em',
    margin: '0',
    display: 'block',
    padding: '10.5px 14px',
    minWidth: '0',
    background: 'none',
    boxSizing: 'content-box',
    textRendering: 'auto',
    cursor: 'text',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.primary.border}`,
    '&:focus': {
      outline: '0',
      border: `2px solid ${theme.palette.primary.main}`,
      borderBottom: 'none',
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0'
    },
    '&:focus + label': {
      color: theme.palette.primary.main
    }
  },
  listContainer: {
    overflow: 'auto',
    border: `2px solid ${theme.palette.primary.main}`,
    borderTop: 'none',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0'
  },
  item: {
    color: theme.palette.text.primary,
    lineHeight: '1.1876em',
    width: '90%',
    border: '0',
    height: '1.1876em',
    margin: '0',
    display: 'block',
    padding: '10px 14px',
    minWidth: '0',
    background: 'none',
    boxSizing: 'content-box',
    textRendering: 'auto',
    cursor: 'text'
  }
}))
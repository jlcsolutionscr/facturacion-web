import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  container: {
    overflow: 'auto',
    margin: '0 auto'
  },
  title: {
    color: theme.palette.text.primary,
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(20),
    marginBottom: '20px'
  },
  subTitle: {
    color: theme.palette.text.primary,
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(15),
    marginBottom: '20px'
  },
  headerRange: {
    display: 'flex',
    flexDirection: 'row'
  }
}))

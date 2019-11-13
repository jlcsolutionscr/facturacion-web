import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  root: {
    paddingTop: '1%',
    backgroundColor: '#FAFAFA'
  },
  card: {
    backgroundColor: '#595959',
    maxWidth: '30%',
    color: 'inherit'
  },
  expantionPanel: {
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    color: 'black'
  },
  expantionIcon: {
    color: 'black'
  },
  media: {
    height: 0,
    paddingTop: '66.25%'
  },
  title: {
    marginBottom: theme.spacing(1),
    fontFamily: 'PT Sans',
    fontSize: theme.typography.pxToRem(26),
    fontWeight: '700',
    color: 'inherit'
  },
  subTitle: {
    fontFamily: 'PT Sans',
    fontSize: theme.typography.pxToRem(18),
    color: 'inherit'
  },
  paragraphTop: {
    paddingTop: theme.spacing(2),
    fontFamily: 'PT Sans',
    fontSize: theme.typography.pxToRem(16),
    color: 'inherit'
  },
  paragraph: {
    marginTop: '10px',
    fontFamily: 'PT Sans',
    fontSize: theme.typography.pxToRem(16),
    color: 'inherit'
  },
  paragraphList: {
    marginLeft: '20px',
    marginTop: '10px',
    fontFamily: 'PT Sans',
    fontSize: theme.typography.pxToRem(16),
    color: 'inherit'
  },
  link: {
    margin: theme.spacing(1)
  },
  expand: {
    position: 'relative',
    color: 'white',
    transform: 'rotate(0deg)',
    marginLeft: '85%',
    marginTop: '-50%',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  button: {
    color: 'inherit'
  }
}))

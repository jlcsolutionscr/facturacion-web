import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  root: {
    paddingTop: '4%',
    backgroundColor: '#FAFAFA'
  },
  card: {
    backgroundColor: '#595959',
    maxWidth: '30%',
    color: 'inherit'
  },
  media: {
    height: 0,
    paddingTop: '66.25%'
  },
  title: {
    marginBottom: theme.spacing(1),
    fontFamily: 'PT Sans',
    fontSize: 26,
    fontWeight: '700',
    color: 'inherit'
  },
  subTitle: {
    fontFamily: 'PT Sans',
    fontSize: 18,
    color: 'inherit'
  },
  paragraphTop: {
    paddingTop: theme.spacing(2),
    fontFamily: 'PT Sans',
    fontSize: 16,
    color: 'inherit'
  },
  paragraph: {
    fontFamily: 'PT Sans',
    fontSize: 16,
    color: 'inherit'
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
  }
}))

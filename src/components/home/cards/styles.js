import { makeStyles, createStyles } from '@material-ui/core/styles';

export const createStyle = makeStyles(theme => createStyles({
  card: {
    backgroundColor: '#595959',
    maxWidth: '30%'
  },
  media: {
    height: 0,
    paddingTop: '66.25%'
  },
  body2: {
    marginTop: theme.spacing(2),
    color: '#E7F2F8',
    fontFamily: 'RussoOne',
    fontStyle: 'italic',
    fontSize: 70,
    textShadow: '6px 6px 6px rgba(0,0,0,0.85)'
  },
  cardHeader: {
    marginBottom: theme.spacing(1),
    fontFamily: 'PT Sans',
    fontSize: 26,
    fontWeight: '700',
    color: 'white'
  },
  title: {
    fontFamily: 'PT Sans',
    fontSize: 18,
    color: 'white'
  },
  pTop: {
    paddingTop: theme.spacing(4),
    fontFamily: 'PT Sans',
    fontSize: 16,
    color: 'white'
  },
  p: {
    fontFamily: 'PT Sans',
    fontSize: 16,
    color: 'white'
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
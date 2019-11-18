import { makeStyles, createStyles } from '@material-ui/core/styles'

export const createStyle = makeStyles(theme => createStyles({
  container: {
    paddingTop: '4%',
    paddingBottom: '4%',
    paddingLeft: '5%',
    paddingRight: '5%',
    backgroundColor: '#EFF7F7'
  },
  card: {
    backgroundColor: '#CCE7F9',
    maxWidth: '70%',
    color: 'inherit'
  },
  expantionPanel: {
    justifyContent: 'center',
    backgroundColor: '#E2EBF1',
    color: 'black'
  },
  expantionTitle: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: '600',
    color: 'inherit'
  },
  margin5: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5)
  },
  expantionIcon: {
    color: 'black'
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  title: {
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.pxToRem(26),
    fontWeight: '700',
    color: 'inherit'
  },
  subTitle: {
    marginTop: theme.spacing(2),
    fontSize: theme.typography.pxToRem(20),
    color: 'inherit'
  },
  paragraph: {
    marginTop: theme.spacing(2),
    fontSize: theme.typography.pxToRem(16),
    color: 'inherit'
  },
  paragraphError: {
    marginTop: theme.spacing(2),
    fontSize: theme.typography.pxToRem(16),
    color: 'red'
  },
  enumerate: {
    marginLeft: theme.spacing(3)
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

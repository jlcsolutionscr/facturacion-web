import React from 'react'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { formatCurrency } from 'utils/utilities' 

const useStyles = makeStyles(theme => ({
    container: {
      width: '100%',
      overflowX: 'auto'
    },
    title: {
      color: 'black',
      marginTop: '40px',
      textAlign: 'center',
      fontSize: theme.typography.pxToRem(20),
      marginBottom: '20px'
    },
    subTitle: {
      color: 'black',
      textAlign: 'center',
      fontSize: theme.typography.pxToRem(15),
      marginBottom: '20px'
    },
    headerRange: {
      display: 'flex',
      flexDirection: 'row'
    },
    table: {
      minWidth: 650
    },
    button: {
      padding: '5px 15px',
      backgroundColor: '#239BB5',
      color: 'white',
      boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
      '&:hover': {
        backgroundColor: '#29A4B4',
        boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
      }
    }
  }))

  function SummaryLayout(props) {
    const classes = useStyles()
    return (<Paper className={classes.container}>
      <Typography className={classes.title} color='textSecondary' component='p'>
        {props.reportName}
      </Typography>
      {props.summary !== null && <div className={classes.headerRange}>
        <div style={{width: '60%'}}>
          <Typography className={classes.subTitle} style={{textAlign: 'end', marginRight: '10%'}} color='textSecondary' component='p'>
            Fecha inicial: {props.summary.startDate}
          </Typography>
        </div>
        <div style={{width: '60%'}}>
          <Typography className={classes.subTitle} style={{textAlign: 'start', marginLeft: '10%'}}color='textSecondary' component='p'>
            Fecha final: {props.summary.endDate}
          </Typography>
        </div>
      </div>}
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Detalle</TableCell>
            <TableCell align='right'>Exento</TableCell>
            <TableCell align='right'>Tasa1</TableCell>
            <TableCell align='right'>Tasa2</TableCell>
            <TableCell align='right'>Tasa4</TableCell>
            <TableCell align='right'>Tasa8</TableCell>
            <TableCell align='right'>Tasa13</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row, index) => (
            <TableRow key={index}>
              <TableCell component='th' scope='row'>{row.Descripcion}</TableCell>
              <TableCell align='right'>{formatCurrency(row.Exento)}</TableCell>
              <TableCell align='right'>{formatCurrency(row.Tasa1)}</TableCell>
              <TableCell align='right'>{formatCurrency(row.Tasa2)}</TableCell>
              <TableCell align='right'>{formatCurrency(row.Tasa4)}</TableCell>
              <TableCell align='right'>{formatCurrency(row.Tasa8)}</TableCell>
              <TableCell align='right'>{formatCurrency(row.Tasa13)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{margin: '20px'}}>
        <Button variant='contained' className={classes.button} onClick={() => props.returnOnClick()}>
          Regresar
        </Button>
      </div>
    </Paper>)
  }

  export default SummaryLayout

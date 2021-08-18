import React from 'react'

import Typography from '@material-ui/core/Typography'

import DataGrid from 'components/data-grid'
import Button from 'components/button'
import { makeStyles } from '@material-ui/core/styles'

import { formatCurrency } from 'utils/utilities' 

const useStyles = makeStyles(theme => ({
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

function SummaryLayout({reportName, summary, data, returnOnClick}) {
  const classes = useStyles()
  const rows = data.map(row => (
    {
      name: row.Descripcion,
      rate1: formatCurrency(row.Exento),
      rate2: formatCurrency(row.Tasa1),
      rate3: formatCurrency(row.Tasa2),
      rate4: formatCurrency(row.Tasa4),
      rate5: formatCurrency(row.Tasa8),
      rate6: formatCurrency(row.Tasa13)
    }
  ))
  
  const columns = [
    { field: 'name', headerName: 'Descripción' },
    { field: 'rate1', headerName: 'Exento', type: 'number' },
    { field: 'rate2', headerName: 'Tasa1', type: 'number' },
    { field: 'rate3', headerName: 'Tasa2', type: 'number' },
    { field: 'rate4', headerName: 'Tasa4', type: 'number' },
    { field: 'rate5', headerName: 'Tasa8', type: 'number' },
    { field: 'rate6', headerName: 'Tasa13', type: 'number' }
  ];
  return (<div className={classes.container}>
    <Typography className={classes.title} color='textSecondary' component='p'>
      {reportName}
    </Typography>
    {summary !== null && <div className={classes.headerRange}>
      <div style={{width: '60%'}}>
        <Typography className={classes.subTitle} style={{textAlign: 'end', marginRight: '10%'}} color='textSecondary' component='p'>
          Fecha inicio: {summary.startDate}
        </Typography>
      </div>
      <div style={{width: '60%'}}>
        <Typography className={classes.subTitle} style={{textAlign: 'start', marginLeft: '10%'}}color='textSecondary' component='p'>
          Fecha final: {summary.endDate}
        </Typography>
      </div>
    </div>}
    <DataGrid
        minWidth={650}
        dense
        columns={columns}
        rows={rows}
        rowsPerPage={8}
      />
    <div style={{margin: '10px 0 10px 0'}}>
      <Button label='Regresar' onClick={() => returnOnClick()} />
    </div>
  </div>)
}

export default SummaryLayout

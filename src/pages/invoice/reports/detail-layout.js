import React from 'react'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import DataGrid from 'components/data-grid'
import Button from 'components/button'
import { formatCurrency } from 'utils/utilities' 

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'auto'
  },
  title: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(20),
    marginBottom: '20px'
  },
  subTitle: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(15),
    marginBottom: '20px'
  },
  headerRange: {
    display: 'flex',
    flexDirection: 'row'
  }
}))

function DetailLayout({reportName, summary, data, returnOnClick}) {
  const classes = useStyles()
  const rows = data.map(row => (
    {
      type: row.TipoDocumento,
      name: row.Nombre,
      identifier: row.Identificacion,
      date: row.Fecha,
      ref: row.Consecutivo,
      subtotal: formatCurrency(row.Total - row.Impuesto),
      taxes: formatCurrency(row.Impuesto),
      amount: formatCurrency(row.Total)
    }
  ))
  
  const columns = [
    { field: 'type', headerName: 'Tipo' },
    { field: 'name', headerName: 'Emisor/Receptor' },
    { field: 'identifier', headerName: 'Identificación' },
    { field: 'date', headerName: 'Fecha' },
    { field: 'ref', headerName: 'Consecutivo' },
    { field: 'subtotal', headerName: 'SubTotal', type: 'number' },
    { field: 'taxes', headerName: 'Impuesto', type: 'number' },
    { field: 'amount', headerName: 'Total', type: 'number' }
  ];
  return (<div className={classes.container}>
    <Typography className={classes.title} color='textSecondary' component='p'>
      {reportName}
    </Typography>
    <div className={classes.headerRange}>
      <div style={{width: '60%'}}>
        {summary && <Typography className={classes.subTitle} style={{textAlign: 'end', marginRight: '10%'}} color='textSecondary' component='p'>
          Fecha inicio: {summary.startDate}
        </Typography>}
      </div>
      <div style={{width: '60%'}}>
        {summary && <Typography className={classes.subTitle} style={{textAlign: 'start', marginLeft: '10%'}}color='textSecondary' component='p'>
          Fecha final: {summary.endDate}
        </Typography>}
      </div>
    </div>
    <DataGrid
      minWidth={1330}
      dense
      columns={columns}
      rows={rows}
      rowsPerPage={8}
    />
    <div style={{margin: '20px'}}>
      <Button label='Regresar' onClick={() => returnOnClick()} />
    </div>
  </div>)
}

export default DetailLayout

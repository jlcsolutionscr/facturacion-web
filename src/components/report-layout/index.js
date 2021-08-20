import React from 'react'

import Typography from '@material-ui/core/Typography'

import DataGrid from 'components/data-grid'
import Button from 'components/button'
import { formatCurrency } from 'utils/utilities'
import { createStyle } from './styles'

function DetailLayout({reportName, summary, data, returnOnClick}) {
  const classes = createStyle()
  const columns = Object.entries(data[0]).map(key => (
    {field: key[0], headerName: key[0], type: typeof(key[1]) === 'number' ? 'number' : ''}
  ))
  const rows = data.map(row => {
    let data = {}
    columns.forEach(key => (
      data[key.field] = key.type === 'number' ? formatCurrency(row[key.field]) : row[key.field]
    ))
    return data
  })
  
  return (<div className={classes.container}>
    <Typography className={classes.title} color='textSecondary' component='p'>
      {reportName}
    </Typography>
    <div className={classes.headerRange}>
      <div style={{width: '60%'}}>
        {summary && <Typography className={classes.subTitle} color='textSecondary' component='p'>
          Fecha inicio: {summary.startDate}
        </Typography>}
      </div>
      <div style={{width: '60%'}}>
        {summary && <Typography className={classes.subTitle} color='textSecondary' component='p'>
          Fecha final: {summary.endDate}
        </Typography>}
      </div>
    </div>
    <DataGrid
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

export default DetailLayout

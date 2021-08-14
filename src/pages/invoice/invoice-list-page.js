import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import { getInvoiceListByPageNumber, revokeInvoice } from 'store/invoice/actions'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import DataGrid from 'components/data-grid'
import { RemoveCircleIcon } from 'utils/iconsHelper'
import { formatCurrency } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  dataContainer: {
    margin: '10px',
    display: 'flex',
    overflow: 'hidden'
  },
  icon: {
    padding: 0
  },
  buttonContainer: {
    margin: '0 0 10px 10px',
    order: 5
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

function InvoiceListPage({ listPage, listCount, list, getInvoiceListByPageNumber, revokeInvoice, setActiveSection }) {
  const classes = useStyles()
  const rows = list.map((row, index) => (
    {
      id: row.IdFactura,
      date: row.Fecha,
      name: row.NombreCliente,
      taxes: formatCurrency(row.Impuesto),
      amount: formatCurrency(row.Total),
      action: (
        <IconButton disabled={row.Anulando} className={classes.icon} color="secondary" component="span" onClick={() => revokeInvoice(row.IdFactura)}>
          <RemoveCircleIcon className={classes.icon} />
        </IconButton>
      )
    }
  ))
  
  const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'date', headerName: 'Fecha' },
    { field: 'name', headerName: 'Nombre' },
    { field: 'taxes', headerName: 'Impuesto', type: 'number' },
    { field: 'amount', headerName: 'Total', type: 'number' },
    { field: 'action', headerName: '' }
  ];
  return (
    <div className={classes.container}>
      <div className={classes.dataContainer}>
        <DataGrid
          dense
          page={listPage - 1}
          columns={columns}
          rows={rows}
          rowsCount={listCount}
          rowsPerPage={10}
          onPageChange={(page) => {
            getInvoiceListByPageNumber(page + 1)
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button variant='contained' className={classes.button} onClick={() => setActiveSection(0)}>
          Regresar
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    listPage: state.invoice.listPage,
    listCount: state.invoice.listCount,
    list: state.invoice.list
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getInvoiceListByPageNumber, revokeInvoice, setActiveSection }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceListPage)

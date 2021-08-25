import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import { getInvoiceListByPageNumber, revokeInvoice } from 'store/invoice/actions'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import IconButton from '@material-ui/core/IconButton'

import DataGrid from 'components/data-grid'
import Button from 'components/button'
import { RemoveCircleIcon } from 'utils/iconsHelper'
import { formatCurrency } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.pages,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: '10px auto auto auto'
  },
  dataContainer: {
    display: 'flex',
    overflow: 'hidden',
    margin: '20px',
    '@media (max-width:960px)': {
      margin: '15px'
    },
    '@media (max-width:600px)': {
      margin: '10px'
    },
    '@media (max-width:414px)': {
      margin: '5px'
    }
  },
  icon: {
    padding: 0
  },
  buttonContainer: {
    margin: '0 0 20px 20px',
    '@media (max-width:960px)': {
      margin: '0 0 10px 15px'
    },
    '@media (max-width:600px)': {
      margin: '0 0 10px 10px'
    },
    '@media (max-width:414px)': {
      margin: '0 0 5px 5px'
    }
  },
  dialogActions: {
    margin: '0 20px 10px 20px'
  }
}))

function InvoiceListPage({ listPage, listCount, list, getInvoiceListByPageNumber, revokeInvoice, setActiveSection }) {
  const classes = useStyles()
  const [invoiceId, setInvoiceId] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const handleRevokeButtonClick = (id) => {
    setInvoiceId(id)
    setDialogOpen(true)
  }
  const handleConfirmButtonClick = () => {
    setDialogOpen(false)
    revokeInvoice(invoiceId)
  }
  const rows = list.map((row) => (
    {
      id: row.IdFactura,
      date: row.Fecha,
      name: row.NombreCliente,
      taxes: formatCurrency(row.Impuesto),
      amount: formatCurrency(row.Total),
      action: (
        <IconButton disabled={row.Anulando} className={classes.icon} color="secondary" component="span" onClick={() => handleRevokeButtonClick(row.IdFactura)}>
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
    <div className={classes.root}>
      <div className={classes.dataContainer}>
        <DataGrid
          minWidth={722}
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
        <Button label='Regresar' onClick={() => setActiveSection(0)} />
      </div>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogTitle id="simple-dialog-title">Anular factura</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la factura número ${invoiceId}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label='Cerrar' onClick={() => setDialogOpen(false)} />
          <Button label='Anular' autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
        
      </Dialog>
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

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {
  getDocumentListFirstPage,
  getDocumentListByPageNumber,
  sendNotification,
  getDocumentDetails,
  setDocumentDetails
} from 'store/document/actions'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import DataGrid from 'components/data-grid'
import Button from 'components/button'
import { EmailIcon, InfoIcon } from 'utils/iconsHelper'
import { formatCurrency } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 'auto'
  },
  dataContainer: {
    display: 'flex',
    overflow: 'hidden',
    padding: '20px',
    '@media (max-width:960px)': {
      padding: '16px'
    },
    '@media (max-width:600px)': {
      padding: '13px'
    },
    '@media (max-width:414px)': {
      padding: '10px'
    }
  },
  emailIcon: {
    padding: 0,
    color: '#239BB5'
  },
  infoIcon: {
    padding: 0,
    color: 'gray'
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

function DocumentListPage({
  listPage,
  listCount,
  list,
  details,
  getDocumentListByPageNumber,
  sendNotification,
  getDocumentDetails,
  setDocumentDetails,
  setActiveSection
}) {
  const classes = useStyles()
  const [documentId, setDocumentId] = React.useState(null)
  const [email, setEmail] = React.useState('')
  const handleConfirmEmailClick = () => {
    sendNotification(documentId, email)
    setEmail('')
  }
  const dialogContent = email !== ''
  ? (
    <div>
      <DialogTitle>Enviar documento electrónico</DialogTitle>
      <DialogContent>
        <TextField
          value={email}
          label='Dirección electrónica'
          fullWidth
          variant='outlined'
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button negative label='Cancelar' onClick={() => setEmail('')} />
        <Button label='Enviar' autoFocus onClick={handleConfirmEmailClick} />
      </DialogActions>
    </div>
  )
  : details !== ''
    ? (
      <div>
        <DialogTitle>Mesaje de respuesta</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {decodeURIComponent(escape(details))}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label='Cerrar' onClick={() => setDocumentDetails('')} />
        </DialogActions>
      </div>
    )
    : null
  const handleEmailClick = (id, newEmail) => {
    setDocumentId(id)
    setEmail(newEmail)
  }
  const handleDetailsClick = (id) => {
    getDocumentDetails(id)
  }
  const handleDialogClose = () => {
    if (email !== '' ) setEmail('')
    if (details !== '' ) setDocumentDetails('')
  }
  const rows = list.map(row => {
    const buttonDisabled = row.NombreReceptor === 'CLIENTE DE CONTADO' || row.EsMensajeReceptor === 'S' || row.EstadoEnvio !== 'aceptado'
    return ({
      id: row.IdDocumento,
      ref: row.Consecutivo,
      date: row.Fecha,
      status: row.EstadoEnvio,
      name: row.NombreReceptor,
      amount: formatCurrency(row.MontoTotal),
      email: (
        <IconButton disabled={buttonDisabled} className={classes.emailIcon} color="secondary" component="span" onClick={() => handleEmailClick(row.IdDocumento, row.CorreoNotificacion)}>
          <EmailIcon />
        </IconButton>
      ),
      details: (
        <IconButton className={classes.infoIcon} color="secondary" component="span" onClick={() => handleDetailsClick(row.IdDocumento)}>
          <InfoIcon />
        </IconButton>
      )
    })
  })
  
  const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'ref', headerName: 'Consecutivo' },
    { field: 'date', headerName: 'Fecha' },
    { field: 'status', headerName: 'Estado' },
    { field: 'name', headerName: 'Receptor' },
    { field: 'amount', headerName: 'Total', type: 'number' },
    { field: 'email', headerName: '' },
    { field: 'details', headerName: '' }
  ];
  return (
    <div className={classes.root}>
      <div className={classes.dataContainer}>
        <DataGrid
          minWidth={1100}
          dense
          page={listPage - 1}
          columns={columns}
          rows={rows}
          rowsCount={listCount}
          rowsPerPage={10}
          onPageChange={(page) => {
            getDocumentListByPageNumber(page + 1)
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label='Regresar' onClick={() => setActiveSection(0)} />
      </div>
      <Dialog onClose={handleDialogClose} open={dialogContent !== null}>
        {dialogContent}
      </Dialog>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    listPage: state.document.listPage,
    listCount: state.document.listCount,
    list: state.document.list,
    details: state.document.details
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getDocumentListFirstPage,
    getDocumentListByPageNumber,
    sendNotification,
    getDocumentDetails,
    setDocumentDetails,
    setActiveSection
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListPage)

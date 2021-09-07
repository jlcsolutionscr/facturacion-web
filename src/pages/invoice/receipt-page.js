import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import TextField from 'components/text-field'
import Button from 'components/button'
import { AddCircleIcon, RemoveCircleIcon } from 'utils/iconsHelper'

import { setActiveSection } from 'store/ui/actions'
import {
  setIssuerDetails,
  setExonerationDetails,
  setProductDetails,
  addDetails,
  removeDetails,
  saveReceipt
} from 'store/receipt/actions'

import { formatCurrency, roundNumber, convertStringToDate, convertDateToString } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.pages,
    overflow: 'auto',
    margin: '20px auto auto auto',
    padding: '20px',
    '@media (max-width:960px)': {
      marginTop: '16px',
      padding: '16px'
    },
    '@media (max-width:600px)': {
      marginTop: '13px',
      padding: '13px'
    },
    '@media (max-width:414px)': {
      marginTop: '10px',
      padding: '10px'
    }
  },
  container: {
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
  bottom: {
    display: 'flex',
    overflow: 'auto',
    width: '100%'
  },
  outerButton: {
    padding: '8px'
  },
  innerButton: {
    padding: '0px'
  }
}))

function ReceiptPage({
  idTypeList,
  issuer,
  exonerationTypeList,
  exoneration,
  rentTypeList,
  product,
  detailsList,
  summary,
  successful,
  setExonerationDetails,
  setIssuerDetails,
  setProductDetails,
  addDetails,
  removeDetails,
  saveReceipt,
  setActiveSection
}) {
  const classes = useStyles()
  const idTypeItems = idTypeList.map(item => {
    return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const rentTypes = rentTypeList.map(item => {
    return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const exonerationTypesItems = exonerationTypeList.map(item => {
    return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const addDisabled = product.code === '' || product.description === '' || product.unit === '' || product.quantity === '' || product.price === ''
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Select
              disabled={successful}
              id='IdTipoIdentificacion'
              value={issuer.idType}
              onChange={(event) => setIssuerDetails('idType', event.target.value)}
            >
              {idTypeItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.id}
            label='Identificación'
            onChange={(event) => setIssuerDetails('id', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.name}
            label='Nombre'
            onChange={(event) => setIssuerDetails('name', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.comercialName}
            label='Nombre comercial'
            onChange={(event) => setIssuerDetails('comercialName', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.address}
            label='Dirección'
            onChange={(event) => setIssuerDetails('address', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.phone}
            label='Teléfono'
            onChange={(event) => setIssuerDetails('phone', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.email}
            label='Correo electrónico'
            onChange={(event) => setIssuerDetails('email', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <FormControl fullWidth>
            <Select
              disabled={successful}
              id='IdTipoExoneracion'
              value={exoneration.type}
              onChange={(event) => setExonerationDetails('type', event.target.value)}
            >
              {exonerationTypesItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            id='NumDocExoneracion'
            label='Documento de exoneración'
            value={exoneration.ref}
            onChange={(event) => setExonerationDetails('ref', event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            id='NombreInstExoneracion'
            label='Nombre de institución'
            value={exoneration.issuerName}
            onChange={(event) => setExonerationDetails('issuerName', event.target.value)}
          />
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={5} sm={3}>
            <DatePicker
              disabled={successful}
              label='Fecha exoneración'
              format='dd/MM/yyyy'
              value={convertStringToDate(exoneration.date)}
              onChange={(date) => setExonerationDetails('date', convertDateToString(date))}
              animateYearScrolling
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            id='PorcentajeExoneracion'
            value={exoneration.percentage}
            label='Porcentaje de exoneración'
            numericFormat
            onChange={(event) => setExonerationDetails('percentage', event.target.value)}
          />
        </Grid>
        <Grid style={{textAlign: 'center'}} item xs={12}>
          <span>Detalle de la factura</span>
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled={successful}
            label='Código'
            id='Codigo'
            value={product.code}
            onChange={(event) => setProductDetails('code', event.target.value)}
          />
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth>
            <Select
              disabled={successful}
              id='IdImpuesto'
              value={product.taxType}
              onChange={(event) => setProductDetails('taxType', event.target.value)}
            >
              {rentTypes}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            label='Descripción'
            id='Descripcion'
            value={product.description}
            onChange={(event) => setProductDetails('description', event.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            disabled={successful}
            label='Unidad'
            id='Unidad'
            value={product.unit}
            onChange={(event) => setProductDetails('unit', event.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            disabled={successful}
            label='Cantidad'
            id='Cantidad'
            numericFormat
            value={product.quantity}
            onChange={(event) => setProductDetails('quantity', event.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled={successful}
            label='Precio'
            numericFormat
            value={product.price}
            onChange={(event) => setProductDetails('price', event.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton disabled={addDisabled} className={classes.outerButton} color="primary" component="span" onClick={() => addDetails()}>
            <AddCircleIcon />
          </IconButton>
        </Grid>
        <div className={classes.bottom}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align='right'>Cantidad</TableCell>
                <TableCell align='right'>Total</TableCell>
                <TableCell align='right'> - </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailsList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.Codigo}</TableCell>
                  <TableCell>{row.Descripcion}</TableCell>
                  <TableCell align='right'>{row.Cantidad}</TableCell>
                  <TableCell align='right'>{formatCurrency(roundNumber(row.Cantidad * row.PrecioVenta, 2), 2)}</TableCell>
                  <TableCell align='right'>
                    <IconButton disabled={successful} className={classes.innerButton} color="secondary" component="span" onClick={() => removeDetails(row.IdProducto)}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            disabled={summary.total === 0 || successful}
            label='Guardar'
            onClick={() => saveReceipt()}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button label='Regresar' onClick={() => setActiveSection(0)} />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    idTypeList: state.ui.idTypeList,
    issuer: state.receipt.issuer,
    exonerationTypeList: state.ui.exonerationTypeList,
    exoneration: state.receipt.exoneration,
    product: state.receipt.product,
    rentTypeList: state.ui.rentTypeList,
    detailsList: state.receipt.detailsList,
    summary: state.receipt.summary,
    successful: state.receipt.successful
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setIssuerDetails,
    setExonerationDetails,
    setProductDetails,
    addDetails,
    removeDetails,
    saveReceipt,
    setActiveSection
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptPage)

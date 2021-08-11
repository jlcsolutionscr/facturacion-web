import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'

import ListDropdown from 'components/list-dropdown'
import TextField from 'components/text-field'

import {
  addDetails,
  removeDetails
} from 'store/invoice/actions'

import { formatCurrency, roundNumber } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'white',
    padding: '10px'
  }
}))

function StepTwoScreen({index, value, product, productList, productDetails, successful}) {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const classes = useStyles()
  const [filter, setFilter] = React.useState('')
  const [description, setDescription] = React.useState(product ? product.Descripcion : '')
  const [quantity, setQuantity] = React.useState(1)
  const [price, setPrice] = React.useState(product ? product.PrecioVenta : 0)
  const rows = productDetails.map((item, index) => {
    return (<Table className={classes.table} aria-label='simple table'>
      <TableBody>
        {productDetails.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.Cantidad}</TableCell>
            <TableCell>{row.Descripcion}</TableCell>
            <TableCell align='right'>{formatCurrency(roundNumber(item.Cantidad * item.PrecioVenta, 2), 2)}</TableCell>
            <TableCell align='right'>+</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>)
  })
  let buttonEnabled = product !== null && description !== '' && quantity !== null && price !== null && successful === false
  return (<div className={classes.container} hidden={value !== index}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ListDropdown
          label='Seleccione un producto'
          items={productList}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='Descripción'
          value={description}
          fullWidth
          variant='outlined'
          onChange={(event) => setDescription(event.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label='Cantidad'
          value={quantity}
          fullWidth
          numericFormat
          variant='outlined'
          onChange={(event) => setQuantity(event.target.value)}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          label='Precio'
          value={price}
          fullWidth
          numericFormat
          variant='outlined'
          onChange={(event) => setPrice(event.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          disabled={!buttonEnabled}
          onPressButton={() => this.props.insertProduct()}
        />
      </Grid>
      <Grid item xs={12}>
        {rows}
      </Grid>
    </Grid>
  </div>)
}

const mapStateToProps = (state) => {
  return {
    product: state.product.product,
    productList: state.product.productList,
    productDetails: state.invoice.productDetails
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addDetails, removeDetails }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepTwoScreen)

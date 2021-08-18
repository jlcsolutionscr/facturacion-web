import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'

import ListDropdown from 'components/list-dropdown'
import TextField from 'components/text-field'
import { AddCircleIcon, RemoveCircleIcon } from 'utils/iconsHelper'

import {
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  filterProductList,
  addDetails,
  removeDetails
} from 'store/invoice/actions'

import { formatCurrency, roundNumber } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: '2%',
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  bottom: {
    margin: '10px 0 10px 0',
    display: 'flex',
    overflow: 'hidden'
  },
  outerButton: {
    padding: '8px'
  },
  innerButton: {
    padding: '0px'
  }
}))

let delayTimer = null;

function StepTwoScreen({
  index,
  value,
  productList,
  product,
  description,
  quantity,
  price,
  productDetails,
  successful,
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  filterProductList,
  addDetails,
  removeDetails
}) {
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0)
  }, [value])
  const [filter, setFilter] = React.useState('')
  const handleOnFilterChange = (event) => {
    setFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      filterProductList(event.target.value)
    }, 500)
  }
  const handleItemSelected = (item) => {
    getProduct(item.Id)
  }
  let buttonEnabled = product !== null && description !== '' && quantity !== null && price !== null && successful === false
  const display = value !== index ? 'none' : 'flex'
  return (<div ref={myRef} className={classes.root} style={{display: display}}>
    <div className={classes.container}>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ListDropdown
              label='Seleccione un producto'
              items={productList}
              value={filter}
              onItemSelected={handleItemSelected}
              onChange={handleOnFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Descripción'
              id='Descripcion'
              value={description}
              fullWidth
              variant='outlined'
              onChange={(event) => setDescription(event.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label='Cantidad'
              id='Cantidad'
              value={quantity}
              fullWidth
              numericFormat
              variant='outlined'
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
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
            <IconButton className={classes.outerButton} color="primary" disabled={!buttonEnabled} component="span" onClick={() => addDetails()}>
              <AddCircleIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
      <div className={classes.bottom}>
        <Grid container spacing={2} style={{overflowY: 'auto'}}>
          <Grid item xs={12}>
            <Table size="small">
              <TableBody>
                {productDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.Cantidad}</TableCell>
                    <TableCell>{`${row.Codigo} - ${row.Descripcion}`}</TableCell>
                    <TableCell align='right'>{formatCurrency(roundNumber(row.Cantidad * row.PrecioVenta, 2), 2)}</TableCell>
                    <TableCell align='right'>
                      <IconButton className={classes.innerButton} color="secondary" component="span" onClick={() => removeDetails(row.IdProducto)}>
                        <RemoveCircleIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </div>
    </div>
  </div>)
}

const mapStateToProps = (state) => {
  return {
    description: state.invoice.description,
    quantity: state.invoice.quantity,
    product: state.product.product,
    price: state.invoice.price,
    productList: state.product.productList,
    productDetails: state.invoice.productDetails,
    successful: state.invoice.successful
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getProduct,
    setDescription,
    setQuantity,
    setPrice,
    filterProductList,
    addDetails,
    removeDetails
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepTwoScreen)

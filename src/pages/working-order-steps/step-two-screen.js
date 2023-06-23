import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'

import ListDropdown from 'components/list-dropdown'
import TextField from 'components/text-field'
import { AddCircleIcon, RemoveCircleIcon } from 'utils/iconsHelper'
import { ROWS_PER_PRODUCT } from 'utils/constants'

import { filterProductList, getProductListByPageNumber } from 'store/product/actions'
import {
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  addDetails,
  removeDetails
} from 'store/working-order/actions'

import { formatCurrency, roundNumber } from 'utils/utilities'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: '2%',
    backgroundColor: theme.palette.background.pages
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  formControl: {
    minWidth: '150px'
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

let delayTimer = null

function StepTwoScreen({
  index,
  value,
  permissions,
  productListPage,
  productListCount,
  productList,
  product,
  description,
  quantity,
  price,
  detailsList,
  status,
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  filterProductList,
  getProductListByPageNumber,
  addDetails,
  removeDetails
}) {
  const classes = useStyles()
  const myRef = React.useRef(null)
  React.useEffect(() => {
    if (value === 1) myRef.current.scrollTo(0, 0)
  }, [value])

  const [filterType, setFilterType] = React.useState(2)
  const [filter, setFilter] = React.useState('')
  const isPriceChangeEnabled = permissions.filter(role => [52].includes(role.IdRole)).length > 0

  const handleOnFilterChange = (event) => {
    setFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      filterProductList(event.target.value, filterType)
    }, 1000)
  }

  const handleItemSelected = (item) => {
    getProduct(item.Id, filterType)
    setFilter('')
  }

  const handleFilterTypeChange = () => {
    const newFilterType = filterType === 1 ? 2 : 1
    setFilterType(newFilterType)
    setFilter('')
    filterProductList('', newFilterType)
  }

  const handlePriceChange = (event) => {
    isPriceChangeEnabled && setPrice(event.target.value)
  }

  const products = productList.map(item => ({ ...item, Descripcion: (filterType === 1 ? `${item.Codigo} - ${item.Descripcion}` : item.Descripcion)}))
  const fieldDisabled = status === 'converted'
  let buttonEnabled = product !== null && description !== '' && quantity !== null && price !== null && fieldDisabled === false
  const display = value !== index ? 'none' : 'flex'
  return (<div ref={myRef} className={classes.root} style={{display: display}}>
    <div className={classes.container}>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControl}>
              <InputLabel id="filter-type-select-label">Filtrar producto por:</InputLabel>
              <Select
                labelId="filter-type-select-label"
                id="filter-type-select"
                value={filterType}
                onChange={handleFilterTypeChange}
              >
                <MenuItem value={1}>Código</MenuItem>
                <MenuItem value={2}>Descripción</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <ListDropdown
              disabled={fieldDisabled}
              label='Seleccione un producto'
              page={productListPage - 1}
              rowsCount={productListCount}
              rows={products}
              value={filter}
              rowId='Id'
              rowsPerPage={ROWS_PER_PRODUCT}
              onItemSelected={handleItemSelected}
              onChange={handleOnFilterChange}
              onPageChange={(pageNumber) => getProductListByPageNumber(pageNumber + 1, filter, filterType)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={fieldDisabled}
              label='Descripción'
              id='Descripcion'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled={fieldDisabled}
              label='Cantidad'
              id='Cantidad'
              value={quantity}
              numericFormat
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled={fieldDisabled}
              label='Precio'
              value={price}
              numericFormat
              onChange={handlePriceChange}
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
              <TableHead>
                <TableRow>
                  <TableCell align='right'>Cantidad</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align='right'>Total</TableCell>
                  <TableCell align='right'> - </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailsList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align='right'>{row.Cantidad}</TableCell>
                    <TableCell>{`${row.Codigo} - ${row.Descripcion}`}</TableCell>
                    <TableCell align='right'>{formatCurrency(roundNumber(row.Cantidad * row.PrecioVenta, 2), 2)}</TableCell>
                    <TableCell align='right'>
                      <IconButton disabled={fieldDisabled} className={classes.innerButton} color="secondary" component="span" onClick={() => removeDetails(row.IdProducto, index)}>
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
    permissions: state.session.permissions,
    description: state.workingOrder.description,
    quantity: state.workingOrder.quantity,
    product: state.product.product,
    price: state.workingOrder.price,
    productListPage: state.product.listPage,
    productListCount: state.product.listCount,
    productList: state.product.list,
    detailsList: state.workingOrder.detailsList,
    status: state.workingOrder.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getProduct,
    setDescription,
    setQuantity,
    setPrice,
    filterProductList,
    getProductListByPageNumber,
    addDetails,
    removeDetails
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StepTwoScreen)

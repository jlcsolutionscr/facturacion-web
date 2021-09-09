import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {
  getProduct,
  setProduct,
  filterProductList,
  filterClasificationList,
  setProductAttribute,
  saveProduct
} from 'store/product/actions'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'

import DataGrid from 'components/data-grid'
import ListDropdown from 'components/list-dropdown'
import TextField from 'components/text-field'
import LabelField from 'components/label-field'
import Button from 'components/button'

import { getPriceFromTaxRate } from 'utils/domainHelper'
import { roundNumber } from 'utils/utilities'
import { SearchIcon } from 'utils/iconsHelper'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.pages,
    overflowY: 'auto',
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
  formControl: {
    minWidth: '150px'
  },
  label: {
    color: theme.palette.text.primary
  },
  dataContainer: {
    display: 'flex',
    overflow: 'hidden'
  },
  icon: {
    padding: '7px'
  }
}))

let delayTimer = null

function ProductPage({
  product,
  productList,
  productTypeList,
  categoryList,
  providerList,
  clasificationList,
  rentTypeList,
  getProduct,
  setProduct,
  filterProductList,
  filterClasificationList,
  setProductAttribute,
  saveProduct,
  setActiveSection
}) {
  const classes = useStyles()
  const [filterType, setFilterType] = React.useState(2)
  const [filter, setFilter] = React.useState('')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [clasificationFilter, setClasificationFilter] = React.useState('')
  const [untaxPrice1, setUntaxPrice1] = React.useState(0)
  const [untaxPrice2, setUntaxPrice2] = React.useState(0)
  const [untaxPrice3, setUntaxPrice3] = React.useState(0)
  const [untaxPrice4, setUntaxPrice4] = React.useState(0)
  const [untaxPrice5, setUntaxPrice5] = React.useState(0)
  React.useEffect(() => {
    const calculatePrice = (value, taxId) => (roundNumber(getPriceFromTaxRate(value, rentTypeList.find(elm => elm.Id === taxId).Valor, false), 2))
    setUntaxPrice1(calculatePrice(product.PrecioVenta1, product.IdImpuesto))
    setUntaxPrice2(calculatePrice(product.PrecioVenta2, product.IdImpuesto))
    setUntaxPrice3(calculatePrice(product.PrecioVenta3, product.IdImpuesto))
    setUntaxPrice4(calculatePrice(product.PrecioVenta4, product.IdImpuesto))
    setUntaxPrice5(calculatePrice(product.PrecioVenta5, product.IdImpuesto))
  }, [product, rentTypeList]);
  const productTypes = productTypeList.map(item => {
    return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const categories = categoryList.map(item => {
    return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const providers = providerList.map(item => {
    return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const products = productList.map(item => ({ ...item, Descripcion: (filterType === 1 ? `${item.Codigo} - ${item.Descripcion}` : item.Descripcion)}))
  const disabled = product.Codigo === '' ||
    product.Descripcion === '' ||
    product.PrecioCosto === '' ||
    product.PrecioVenta1 === '' ||
    product.PrecioVenta2 === '' ||
    product.PrecioVenta3 === '' ||
    product.PrecioVenta4 === '' ||
    product.PrecioVenta5 === ''
  const handleChange = event => {
    setProductAttribute(event.target.id, event.target.value)
  }
  const handlePriceChange = event => {
    const untaxPrice = roundNumber(getPriceFromTaxRate(event.target.value, rentTypeList.find(elm => elm.Id === product.IdImpuesto).Valor, false), 2)
    setUntaxPrice1(untaxPrice)
    setUntaxPrice2(untaxPrice)
    setUntaxPrice3(untaxPrice)
    setUntaxPrice4(untaxPrice)
    setUntaxPrice5(untaxPrice)
    setProductAttribute('PrecioVenta1', event.target.value)
    setProductAttribute('PrecioVenta2', event.target.value)
    setProductAttribute('PrecioVenta3', event.target.value)
    setProductAttribute('PrecioVenta4', event.target.value)
    setProductAttribute('PrecioVenta5', event.target.value)
  }

  const handleUntaxPriceChange = event => {
    const taxPrice = roundNumber(getPriceFromTaxRate(event.target.value, rentTypeList.find(elm => elm.Id === product.IdImpuesto).Valor, true), 2)
    switch (event.target.id) {
      case 'untaxPrice1':
        setUntaxPrice1(event.target.value)
        setUntaxPrice2(event.target.value)
        setUntaxPrice3(event.target.value)
        setUntaxPrice4(event.target.value)
        setUntaxPrice5(event.target.value)
        setProductAttribute('PrecioVenta1', taxPrice)
        setProductAttribute('PrecioVenta2', taxPrice)
        setProductAttribute('PrecioVenta3', taxPrice)
        setProductAttribute('PrecioVenta4', taxPrice)
        setProductAttribute('PrecioVenta5', taxPrice)
        break
      case 'untaxPrice2':
        setUntaxPrice2(event.target.value)
        setProductAttribute('PrecioVenta2', taxPrice)
        break
      case 'untaxPrice3':
        setUntaxPrice3(event.target.value)
        setProductAttribute('PrecioVenta3', taxPrice)
        break
      case 'untaxPrice4':
        setUntaxPrice4(event.target.value)
        setProductAttribute('PrecioVenta4', taxPrice)
        break
      case 'untaxPrice5':
        setUntaxPrice5(event.target.value)
        setProductAttribute('PrecioVenta5', taxPrice)
        break
      default:
        break
    }
  }
  const handleOnFilterChange = event => {
    setFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      filterProductList(event.target.value, filterType)
    }, 500)
  }
  const handleItemSelected = (item) => {
    getProduct(item.Id)
    setFilter('')
    filterProductList('', filterType)
  }
  const handleOnClose = () => {
    setProduct(null)
    setActiveSection(0)
  }
  const handleFilterTypeChange = () => {
    setFilterType(filterType === 1 ? 2 : 1)
    setFilter('')
    filterProductList('', filterType)
  }
  const handleClasificationClick = () => {
    setDialogOpen(true)
    setClasificationFilter('')
    filterClasificationList('')
  }
  const handleClasificationFilterChange = (event) => {
    setClasificationFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      filterClasificationList(event.target.value)
    }, 500)
  }
  const handleClasificationRowClick = (code) => {
    if (code !== '') {
      const codeEntity = clasificationList.find(elm => elm.Id === code)
      const taxRateId = codeEntity ? rentTypeList.find(elm => elm.Valor === codeEntity.Impuesto).Id : undefined
      setProductAttribute('CodigoClasificacion', code)
      if (taxRateId) setProductAttribute('IdImpuesto', taxRateId)
    }
    setDialogOpen(false)
  }
  const rows = clasificationList.map((row) => (
    {
      id: row.Id,
      taxRate: row.Impuesto,
      description: row.Descripcion
    }
  ))
  const columns = [
    { field: 'id', headerName: 'Código', hidden: true },
    { field: 'taxRate', headerName: 'IVA', type: 'number' },
    { field: 'description', headerName: 'Descripcion' }
    
  ];
  return (
    <div className={classes.root}>
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
            label='Seleccione un producto'
            items={products}
            value={filter}
            onItemSelected={handleItemSelected}
            onChange={handleOnFilterChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id='Tipo'>Seleccione el tipo de producto</InputLabel>
            <Select
              id='Tipo'
              value={product.Tipo}
              onChange={(event) => setProductAttribute('Tipo', event.target.value)}
            >
              {productTypes}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='IdLinea'>Seleccione la línea del producto</InputLabel>
            <Select
              id='IdLinea'
              value={product.IdLinea}
              onChange={(event) => setProductAttribute('IdLinea', event.target.value)}
            >
              {categories}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='Codigo'
            value={product.Codigo}
            label='Código'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='CodigoProveedor'
            value={product.CodigoProveedor}
            label='Codigo proveedor'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={10} sm={6}>
          <TextField
            required
            id='CodigoClasificacion'
            value={product.CodigoClasificacion}
            label='Codigo CABYS'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <IconButton className={classes.icon} aria-label='upload picture' component='span' onClick={handleClasificationClick}>
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField
            disabled
            id='TasaIva'
            value={rentTypeList.find(elm => elm.Id === product.IdImpuesto).Descripcion}
            label='Tasa del IVA'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='IdProveedor'>Seleccione el proveedor</InputLabel>
            <Select
              id='IdProveedor'
              value={product.IdProveedor}
              onChange={(event) => setProductAttribute('IdProveedor', event.target.value)}
            >
              {providers}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='Descripcion'
            value={product.Descripcion}
            label='Descripción'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='PrecioCosto'
            value={product.PrecioCosto}
            label='Precio costo'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='untaxPrice1'
            value={untaxPrice1}
            label='Precio sin impuesto'
            numericFormat
            onChange={handleUntaxPriceChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id='PrecioVenta1'
            value={product.PrecioVenta1}
            label='Precio de venta 1'
            numericFormat
            onChange={handlePriceChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='untaxPrice2'
            value={untaxPrice2}
            label='Precio sin impuesto'
            numericFormat
            onChange={handleUntaxPriceChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='PrecioVenta2'
            value={product.PrecioVenta2}
            label='Precio de venta 2'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='untaxPrice3'
            value={untaxPrice3}
            label='Precio sin impuesto'
            numericFormat
            onChange={handleUntaxPriceChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='PrecioVenta3'
            value={product.PrecioVenta3}
            label='Precio de venta3'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='untaxPrice4'
            value={untaxPrice4}
            label='Precio sin impuesto'
            numericFormat
            onChange={handleUntaxPriceChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='PrecioVenta4'
            value={product.PrecioVenta4}
            label='Precio de venta 4'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='untaxPrice5'
            value={untaxPrice5}
            label='Precio sin impuesto'
            numericFormat
            onChange={handleUntaxPriceChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='PrecioVenta5'
            value={product.PrecioVenta5}
            label='Precio de venta 5'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='Observacion'
            value={product.Observacion}
            label='Observación'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            classes={{
              root: classes.label
            }}
            control={
              <Checkbox
                checked={product.Activo}
                onChange={(event) => setProductAttribute('Activo', !product.Activo)}
                name="AplicaTasaDiferenciada"
                color="primary"
              />
            }
            label="Producto activo"
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            disabled={disabled}
            label='Guardar'
            onClick={() => saveProduct()}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button label='Regresar' onClick={handleOnClose} />
        </Grid>
      </Grid>
      <Dialog id="clasification-dialog" onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id='ClasificationFilter'
                value={clasificationFilter}
                label='Ingrese el criterio de búsqueda'
                onChange={handleClasificationFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DataGrid
                rowAction={handleClasificationRowClick}
                rowActionValue='id'
                showHeader
                minWidth={722}
                dense
                columns={columns}
                rows={rows}
                rowsPerPage={10}
                rowsCount={Math.min(100, rows.length)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label='Cerrar' onClick={() => setDialogOpen(false)} />
        </DialogActions>
      </Dialog>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    product: state.product.product,
    productList: state.product.productList,
    productTypeList: state.product.productTypeList,
    categoryList: state.product.categoryList,
    providerList: state.product.providerList,
    clasificationList: state.product.clasificationList,
    rentTypeList: state.ui.rentTypeList
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setActiveSection,
    getProduct,
    setProduct,
    filterProductList,
    filterClasificationList,
    setProductAttribute,
    saveProduct
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)

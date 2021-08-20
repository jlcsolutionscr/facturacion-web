import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {
  getProduct,
  setProduct,
  filterProductList,
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

import ListDropdown from 'components/list-dropdown'
import TextField from 'components/text-field'
import Button from 'components/button'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: 'auto',
    margin: '0 auto auto auto',
    padding: '20px',
    '@media (max-width:960px)': {
      padding: '15px'
    },
    '@media (max-width:600px)': {
      padding: '10px'
    },
    '@media (max-width:414px)': {
      padding: '5px'
    }
  },
  label: {
    color: theme.palette.text.primary
  }
}))

let delayTimer = null

function ProductPage({
  product,
  productList,
  productTypeList,
  categoryList,
  providerList,
  rentTypeList,
  getProduct,
  setProduct,
  filterProductList,
  setProductAttribute,
  saveProduct,
  setActiveSection
}) {
  const classes = useStyles()
  const [filter, setFilter] = React.useState('')
  const productTypes = productTypeList.map(item => {
    return <MenuItem value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const categories = categoryList.map(item => {
    return <MenuItem value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const providers = providerList.map(item => {
    return <MenuItem value={item.Id}>{item.Descripcion}</MenuItem>
  })
  const rentTypes = rentTypeList.map(item => {
    return <MenuItem value={item.Id}>{item.Descripcion}</MenuItem>
  })
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
  const handleOnFilterChange = event => {
    setFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      filterProductList(event.target.value)
    }, 500)
  }
  const handleOnClose = () => {
    setProduct(null)
    setActiveSection(0)
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ListDropdown
            label='Seleccione un producto'
            items={productList}
            value={filter}
            onItemSelected={(item) => getProduct(item.Id)}
            onChange={handleOnFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            id='Codigo'
            value={product.Codigo}
            label='Código'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='CodigoProveedor'
            value={product.CodigoProveedor}
            label='Codigo proveedor'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='CodigoClasificacion'
            value={product.CodigoClasificacion}
            label='Codigo CABYS'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
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
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='PrecioCosto'
            value={product.PrecioCosto}
            label='Precio costo'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='PrecioVenta1'
            value={product.PrecioVenta1}
            label='Precio de venta 1'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='PrecioVenta2'
            value={product.PrecioVenta2}
            label='Precio de venta 2'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='PrecioVenta3'
            value={product.PrecioVenta3}
            label='Precio de venta3'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='PrecioVenta4'
            value={product.PrecioVenta4}
            label='Precio de venta 4'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='PrecioVenta5'
            value={product.PrecioVenta5}
            label='Precio de venta 5'
            fullWidth
            variant='outlined'
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='IdImpuesto'>Seleccione la tasa del IVA</InputLabel>
            <Select
              id='IdImpuesto'
              value={product.IdImpuesto}
              onChange={(event) => setProductAttribute('IdImpuesto', event.target.value)}
            >
              {rentTypes}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='Observacion'
            value={product.Observacion}
            label='Observación'
            fullWidth
            variant='outlined'
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
    rentTypeList: state.ui.rentTypeList
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setActiveSection,
    getProduct,
    setProduct,
    filterProductList,
    setProductAttribute,
    saveProduct
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)

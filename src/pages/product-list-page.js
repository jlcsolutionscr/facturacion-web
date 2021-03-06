import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {
  getProductListFirstPage,
  getProductListByPageNumber,
  openProduct,
} from 'store/product/actions'

import Grid from '@material-ui/core/Grid'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'

import DataGrid from 'components/data-grid'
import TextField from 'components/text-field'
import Button from 'components/button'
import { EditIcon } from 'utils/iconsHelper'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.pages,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: '10px auto auto auto'
  },
  filterContainer: {
    padding: '20px 20px 0 20px',
    '@media (max-width:960px)': {
      padding: '15px 15px 0 15px'
    },
    '@media (max-width:600px)': {
      padding: '10px 10px 0 10px'
    },
    '@media (max-width:414px)': {
      padding: '5px 5px 0 5px'
    }
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
    display: 'flex',
    margin: '0 0 20px 20px',
    width: '100%',
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
  formControl: {
    minWidth: '145px'
  },
  dialogActions: {
    margin: '0 20px 10px 20px'
  }
}))

let delayTimer = null

function ProductListPage({
  listPage,
  listCount,
  list,
  getProductListFirstPage,
  getProductListByPageNumber,
  openProduct,
  setActiveSection
}) {
  const classes = useStyles()
  const [filter, setFilter] = React.useState('')
  const [filterType, setFilterType] = React.useState(2)
  const handleFilterTypeChange = () => {
    const newFilterType = filterType === 1 ? 2 : 1
    setFilterType(newFilterType)
    setFilter('')
    getProductListFirstPage(null, filter, newFilterType)
  }
  const handleOnFilterChange = event => {
    setFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      getProductListFirstPage(null, event.target.value, filterType)
    }, 500)
  }
  const rows = list.map((row) => (
    {
      id: row.Id,
      name: filterType === 1 ? `${row.Codigo} - ${row.Descripcion}` : row.Descripcion,
      action1: (
        <IconButton className={classes.icon} color="primary" component="span" onClick={() => openProduct(row.Id)}>
          <EditIcon className={classes.icon} />
        </IconButton>
      )
    }
  ))
  
  const columns = [
    { field: 'id', width: '5%', headerName: 'Id' },
    { field: 'name', width: '90%', headerName: 'Nombre' },
    { field: 'action1', width: '5%', headerName: '' }
  ]
  return (
    <div className={classes.root}>
      <Grid className={classes.filterContainer} container spacing={2}>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel control={<Switch value={filterType === 1} onChange={handleFilterTypeChange} />} label="Filtrar producto por c??digo" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='text-filter-id'
            value={filter}
            label={`Filtro por ${filterType === 1 ? 'c??digo' : 'descripci??n'}`}
            onChange={handleOnFilterChange}
          />
        </Grid>
      </Grid>
      <div className={classes.dataContainer}>
        <DataGrid
          showHeader
          dense
          page={listPage - 1}
          columns={columns}
          rows={rows}
          rowsCount={listCount}
          rowsPerPage={7}
          onPageChange={(page) => {
            getProductListByPageNumber(page + 1, filter)
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label='Agregar producto' onClick={() => openProduct(null)} />
        <Button style={{marginLeft: '10px'}} label='Regresar' onClick={() => setActiveSection(0)} />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    listPage: state.product.listPage,
    listCount: state.product.listCount,
    list: state.product.list
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getProductListFirstPage,
    getProductListByPageNumber,
    openProduct,
    setActiveSection
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage)

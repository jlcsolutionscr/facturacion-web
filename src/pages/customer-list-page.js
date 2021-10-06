import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'

import { setActiveSection } from 'store/ui/actions'
import {
  getCustomerListFirstPage,
  getCustomerListByPageNumber,
  openCustomer,
} from 'store/customer/actions'

import Grid from '@material-ui/core/Grid'
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
  dialogActions: {
    margin: '0 20px 10px 20px'
  }
}))

let delayTimer = null

function CustomerListPage({
  listPage,
  listCount,
  list,
  getCustomerListFirstPage,
  getCustomerListByPageNumber,
  openCustomer,
  setActiveSection
}) {
  const classes = useStyles()
  const [filter, setFilter] = React.useState('')
  const handleOnFilterChange = event => {
    setFilter(event.target.value)
    if (delayTimer) {  
      clearTimeout(delayTimer)
    }
    delayTimer = setTimeout(() => {
      getCustomerListFirstPage(null, event.target.value)
    }, 500)
  }
  const rows = list.map((row) => (
    {
      id: row.Id,
      name: row.Descripcion,
      action1: (
        <IconButton className={classes.icon} color="primary" component="span" onClick={() => openCustomer(row.Id)}>
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
          <TextField
            id='text-filter-id'
            value={filter}
            label='Filtro por nombre'
            onChange={handleOnFilterChange}
          />
        </Grid>
      </Grid>
      <div className={classes.dataContainer}>
        <DataGrid
          showHeader
          minWidth={722}
          dense
          page={listPage - 1}
          columns={columns}
          rows={rows}
          rowsCount={listCount}
          rowsPerPage={8}
          onPageChange={(page) => {
            getCustomerListByPageNumber(page + 1, filter)
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label='Nuevo Cliente' onClick={() => openCustomer(null)} />
        <Button style={{marginLeft: '10px'}} label='Regresar' onClick={() => setActiveSection(0)} />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    listPage: state.customer.listPage,
    listCount: state.customer.listCount,
    list: state.customer.list
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getCustomerListFirstPage,
    getCustomerListByPageNumber,
    openCustomer,
    setActiveSection
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerListPage)

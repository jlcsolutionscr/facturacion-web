import React from 'react'
import PropTypes from 'prop-types'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'

import { FirstPageIcon, KeyboardArrowLeftIcon, KeyboardArrowRightIcon, LastPageIcon } from 'utils/iconsHelper'
import { createStyle } from './styles'

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const classes = createStyle()
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }
  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }
  return (
    <div className={classes.paginationActions}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        <LastPageIcon />
      </IconButton>
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

export default function DataGrid({page, minWidth, showHeader, dense, columns, rows, rowsCount, rowsPerPage, rowActionValue, onPageChange, rowAction }) {
  const classes = createStyle()
  const emptyRows = rowsPerPage !== undefined ? rowsPerPage - (Math.min(rowsPerPage, rowsCount - (page !== undefined ? page : 1) * rowsPerPage)) : 0
  const height = rowsPerPage !== undefined ? rowsPerPage * (dense ? 37 : 53) + (showHeader ? 37 : 0) : 0
  let tableStyle = {
    color: 'white',
    minWidth: minWidth
  }
  if (height > 0) tableStyle = { ...tableStyle, display: 'list-table', height: height }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table style={tableStyle} size={dense ? 'small' : 'medium'}>
            {showHeader && <TableHead>
              <TableRow>
                {columns.filter((col) => !col.hidden).map((cell) => (
                  <TableCell
                    key={cell.field}
                    align={cell.type && cell.type === 'number' ? 'right' : 'left'}
                    padding='normal'
                    style={{width: cell.width || 'auto'}}
                  >
                    {cell.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>}
            <TableBody>
              {rows.map((row, rowIndex) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={rowIndex}
                    onDoubleClick={() => rowAction ? rowAction(row[rowActionValue]) : null}
                  >
                    {columns.filter((col) => !col.hidden).map((cell, cellIndex) => (
                      <TableCell
                        style={{whiteSpace: 'nowrap'}}
                        key={`${rowIndex}-${cellIndex}`}
                        component='th'
                        scope='row'
                        padding='normal'
                        align={cell.type && cell.type === 'number' ? 'right' : 'left'}
                      >
                        {row[cell.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                )})
              }
              {page !== undefined && emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 37 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {page !== undefined && <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[]}
          component='div'
          count={rowsCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => onPageChange(newPage)}
          ActionsComponent={TablePaginationActions}
        />}
      </Paper>
    </div>
  )
}
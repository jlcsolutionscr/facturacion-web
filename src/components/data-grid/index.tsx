import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { useStyles } from "./styles";
import { FirstPageIcon, KeyboardArrowLeftIcon, KeyboardArrowRightIcon, LastPageIcon } from "utils/iconsHelper";

type EventType = React.MouseEvent<HTMLButtonElement>;

type TableStyleType = {
  color: string;
  minWidth: number | string;
  display?: string;
  maxHeight?: number;
};

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

export function TablePaginationActions({ count, page, rowsPerPage, onPageChange }: TablePaginationActionsProps) {
  const { classes } = useStyles();
  const handleFirstPageButtonClick = (event: EventType) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event: EventType) => {
    onPageChange(event, page - 1);
  };
  const handleNextButtonClick = (event: EventType) => {
    onPageChange(event, page + 1);
  };
  const handleLastPageButtonClick = (event: EventType) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <div className={classes.paginationActions}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

type ColumnType = {
  field: string;
  headerName: string;
  hidden?: boolean;
  type?: string;
  width?: string;
};

interface DataGridProps {
  showHeader: boolean;
  dense: boolean;
  columns: ColumnType[];
  rows: any[];
  rowsPerPage: number;
  rowsCount?: number;
  page?: number;
  minWidth?: number;
  rowActionValue?: string;
  onPageChange?: (newPage: number) => void;
  rowAction?: any;
}

export default function DataGrid({
  page,
  minWidth,
  showHeader,
  dense,
  columns,
  rows,
  rowsCount,
  rowsPerPage,
  rowActionValue,
  onPageChange,
  rowAction,
}: DataGridProps) {
  const { classes } = useStyles();
  const emptyRows = rowsPerPage - rows.length;
  console.log("emptyRows", emptyRows);
  const height = rowsPerPage * (dense ? 35 : 45) + (showHeader ? 35 : 0);
  let tableStyle: TableStyleType = {
    color: "white",
    minWidth: minWidth || "auto",
  };
  console.log("height", height);
  if (height > 0) tableStyle = { ...tableStyle, display: "list-table", maxHeight: height };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer} style={tableStyle}>
          <Table size={dense ? "small" : "medium"}>
            {showHeader && (
              <TableHead>
                <TableRow>
                  {columns
                    .filter(col => !col.hidden)
                    .map(cell => (
                      <TableCell
                        key={cell.field}
                        align={cell.type && cell.type === "number" ? "right" : "left"}
                        padding="normal"
                        style={{ width: cell.width || "auto" }}
                      >
                        {cell.headerName}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
            )}
            <TableBody style={{ height: (dense ? 35 : 45) * rowsPerPage, overflowY: "auto" }}>
              {rows.map((row, rowIndex) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={rowIndex}
                    onDoubleClick={() => (rowAction && rowActionValue ? rowAction(row[rowActionValue]) : null)}
                  >
                    {columns
                      .filter(col => !col.hidden)
                      .map((cell, cellIndex) => (
                        <TableCell
                          style={{ whiteSpace: "nowrap" }}
                          key={`${rowIndex}-${cellIndex}`}
                          component="th"
                          scope="row"
                          padding="normal"
                          align={cell.type && cell.type === "number" ? "right" : "left"}
                        >
                          {row[cell.field]}
                        </TableCell>
                      ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 35 : 45) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {page !== undefined && (
          <TablePagination
            className={classes.pagination}
            rowsPerPageOptions={[]}
            component="div"
            count={rowsCount ?? rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_event, newPage) => onPageChange && onPageChange(newPage)}
            ActionsComponent={TablePaginationActions}
          />
        )}
      </Paper>
    </div>
  );
}

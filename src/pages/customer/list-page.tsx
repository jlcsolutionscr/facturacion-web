import { Button, DataGrid, TextField, type TextFieldOnChangeEventType } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import {
  filterCustomerList,
  getCustomerListByPageNumber,
  getCustomerListFirstPage,
  openCustomer,
} from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { EditIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
    height: "calc(100% - 20px)",
    margin: "10px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "100%",
      margin: "0",
      height: "100%",
    },
  },
  filterContainer: {
    padding: "15px 15px 0 15px",
    "@media screen and (max-width:599px)": {
      padding: "10px 10px 0 10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "5px 5px 0 5px",
    },
  },
  dataContainer: {
    display: "flex",
    overflow: "hidden",
    padding: "7px 15px 15px 15px",
    "@media screen and (max-width:599px)": {
      padding: "5px 10px 10px 10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "0 5px 5px 5px",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  icon: {
    padding: 0,
  },
  dialogActions: {
    margin: "0 20px 10px 20px",
  },
  dialog: {
    "& .MuiPaper-root": {
      margin: "32px",
      maxHeight: "calc(100% - 64px)",
      "@media screen and (max-width:599px)": {
        margin: "5px",
        maxHeight: "calc(100% - 10px)",
      },
    },
  },
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

export default function CustomerListPage() {
  const [rowsPerCustomer, setRowsPerCustomer] = useState(0);
  const dispatch = useDispatch();
  const listPage = useSelector(getCustomerListPage);
  const listCount = useSelector(getCustomerListCount);
  const list = useSelector(getCustomerList);

  const { classes } = useStyles();
  const [filter, setFilter] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight - 192;
      const rowsPerPage = Math.floor(height / 35);
      setRowsPerCustomer(rowsPerPage);
      dispatch(
        getCustomerListFirstPage({
          filterText: "",
          rowsPerPage,
        })
      );
    }
  }, [dispatch]);

  const handleOnFilterChange = (event: TextFieldOnChangeEventType) => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(
        filterCustomerList({
          filterText: event.target.value,
          rowsPerPage: rowsPerCustomer,
        })
      );
    }, 1000);
  };

  const rows = list.map(row => ({
    id: row.Id,
    name: row.Descripcion,
    action1: (
      <IconButton
        className={classes.icon}
        color="primary"
        component="span"
        onClick={() => dispatch(openCustomer({ idCustomer: row.Id }))}
      >
        <EditIcon className={classes.icon} />
      </IconButton>
    ),
  }));

  const columns = [
    { field: "id", headerName: "Id", hidden: true },
    { field: "name", width: "310px", headerName: "Nombre" },
    { field: "action1", headerName: "" },
  ];

  return (
    <div className={classes.root} ref={containerRef}>
      <Grid className={classes.filterContainer} container spacing={2}>
        <Grid item xs={12}>
          <TextField id="text-filter-id" value={filter} label="Filtro por nombre" onChange={handleOnFilterChange} />
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
          rowsPerPage={rowsPerCustomer}
          onPageChange={page => {
            dispatch(
              getCustomerListByPageNumber({
                pageNumber: page + 1,
                filterText: filter,
                rowsPerPage: rowsPerCustomer,
              })
            );
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Agregar" onClick={() => dispatch(openCustomer({ idCustomer: undefined }))} />
        <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
    </div>
  );
}

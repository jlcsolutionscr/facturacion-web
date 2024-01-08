import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";

import { setActiveSection } from "state/ui/reducer";

import {
  getCustomerList,
  getCustomerListCount,
  getCustomerListPage,
} from "state/customer/reducer";
import {
  filterCustomerList,
  getCustomerListByPageNumber,
  openCustomer,
} from "state/customer/asyncActions";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import DataGrid from "components/data-grid";
import TextField, { TextFieldOnChangeEventType } from "components/text-field";
import Button from "components/button";
import { EditIcon } from "utils/iconsHelper";

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "20px 10%",
    "@media screen and (max-width:960px)": {
      margin: "16px 5%",
    },
    "@media screen and (max-width:414px)": {
      margin: "0",
    },
  },
  filterContainer: {
    padding: "12px 12px 0 12px",
    "@media screen and (max-width:960px)": {
      padding: "10px 10px 0 10px",
    },
  },
  dataContainer: {
    display: "flex",
    overflow: "hidden",
    padding: "12px",
    "@media screen and (max-width:960px)": {
      padding: "10px",
    },
  },
  icon: {
    padding: 0,
  },
  buttonContainer: {
    display: "flex",
    margin: "0 0 20px 20px",
    width: "100%",
    "@media screen and (max-width:960px)": {
      margin: "0 0 10px 15px",
    },
    "@media screen and (max-width:600px)": {
      margin: "0 0 10px 10px",
    },
    "@media screen and (max-width:414px)": {
      margin: "0 0 5px 5px",
    },
  },
  dialogActions: {
    margin: "0 20px 10px 20px",
  },
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

export default function CustomerListPage() {
  const dispatch = useDispatch();
  const listPage = useSelector(getCustomerListPage);
  const listCount = useSelector(getCustomerListCount);
  const list = useSelector(getCustomerList);

  const rowsPerPage = 8;
  const { classes } = useStyles();
  const [filter, setFilter] = React.useState("");
  const handleOnFilterChange = (event: TextFieldOnChangeEventType) => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(
        filterCustomerList({
          filterText: event.target.value,
          rowsPerPage: rowsPerPage,
        })
      );
    }, 1000);
  };
  const rows = list.map((row) => ({
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
    { field: "id", width: "5%", headerName: "Id" },
    { field: "name", width: "90%", headerName: "Nombre" },
    { field: "action1", width: "5%", headerName: "" },
  ];
  return (
    <div className={classes.root}>
      <Grid className={classes.filterContainer} container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="text-filter-id"
            value={filter}
            label="Filtro por nombre"
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
          rowsPerPage={rowsPerPage}
          onPageChange={(page) => {
            dispatch(
              getCustomerListByPageNumber({
                pageNumber: page + 1,
                filterText: filter,
                rowsPerPage: rowsPerPage,
              })
            );
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          label="Agregar cliente"
          onClick={() => dispatch(openCustomer({ idCustomer: undefined }))}
        />
        <Button
          style={{ marginLeft: "10px" }}
          label="Regresar"
          onClick={() => dispatch(setActiveSection(0))}
        />
      </div>
    </div>
  );
}

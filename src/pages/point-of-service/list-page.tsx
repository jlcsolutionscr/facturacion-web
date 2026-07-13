import { Button, DataGrid, TextField, type TextFieldOnChangeEventType } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import { setActiveSection } from "state/ui/reducer";
import { getServicePoint, getServicePointMaintenance } from "state/working-order/asyncActions";
import { getServicePointList } from "state/working-order/reducer";
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
    overflow: "hidden auto",
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
    paddingBottom: "10px",
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

export default function ServicePointListPage() {
  const [filter, setFilter] = useState("");

  const dispatch = useDispatch();
  const list = useSelector(getServicePointList);

  const { classes } = useStyles();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      dispatch(getServicePointMaintenance());
    }
  }, [dispatch]);

  const handleOnFilterChange = (event: TextFieldOnChangeEventType) => {
    setFilter(event.target.value);
  };

  const rows = list
    .filter(row => filter === "" || row.Descripcion.startsWith(filter))
    .map(row => ({
      id: row.Id,
      name: row.Descripcion,
      action1: (
        <IconButton
          className={classes.icon}
          color="primary"
          component="span"
          onClick={() => dispatch(getServicePoint({ id: row.Id }))}
        >
          <EditIcon className={classes.icon} />
        </IconButton>
      ),
    }));

  const columns = [
    { field: "id", headerName: "Id", hidden: true },
    { field: "name", width: "310px", headerName: "Descripción" },
    { field: "action1", headerName: "" },
  ];

  return (
    <div className={classes.root} ref={containerRef}>
      <Grid className={classes.filterContainer} container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="text-filter-id"
            value={filter}
            label="Filtro por descripción"
            onChange={handleOnFilterChange}
          />
        </Grid>
      </Grid>
      <div className={classes.dataContainer}>
        <DataGrid showHeader dense columns={columns} rows={rows} rowsPerPage={rows.length} />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Agregar" onClick={() => dispatch(getServicePoint({ id: undefined }))} />
        <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
    </div>
  );
}

import { Button, DataGrid, TextField, type TextFieldOnChangeEventType } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";

import ProductLoadDialog from "./product-load-dialog";
import {
  filterProductList,
  getProductListByPageNumber,
  getProductListFirstPage,
  openProduct,
} from "state/product/asyncActions";
import { getProductList, getProductListCount, getProductListPage, setProductList } from "state/product/reducer";
import { getUserId } from "state/session/reducer";
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
    margin: "10px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "100%",
      margin: "0",
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
  formControl: {
    minWidth: "145px",
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

export default function ProductListPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(0);

  const dispatch = useDispatch();
  const listPage = useSelector(getProductListPage);
  const listCount = useSelector(getProductListCount);
  const list = useSelector(getProductList);
  const userId = useSelector(getUserId);

  const { classes } = useStyles();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight - 192;
      const rowsPerPage = Math.floor(height / 35);
      setRowsPerPage(rowsPerPage);
      dispatch(
        getProductListFirstPage({
          filterText: "",
          type: 2,
          includeImages: false,
          rowsPerPage,
        })
      );
    }
  }, [dispatch]);

  const handleOnFilterTypeChange = () => {
    const newFilterType = filterType === 1 ? 2 : 1;
    setFilterType(newFilterType);
    setFilter("");
    dispatch(filterProductList({ filterText: "", type: newFilterType, rowsPerPage }));
  };

  const handleOnFilterChange = (event: TextFieldOnChangeEventType) => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(filterProductList({ filterText: event.target.value, type: filterType, rowsPerPage }));
    }, 1000);
  };

  const handleClose = () => {
    dispatch(setProductList([]));
    dispatch(setActiveSection(0));
  };

  const rows = list.map(row => ({
    id: row.Id,
    name: filterType === 1 ? `${row.Codigo} - ${row.Descripcion}` : row.Descripcion,
    action1: (
      <IconButton
        className={classes.icon}
        color="primary"
        component="span"
        onClick={() => dispatch(openProduct({ id: row.Id }))}
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
        <Grid item xs={10} sm={10.5} md={11}>
          <TextField
            id="text-filter-id"
            value={filter}
            label={`Filtro por ${filterType === 1 ? "código" : "descripción"}`}
            onChange={handleOnFilterChange}
          />
        </Grid>
        <Grid item xs={2} sm={1.5} md={1}>
          <Switch value={filterType === 1} onChange={handleOnFilterTypeChange} />
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
          onPageChange={page => {
            dispatch(
              getProductListByPageNumber({
                pageNumber: page + 1,
                filterText: filter,
                type: filterType,
                rowsPerPage: rowsPerPage,
              })
            );
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Agregar" onClick={() => dispatch(openProduct({ id: undefined }))} />
        <Button label="Regresar" onClick={handleClose} />
        {userId === 1 && <Button label="Importar" onClick={() => setDialogOpen(true)} />}
      </div>
      <Dialog fullScreen id="order-summary-dialog" onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <ProductLoadDialog setDialogOpen={setDialogOpen} />
      </Dialog>
    </div>
  );
}

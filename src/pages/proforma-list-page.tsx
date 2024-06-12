import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import Button from "components/button";
import DataGrid from "components/data-grid";
import {
  generatePDF,
  getProformaListByPageNumber,
  revokeProforma,
  setProformaParameters,
} from "state/proforma/asyncActions";
import { getProformaList, getProformaListCount, getProformaListPage } from "state/proforma/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { DeleteIcon, DownloadPdfIcon } from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
    margin: "15px auto",
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
  dataContainer: {
    display: "flex",
    overflow: "hidden",
    padding: "20px",
    "@media screen and (max-width:959px)": {
      padding: "15px",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "5px",
    },
  },
  buttonContainer: {
    display: "flex",
    marginLeft: "20px",
    "@media screen and (max-width:959px)": {
      marginLeft: "15px",
    },
    "@media screen and (max-width:599px)": {
      marginLeft: "10px",
    },
    "@media screen and (max-width:429px)": {
      marginLeft: "5px",
    },
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
      "@media screen and (max-width:429px)": {
        margin: "5px",
        maxHeight: "calc(100% - 10px)",
      },
    },
  },
}));

export default function ProformaListPage() {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [proformaId, setProformaId] = useState(0);
  const [dialogOpen, setDialogOpen] = useState({ open: false, id: 0 });

  const listPage = useSelector(getProformaListPage);
  const listCount = useSelector(getProformaListCount);
  const list = useSelector(getProformaList);

  const handlePdfButtonClick = (id: number, ref: number) => {
    dispatch(generatePDF({ id, ref }));
  };

  const handleRevokeButtonClick = (id: number, ref: number) => {
    setProformaId(id);
    setDialogOpen({ open: true, id: ref });
  };

  const handleConfirmButtonClick = () => {
    setDialogOpen({ open: false, id: 0 });
    dispatch(revokeProforma({ id: proformaId }));
  };

  const rows = list.map(row => ({
    id: row.Consecutivo,
    date: row.Fecha,
    name: row.NombreCliente,
    taxes: formatCurrency(row.Impuesto),
    amount: formatCurrency(row.Total),
    action1: (
      <IconButton
        disabled={row.Anulando}
        className={classes.icon}
        color="primary"
        component="span"
        onClick={() => handlePdfButtonClick(row.IdFactura, row.Consecutivo)}
      >
        <DownloadPdfIcon className={classes.icon} />
      </IconButton>
    ),
    action2: (
      <IconButton
        disabled={row.Anulando}
        className={classes.icon}
        color="secondary"
        component="span"
        onClick={() => handleRevokeButtonClick(row.IdFactura, row.Consecutivo)}
      >
        <DeleteIcon className={classes.icon} />
      </IconButton>
    ),
  }));

  const columns = [
    { field: "id", headerName: "Id" },
    { field: "date", headerName: "Fecha" },
    { field: "name", headerName: "Nombre" },
    { field: "taxes", headerName: "Impuesto", type: "number" },
    { field: "amount", headerName: "Total", type: "number" },
    { field: "action1", headerName: "" },
    { field: "action2", headerName: "" },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.dataContainer}>
        <DataGrid
          showHeader
          dense
          page={listPage - 1}
          columns={columns}
          rows={rows}
          rowsCount={listCount}
          rowsPerPage={10}
          onPageChange={page => {
            dispatch(getProformaListByPageNumber({ pageNumber: page + 1 }));
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Nueva Proforma" onClick={() => setProformaParameters({ id: 24 })} />
        <Button style={{ marginLeft: "10px" }} label="Regresar" onClick={() => setActiveSection(0)} />
      </div>
      <Dialog id="revoke-dialog" onClose={() => setDialogOpen({ open: false, id: 0 })} open={dialogOpen.open}>
        <DialogTitle>Anular proforma</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la proforma número ${dialogOpen.id}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cerrar" onClick={() => setDialogOpen({ open: false, id: 0 })} />
          <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import Button from "components/button";
import DataGrid from "components/data-grid";
import {
  generatePDF,
  getProformaListByPageNumber,
  revokeProforma,
  sendEmail,
  setProformaParameters,
} from "state/proforma/asyncActions";
import { getProformaList, getProformaListCount, getProformaListPage } from "state/proforma/reducer";
import { setActiveSection } from "state/ui/reducer";
import { ROWS_PER_LIST, TRANSITION_ANIMATION } from "utils/constants";
import { DeleteIcon, DownloadPdfIcon, EmailIcon } from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

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
    justifyContent: "center",
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
  emailIcon: {
    padding: 0,
    color: "#239BB5",
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
  const [email, setEmail] = useState("");
  const [dialogStatus, setDialogStatus] = useState({
    open: false,
    type: 1,
    id: 0,
  });

  const listPage = useSelector(getProformaListPage);
  const listCount = useSelector(getProformaListCount);
  const list = useSelector(getProformaList);

  const handlePdfButtonClick = (id: number, ref: number) => {
    dispatch(generatePDF({ id, ref }));
  };

  const handleDialogClose = () => {
    setDialogStatus({ open: false, type: 1, id: 0 });
  };

  const handleEmailClick = (id: number, newEmail: string) => {
    setEmail(newEmail);
    setDialogStatus({ open: true, type: 1, id });
  };

  const handleRevokeButtonClick = (id: number, ref: number) => {
    setProformaId(id);
    setDialogStatus({ open: true, type: 2, id: ref });
  };

  const handleConfirmButtonClick = () => {
    setDialogStatus({ open: false, type: 1, id: 0 });
    dispatch(revokeProforma({ id: proformaId }));
  };

  const handleConfirmEmailClick = () => {
    setDialogStatus({ open: false, type: 1, id: 0 });
    dispatch(sendEmail({ id: dialogStatus.id, emailTo: email }));
    setEmail("");
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
        className={classes.emailIcon}
        color="secondary"
        component="span"
        onClick={() => handleEmailClick(row.IdFactura, "")}
      >
        <EmailIcon />
      </IconButton>
    ),
    action3: (
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
    { field: "name", headerName: "Nombre", width: "280px" },
    { field: "taxes", headerName: "Impuesto", type: "number" },
    { field: "amount", headerName: "Total", type: "number" },
    { field: "action1", headerName: "" },
    { field: "action2", headerName: "" },
    { field: "action3", headerName: "" },
  ];

  const dialogContent =
    dialogStatus.type === 1 ? (
      <div>
        <DialogTitle>Enviar proforma por correo</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ marginTop: "5px", width: "22rem" }}
            fullWidth
            value={email}
            label="Dirección electrónica"
            onChange={e => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cancelar" onClick={handleDialogClose} />
          <Button label="Enviar" autoFocus onClick={handleConfirmEmailClick} />
        </DialogActions>
      </div>
    ) : dialogStatus.type === 2 ? (
      <div>
        <DialogTitle>Anular proforma</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la proforma número ${dialogStatus.id}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cerrar" onClick={handleDialogClose} />
          <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </div>
    ) : null;

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
          rowsPerPage={ROWS_PER_LIST}
          onPageChange={page => {
            dispatch(getProformaListByPageNumber({ pageNumber: page + 1 }));
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Nueva Proforma" onClick={() => dispatch(setProformaParameters())} />
        <Button style={{ marginLeft: "10px" }} label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
      <Dialog id="revoke-dialog" onClose={handleDialogClose} open={dialogStatus.open}>
        {dialogContent}
      </Dialog>
    </div>
  );
}

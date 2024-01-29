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
import Typography from "@mui/material/Typography";

import Button from "components/button";
import DataGrid from "components/data-grid";
import {
  getDocumentDetails as getDocumentDetailsAction,
  getDocumentListByPageNumber,
  sendNotification,
} from "state/document/asyncActions";
import {
  getDocumentDetails,
  getDocumentList,
  getDocumentListCount,
  getDocumentListPage,
  setDocumentDetails,
} from "state/document/reducer";
import { setActiveSection } from "state/ui/reducer";
import { EmailIcon, InfoIcon } from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "84%",
    display: "flex",
    flexDirection: "column",
    margin: "15px 8%",
    "@media screen and (max-width:960px)": {
      width: "90%",
      margin: "10px 5%",
    },
    "@media screen and (max-width:430px)": {
      width: "100%",
      margin: "0",
    },
  },
  title: {
    display: "flex",
    justifyContent: "center",
  },
  dataContainer: {
    display: "flex",
    overflow: "auto",
    padding: "6px 12px 12px 12px",
    "@media screen and (max-width:960px)": {
      padding: "5px 10px 10px 10px",
    },
  },
  buttonContainer: {
    marginLeft: "12px",
    "@media screen and (max-width:960px)": {
      marginLeft: "10px",
    },
  },
  dialogActions: {
    margin: "0 20px 10px 20px",
  },
  emailIcon: {
    padding: 0,
    color: "#239BB5",
  },
  infoIcon: {
    padding: 0,
    color: "gray",
  },
}));

export default function DocumentListPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [dialogStatus, setDialogStatus] = useState({
    open: false,
    type: 1,
  });
  const [documentId, setDocumentId] = useState(0);
  const [email, setEmail] = useState("");

  const listPage = useSelector(getDocumentListPage);
  const listCount = useSelector(getDocumentListCount);
  const list = useSelector(getDocumentList);
  const details = useSelector(getDocumentDetails);

  const handleConfirmEmailClick = () => {
    setDialogStatus({ open: false, type: 1 });
    dispatch(sendNotification({ id: documentId, emailTo: email }));
    setEmail("");
  };

  const handleEmailClick = (id: number, newEmail: string) => {
    setDocumentId(id);
    setEmail(newEmail);
    setDialogStatus({ open: true, type: 1 });
  };

  const handleDetailsClick = (id: number) => {
    dispatch(getDocumentDetailsAction({ id }));
    setDialogStatus({ open: true, type: 2 });
  };

  const handleDialogClose = () => {
    setDialogStatus({ open: false, type: 1 });
    if (email !== "") setEmail("");
    if (details !== "") dispatch(setDocumentDetails(""));
  };

  const dialogContent =
    dialogStatus.type === 1 ? (
      <div>
        <DialogTitle>Enviar documento electrónico</DialogTitle>
        <DialogContent>
          <TextField value={email} label="Dirección electrónica" onChange={e => setEmail(e.target.value)} />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cancelar" onClick={() => setEmail("")} />
          <Button label="Enviar" autoFocus onClick={handleConfirmEmailClick} />
        </DialogActions>
      </div>
    ) : dialogStatus.type === 2 ? (
      <div>
        <DialogTitle>Mesaje de respuesta</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{decodeURIComponent(escape(details))}</DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cerrar" onClick={() => handleDialogClose()} />
        </DialogActions>
      </div>
    ) : null;

  const rows = list.map(row => {
    const buttonDisabled = row.IdTipoDocumento > 3 || row.EstadoEnvio !== "aceptado";
    return {
      id: row.IdDocumento,
      ref: row.Consecutivo,
      date: row.Fecha,
      status: row.EstadoEnvio,
      name: row.NombreReceptor,
      amount: formatCurrency(row.MontoTotal),
      email: (
        <IconButton
          disabled={buttonDisabled}
          className={classes.emailIcon}
          color="secondary"
          component="span"
          onClick={() => handleEmailClick(row.IdDocumento, row.CorreoNotificacion)}
        >
          <EmailIcon />
        </IconButton>
      ),
      details: (
        <IconButton
          className={classes.infoIcon}
          color="secondary"
          component="span"
          onClick={() => handleDetailsClick(row.IdDocumento)}
        >
          <InfoIcon />
        </IconButton>
      ),
    };
  });

  const columns = [
    { field: "id", headerName: "Id" },
    { field: "ref", headerName: "Consecutivo" },
    { field: "date", headerName: "Fecha" },
    { field: "status", headerName: "Estado" },
    { field: "name", headerName: "Receptor" },
    { field: "amount", headerName: "Total", type: "number" },
    { field: "email", headerName: "" },
    { field: "details", headerName: "" },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h6">Documentos electrónicos procesados</Typography>
      </div>
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
            dispatch(getDocumentListByPageNumber({ pageNumber: page + 1 }));
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
      <Dialog
        onClose={handleDialogClose}
        open={dialogStatus.open && (dialogStatus.type === 1 || (dialogStatus.type === 2 && details !== ""))}
      >
        {dialogContent}
      </Dialog>
    </div>
  );
}

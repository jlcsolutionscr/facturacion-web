import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import Button from "components/button";
import DataGrid from "components/data-grid";
import {
  getDocumentDetails as getDocumentDetailsAction,
  getDocumentListByPageNumber,
  reprocesingDocument,
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
import { TRANSITION_ANIMATION } from "utils/constants";
import { EmailIcon, InfoIcon, RefreshIcon } from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    maxWidth: "1024px",
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

  useEffect(() => {
    if (details !== null) setDialogStatus({ open: true, type: 2 });
  }, [details]);

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
  };

  const handleResendClick = (id: number) => {
    dispatch(reprocesingDocument({ id }));
  };

  const handleDialogClose = () => {
    if (email !== "") setEmail("");
    if (details !== "") dispatch(setDocumentDetails(null));
    setDialogStatus({ open: false, type: dialogStatus.type });
  };

  const dialogContent =
    dialogStatus.type === 1 ? (
      <div>
        <DialogTitle>Enviar documento electrónico</DialogTitle>
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
        <DialogTitle>Mesaje de respuesta</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {details !== "" ? details : "Transacción procesada satisfactoriamente!"}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cerrar" onClick={handleDialogClose} />
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
        <Tooltip title="Reenviar notifiación por correo">
          <IconButton
            disabled={buttonDisabled}
            className={classes.emailIcon}
            color="secondary"
            component="span"
            onClick={() => handleEmailClick(row.IdDocumento, row.CorreoNotificacion)}
          >
            <EmailIcon />
          </IconButton>
        </Tooltip>
      ),
      details: (
        <Tooltip title="Mostrar respuesta de Hacienda">
          <IconButton
            className={classes.infoIcon}
            color="secondary"
            component="span"
            onClick={() => handleDetailsClick(row.IdDocumento)}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      ),
      reprocesing: (
        <Tooltip title="Re-procesar documento rechazado">
          <IconButton
            className={classes.infoIcon}
            color="secondary"
            component="span"
            disabled={row.EstadoEnvio === "aceptado" || row.IdTipoDocumento > 3 || row.Reprocesado}
            onClick={() => handleResendClick(row.IdDocumento)}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
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
    { field: "reprocesing", headerName: "" },
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
            dispatch(getDocumentListByPageNumber({ pageNumber: page + 1 }));
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
      <Dialog onClose={handleDialogClose} open={dialogStatus.open}>
        {dialogContent}
      </Dialog>
    </div>
  );
}

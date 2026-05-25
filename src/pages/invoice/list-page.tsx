import { Button, DataGrid } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import {
  generateInvoiceTicket,
  generatePDF,
  getInvoiceListByPageNumber,
  getInvoiceListFirstPage,
  revokeInvoice,
} from "state/invoice/asyncActions";
import { getInvoiceList, getInvoiceListCount, getInvoiceListPage } from "state/invoice/reducer";
import { getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { DeleteIcon, DownloadPdfIcon, PrinterIcon } from "utils/iconsHelper";
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
    padding: "15px",
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

export default function InvoiceListPage() {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [invoiceId, setInvoiceId] = useState(0);
  const [dialogOpen, setDialogOpen] = useState({ open: false, id: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(0);

  const listPage = useSelector(getInvoiceListPage);
  const listCount = useSelector(getInvoiceListCount);
  const list = useSelector(getInvoiceList);
  const permissions = useSelector(getPermissions);

  const revokeRoleEnabled = permissions.filter(role => [1, 49].includes(role.IdRole)).length > 0;

  const containeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containeRef.current) {
      const height = containeRef.current.offsetHeight - 123;
      const rowsPerPage = Math.floor(height / 35);
      setRowsPerPage(rowsPerPage);
      dispatch(
        getInvoiceListFirstPage({
          rowsPerPage,
        })
      );
    }
  }, [dispatch]);

  const printReceipt = (id: number) => {
    dispatch(generateInvoiceTicket({ id }));
  };

  const handlePdfButtonClick = (id: number, ref: number) => {
    dispatch(generatePDF({ id, ref }));
  };

  const handleRevokeButtonClick = (id: number, ref: number) => {
    setInvoiceId(id);
    setDialogOpen({ open: true, id: ref });
  };

  const handleConfirmButtonClick = () => {
    setDialogOpen({ open: false, id: 0 });
    dispatch(revokeInvoice({ id: invoiceId, rowsPerPage }));
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
        component="span"
        onClick={() => printReceipt(row.IdFactura)}
      >
        <PrinterIcon className={classes.icon} />
      </IconButton>
    ),
    action2: (
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
    action3: (
      <IconButton
        disabled={row.Anulando || !revokeRoleEnabled}
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

  return (
    <div className={classes.root} ref={containeRef}>
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
            dispatch(getInvoiceListByPageNumber({ pageNumber: page + 1, rowsPerPage: rowsPerPage }));
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
      <Dialog id="revoke-dialog" onClose={() => setDialogOpen({ open: false, id: 0 })} open={dialogOpen.open}>
        <DialogTitle>Anular factura</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la factura número ${dialogOpen.id}?`}
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

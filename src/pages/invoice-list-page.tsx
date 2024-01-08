import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";
import UAParser from "ua-parser-js";

import { setActiveSection } from "state/ui/actions";
import {
  getInvoiceListByPageNumber,
  revokeInvoice,
  generatePDF,
  generateInvoiceTicket,
} from "state/invoice/asyncActions";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";

import DataGrid from "components/data-grid";
import Button from "components/button";
import { PrinterIcon, DownloadPdfIcon, DeleteIcon } from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: theme.palette.custom.pagesBackground,
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
    margin: "0 0 20px 20px",
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

function InvoiceListPage({
  listPage,
  listCount,
  list,
  getInvoiceListByPageNumber,
  revokeInvoice,
  setActiveSection,
  generatePDF,
  generateInvoiceTicket,
}) {
  const result = new UAParser().getResult();
  const { classes } = useStyles();
  const [invoiceId, setInvoiceId] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState({ open: false, id: 0 });
  const isMobile = !!result.device.type;
  const printReceipt = (id) => {
    generateInvoiceTicket(id);
  };
  const handlePdfButtonClick = (id, ref) => {
    generatePDF(id, ref);
  };
  const handleRevokeButtonClick = (id, ref) => {
    setInvoiceId(id);
    setDialogOpen({ open: true, id: ref });
  };
  const handleConfirmButtonClick = () => {
    setDialogOpen({ open: false, id: 0 });
    revokeInvoice(invoiceId);
  };
  const rows = list.map((row) => ({
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
  ];
  if (!isMobile) {
    columns.push({ field: "action1", headerName: "" });
  }
  columns.push({ field: "action2", headerName: "" });
  columns.push({ field: "action3", headerName: "" });
  return (
    <div className={classes.root}>
      <div className={classes.dataContainer}>
        <DataGrid
          showHeader
          minWidth={722}
          dense
          page={listPage - 1}
          columns={columns}
          rows={rows}
          rowsCount={listCount}
          rowsPerPage={10}
          onPageChange={(page) => {
            getInvoiceListByPageNumber(page + 1);
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Regresar" onClick={() => setActiveSection(0)} />
      </div>
      <Dialog
        id="revoke-dialog"
        onClose={() => setDialogOpen({ open: false, id: 0 })}
        open={dialogOpen.open}
      >
        <DialogTitle>Anular factura</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la factura número ${dialogOpen.id}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            negative
            label="Cerrar"
            onClick={() => setDialogOpen({ open: false, id: 0 })}
          />
          <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    listPage: state.invoice.listPage,
    listCount: state.invoice.listCount,
    list: state.invoice.list,
    ticket: state.invoice.ticket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getInvoiceListByPageNumber,
      revokeInvoice,
      generatePDF,
      setActiveSection,
      generateInvoiceTicket,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceListPage);

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";

import { setActiveSection } from "store/ui/actions";
import {
  getWorkingOrderListByPageNumber,
  setWorkingOrderParameters,
  revokeWorkingOrder,
  generatePDF,
  openWorkingOrder,
  generateWorkingOrderTicket,
} from "state/working-order/asyncActions";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";

import DataGrid from "components/data-grid";
import Button from "components/button";
import {
  EditIcon,
  PrinterIcon,
  DownloadPdfIcon,
  DeleteIcon,
} from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.custom.pagesBackground,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "10px auto auto auto",
  },
  dataContainer: {
    display: "flex",
    overflow: "hidden",
    margin: "20px",
    "@media screen and (max-width:960px)": {
      margin: "15px",
    },
    "@media screen and (max-width:600px)": {
      margin: "10px",
    },
    "@media screen and (max-width:414px)": {
      margin: "5px",
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

function WorkingOrderListPage({
  listPage,
  listCount,
  list,
  getWorkingOrderListByPageNumber,
  setWorkingOrderParameters,
  revokeWorkingOrder,
  generatePDF,
  setActiveSection,
  openWorkingOrder,
  generateWorkingOrderTicket,
}) {
  const classes = useStyles();
  const [workingOrderId, setWorkingOrderId] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState({ open: false, id: 0 });
  const printReceipt = (id) => {
    generateWorkingOrderTicket(id);
  };
  const handleOpenOrderClick = (id) => {
    openWorkingOrder(id);
  };
  const handleRevokeButtonClick = (id, ref) => {
    setWorkingOrderId(id);
    setDialogOpen({ open: true, id: ref });
  };
  const handlePdfButtonClick = (id, ref) => {
    generatePDF(id, ref);
  };
  const handleConfirmButtonClick = () => {
    setDialogOpen({ open: false, id: 0 });
    revokeWorkingOrder(workingOrderId);
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
        color="primary"
        component="span"
        onClick={() => handleOpenOrderClick(row.IdFactura)}
      >
        <EditIcon className={classes.icon} />
      </IconButton>
    ),
    action2: (
      <IconButton
        disabled={row.Anulando}
        className={classes.icon}
        component="span"
        onClick={() => printReceipt(row.IdFactura)}
      >
        <PrinterIcon className={classes.icon} />
      </IconButton>
    ),
    action3: (
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
    action4: (
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
    { field: "action3", headerName: "" },
    { field: "action4", headerName: "" },
  ];
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
            getWorkingOrderListByPageNumber(page + 1);
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          label="Nueva Orden"
          onClick={() => setWorkingOrderParameters()}
        />
        <Button
          style={{ marginLeft: "10px" }}
          label="Regresar"
          onClick={() => setActiveSection(0)}
        />
      </div>
      <Dialog
        id="revoke-dialog"
        onClose={() => setDialogOpen({ open: false, id: 0 })}
        open={dialogOpen.open}
      >
        <DialogTitle>Anular orden de servicio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la orden de servicio número ${dialogOpen.id}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            negative
            label="Cerrar"
            onClick={() => setDialogOpen(false)}
          />
          <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    listPage: state.workingOrder.listPage,
    listCount: state.workingOrder.listCount,
    list: state.workingOrder.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getWorkingOrderListByPageNumber,
      setWorkingOrderParameters,
      revokeWorkingOrder,
      generatePDF,
      openWorkingOrder,
      setActiveSection,
      generateWorkingOrderTicket,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingOrderListPage);

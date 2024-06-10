import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";

import { setActiveSection } from "store/ui/actions";
import {
  setProformaParameters,
  getProformaListByPageNumber,
  revokeProforma,
  generatePDF,
} from "store/proforma/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";

import DataGrid from "components/data-grid";
import Button from "components/button";
import { DownloadPdfIcon, DeleteIcon } from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.pages,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "10px auto auto auto",
  },
  dataContainer: {
    display: "flex",
    overflow: "hidden",
    margin: "20px",
    "@media (max-width:960px)": {
      margin: "15px",
    },
    "@media (max-width:600px)": {
      margin: "10px",
    },
    "@media (max-width:414px)": {
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
    "@media (max-width:960px)": {
      margin: "0 0 10px 15px",
    },
    "@media (max-width:600px)": {
      margin: "0 0 10px 10px",
    },
    "@media (max-width:414px)": {
      margin: "0 0 5px 5px",
    },
  },
  dialogActions: {
    margin: "0 20px 10px 20px",
  },
}));

function ProformaListPage({
  listPage,
  listCount,
  list,
  getProformaListByPageNumber,
  setProformaParameters,
  revokeProforma,
  generatePDF,
  setActiveSection,
}) {
  const classes = useStyles();
  const [proformaId, setProformaId] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState({ open: false, id: 0 });

  const handlePdfButtonClick = (id, ref) => {
    generatePDF(id, ref);
  };

  const handleRevokeButtonClick = (id, ref) => {
    setProformaId(id);
    setDialogOpen({ open: true, id: ref });
  };

  const handleConfirmButtonClick = () => {
    setDialogOpen({ open: false, id: 0 });
    revokeProforma(proformaId);
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
          minWidth={722}
          dense
          page={listPage - 1}
          columns={columns}
          rows={rows}
          rowsCount={listCount}
          rowsPerPage={10}
          onPageChange={page => {
            getProformaListByPageNumber(page + 1);
          }}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Nueva Proforma" onClick={() => setProformaParameters()} />
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

const mapStateToProps = state => {
  return {
    listPage: state.proforma.listPage,
    listCount: state.proforma.listCount,
    list: state.proforma.list,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getProformaListByPageNumber,
      setProformaParameters,
      revokeProforma,
      generatePDF,
      setActiveSection,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProformaListPage);

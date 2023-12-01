import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";

import { setActiveSection } from "store/ui/actions";
import { setWorkingOrderParameters, revokeWorkingOrder, openWorkingOrder } from "store/working-order/actions";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "components/button";
import Tab from "components/tab";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.pages,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  dataContainer: {
    overflowY: "auto",
    marginBottom: "auto",
    padding: "20px",
    "@media (max-width:960px)": {
      padding: "16px",
    },
    "@media (max-width:600px)": {
      padding: "13px",
    },
    "@media (max-width:414px)": {
      padding: "10px",
    },
  },
  buttonContainer: {
    display: "flex",
    margin: "10px 0 20px 20px",
    width: "100%",
    height: "50px",
    "@media (max-width:960px)": {
      margin: "10px 0 10px 15px",
    },
    "@media (max-width:600px)": {
      margin: "10px 0 10px 10px",
    },
    "@media (max-width:414px)": {
      margin: "10px 0 5px 5px",
    },
  },
  dialogActions: {
    margin: "0 20px 10px 20px",
  },
}));

function RestaurantOrderListPage({
  list,
  setWorkingOrderParameters,
  revokeWorkingOrder,
  setActiveSection,
  openWorkingOrder,
}) {
  const classes = useStyles();
  const [workingOrderId, setWorkingOrderId] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState({ open: false, id: 0 });
  const handleOpenOrderClick = id => {
    openWorkingOrder(id);
  };
  const handleRevokeButtonClick = (id, ref) => {
    setWorkingOrderId(id);
    setDialogOpen({ open: true, id: ref });
  };
  const handleConfirmButtonClick = () => {
    setDialogOpen({ open: false, id: 0 });
    revokeWorkingOrder(workingOrderId);
  };
  const rows = list.map(row => (
    <Grid item key={row.IdFactura} xs={6} sm={4} md={3}>
      <Tab
        title={row.NombreCliente}
        edit={() => handleOpenOrderClick(row.IdFactura)}
        close={() => handleRevokeButtonClick(row.IdFactura, row.NombreCliente)}
      />
    </Grid>
  ));
  return (
    <div className={classes.root}>
      <div className={classes.dataContainer}>
        <Grid container justifyContent="center">
          {rows}
        </Grid>
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Nueva Orden" onClick={() => setWorkingOrderParameters()} />
        <Button style={{ marginLeft: "10px" }} label="Regresar" onClick={() => setActiveSection(0)} />
      </div>
      <Dialog id="revoke-dialog" onClose={() => setDialogOpen({ open: false, id: 0 })} open={dialogOpen.open}>
        <DialogTitle>Anular orden de servicio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la orden para la ${dialogOpen.id}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cerrar" onClick={() => setDialogOpen(false)} />
          <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    list: state.workingOrder.list,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setWorkingOrderParameters,
      revokeWorkingOrder,
      openWorkingOrder,
      setActiveSection,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantOrderListPage);

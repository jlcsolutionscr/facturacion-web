import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";

import Button from "components/button";
import Tab from "components/tab";
import { setActiveSection } from "state/ui/reducer";
import { openWorkingOrder, revokeWorkingOrder, setWorkingOrderParameters } from "state/working-order/asyncActions";
import { getWorkingOrderList } from "state/working-order/reducer";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
    margin: "15px auto",
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
  dialogActions: {
    margin: "0 20px 10px 20px",
  },
}));

export default function RestaurantOrderListPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [workingOrderId, setWorkingOrderId] = useState(0);
  const [dialogOpen, setDialogOpen] = useState({ open: false, id: 0 });

  const list = useSelector(getWorkingOrderList);

  const handleOpenOrderClick = (id: number) => {
    dispatch(openWorkingOrder({ id: id }));
  };

  const handleRevokeButtonClick = (id: number, ref: number) => {
    setWorkingOrderId(id);
    setDialogOpen({ open: true, id: ref });
  };

  const handleConfirmButtonClick = () => {
    setDialogOpen({ open: false, id: 0 });
    dispatch(revokeWorkingOrder({ id: workingOrderId }));
  };

  const rows = list.map(row => (
    <Grid item key={row.IdFactura} xs={6} sm={4} md={3}>
      <Tab
        title={row.NombreCliente}
        edit={() => handleOpenOrderClick(row.IdFactura)}
        close={() => handleRevokeButtonClick(row.IdFactura, row.Consecutivo)}
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
        <Button label="Nueva Orden" onClick={() => dispatch(setWorkingOrderParameters())} />
        <Button style={{ marginLeft: "10px" }} label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
      <Dialog id="revoke-dialog" onClose={() => setDialogOpen({ open: false, id: 0 })} open={dialogOpen.open}>
        <DialogTitle>Anular orden de servicio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la orden para la ${dialogOpen.id}?`}
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

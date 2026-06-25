import { Button, DataGrid } from "jlc-component-library";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import { DialogStatus, DialogType } from "./order-summary";
import { getLocalPrinting } from "state/ui/reducer";
import {
  getPrintingTicketList as getPrintingTicketListAction,
  printWorkingOrderTicket,
  updateWorkingOrderTicket,
} from "state/working-order/asyncActions";
import { getPrintingTicketList } from "state/working-order/reducer";
import { PrinterIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(() => ({
  dataContainer: {
    display: "flex",
    overflow: "hidden",
    padding: "10px 20px 20px 20px",
    "@media screen and (max-width:599px)": {
      padding: "5px 10px 10px 10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "0 5px 5px 5px",
    },
  },
  icon: {
    padding: 0,
  },
  printerIcon: {
    color: "#000",
  },
}));

type TicketsDialogProps = {
  setDialogStatus: (value: DialogStatus) => void;
};

export default function TicketsDialog({ setDialogStatus }: TicketsDialogProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const printingTicketsList = useSelector(getPrintingTicketList);
  const localPrinting = useSelector(getLocalPrinting);

  useEffect(() => {
    dispatch(getPrintingTicketListAction());
  }, [dispatch]);

  const handlePrintingAction = (id: number) => {
    if (localPrinting) {
      dispatch(printWorkingOrderTicket({ ticketId: id }));
    } else {
      dispatch(updateWorkingOrderTicket({ ticketId: id }));
    }
  };

  const rows = printingTicketsList.map(row => ({
    id: row.IdTiquete,
    description: row.DetalleTiqueteOrdenServicio,
    printer: row.Impresora,
    printed: row.Impreso ? "Sí" : "No",
    action1: (
      <IconButton
        className={classes.icon}
        color="primary"
        component="span"
        onClick={() => handlePrintingAction(row.IdTiquete)}
      >
        <PrinterIcon className={classes.printerIcon} />
      </IconButton>
    ),
  }));

  const columns = [
    { field: "id", headerName: "Id", width: "50px" },
    { field: "description", width: "300px", headerName: "Nombre" },
    { field: "printer", width: "100px", headerName: "Categoria" },
    { field: "printed", width: "50px", headerName: "Impreso" },
    { field: "action1", headerName: "" },
  ];

  return (
    <>
      <DialogTitle>Tiquetes de la orden</DialogTitle>
      <DialogContent>
        <div className={classes.dataContainer}>
          <DataGrid showHeader dense columns={columns} rows={rows} rowsPerPage={rows.length} />
        </div>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px" }}>
        <Button
          negative
          label="Cerrar"
          onClick={() => setDialogStatus({ status: false, id: 0, type: DialogType.TICKETS })}
        />
      </DialogActions>
    </>
  );
}

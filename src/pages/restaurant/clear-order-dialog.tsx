import { Button } from "jlc-component-library";
import { useDispatch } from "react-redux";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { DialogStatus, DialogType } from "pages/restaurant/order-summary";
import { resetWorkingOrder } from "state/working-order/reducer";

type ClearOrderDialogProps = {
  setDialogStatus: (value: DialogStatus) => void;
};

export default function ClearOrderDialog({ setDialogStatus }: ClearOrderDialogProps) {
  const dispatch = useDispatch();

  const handleConfirmButtonClick = () => {
    setDialogStatus({ status: false, id: 0, type: DialogType.CLEAR });
    dispatch(resetWorkingOrder());
  };

  return (
    <>
      <DialogTitle>Limpiar orden de servicio</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Desea proceder con la eliminación de la información actual?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px" }}>
        <Button label="Limpiar" autoFocus onClick={handleConfirmButtonClick} />
        <Button
          negative
          label="Cerrar"
          onClick={() => setDialogStatus({ status: false, id: 0, type: DialogType.CLEAR })}
        />
      </DialogActions>
    </>
  );
}

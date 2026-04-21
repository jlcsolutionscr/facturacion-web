import { Button } from "jlc-component-library";
import { useDispatch } from "react-redux";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { DialogStatus, DialogType } from "pages/restaurant/order-summary";
import { revokeWorkingOrder } from "state/working-order/asyncActions";

type RevokeOrderDialogProps = {
  workingOrderId: number;
  setDialogStatus: (value: DialogStatus) => void;
};

export default function RevokeOrderDialog({ workingOrderId, setDialogStatus }: RevokeOrderDialogProps) {
  const dispatch = useDispatch();

  const handleConfirmButtonClick = () => {
    setDialogStatus({ status: false, id: 0, type: DialogType.REVOKE });
    dispatch(revokeWorkingOrder({ id: workingOrderId }));
  };

  return (
    <>
      <DialogTitle>Anular orden de servicio</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Desea proceder con la anulación de la orden para la ${workingOrderId}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px" }}>
        <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        <Button
          negative
          label="Cerrar"
          onClick={() => setDialogStatus({ status: false, id: 0, type: DialogType.REVOKE })}
        />
      </DialogActions>
    </>
  );
}

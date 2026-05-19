import { Button } from "jlc-component-library";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { DialogStatus, DialogType } from "./order-summary";

type ClearOrderDialogProps = {
  setDialogStatus: (value: DialogStatus) => void;
  handleReset: () => void;
};

export default function ClearOrderDialog({ setDialogStatus, handleReset }: ClearOrderDialogProps) {
  const handleConfirmButtonClick = () => {
    setDialogStatus({ status: false, id: 0, type: DialogType.CLEAR });
    handleReset();
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

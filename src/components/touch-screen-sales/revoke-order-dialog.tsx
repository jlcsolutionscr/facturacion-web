import { Button } from "jlc-component-library";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { DialogStatus, DialogType } from "./order-summary";

type RevokeOrderDialogProps = {
  alertMessage: string;
  setDialogStatus: (value: DialogStatus) => void;
  handleRevoke: () => void;
};

export default function RevokeOrderDialog({ alertMessage, setDialogStatus, handleRevoke }: RevokeOrderDialogProps) {
  const handleConfirmButtonClick = () => {
    setDialogStatus({ status: false, id: 0, type: DialogType.REVOKE });
    handleRevoke();
  };

  return (
    <>
      <DialogTitle>Anulación de registro</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{alertMessage}</DialogContentText>
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

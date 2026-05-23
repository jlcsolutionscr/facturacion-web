import { Button } from "jlc-component-library";
import { useState } from "react";
import { useSelector } from "react-redux";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";

import { DialogStatus, DialogType } from "./order-summary";
import Tab from "components/touch-screen-sales/point-of-service-card";
import { getServicePointList } from "state/working-order/reducer";

type TranslateOrderDialogProps = {
  orderId: number;
  servicePointId: number;
  setDialogStatus: (value: DialogStatus) => void;
  handleTranslate: (servicePointId: number) => void;
};

export default function TranslateOrderDialog({
  orderId,
  servicePointId,
  setDialogStatus,
  handleTranslate,
}: TranslateOrderDialogProps) {
  const [newServicePointId, setNewServicePointId] = useState(-1);

  const servicePointList = useSelector(getServicePointList);

  const handleConfirmButtonClick = () => {
    setDialogStatus({ status: false, id: 0, type: DialogType.TRANSLATE });
    handleTranslate(newServicePointId);
  };

  const rows = servicePointList.map(row => (
    <Grid item key={row.Id} xs={4} sm={3} md={2} justifyItems="center">
      <Tab
        title={row.Descripcion}
        disabled={row.Valor > 0}
        active={row.Valor === orderId ? false : row.Valor > 0}
        selected={row.Id === newServicePointId}
        edit={() => setNewServicePointId(row.Id)}
      />
    </Grid>
  ));

  return (
    <>
      <DialogTitle>Trasladar orden de servicio</DialogTitle>
      <DialogContent>
        <Grid container justifyContent="center">
          {rows}
        </Grid>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px" }}>
        <Button
          disabled={servicePointId === newServicePointId}
          label="Trasladar"
          autoFocus
          onClick={handleConfirmButtonClick}
        />
        <Button
          negative
          label="Cerrar"
          onClick={() => setDialogStatus({ status: false, id: 0, type: DialogType.TRANSLATE })}
        />
      </DialogActions>
    </>
  );
}

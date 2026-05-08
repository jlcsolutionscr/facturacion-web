import { Button, TextField } from "jlc-component-library";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";

import { DialogStatus, DialogType } from "pages/restaurant/order-summary";
import { getPermissions } from "state/session/reducer";
import { updateDetails } from "state/working-order/asyncActions";
import { getProductDetails, setDescription, setPrice, setQuantity } from "state/working-order/reducer";
import { parseStringToNumber } from "utils/utilities";

type UpdateProducDialogProps = {
  productId: number;
  setDialogStatus: (value: DialogStatus) => void;
};

export default function UpdateProducDialog({ productId, setDialogStatus }: UpdateProducDialogProps) {
  const dispatch = useDispatch();
  const productDetails = useSelector(getProductDetails);
  const permissions = useSelector(getPermissions);

  const isPriceChangeEnabled = permissions.filter(role => [1, 52].includes(role.IdRole)).length > 0;

  const handleUpdate = () => {
    dispatch(updateDetails({ pos: productId }));
    setDialogStatus({ status: false, id: 0, type: DialogType.UPDATE });
  };
  return (
    <>
      <DialogTitle>Actualizar producto</DialogTitle>
      <DialogContent>
        <Box sx={{ paddingTop: { xs: 1, sm: 2 } }}>
          <Grid container gap={{ xs: 1, sm: 2 }}>
            <Grid xs={12}>
              <TextField
                label="Descripción"
                id="Descripcion"
                value={productDetails.description}
                onChange={event => dispatch(setDescription(event.target.value))}
              />
            </Grid>
            <Grid xs={3}>
              <TextField
                label="Cantidad"
                id="Cantidad"
                value={productDetails.quantity.toString()}
                numericFormat
                onChange={event => dispatch(setQuantity(parseStringToNumber(event.target.value)))}
              />
            </Grid>
            <Grid xs={6}>
              <TextField
                readOnly={!isPriceChangeEnabled}
                label="Precio"
                value={productDetails.price.toString()}
                numericFormat
                onChange={event => dispatch(setPrice(parseStringToNumber(event.target.value)))}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px" }}>
        <Button
          disabled={productDetails.quantity == 0 || productDetails.price == 0}
          label="Aplicar"
          autoFocus
          onClick={handleUpdate}
        />
        <Button
          negative
          label="Cerrar"
          onClick={() => setDialogStatus({ status: false, id: 0, type: DialogType.UPDATE })}
        />
      </DialogActions>
    </>
  );
}

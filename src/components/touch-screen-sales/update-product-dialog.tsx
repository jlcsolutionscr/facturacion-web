import { Button, LabelField, TextField } from "jlc-component-library";
import { ProductDetailsType } from "types/domain";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";

import { DialogStatus, DialogType } from "./order-summary";

type UpdateProductDialogProps = {
  id: number;
  isPriceChangeEnabled: boolean;
  productDetails: ProductDetailsType;
  setDialogStatus: (value: DialogStatus) => void;
  setProductDetails: (value: ProductDetailsType) => void;
  handleSubmit: (value: number) => void;
};

export default function UpdateProductDialog({
  id,
  isPriceChangeEnabled,
  productDetails,
  setDialogStatus,
  setProductDetails,
  handleSubmit,
}: UpdateProductDialogProps) {
  const handleUpdate = () => {
    handleSubmit(id);
    setDialogStatus({ status: false, id: 0, type: DialogType.UPDATE });
  };

  const buttonDisabled = ["0", ""].includes(productDetails.quantity) || ["0", ""].includes(productDetails.price);
  return (
    <>
      <DialogTitle>Actualizar producto</DialogTitle>
      <DialogContent>
        <Box sx={{ paddingTop: { xs: 1, sm: 2 } }}>
          <Grid container gap={{ xs: 1, sm: 2 }}>
            <Grid xs={12}>
              <LabelField label="Descripción" id="Descripcion" value={productDetails.description} />
            </Grid>
            <Grid xs={12}>
              <TextField
                label="Información adicional"
                id="additionalInformation"
                value={productDetails.additionalInformation}
                onChange={event => setProductDetails({ ...productDetails, additionalInformation: event.target.value })}
              />
            </Grid>

            <Grid xs={3}>
              <TextField
                label="Cantidad"
                id="Cantidad"
                value={productDetails.quantity}
                numericFormat
                onChange={event => setProductDetails({ ...productDetails, quantity: event.target.value })}
              />
            </Grid>
            <Grid xs={6}>
              <TextField
                readOnly={!isPriceChangeEnabled}
                label="Precio"
                value={productDetails.price}
                numericFormat
                onChange={event => setProductDetails({ ...productDetails, price: event.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px" }}>
        <Button disabled={buttonDisabled} label="Aplicar" autoFocus onClick={handleUpdate} />
        <Button
          negative
          label="Cerrar"
          onClick={() => setDialogStatus({ status: false, id: 0, type: DialogType.UPDATE })}
        />
      </DialogActions>
    </>
  );
}

import { Button, TextField } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import ClearOrderDialog from "pages/restaurant/clear-order-dialog";
import PaymentDialog from "pages/restaurant/payment-dialog";
import RevokeOrderDialog from "pages/restaurant/revoke-order-dialog";
import TicketsDialog from "pages/restaurant/tickets-dialog";
import UpdateProductDialog from "pages/restaurant/update-product-dialog";
import { generateInvoiceTicket } from "state/invoice/asyncActions";
import { setActiveSection } from "state/ui/reducer";
import { removeDetails, saveWorkingOrder } from "state/working-order/asyncActions";
import {
  getDeliveryDetails,
  getInvoiceId,
  getProductDetailsList,
  getStatus,
  getSummary,
  getWorkingOrderId,
  setDeliveryAttribute,
  setProductDetails,
} from "state/working-order/reducer";
import { ORDER_STATUS } from "utils/constants";
import { BackArrowIcon, EditIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  backButton: {
    position: "absolute",
    left: "20px",
    zIndex: "10",
  },
  icon: {
    color: theme.palette.text.primary,
  },
  summaryDetails: {
    justifyContent: "center",
    width: "100%",
    height: "auto",
    maxHeight: "calc(100% - 186px)",
    overflow: "hidden auto",
    "@media screen and (min-width:900px)": {
      maxHeight: "calc(100% - 194px)",
    },
  },
  summaryTitle: {
    marginTop: "0",
    fontWeight: "700",
    textAlign: "center",
    color: theme.palette.text.primary,
  },
}));

interface OrderSummaryProps {
  isSplitMode: boolean;
  value?: number;
}

export enum DialogType {
  CLEAR = "CLEAR",
  REVOKE = "REVOKE",
  UPDATE = "UPDATE",
  PAYMENT = "PAYMENT",
  TICKETS = "TICKETS",
}

export type DialogStatus = { status: boolean; id: number; type: string };

export default function OrderSummary({ isSplitMode, value }: OrderSummaryProps) {
  const { classes } = useStyles();

  const [dialogStatus, setDialogStatus] = useState<DialogStatus>({ status: false, id: 0, type: DialogType.CLEAR });

  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);

  const summary = useSelector(getSummary);
  const workingOrderId = useSelector(getWorkingOrderId);
  const productDetailsList = useSelector(getProductDetailsList);
  const status = useSelector(getStatus);
  const invoiceId = useSelector(getInvoiceId);
  const delivery = useSelector(getDeliveryDetails);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

  const { total } = summary;
  const buttonDisabled = total === 0;

  const handleRevokeButtonClick = () => {
    setDialogStatus({ status: true, id: workingOrderId, type: DialogType.REVOKE });
  };

  const handleProductUpdate = (details: any, index: number) => {
    dispatch(setProductDetails(details));
    setDialogStatus({ status: true, id: index, type: DialogType.UPDATE });
  };

  return (
    <Grid
      ref={myRef}
      width="100%"
      height="auto"
      maxHeight="100%"
      overflow="hidden"
      container
      gap={1}
      justifyContent="center"
    >
      {isSplitMode && (
        <Grid>
          <div className={classes.backButton}>
            <IconButton aria-label="back-button" component="span" onClick={() => dispatch(setActiveSection(11))}>
              <BackArrowIcon className={classes.icon} />
            </IconButton>
          </div>
        </Grid>
      )}
      <Grid container xs={12} justifyContent="center">
        <Grid container gap={1}>
          {status !== ORDER_STATUS.CONVERTED ? (
            <>
              <Grid>
                <Button
                  label="Tiquetes"
                  onClick={() => setDialogStatus({ status: true, id: workingOrderId, type: DialogType.TICKETS })}
                />
              </Grid>
              {status === ORDER_STATUS.READY && (
                <Grid>
                  {total > 0 && (
                    <Button
                      label="Facturar"
                      onClick={() => setDialogStatus({ status: true, id: workingOrderId, type: DialogType.PAYMENT })}
                    />
                  )}
                </Grid>
              )}
              {status === ORDER_STATUS.ON_PROGRESS && (
                <Grid>
                  <Button
                    disabled={buttonDisabled}
                    label={workingOrderId > 0 ? "Actualizar" : "Guardar"}
                    onClick={() => dispatch(saveWorkingOrder())}
                  />
                </Grid>
              )}
              {workingOrderId > 0 && status !== ORDER_STATUS.CONVERTED && (
                <Grid>
                  <Button label="Anular" onClick={handleRevokeButtonClick} />
                </Grid>
              )}
              {workingOrderId === 0 && (
                <Grid xs="auto">
                  <Button
                    disabled={total === 0}
                    label="Limpiar"
                    onClick={() => setDialogStatus({ status: true, id: 0, type: DialogType.CLEAR })}
                  />
                </Grid>
              )}
            </>
          ) : (
            <Grid xs="auto">
              <Button label="Imprimir Factura" onClick={() => dispatch(generateInvoiceTicket({ id: invoiceId }))} />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid xs={12} textAlign="center">
        <TextField
          multiline
          rows={2}
          value={delivery.details}
          label="Observaciones:"
          onChange={event =>
            dispatch(
              setDeliveryAttribute({
                attribute: "details",
                value: event.target.value,
              })
            )
          }
        />
      </Grid>
      <Grid xs={12} textAlign="center">
        <Typography style={{ fontWeight: "bold", fontSize: 22 }}>{`Total: ${formatCurrency(total)}`}</Typography>
      </Grid>
      <Grid xs={12} textAlign="center">
        <Typography className={classes.summaryTitle}>DETALLE DE LA ORDEN</Typography>
      </Grid>
      <Grid container xs={12} className={classes.summaryDetails}>
        {productDetailsList.map((row, index) => {
          return (
            <Grid key={`${row.id}-${index}`} container xs={12}>
              <Grid xs={9}>
                <Typography overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {row.description}
                </Typography>
              </Grid>
              <Grid xs={3} textAlign="end">
                <Typography>{formatCurrency(roundNumber(row.quantity * row.price, 2), 2)}</Typography>
              </Grid>
              <Grid xs={9}>
                <Typography>{`${row.quantity} Und x ${formatCurrency(row.price, 2)}`}</Typography>
              </Grid>
              <Grid xs={1.5}>
                <IconButton
                  disabled={row.orderId > 0}
                  style={{ padding: 0 }}
                  color="primary"
                  component="span"
                  onClick={() => handleProductUpdate(row, index)}
                >
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid xs={1.5} textAlign="end">
                <IconButton
                  disabled={row.orderId > 0}
                  style={{ padding: 0 }}
                  color="secondary"
                  component="span"
                  onClick={() => dispatch(removeDetails({ pos: index }))}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        maxWidth={dialogStatus.type === DialogType.TICKETS ? "md" : "sm"}
        id="order-summary-dialog"
        onClose={() => setDialogStatus({ status: false, id: 0, type: dialogStatus.type })}
        open={dialogStatus.status}
      >
        {dialogStatus.type === DialogType.CLEAR ? (
          <ClearOrderDialog setDialogStatus={setDialogStatus} />
        ) : dialogStatus.type === DialogType.REVOKE ? (
          <RevokeOrderDialog workingOrderId={workingOrderId} setDialogStatus={setDialogStatus} />
        ) : dialogStatus.type === DialogType.UPDATE ? (
          <UpdateProductDialog productId={dialogStatus.id} setDialogStatus={setDialogStatus} />
        ) : dialogStatus.type === DialogType.TICKETS ? (
          <TicketsDialog setDialogStatus={setDialogStatus} />
        ) : (
          <PaymentDialog summary={summary} status={status} setDialogStatus={setDialogStatus} />
        )}
      </Dialog>
    </Grid>
  );
}

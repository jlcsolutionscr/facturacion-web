import { Button, TextField } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import {
  CustomerDetailsType,
  PaymentDetailsType,
  ProductDetailsType,
  SummaryType,
  WorkingOrderProductDetails,
} from "types/domain";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import ClearOrderDialog from "./clear-order-dialog";
import PaymentDialog from "./payment-dialog";
import RevokeOrderDialog from "./revoke-order-dialog";
import TicketsDialog from "./tickets-dialog";
import UpdateProductDialog from "./update-product-dialog";
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
    maxHeight: "calc(100% - 84px)",
    overflow: "hidden auto",
    "@media screen and (min-width:414px)": {
      maxHeight: "calc(100% - 94px)",
    },
  },
  withExtraDetails: {
    maxHeight: "calc(100% - 110px)",
    "@media screen and (min-width:414px)": {
      maxHeight: "calc(100% - 120px)",
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
  id: number;
  summary: SummaryType;
  productDetails: WorkingOrderProductDetails;
  productDetailsList: WorkingOrderProductDetails[];
  customerDetails: CustomerDetailsType;
  paymentDetailsList: PaymentDetailsType[];
  activityCode: number;
  revokeAlertMessage: string;
  isPriceChangeEnabled: boolean;
  ticketsButtonEnabled: boolean;
  invoiceButtonEnabled: boolean;
  saveButtonEnabled: boolean;
  revokeButtonEnabled: boolean;
  resetButtonEnabled: boolean;
  printButtonEnabled: boolean;
  getCustomerDetails: (customerId: number) => void;
  setCustomerAttribute: (attribute: { attribute: string; value: string }) => void;
  setActivityCode: (value: string) => void;
  setPaymentDetailsList: (list: PaymentDetailsType[]) => void;
  setSummary: (value: SummaryType) => void;
  setProductDetails: (value: ProductDetailsType) => void;
  updateProductDetailsList: (value: number) => void;
  handleProductRemove: (value: number) => void;
  handlePrintTicket: () => void;
  handleReset: () => void;
  handleRevoke: () => void;
  generateInvoice: () => void;
  handleClose: () => void;
  isSplitMode?: boolean;
  value?: number;
  extraDetails?: string;
  setExtraDetails?: (value: string) => void;
  handleSave?: () => void;
}

export enum DialogType {
  CLEAR = "CLEAR",
  REVOKE = "REVOKE",
  UPDATE = "UPDATE",
  PAYMENT = "PAYMENT",
  TICKETS = "TICKETS",
}

export type DialogStatus = { status: boolean; id: number; type: string };

export default function OrderSummary({
  id,
  summary,
  extraDetails,
  productDetails,
  productDetailsList,
  customerDetails,
  paymentDetailsList,
  activityCode,
  revokeAlertMessage,
  isPriceChangeEnabled,
  ticketsButtonEnabled,
  invoiceButtonEnabled,
  saveButtonEnabled,
  revokeButtonEnabled,
  resetButtonEnabled,
  printButtonEnabled,
  getCustomerDetails,
  setCustomerAttribute,
  setPaymentDetailsList,
  setActivityCode,
  setSummary,
  setProductDetails,
  updateProductDetailsList,
  handleProductRemove,
  handlePrintTicket,
  handleClose,
  handleSave,
  setExtraDetails,
  handleReset,
  handleRevoke,
  generateInvoice,
  isSplitMode,
  value,
}: OrderSummaryProps) {
  const { classes } = useStyles();

  const [dialogStatus, setDialogStatus] = useState<DialogStatus>({ status: false, id: 0, type: DialogType.CLEAR });
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

  const { total } = summary;
  const buttonDisabled = total === 0;

  const openRevokeDialog = () => {
    setDialogStatus({ status: true, id: id, type: DialogType.REVOKE });
  };

  const handleProductUpdate = (index: number) => {
    setProductDetails(productDetailsList[index]);
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
            <IconButton aria-label="back-button" component="span" onClick={handleClose}>
              <BackArrowIcon className={classes.icon} />
            </IconButton>
          </div>
        </Grid>
      )}
      <Grid container xs={12} sx={{ height: "35px" }} justifyContent="center">
        <Grid container gap={1}>
          {ticketsButtonEnabled && (
            <Grid>
              <Button
                label="Tiquetes"
                onClick={() => setDialogStatus({ status: true, id: id, type: DialogType.TICKETS })}
              />
            </Grid>
          )}
          {invoiceButtonEnabled && id === 0 && (
            <Grid>
              <Button
                disabled={total === 0}
                label="Facturar"
                onClick={() => setDialogStatus({ status: true, id: id, type: DialogType.PAYMENT })}
              />
            </Grid>
          )}
          {saveButtonEnabled && handleSave && (
            <Grid>
              <Button disabled={buttonDisabled} label={id > 0 ? "Actualizar" : "Guardar"} onClick={handleSave} />
            </Grid>
          )}
          {revokeButtonEnabled && (
            <Grid>
              <Button label="Anular" onClick={openRevokeDialog} />
            </Grid>
          )}
          {resetButtonEnabled && (
            <Grid xs="auto">
              <Button
                disabled={total === 0}
                label="Limpiar"
                onClick={() => setDialogStatus({ status: true, id: 0, type: DialogType.CLEAR })}
              />
            </Grid>
          )}
          {printButtonEnabled && (
            <Grid xs="auto">
              <Button label="Imprimir Factura" onClick={handlePrintTicket} />
            </Grid>
          )}
        </Grid>
      </Grid>
      {extraDetails !== undefined && setExtraDetails && (
        <Grid xs={12} textAlign="center">
          <TextField
            multiline
            rows={2}
            value={extraDetails}
            label="Observaciones:"
            onChange={event => setExtraDetails(event.target.value)}
          />
        </Grid>
      )}
      <Grid xs={12} style={{ height: "33px" }} textAlign="center">
        <Typography style={{ fontWeight: "bold", fontSize: 22 }}>{`Total: ${formatCurrency(total)}`}</Typography>
      </Grid>
      <Grid
        container
        xs={12}
        className={`${classes.summaryDetails} ${extraDetails !== undefined && classes.withExtraDetails}`}
      >
        {productDetailsList.map((row, index) => {
          return (
            <Grid key={`${row.id}-${index}`} container xs={12}>
              <Grid xs={9}>
                <Typography overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {row.description}
                </Typography>
              </Grid>
              <Grid xs={3} textAlign="end">
                <Typography>
                  {formatCurrency(roundNumber(parseFloat(row.quantity) * parseFloat(row.price), 2), 2)}
                </Typography>
              </Grid>
              <Grid xs={9}>
                <Typography>{`${row.quantity} Und x ${formatCurrency(parseFloat(row.price), 2)}`}</Typography>
              </Grid>
              <Grid xs={1.5}>
                <IconButton
                  disabled={(row.orderId ?? 0) > 0}
                  style={{ padding: 0 }}
                  color="primary"
                  component="span"
                  onClick={() => handleProductUpdate(index)}
                >
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid xs={1.5} textAlign="end">
                <IconButton
                  disabled={(row.orderId ?? 0) > 0}
                  style={{ padding: 0 }}
                  color="secondary"
                  component="span"
                  onClick={() => handleProductRemove(index)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <Dialog
        disableEscapeKeyDown
        maxWidth={dialogStatus.type === DialogType.TICKETS ? "md" : "sm"}
        id="order-summary-dialog"
        open={dialogStatus.status}
      >
        {dialogStatus.type === DialogType.CLEAR ? (
          <ClearOrderDialog setDialogStatus={setDialogStatus} handleReset={handleReset} />
        ) : dialogStatus.type === DialogType.REVOKE ? (
          <RevokeOrderDialog
            alertMessage={revokeAlertMessage}
            setDialogStatus={setDialogStatus}
            handleRevoke={handleRevoke}
          />
        ) : dialogStatus.type === DialogType.UPDATE ? (
          <UpdateProductDialog
            id={dialogStatus.id}
            productDetails={productDetails}
            isPriceChangeEnabled={isPriceChangeEnabled}
            setProductDetails={setProductDetails}
            applyChanges={updateProductDetailsList}
            setDialogStatus={setDialogStatus}
          />
        ) : dialogStatus.type === DialogType.TICKETS ? (
          <TicketsDialog setDialogStatus={setDialogStatus} />
        ) : (
          <PaymentDialog
            summary={summary}
            customerDetails={customerDetails}
            paymentDetailsList={paymentDetailsList}
            activityCode={activityCode}
            getCustomerDetails={getCustomerDetails}
            setCustomerAttribute={setCustomerAttribute}
            setActivityCode={setActivityCode}
            setPaymentDetailsList={setPaymentDetailsList}
            setSummary={setSummary}
            generateInvoice={generateInvoice}
            setDialogStatus={setDialogStatus}
          />
        )}
      </Dialog>
    </Grid>
  );
}

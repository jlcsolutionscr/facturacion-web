import { Button, TextField } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import {
  CustomerDetailsType,
  PaymentMethodType,
  ProductDetailsType,
  SummaryType,
  WorkingOrderProductDetails,
} from "types/domain";
import MuiButton from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import ClearOrderDialog from "./clear-order-dialog";
import PaymentDialog from "./payment-dialog";
import RevokeOrderDialog from "./revoke-order-dialog";
import TicketsDialog from "./tickets-dialog";
import UpdateProductDialog from "./update-product-dialog";
import { TRANSITION_ANIMATION } from "utils/constants";
import { BackArrowIcon, EditIcon, PrinterIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  button: {
    padding: "5px 15px",
    backgroundColor: theme.palette.mode === "dark" ? "rgb(144, 202, 249)" : "#08415c",
    color: theme.palette.mode === "dark" ? "#000" : "rgba(255,255,255,0.85)",
    boxShadow: "3px 3px 6px rgba(0,0,0,0.55)",
    transition: `background-color ${TRANSITION_ANIMATION}, color ${TRANSITION_ANIMATION}`,
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "rgb(66, 165, 245)" : "#27546c",
      boxShadow: "4px 4px 6px rgba(0,0,0,0.55)",
    },
    "&:disabled": {
      backgroundColor: theme.palette.mode === "dark" ? "rgb(144, 202, 249)" : "#08415c",
      color: theme.palette.mode === "dark" ? "#000" : "rgba(255,255,255,0.85)",
      opacity: theme.palette.mode === "dark" ? 0.5 : 0.7,
    },
  },
  icon: {
    path: {
      color: "#FFF",
    },
  },
  summaryDetails: {
    justifyContent: "center",
    width: "100%",
    height: "auto",
    maxHeight: "calc(100% - 84px)",
    overflow: "hidden auto",
  },
  withExtraDetails: {
    maxHeight: "calc(100% - 154px)",
  },
  summaryTitle: {
    marginTop: "0",
    fontWeight: "700",
    textAlign: "center",
    color: theme.palette.text.primary,
  },
}));

interface OrderSummaryProps {
  orderId: number;
  invoiceId: number;
  summary: SummaryType;
  productDetails: WorkingOrderProductDetails;
  productDetailsList: WorkingOrderProductDetails[];
  customerDetails: CustomerDetailsType;
  paymentMethodList: PaymentMethodType[];
  activityCode: number;
  paymentTotal: number;
  revokeAlertMessage: string;
  isPriceChangeEnabled: boolean;
  ticketsButtonEnabled: boolean;
  invoiceButtonEnabled: boolean;
  saveButtonEnabled: boolean;
  revokeButtonEnabled: boolean;
  resetButtonEnabled: boolean;
  getCustomerDetails: (customerId: number) => void;
  setCustomerAttribute: (attribute: { attribute: string; value: string }) => void;
  setActivityCode: (value: string) => void;
  setPaymentMethodList: (list: PaymentMethodType[]) => void;
  setCashAmount: (value: number) => void;
  setProductDetails: (value: ProductDetailsType) => void;
  updateProductDetailsList: (value: number) => void;
  handleProductRemove: (value: number) => void;
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
  orderId,
  invoiceId,
  summary,
  extraDetails,
  productDetails,
  productDetailsList,
  customerDetails,
  paymentMethodList,
  activityCode,
  paymentTotal,
  revokeAlertMessage,
  isPriceChangeEnabled,
  ticketsButtonEnabled,
  invoiceButtonEnabled,
  saveButtonEnabled,
  revokeButtonEnabled,
  resetButtonEnabled,
  getCustomerDetails,
  setCustomerAttribute,
  setPaymentMethodList,
  setActivityCode,
  setCashAmount,
  setProductDetails,
  updateProductDetailsList,
  handleProductRemove,
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
    setDialogStatus({ status: true, id: orderId, type: DialogType.REVOKE });
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
      <Grid container xs={12} sx={{ height: "35px" }} justifyContent="center">
        <Grid container gap={1}>
          {isSplitMode && (
            <Grid>
              <MuiButton variant="contained" className={classes.button} onClick={handleClose}>
                <BackArrowIcon className={classes.icon} />
              </MuiButton>
            </Grid>
          )}
          {ticketsButtonEnabled && (
            <Grid>
              <MuiButton
                variant="contained"
                className={classes.button}
                onClick={() => setDialogStatus({ status: true, id: orderId, type: DialogType.TICKETS })}
              >
                <PrinterIcon className={classes.icon} />
              </MuiButton>
            </Grid>
          )}
          {invoiceButtonEnabled && invoiceId === 0 && (
            <Grid>
              <Button
                disabled={total === 0}
                label="Pagar"
                onClick={() => setDialogStatus({ status: true, id: orderId, type: DialogType.PAYMENT })}
              />
            </Grid>
          )}
          {saveButtonEnabled && handleSave && (
            <Grid>
              <Button disabled={buttonDisabled} label="Guardar" onClick={handleSave} />
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
          {revokeButtonEnabled && (
            <Grid>
              <Button label="Anular" onClick={openRevokeDialog} />
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
            invoiceId={invoiceId}
            summary={summary}
            customerDetails={customerDetails}
            paymentMethodList={paymentMethodList}
            activityCode={activityCode}
            paymentTotal={paymentTotal}
            getCustomerDetails={getCustomerDetails}
            setCustomerAttribute={setCustomerAttribute}
            setActivityCode={setActivityCode}
            setPaymentMethodList={setPaymentMethodList}
            setCashAmount={setCashAmount}
            generateInvoice={generateInvoice}
            setDialogStatus={setDialogStatus}
          />
        )}
      </Dialog>
    </Grid>
  );
}

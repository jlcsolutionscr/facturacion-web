import { Button, Select, TextField } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { CompanyType, IdDescriptionType, SummaryType } from "types/domain";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { generateInvoiceTicket, saveInvoice } from "state/invoice/asyncActions";
import { resetInvoice, setActivityCode, setComment, setCurrency } from "state/invoice/reducer";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  container: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    padding: "15px 20px 20px 20px",
    "@media screen and (max-width:959px)": {
      padding: "15px",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "10 5px 5px 5px",
    },
  },
  summary: {
    flexDirection: "column",
    maxWidth: "330px",
    textAlign: "center",
  },
  details: {
    marginTop: "0",
    textAlign: "left",
    " & .MuiGrid-item": {
      paddingTop: "8px",
    },
  },
  summaryTitle: {
    marginTop: "0",
    fontWeight: "700",
    color: theme.palette.text.primary,
  },
  columnRight: {
    textAlign: "right",
  },
  summaryRow: {
    color: theme.palette.text.primary,
  },
  centered: {
    display: "flex",
    margin: "auto",
    justifyContent: "center",
  },
}));

interface InvoiceSummaryProps {
  index: number;
  value: number;
  invoiceId: number | null;
  company: CompanyType;
  summary: SummaryType;
  activityCode: number;
  currency: number;
  comment: string;
  vendorList: IdDescriptionType[];
  successful: boolean;
  setValue: (value: number) => void;
  className?: string;
}

export default function InvoiceSummary({
  index,
  value,
  invoiceId,
  company,
  summary,
  activityCode,
  currency,
  comment,
  successful,
  setValue,
  className,
}: InvoiceSummaryProps) {
  const { classes } = useStyles();
  const [cashPayment, setCashPayment] = useState<string>(summary.total.toString());
  const [cardPayment, setCardPayment] = useState("0");
  const [transferPayment, setTransferPayment] = useState("0");

  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);

  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;

  useEffect(() => {
    if (value === 2) myRef.current?.scrollTo(0, 0);
  }, [value]);

  useEffect(() => {
    setCashPayment(summary.total.toString());
    setCardPayment("0");
    setTransferPayment("0");
  }, [summary.total]);

  const handleOnPrintButton = () => {
    invoiceId && dispatch(generateInvoiceTicket({ id: invoiceId }));
  };

  const handlePaymentOptionChange = (type: string, value: string) => {
    const floatValue = value === "" ? 0 : parseFloat(value);
    if (type === "CASH") {
      setCashPayment(value);
      setCardPayment((total - floatValue).toString());
      setTransferPayment("0");
    } else if (type === "CARD") {
      setCardPayment(value);
      setTransferPayment((total - parseFloat(cashPayment) - floatValue).toString());
    } else {
      if (floatValue === 0) setCashPayment(total.toString());
      setTransferPayment(value);
    }
  };

  const handleSbumitButton = () => {
    const paymentList = [];
    if (cashPayment !== "0") {
      paymentList.push({
        paymentId: 1,
        bankId: 0,
        description: "EFECTIVO",
        amount: parseFloat(cashPayment),
      });
    }
    if (cardPayment !== "0") {
      paymentList.push({
        paymentId: 2,
        bankId: 0,
        description: "TARJETA",
        amount: parseFloat(cardPayment),
      });
    }
    if (transferPayment !== "0") {
      paymentList.push({
        paymentId: 4,
        bankId: 0,
        description: "TRANSFERENCIA",
        amount: parseFloat(transferPayment),
      });
    }
    if (!successful) {
      dispatch(saveInvoice({ paymentList: paymentList }));
    } else {
      dispatch(resetInvoice());
      dispatch(setActivityCode(company.ActividadEconomicaEmpresa[0]?.CodigoActividad ?? 0));
      setValue(0);
    }
  };

  const activityItems = company.ActividadEconomicaEmpresa.map(item => (
    <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
      {item.Descripcion}
    </MenuItem>
  ));

  const buttonDisabled = total === 0;

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            label="Observaciones"
            id="Observacion"
            value={comment}
            onChange={event => dispatch(setComment(event.target.value))}
          />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <Grid container item xs={10} sm={6} md={6} lg={4} gap={1}>
            {activityItems.length > 1 && (
              <Grid item xs={12}>
                <Select
                  id="codigo-actividad-select-id"
                  label="Seleccione la Actividad Económica"
                  value={activityCode.toString()}
                  onChange={event => dispatch(setActivityCode(event.target.value))}
                >
                  {activityItems}
                </Select>
              </Grid>
            )}
            <Grid item xs={12} className={`${classes.centered} ${classes.summary}`}>
              <InputLabel className={classes.summaryTitle}>RESUMEN DE FACTURA</InputLabel>
              <Grid container className={classes.details}>
                <Grid item xs={6}>
                  <InputLabel className={classes.summaryRow}>Gravado</InputLabel>
                </Grid>
                <Grid item xs={6} className={classes.columnRight}>
                  <InputLabel className={classes.summaryRow}>{formatCurrency(taxed)}</InputLabel>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.summaryRow}>Exonerado</InputLabel>
                </Grid>
                <Grid item xs={6} className={classes.columnRight}>
                  <InputLabel className={classes.summaryRow}>{formatCurrency(exonerated)}</InputLabel>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.summaryRow}>Excento</InputLabel>
                </Grid>
                <Grid item xs={6} className={classes.columnRight}>
                  <InputLabel className={classes.summaryRow}>{formatCurrency(exempt)}</InputLabel>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.summaryRow}>SubTotal</InputLabel>
                </Grid>
                <Grid item xs={6} className={classes.columnRight}>
                  <InputLabel className={classes.summaryRow}>{formatCurrency(subTotal)}</InputLabel>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.summaryRow}>Impuesto</InputLabel>
                </Grid>
                <Grid item xs={6} className={classes.columnRight}>
                  <InputLabel className={classes.summaryRow}>{formatCurrency(taxes)}</InputLabel>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.summaryRow}>Total</InputLabel>
                </Grid>
                <Grid item xs={6} className={classes.columnRight}>
                  <InputLabel className={classes.summaryRow}>{formatCurrency(total)}</InputLabel>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.centered}>
              <InputLabel className={classes.summaryTitle}>DESGLOSE DE PAGO</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <TextField
                readOnly={successful}
                numericFormat
                value={cashPayment}
                label="Monto en efectivo:"
                onBlur={() => cashPayment === "" && setCashPayment("0")}
                onChange={event => handlePaymentOptionChange("CASH", event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                readOnly={successful}
                numericFormat
                value={cardPayment}
                label="Monto en tarjeta:"
                onBlur={() => cardPayment === "" && setCardPayment("0")}
                onChange={event => handlePaymentOptionChange("CARD", event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                readOnly={successful}
                numericFormat
                value={transferPayment}
                label="Monto en transferencia:"
                onBlur={() => transferPayment === "" && setTransferPayment("0")}
                onChange={event => handlePaymentOptionChange("BANK", event.target.value)}
              />
            </Grid>
            {company.HabilitaFacturacionMonedaExtranjera && (
              <Grid item xs={12} className={classes.centered}>
                <Select
                  disabled={successful}
                  id="currenty-type-select-id"
                  label="Seleccione la moneda de la transacción"
                  value={currency.toString()}
                  onChange={event => dispatch(setCurrency(event.target.value))}
                >
                  <MenuItem value={1}>COLONES</MenuItem>
                  <MenuItem value={2}>DOLARES</MenuItem>
                </Select>
              </Grid>
            )}
            <Grid item container xs={12} gap={1} justifyContent="center">
              <Grid item>
                <Button
                  disabled={buttonDisabled}
                  label={successful ? "Nueva factura" : "Guardar"}
                  onClick={handleSbumitButton}
                />
              </Grid>
              {successful && (
                <Grid item>
                  <Button disabled={buttonDisabled} label="Imprimir" onClick={handleOnPrintButton} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

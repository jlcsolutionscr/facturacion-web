import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { CompanyType, IdDescriptionType, PaymentDetailsType, SummaryType } from "types/domain";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Button from "components/button";
import Select from "components/select";
import TextField from "components/text-field";
import { generateInvoiceTicket, saveInvoice } from "state/invoice/asyncActions";
import { resetInvoice, setActivityCode, setComment, setPaymentDetailsList, setVendorId } from "state/invoice/reducer";
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
    maxWidth: "300px",
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

interface StepThreeScreenProps {
  index: number;
  value: number;
  invoiceId: number | null;
  company: CompanyType | null;
  summary: SummaryType;
  activityCode: number;
  paymentDetails: PaymentDetailsType[];
  vendorId: number;
  comment: string;
  vendorList: IdDescriptionType[];
  successful: boolean;
  setValue: (value: number) => void;
  className?: string;
}

export default function StepThreeScreen({
  index,
  value,
  invoiceId,
  company,
  summary,
  activityCode,
  paymentDetails,
  vendorId,
  comment,
  vendorList,
  successful,
  setValue,
  className,
}: StepThreeScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);

  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;

  useEffect(() => {
    if (value === 2) myRef.current?.scrollTo(0, 0);
  }, [value]);

  const buttonDisabled = total === 0;
  const paymentMethods: { id: number; description: string }[] = [
    { id: 1, description: "EFECTIVO" },
    { id: 2, description: "TARJETA" },
    { id: 3, description: "CHEQUE" },
    { id: 4, description: "TRANSFERENCIA" },
  ];
  const paymentItems = paymentMethods.map(item => {
    return (
      <MenuItem key={item.id} value={item.id}>
        {item.description}
      </MenuItem>
    );
  });
  const handleOnPress = () => {
    if (!successful) {
      dispatch(saveInvoice());
    } else {
      dispatch(resetInvoice());
      setValue(0);
    }
  };
  const handleOnPrintButton = () => {
    invoiceId && dispatch(generateInvoiceTicket({ id: invoiceId }));
  };
  const activityItems = company
    ? company.ActividadEconomicaEmpresa.map(item => {
        return (
          <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
            {item.Descripcion}
          </MenuItem>
        );
      })
    : [];
  const vendorItems = vendorList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
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
        {activityItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={10} sm={6} md={4}>
              <Select
                id="codigo-actividad-select-id"
                label="Seleccione la Actividad Económica"
                value={activityCode.toString()}
                onChange={event => dispatch(setActivityCode(event.target.value))}
              >
                {activityItems}
              </Select>
            </Grid>
          </Grid>
        )}
        {vendorItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={10} sm={6} md={4}>
              <Select
                id="id-vendedor-select-id"
                label="Seleccione el Vendedor"
                value={vendorId.toString()}
                onChange={event => dispatch(setVendorId(event.target.value))}
              >
                {vendorItems}
              </Select>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid item xs={11} sm={6} md={5} className={`${classes.summary} ${classes.centered}`}>
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
        </Grid>
        <Grid item xs={10} sm={6} md={4} className={classes.centered}>
          <Select
            disabled={successful}
            id="forma-pago-select-id"
            label="Seleccione la forma de pago:"
            value={paymentDetails[0].paymentId.toString()}
            onChange={event =>
              dispatch(
                setPaymentDetailsList([
                  {
                    paymentId: event.target.value,
                    description:
                      paymentMethods.find(method => method.id === parseInt(event.target.value))?.description ??
                      "NO ESPECIFICADO",
                    amount: total,
                  },
                ])
              )
            }
          >
            {paymentItems}
          </Select>
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <Button disabled={buttonDisabled} label={successful ? "Nueva factura" : "Agregar"} onClick={handleOnPress} />
        </Grid>
        {successful && (
          <Grid item xs={12} className={classes.centered}>
            <Button disabled={buttonDisabled} label="Imprimir" onClick={handleOnPrintButton} />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

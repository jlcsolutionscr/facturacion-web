import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Button from "components/button";
import Select from "components/select";
import TextField from "components/text-field";
import { generateInvoiceTicket, saveInvoice, setInvoiceParameters } from "state/invoice/asyncActions";
import {
  getActivityCode,
  getComment,
  getInvoiceId,
  getPaymentDetailsList,
  getSuccessful,
  getSummary,
  getVendorId,
  setActivityCode,
  setComment,
  setPaymentDetailsList,
  setVendorId,
} from "state/invoice/reducer";
import { getCompany, getVendorList } from "state/session/reducer";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.background.paper,
  },
  summary: {
    flexDirection: "column",
    maxWidth: "300px",
    textAlign: "center",
  },
  details: {
    marginTop: "5px",
    textAlign: "left",
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
  setValue: (value: number) => void;
}

export default function StepThreeScreen({ index, value, setValue }: StepThreeScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const myRef = React.useRef<HTMLDivElement>(null);

  const invoiceId = useSelector(getInvoiceId);
  const company = useSelector(getCompany);
  const summary = useSelector(getSummary);
  const activityCode = useSelector(getActivityCode);
  const paymentDetails = useSelector(getPaymentDetailsList);
  const vendorId = useSelector(getVendorId);
  const comment = useSelector(getComment);
  const successful = useSelector(getSuccessful);

  const vendorList = useSelector(getVendorList);

  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;

  React.useEffect(() => {
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
      dispatch(setInvoiceParameters({ id: 5 }));
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
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.centered}>
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
            <Grid item xs={12} sm={7} md={6}>
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
            <Grid item xs={12} sm={7} md={6}>
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
        <Grid item xs={12} className={`${classes.summary} ${classes.centered}`}>
          <InputLabel className={classes.summaryTitle}>RESUMEN DE FACTURA</InputLabel>
          <Grid container spacing={2} className={classes.details}>
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
          <Select
            disabled={successful}
            id="sucursal-select-id"
            label="Seleccione la forma de pago:"
            value={paymentDetails[0].paymentId.toString()}
            onChange={event =>
              dispatch(
                setPaymentDetailsList({
                  paymentId: event.target.value,
                  description:
                    paymentMethods.find(method => method.id === parseInt(event.target.value))?.description ??
                    "NO ESPECIFICADO",
                  amount: total,
                })
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

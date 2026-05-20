import { Button, Select } from "jlc-component-library";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { CompanyType, IdDescriptionType, PaymentMethodType, SummaryType } from "types/domain";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { generateInvoiceTicket } from "state/invoice/asyncActions";
import { generateInvoice, generateWorkingOrderTicket, saveWorkingOrder } from "state/working-order/asyncActions";
import {
  resetWorkingOrder,
  setActivityCode,
  setCurrency,
  setPaymentMethodList,
  setVendorId,
} from "state/working-order/reducer";
import { ORDER_STATUS, TRANSITION_ANIMATION } from "utils/constants";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  container: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    padding: "15px 20px 0 20px",
    transition: `background-color ${TRANSITION_ANIMATION}`,
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

interface OrderSummaryProps {
  index: number;
  value: number;
  company: CompanyType | null;
  summary: SummaryType;
  activityCode: number;
  paymentMethod: PaymentMethodType[];
  vendorId: number;
  currency: number;
  workingOrderId: number;
  vendorList: IdDescriptionType[];
  cashAdvance: number;
  savedOrderTotal: number;
  status: string;
  invoiceId: number;
  setValue: (id: number) => void;
  className?: string;
}

export default function OrderSummary({
  value,
  index,
  company,
  summary,
  activityCode,
  paymentMethod,
  vendorId,
  currency,
  workingOrderId,
  vendorList,
  cashAdvance,
  savedOrderTotal,
  status,
  invoiceId,
  setValue,
  className,
}: OrderSummaryProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value === 3) myRef.current?.scrollTo(0, 0);
  }, [value]);

  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;
  const paymentMethods: { id: number; description: string }[] = [
    { id: 1, description: "EFECTIVO" },
    { id: 2, description: "TARJETA" },
    { id: 3, description: "CHEQUE" },
    { id: 4, description: "TRANSFERENCIA" },
  ];
  const paymentItems = paymentMethods.map(item => (
    <MenuItem key={item.id} value={item.id}>
      {item.description}
    </MenuItem>
  ));

  const handleOnPrintClick = () => {
    if (invoiceId > 0) {
      dispatch(generateInvoiceTicket({ id: invoiceId }));
    } else {
      dispatch(generateWorkingOrderTicket({ id: workingOrderId }));
    }
  };

  const handleNewRecord = () => {
    dispatch(resetWorkingOrder());
    setValue(0);
  };

  const activityItems = company
    ? company.ActividadEconomicaEmpresa.map(item => (
        <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
          {item.Descripcion}
        </MenuItem>
      ))
    : [];
  const vendorItems = vendorList.map(item => (
    <MenuItem key={item.Id} value={item.Id}>
      {item.Descripcion}
    </MenuItem>
  ));
  return (
    <div ref={myRef} className={`${classes.container} ${className}`} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item container xs={12}>
          <Grid item xs={11} sm={6} md={5} className={`${classes.summary} ${classes.centered}`}>
            <InputLabel className={classes.summaryTitle}>RESUMEN DE ORDEN DE SERVICIO</InputLabel>
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
              <Grid item xs={6}>
                <InputLabel className={classes.summaryRow}>Saldo</InputLabel>
              </Grid>
              <Grid item xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(total - cashAdvance)}</InputLabel>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {invoiceId === 0 && (
          <>
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
            <Grid item xs={12} className={classes.centered}>
              <Grid item xs={10} sm={6} md={4}>
                <Select
                  id="forma-pago-select-id"
                  label="Seleccione la forma de pago:"
                  value={paymentMethod[0] ? paymentMethod[0].paymentId.toString() : ""}
                  onChange={event =>
                    dispatch(
                      setPaymentMethodList([
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
            </Grid>
            <Grid item xs={12} className={classes.centered}>
              <Grid item xs={10} sm={6} md={4}>
                <Select
                  id="currenty-type-select-id"
                  label="Seleccione la moneda de la transacción"
                  value={currency.toString()}
                  onChange={event => dispatch(setCurrency(event.target.value))}
                >
                  <MenuItem value={1}>COLONES</MenuItem>
                  <MenuItem value={2}>DOLARES</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </>
        )}
        <Grid item xs={12} container gap={2} justifyContent="center">
          {(savedOrderTotal < summary.total || status === ORDER_STATUS.ON_PROGRESS) && (
            <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
              <Button label="Guardar" onClick={() => dispatch(saveWorkingOrder())} />
            </Grid>
          )}
          <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
            <Button label="Nueva Orden" onClick={handleNewRecord} />
          </Grid>
          {savedOrderTotal === summary.total && summary.total > 0 && status === ORDER_STATUS.READY && (
            <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
              <Button label="Facturar" onClick={() => dispatch(generateInvoice())} />
            </Grid>
          )}
          {savedOrderTotal === summary.total && (invoiceId > 0 || workingOrderId > 0) && (
            <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
              <Button label={invoiceId === 0 ? "Imprimir Orden" : "Imprimir Factura"} onClick={handleOnPrintClick} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

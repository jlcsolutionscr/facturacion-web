import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Button from "components/button";
import Select from "components/select";
import { getCompany } from "state/session/reducer";
import { saveWorkingOrder } from "state/working-order/asyncActions";
import {
  getActivityCode,
  getPaymentDetailsList,
  getSummary,
  getWorkingOrderId,
  resetWorkingOrder,
  setActivityCode,
  setPaymentDetailsList,
} from "state/working-order/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  container: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    padding: "20px",
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

interface StepTwoScreenProps {
  index: number;
  value: number;
  setValue: (id: number) => void;
  className?: string;
}

export default function StepTwoScreen({ value, index, setValue, className }: StepTwoScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);

  const summary = useSelector(getSummary);
  const workingOrderId = useSelector(getWorkingOrderId);
  const company = useSelector(getCompany);
  const activityCode = useSelector(getActivityCode);
  const paymentDetails = useSelector(getPaymentDetailsList);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

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
  const activityItems = company
    ? company.ActividadEconomicaEmpresa.map(item => {
        return (
          <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
            {item.Descripcion}
          </MenuItem>
        );
      })
    : [];
  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;
  const buttonDisabled = total === 0;

  const handleNewRecord = () => {
    dispatch(resetWorkingOrder());
    setValue(0);
  };

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} hidden={value !== index}>
      <Grid container spacing={2}>
        {activityItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={12} sm={7} md={6}>
              <Select
                id="codigo-actividad-select-id"
                label="Seleccione la Actividad Económica"
                value={activityCode.toString()}
                onChange={event => setActivityCode(event.target.value)}
              >
                {activityItems}
              </Select>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid item xs={11} sm={6} md={5} className={`${classes.summary} ${classes.centered}`}>
            <InputLabel className={classes.summaryTitle}>RESUMEN ORDEN DE SERVICIO</InputLabel>
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
            id="forma-pago-select-id"
            label="Seleccione la forma de pago:"
            value={paymentDetails[0].paymentId.toString()}
            disabled={buttonDisabled}
            onChange={event =>
              setPaymentDetailsList([
                {
                  paymentId: event.target.value,
                  description:
                    paymentMethods.find(method => method.id === parseInt(event.target.value))?.description ??
                    "NO ESPECIFICADO",
                  amount: total,
                },
              ])
            }
          >
            {paymentItems}
          </Select>
        </Grid>
        <Grid item container gap={2} justifyContent="center">
          <Grid item>
            <Button
              disabled={buttonDisabled}
              label={workingOrderId > 0 ? "Actualizar" : "Agregar"}
              onClick={() => dispatch(saveWorkingOrder())}
            />
          </Grid>
          <Grid item>
            <Button label="Nueva Orden" onClick={handleNewRecord} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

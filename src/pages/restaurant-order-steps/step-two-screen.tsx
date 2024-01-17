import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Button from "components/button";
import Select from "components/select";
import {
  generateInvoice,
  generateInvoiceTicket,
  generateWorkingOrderTicket,
  saveWorkingOrder,
  setActivityCode,
  setPaymentDetailsList,
} from "state/working-order/asyncActions";
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
    marginTop: "10px",
    textAlign: "left",
  },
  summaryTitle: {
    marginTop: "20px",
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
  left: {
    display: "flex",
    margin: "auto",
    justifyContent: "flex-start",
  },
  right: {
    display: "flex",
    margin: "auto",
    justifyContent: "flex-end",
  },
}));

function StepTwoScreen({
  value,
  index,
  company,
  summary,
  activityCode,
  paymentDetails,
  workingOrderId,
  status,
  setActivityCode,
  setPaymentDetailsList,
  generateWorkingOrderTicket,
  generateInvoice,
  generateInvoiceTicket,
}) {
  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;
  const { classes } = useStyles();
  const myRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);
  const buttonDisabled = total === 0 || status !== "ready";
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
  const handleOnPrintClick = () => {
    if (status === "converted") {
      generateInvoiceTicket();
    } else {
      generateWorkingOrderTicket(workingOrderId);
    }
  };
  const activityItems = company.ActividadEconomicaEmpresa.map(item => {
    return (
      <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2} className={classes.gridContainer}>
        {activityItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={12} sm={7} md={6}>
              <Select
                id="codigo-actividad-select-id"
                label="Seleccione la Actividad Económica"
                value={activityCode}
                onChange={event => setActivityCode(event.target.value)}
              >
                {activityItems}
              </Select>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} className={`${classes.summary} ${classes.centered}`}>
          <InputLabel className={classes.summaryTitle}>RESUMEN DE ORDEN SERVICIO</InputLabel>
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
            style={{ width: "215px", textAlign: "left" }}
            id="forma-pago-select-id"
            label="Seleccione la forma de pago:"
            value={paymentDetails[0].paymentId}
            disabled={buttonDisabled}
            onChange={event =>
              setPaymentDetailsList({
                paymentId: event.target.value,
                description:
                  paymentMethods.find(method => method.id === event.target.value)?.description ?? "NO ESPECIFICADO",
                amount: total,
              })
            }
          >
            {paymentItems}
          </Select>
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <Button disabled={buttonDisabled} label="Facturar" onClick={() => generateInvoice()} />
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <Button disabled={status !== "converted"} label="Imprimir Factura" onClick={handleOnPrintClick} />
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    workingOrderId: state.workingOrder.workingOrderId,
    status: state.workingOrder.status,
    company: state.company.company,
    summary: state.workingOrder.summary,
    activityCode: state.workingOrder.activityCode,
    paymentDetails: state.workingOrder.paymentDetails,
    branchList: state.ui.branchList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setActivityCode,
      setPaymentDetailsList,
      saveWorkingOrder,
      generateWorkingOrderTicket,
      generateInvoice,
      generateInvoiceTicket,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StepTwoScreen);

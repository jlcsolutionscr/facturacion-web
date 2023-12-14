import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@mui/material/styles";

import {
  setActivityCode,
  setPaymentDetailsList,
  setVendorId,
  setComment,
  saveInvoice,
  setInvoiceParameters,
  generateInvoiceTicket,
} from "state/invoice/asyncActions";

import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Button from "components/button";
import TextField from "components/text-field";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.background.pages,
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

function StepThreeScreen({
  value,
  index,
  company,
  summary,
  activityCode,
  paymentDetails,
  vendorId,
  comment,
  successful,
  invoiceId,
  vendorList,
  setPaymentDetailsList,
  setVendorId,
  setComment,
  saveInvoice,
  setInvoiceParameters,
  generateInvoiceTicket,
  setActivityCode,
  setValue,
}) {
  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;
  const classes = useStyles();
  const myRef = React.useRef(null);
  React.useEffect(() => {
    if (value === 2) myRef.current.scrollTo(0, 0);
  }, [value]);
  const buttonDisabled = total === 0;
  const paymentMethods: { id: number; description: string }[] = [
    { id: 1, description: "EFECTIVO" },
    { id: 2, description: "TARJETA" },
    { id: 3, description: "CHEQUE" },
    { id: 4, description: "TRANSFERENCIA" },
  ];
  const paymentItems = paymentMethods.map((item) => {
    return (
      <MenuItem key={item.id} value={item.id}>
        {item.description}
      </MenuItem>
    );
  });
  const handleOnPress = () => {
    if (!successful) {
      saveInvoice();
    } else {
      setInvoiceParameters(5);
      setValue(0);
    }
  };
  const handleOnPrintButton = () => {
    generateInvoiceTicket(invoiceId);
  };
  const activityItems = company.ActividadEconomicaEmpresa.map((item) => {
    return (
      <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const vendorItems = vendorList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.centered}>
          <TextField
            disabled={successful}
            label="Observaciones"
            id="Observacion"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </Grid>
        {activityItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={12} sm={7} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Seleccione la Actividad Económica
                </InputLabel>
                <Select
                  id="CodigoActividad"
                  value={activityCode}
                  onChange={(event) => setActivityCode(event.target.value)}
                >
                  {activityItems}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        {vendorItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={12} sm={7} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Seleccione el Vendedor
                </InputLabel>
                <Select
                  id="VendorId"
                  value={vendorId}
                  onChange={(event) => setVendorId(event.target.value)}
                >
                  {vendorItems}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} className={`${classes.summary} ${classes.centered}`}>
          <InputLabel className={classes.summaryTitle}>
            RESUMEN DE FACTURA
          </InputLabel>
          <Grid container spacing={2} className={classes.details}>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Gravado</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>
                {formatCurrency(taxed)}
              </InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Exonerado</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>
                {formatCurrency(exonerated)}
              </InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Excento</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>
                {formatCurrency(exempt)}
              </InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>SubTotal</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>
                {formatCurrency(subTotal)}
              </InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Impuesto</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>
                {formatCurrency(taxes)}
              </InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Total</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>
                {formatCurrency(total)}
              </InputLabel>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <FormControl style={{ width: "215px", textAlign: "left" }}>
            <InputLabel id="demo-simple-select-label">
              Seleccione la forma de pago:
            </InputLabel>
            <Select
              disabled={successful}
              id="Sucursal"
              value={paymentDetails[0].paymentId}
              onChange={(event) =>
                setPaymentDetailsList({
                  paymentId: event.target.value,
                  description:
                    paymentMethods.find(
                      (method) => method.id === event.target.value
                    )?.description ?? "NO ESPECIFICADO",
                  amount: total,
                })
              }
            >
              {paymentItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} className={classes.centered}>
          <Button
            disabled={buttonDisabled}
            label={successful ? "Nueva factura" : "Agregar"}
            onClick={handleOnPress}
          />
        </Grid>
        {successful && (
          <Grid item xs={12} className={classes.centered}>
            <Button
              disabled={buttonDisabled}
              label="Imprimir"
              onClick={handleOnPrintButton}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    company: state.company.company,
    invoiceId: state.invoice.invoiceId,
    activityCode: state.invoice.activityCode,
    paymentDetails: state.invoice.paymentDetails,
    summary: state.invoice.summary,
    comment: state.invoice.comment,
    successful: state.invoice.successful,
    branchList: state.ui.branchList,
    vendorList: state.session.vendorList,
    vendorId: state.invoice.vendorId,
    error: state.invoice.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setActivityCode,
      setPaymentDetailsList,
      setVendorId,
      setComment,
      saveInvoice,
      setInvoiceParameters,
      generateInvoiceTicket,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StepThreeScreen);

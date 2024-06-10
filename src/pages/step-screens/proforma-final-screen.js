import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Button from "components/button";
import TextField from "components/text-field";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles(theme => ({
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

export default function StepThreeScreen({
  value,
  index,
  summary,
  vendorId,
  comment,
  proforma,
  vendorList,
  setProformaAttributes,
  saveProforma,
  setProformaParameters,
  setValue,
}) {
  const { gravado, exonerado, excento, subTotal, impuesto, total } = summary;
  const classes = useStyles();
  const myRef = React.useRef(null);

  React.useEffect(() => {
    if (value === 2) myRef.current.scrollTo(0, 0);
  }, [value]);

  const buttonDisabled = total === 0;

  const handleOnPress = () => {
    if (!proforma) {
      saveProforma();
    } else {
      setProformaParameters();
      setValue(0);
    }
  };

  const vendorItems = vendorList.map(item => {
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
            label="Observaciones"
            id="Observacion"
            value={comment}
            onChange={event => setProformaAttributes({ comment: event.target.value })}
          />
        </Grid>
        {vendorItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={12} sm={7} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Seleccione el Vendedor</InputLabel>
                <Select
                  id="VendorId"
                  value={vendorId}
                  onChange={event => setProformaAttributes({ vendorId: event.target.value })}
                >
                  {vendorItems}
                </Select>
              </FormControl>
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
              <InputLabel className={classes.summaryRow}>{formatCurrency(gravado)}</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Exonerado</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(exonerado)}</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <InputLabel className={classes.summaryRow}>Excento</InputLabel>
            </Grid>
            <Grid item xs={6} className={classes.columnRight}>
              <InputLabel className={classes.summaryRow}>{formatCurrency(excento)}</InputLabel>
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
              <InputLabel className={classes.summaryRow}>{formatCurrency(impuesto)}</InputLabel>
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
          <Button disabled={buttonDisabled} label={proforma ? "Actualizar" : "Agregar"} onClick={handleOnPress} />
        </Grid>
      </Grid>
    </div>
  );
}

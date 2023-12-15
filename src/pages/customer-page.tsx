import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";

import { setActiveSection } from "store/ui/actions";
import {
  validateCustomerIdentifier,
  setCustomer,
  setCustomerAttribute,
  saveCustomer,
} from "state/customer/asyncActions";

import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import TextField from "components/text-field";
import Button from "components/button";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.custom.pagesBackground,
    overflowY: "auto",
    margin: "20px auto auto auto",
    padding: "20px",
    "@media screen and (max-width:960px)": {
      marginTop: "16px",
      padding: "16px",
    },
    "@media screen and (max-width:600px)": {
      marginTop: "13px",
      padding: "13px",
    },
    "@media screen and (max-width:414px)": {
      marginTop: "10px",
      padding: "10px",
    },
  },
  label: {
    color: theme.palette.text.primary,
  },
}));

function CustomerPage({
  idTypeList,
  priceTypeList,
  taxTypeList,
  exonerationTypeList,
  customer,
  validateCustomerIdentifier,
  setCustomer,
  setCustomerAttribute,
  saveCustomer,
  setActiveSection,
}) {
  const classes = useStyles();
  const idTypeItems = idTypeList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const rentTypeItems = [];
  taxTypeList.forEach((item) => {
    if (item.Id > 1)
      rentTypeItems.push(
        <MenuItem key={item.Id} value={item.Id}>
          {item.Descripcion}
        </MenuItem>
      );
  });
  const priceTypeItems = priceTypeList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const exonerationTypesItems = exonerationTypeList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  let disabled = true;
  if (customer != null) {
    disabled =
      customer.Identificacion === "" ||
      customer.Nombre === "" ||
      customer.Direccion === "" ||
      customer.Telefono === "" ||
      customer.CorreoElectronico === "" ||
      customer.IdTipoPrecio === null ||
      customer.IdImpuesto === null ||
      customer.IdTipoExoneracion === null;
  }
  const handlePaste = (e) => {
    e.preventDefault();
  };
  const handleChange = (event) => {
    setCustomerAttribute(event.target.id, event.target.value);
    if (
      event.target.id === "Identificacion" &&
      customer.IdTipoIdentificacion === 0 &&
      event.target.value.length === 9
    ) {
      validateCustomerIdentifier(event.target.value);
    }
  };
  const handleIdTypeChange = (value) => {
    setCustomerAttribute("IdTipoIdentificacion", value);
    setCustomerAttribute("Identificacion", "");
    setCustomerAttribute("Nombre", "");
  };
  const handleCheckboxChange = () => {
    setCustomerAttribute(
      "AplicaTasaDiferenciada",
      !customer.AplicaTasaDiferenciada
    );
    if (customer.AplicaTasaDiferenciada) setCustomerAttribute("IdImpuesto", 8);
  };
  const handleOnClose = () => {
    setCustomer(null);
    setActiveSection(3);
  };
  let idPlaceholder = "";
  let idMaxLength = 0;
  switch (customer.IdTipoIdentificacion) {
    case 0:
      idPlaceholder = "999999999";
      idMaxLength = 9;
      break;
    case 1:
      idPlaceholder = "9999999999";
      idMaxLength = 10;
      break;
    case 2:
      idPlaceholder = "999999999999";
      idMaxLength = 12;
      break;
    case 3:
      idPlaceholder = "9999999999";
      idMaxLength = 10;
      break;
    default:
      idPlaceholder = "999999999";
      idMaxLength = 9;
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="IdTipoIdentificacion">
              Tipo de identificación
            </InputLabel>
            <Select
              id="IdTipoIdentificacion"
              value={customer.IdTipoIdentificacion}
              onChange={(event) => handleIdTypeChange(event.target.value)}
            >
              {idTypeItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            numericFormat={customer.IdTipoIdentificacion > 1 ? false : true}
            id="Identificacion"
            value={customer.Identificacion}
            label="Identificación"
            placeholder={idPlaceholder}
            inputProps={{ maxLength: idMaxLength }}
            onChange={handleChange}
            onPaste={handlePaste}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Nombre"
            value={customer.Nombre}
            label="Nombre del cliente"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="NombreComercial"
            value={customer.NombreComercial}
            label="Nombre Comercial"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Direccion"
            value={customer.Direccion}
            label="Dirección"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Telefono"
            value={customer.Telefono}
            label="Teléfono"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Fax"
            value={customer.Fax}
            label="Fax"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="CorreoElectronico"
            value={customer.CorreoElectronico}
            label="Correo electrónico"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <FormControl fullWidth>
            <InputLabel id="IdTipoPrecio">Tipo de precio</InputLabel>
            <Select
              id="IdTipoPrecio"
              value={customer.IdTipoPrecio}
              onChange={(event) =>
                setCustomerAttribute("IdTipoPrecio", event.target.value)
              }
            >
              {priceTypeItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={customer.AplicaTasaDiferenciada}
                onChange={handleCheckboxChange}
                name="AplicaTasaDiferenciada"
                color="primary"
              />
            }
            label="Aplica tasa diferenciada"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={!customer.AplicaTasaDiferenciada}>
            <InputLabel id="IdTipoImpuesto">
              Tasa de IVA diferenciada
            </InputLabel>
            <Select
              id="IdImpuesto"
              value={customer.IdImpuesto}
              onChange={(event) =>
                setCustomerAttribute("IdImpuesto", event.target.value)
              }
            >
              {rentTypeItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={7}>
          <FormControl fullWidth>
            <InputLabel id="IdTipoExoneracion">Tasa de exoneración</InputLabel>
            <Select
              id="IdTipoExoneracion"
              value={customer.IdTipoExoneracion}
              onChange={(event) =>
                setCustomerAttribute("IdTipoExoneracion", event.target.value)
              }
            >
              {exonerationTypesItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="NumDocExoneracion"
            value={customer.NumDocExoneracion}
            label="Documento de exoneración"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="NombreInstExoneracion"
            value={customer.NombreInstExoneracion}
            label="Nombre de institución"
            onChange={handleChange}
          />
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={5} sm={3}>
            <DatePicker
              label="Fecha exoneración"
              format="dd/MM/yyyy"
              value={customer.FechaEmisionDoc}
              onChange={(value) =>
                setCustomerAttribute("FechaEmisionDoc", value)
              }
              animateYearScrolling
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={12}>
          <TextField
            id="PorcentajeExoneracion"
            value={customer.PorcentajeExoneracion}
            label="Porcentaje de exoneración"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            disabled={disabled}
            label="Guardar"
            onClick={() => saveCustomer()}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button label="Regresar" onClick={handleOnClose} />
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    customerList: state.customer.customerList,
    idTypeList: state.ui.idTypeList,
    priceTypeList: state.customer.priceTypeList,
    taxTypeList: state.ui.taxTypeList,
    exonerationTypeList: state.ui.exonerationTypeList,
    customer: state.customer.customer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setActiveSection,
      validateCustomerIdentifier,
      setCustomer,
      setCustomerAttribute,
      saveCustomer,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);

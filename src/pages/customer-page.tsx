import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

import Button from "components/button";
import Select from "components/select";
import TextField, { TextFieldOnChangeEventType } from "components/text-field";
import { saveCustomer, validateCustomerIdentifier } from "state/customer/asyncActions";
import { getCustomer, getPriceTypeList, setCustomer, setCustomerAttribute } from "state/customer/reducer";
import { getExonerationTypeList, getIdTypeList, getTaxTypeList, setActiveSection } from "state/ui/reducer";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: "auto",
    margin: "20px 10%",
    padding: "20px",
    "@media screen and (max-width:960px)": {
      margin: "16px 5%",
      padding: "16px",
    },
    "@media screen and (max-width:600px)": {
      margin: "13px",
      padding: "13px",
    },
    "@media screen and (max-width:414px)": {
      margin: "0",
      padding: "10px",
    },
  },
  label: {
    color: theme.palette.text.primary,
  },
}));

export default function CustomerPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const idTypeList = useSelector(getIdTypeList);
  const priceTypeList = useSelector(getPriceTypeList);
  const taxTypeList = useSelector(getTaxTypeList);
  const exonerationTypeList = useSelector(getExonerationTypeList);
  const customer = useSelector(getCustomer);

  const idTypeItems = idTypeList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const rentTypeItems = taxTypeList
    .filter(item => item.Id > 1)
    .map(item => {
      return (
        <MenuItem key={item.Id} value={item.Id}>
          {item.Descripcion}
        </MenuItem>
      );
    });
  const priceTypeItems = priceTypeList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const exonerationTypesItems = exonerationTypeList.map(item => {
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
  const handlePaste = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  const handleChange = (event: TextFieldOnChangeEventType) => {
    dispatch(
      setCustomerAttribute({
        attribute: event.target.id,
        value: event.target.value,
      })
    );
    if (
      event.target.id === "Identificacion" &&
      customer.IdTipoIdentificacion === 0 &&
      event.target.value.length === 9
    ) {
      dispatch(validateCustomerIdentifier({ identifier: event.target.value }));
    }
  };

  const handleIdTypeChange = (value: string) => {
    dispatch(setCustomerAttribute({ attribute: "IdTipoIdentificacion", value }));
    dispatch(setCustomerAttribute({ attribute: "Identificacion", value: "" }));
    dispatch(setCustomerAttribute({ attribute: "Nombre", value: "" }));
  };

  const handleCheckboxChange = () => {
    dispatch(
      setCustomerAttribute({
        attribute: "AplicaTasaDiferenciada",
        value: !customer.AplicaTasaDiferenciada,
      })
    );
    if (customer.AplicaTasaDiferenciada) dispatch(setCustomerAttribute({ attribute: "IdImpuesto", value: 8 }));
  };

  const handleOnClose = () => {
    dispatch(setCustomer(null));
    dispatch(setActiveSection(3));
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
          <Select
            id="IdTipoIdentificacion"
            label="Tipo de identificación"
            value={customer.IdTipoIdentificacion.toString()}
            onChange={event => handleIdTypeChange(event.target.value)}
          >
            {idTypeItems}
          </Select>
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
          <TextField required id="Nombre" value={customer.Nombre} label="Nombre del cliente" onChange={handleChange} />
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
          <TextField required id="Direccion" value={customer.Direccion} label="Dirección" onChange={handleChange} />
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
          <TextField id="Fax" value={customer.Fax} label="Fax" numericFormat onChange={handleChange} />
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
          <Select
            id="IdTipoPrecio"
            label="Tipo de precio"
            value={customer.IdTipoPrecio.toString()}
            onChange={event =>
              dispatch(
                setCustomerAttribute({
                  attribute: "IdTipoPrecio",
                  value: event.target.value,
                })
              )
            }
          >
            {priceTypeItems}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            componentsProps={{
              typography: { variant: "body1", color: "text.primary" },
            }}
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
          <Select
            id="IdImpuesto"
            label="Tasa de IVA diferenciada"
            value={customer.IdImpuesto.toString()}
            onChange={event =>
              dispatch(
                setCustomerAttribute({
                  attribute: "IdImpuesto",
                  value: event.target.value,
                })
              )
            }
          >
            {rentTypeItems}
          </Select>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Select
            id="IdTipoExoneracion"
            label="Tasa de exoneración"
            value={customer.IdTipoExoneracion.toString()}
            onChange={event =>
              dispatch(
                setCustomerAttribute({
                  attribute: "IdTipoExoneracion",
                  value: event.target.value,
                })
              )
            }
          >
            {exonerationTypesItems}
          </Select>
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={5} sm={3}>
            <DatePicker
              label="Fecha exoneración"
              format="dd/MM/yyyy"
              value={new Date(customer.FechaEmisionDoc)}
              onChange={(value: Date | null) => {
                console.log("value", value);
                dispatch(
                  setCustomerAttribute({
                    attribute: "FechaEmisionDoc",
                    value: format(value !== null ? value : Date.now(), "yyyy-MM-dd") + "T23:59:59",
                  })
                );
              }}
            />
          </Grid>
        </LocalizationProvider>
        <Grid item xs={12}>
          <TextField
            id="PorcentajeExoneracion"
            value={customer.PorcentajeExoneracion.toString()}
            label="Porcentaje de exoneración"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button disabled={disabled} label="Guardar" onClick={() => dispatch(saveCustomer())} />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button label="Regresar" onClick={handleOnClose} />
        </Grid>
      </Grid>
    </div>
  );
}

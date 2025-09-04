import { SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import Button from "components/button";
import DatePicker from "components/data-picker";
import Select from "components/select";
import TextField, { TextFieldOnChangeEventType } from "components/text-field";
import { getAvailableEconomicActivityList } from "state/company/reducer";
import { saveCustomer, validateCustomerIdentifier } from "state/customer/asyncActions";
import { getCustomer, getPriceTypeList, setCustomer, setCustomerAttribute } from "state/customer/reducer";
import { getExonerationNameList, getExonerationTypeList, getIdTypeList, setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { defaultCustomer } from "utils/defaults";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: "hidden",
    maxWidth: "900px",
    width: "100%",
    margin: "15px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "calc(100% - 10px)",
      margin: "5px",
    },
  },
  header: {
    height: "45px",
    alignContent: "center",
  },
  content: {
    overflowY: "scroll",
    height: "calc(100% - 105px)",
    padding: "5px",
    scrollbarWidth: "thin",
  },
  footer: {
    height: "50px",
    alignContent: "center",
  },
}));

export default function CustomerPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const idTypeList = useSelector(getIdTypeList);
  const priceTypeList = useSelector(getPriceTypeList);
  const exonerationTypeList = useSelector(getExonerationTypeList);
  const exonerationNameList = useSelector(getExonerationNameList);
  const customer = useSelector(getCustomer);
  const economicActivityList = useSelector(getAvailableEconomicActivityList);

  const idTypeItems = idTypeList.map(item => {
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
  const exonerationTypeItems = exonerationTypeList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const exonerationNamesItems = exonerationNameList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const activityItems = economicActivityList.map(item => {
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
      customer.IdTipoExoneracion === null;
  }
  const handlePaste = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const handleChange = (event: TextFieldOnChangeEventType) => {
    dispatch(
      setCustomerAttribute({
        attribute: event.target.id,
        value: event.target.value,
      })
    );
    if (event.target.id === "Identificacion") {
      dispatch(validateCustomerIdentifier({ idType: customer.IdTipoIdentificacion, identifier: event.target.value }));
    }
  };

  const handleIdTypeChange = (value: string) => {
    dispatch(setCustomer({ ...defaultCustomer, IdTipoIdentificacion: value }));
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
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6" textAlign="center" fontWeight="700" color="textPrimary">
          Información del Cliente
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={6}>
            <Select
              id="IdTipoIdentificacion"
              label="Tipo de identificación"
              value={customer.IdTipoIdentificacion.toString()}
              onChange={event => handleIdTypeChange(event.target.value)}
            >
              {idTypeItems}
            </Select>
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="Nombre"
              value={customer.Nombre}
              label="Nombre del cliente"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={6} sm={4}>
            <TextField
              required
              id="Telefono"
              value={customer.Telefono}
              label="Teléfono"
              numericFormat
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              required
              id="Celular"
              value={customer.Celular}
              label="Celular"
              numericFormat
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField id="Fax" value={customer.Fax} label="Fax" numericFormat onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={9}>
            <TextField
              required
              id="CorreoElectronico"
              value={customer.CorreoElectronico}
              label="Correo electrónico"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
              {exonerationTypeItems}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              id="IdNombreInstExoneracion"
              label="Nombre de institución"
              value={customer.IdNombreInstExoneracion.toString()}
              onChange={event =>
                dispatch(
                  setCustomerAttribute({
                    attribute: "IdNombreInstExoneracion",
                    value: event.target.value,
                  })
                )
              }
            >
              {exonerationNamesItems}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="NumDocExoneracion"
              value={customer.NumDocExoneracion}
              label="Documento de exoneración"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="ArticuloExoneracion"
              value={customer.ArticuloExoneracion}
              label="Artículo"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              id="IncisoExoneracion"
              value={customer.IncisoExoneracion}
              label="Inciso"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Fecha exoneración"
              value={customer.FechaEmisionDoc}
              onChange={(value: string) => dispatch(setCustomerAttribute({ attribute: "FechaEmisionDoc", value }))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="PorcentajeExoneracion"
              value={customer.PorcentajeExoneracion.toString()}
              label="Porcentaje de exoneración"
              numericFormat
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              id="CodigoActividad"
              label="Seleccione la Actividad Económica"
              value={customer.CodigoActividad}
              onChange={event =>
                dispatch(
                  setCustomerAttribute({
                    attribute: "CodigoActividad",
                    value: event.target.value,
                  })
                )
              }
            >
              {activityItems}
            </Select>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.footer}>
        <Grid container justifyContent="center" gap={1}>
          <Button disabled={disabled} label="Guardar" onClick={() => dispatch(saveCustomer())} />
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(3))} />
        </Grid>
      </Box>
    </Box>
  );
}

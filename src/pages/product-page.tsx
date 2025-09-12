import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import Button from "components/button";
import DataGrid from "components/data-grid";
import LabelField from "components/label-field";
import Select from "components/select";
import TextField, { TextFieldOnChangeEventType } from "components/text-field";
import { filterClasificationList, saveProduct, validateProductCode } from "state/product/asyncActions";
import {
  getCategoryList,
  getClasificationList,
  getProduct,
  getProductTypeList,
  setProductAttribute,
} from "state/product/reducer";
import { getTaxTypeList, setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { SearchIcon } from "utils/iconsHelper";
import { getDescriptionFromRateId, getIdFromRateValue, getTaxeRateFromId, roundNumber } from "utils/utilities";

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
  icon: {
    padding: "7px",
  },
}));

function getUntaxedPrice(price: number, taxRate: number) {
  const rate = taxRate / 100;
  const finalPrice = price / (1 + rate);
  return finalPrice;
}

function getTaxedPrice(price: number, taxRate: number) {
  const rate = taxRate / 100;
  const finalPrice = price * (1 + rate);
  return finalPrice;
}

let delayTimer: ReturnType<typeof setTimeout> | null = null;

export default function ProductPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [clasificationFilter, setClasificationFilter] = useState("");
  const [untaxPrice1, setUntaxPrice1] = useState(0);
  const [untaxPrice2, setUntaxPrice2] = useState(0);
  const [untaxPrice3, setUntaxPrice3] = useState(0);
  const [untaxPrice4, setUntaxPrice4] = useState(0);
  const [untaxPrice5, setUntaxPrice5] = useState(0);

  const product = useSelector(getProduct);
  const productTypeList = useSelector(getProductTypeList);
  const categoryList = useSelector(getCategoryList);
  const clasificationList = useSelector(getClasificationList);
  const taxTypeList = useSelector(getTaxTypeList);

  useEffect(() => {
    const calculatePrice = (value: number, taxId: number) => {
      const taxRate = getTaxeRateFromId(taxTypeList, taxId);
      return roundNumber(getUntaxedPrice(value, taxRate), 2);
    };
    setUntaxPrice1(calculatePrice(product.PrecioVenta1, product.IdImpuesto));
    setUntaxPrice2(calculatePrice(product.PrecioVenta2, product.IdImpuesto));
    setUntaxPrice3(calculatePrice(product.PrecioVenta3, product.IdImpuesto));
    setUntaxPrice4(calculatePrice(product.PrecioVenta4, product.IdImpuesto));
    setUntaxPrice5(calculatePrice(product.PrecioVenta5, product.IdImpuesto));
  }, [product, taxTypeList]);

  const productTypes = productTypeList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });

  const categories = categoryList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });

  const disabled =
    product.IdLinea === 0 ||
    product.Codigo === "" ||
    product.Descripcion === "" ||
    product.PrecioVenta1 === 0 ||
    product.PrecioVenta2 === 0 ||
    product.PrecioVenta3 === 0 ||
    product.PrecioVenta4 === 0 ||
    product.PrecioVenta5 === 0;

  const handleChange = (event: TextFieldOnChangeEventType) => {
    dispatch(setProductAttribute({ attribute: event.target.id, value: event.target.value }));
  };

  const handlePriceChange = (event: TextFieldOnChangeEventType) => {
    const taxRate = getTaxeRateFromId(taxTypeList, product.IdImpuesto);
    const untaxPrice = roundNumber(getUntaxedPrice(parseFloat(event.target.value), taxRate), 2);
    setUntaxPrice1(untaxPrice);
    setUntaxPrice2(untaxPrice);
    setUntaxPrice3(untaxPrice);
    setUntaxPrice4(untaxPrice);
    setUntaxPrice5(untaxPrice);
    dispatch(setProductAttribute({ attribute: "PrecioVenta1", value: event.target.value }));
    dispatch(setProductAttribute({ attribute: "PrecioVenta2", value: event.target.value }));
    dispatch(setProductAttribute({ attribute: "PrecioVenta3", value: event.target.value }));
    dispatch(setProductAttribute({ attribute: "PrecioVenta4", value: event.target.value }));
    dispatch(setProductAttribute({ attribute: "PrecioVenta5", value: event.target.value }));
  };

  const handleUntaxPriceChange = (event: TextFieldOnChangeEventType) => {
    const taxRate = getTaxeRateFromId(taxTypeList, product.IdImpuesto);
    const taxPrice = roundNumber(getTaxedPrice(parseFloat(event.target.value), taxRate), 2);
    switch (event.target.id) {
      case "untaxPrice1":
        setUntaxPrice1(parseFloat(event.target.value));
        setUntaxPrice2(parseFloat(event.target.value));
        setUntaxPrice3(parseFloat(event.target.value));
        setUntaxPrice4(parseFloat(event.target.value));
        setUntaxPrice5(parseFloat(event.target.value));
        dispatch(setProductAttribute({ attribute: "PrecioVenta1", value: taxPrice }));
        dispatch(setProductAttribute({ attribute: "PrecioVenta2", value: taxPrice }));
        dispatch(setProductAttribute({ attribute: "PrecioVenta3", value: taxPrice }));
        dispatch(setProductAttribute({ attribute: "PrecioVenta4", value: taxPrice }));
        dispatch(setProductAttribute({ attribute: "PrecioVenta5", value: taxPrice }));
        break;
      case "untaxPrice2":
        setUntaxPrice2(parseFloat(event.target.value));
        dispatch(setProductAttribute({ attribute: "PrecioVenta2", value: taxPrice }));
        break;
      case "untaxPrice3":
        setUntaxPrice3(parseFloat(event.target.value));
        dispatch(setProductAttribute({ attribute: "PrecioVenta3", value: taxPrice }));
        break;
      case "untaxPrice4":
        setUntaxPrice4(parseFloat(event.target.value));
        dispatch(setProductAttribute({ attribute: "PrecioVenta4", value: taxPrice }));
        break;
      case "untaxPrice5":
        setUntaxPrice5(parseFloat(event.target.value));
        dispatch(setProductAttribute({ attribute: "PrecioVenta5", value: taxPrice }));
        break;
      default:
        break;
    }
  };

  const handleClasificationClick = () => {
    setDialogOpen(true);
    setClasificationFilter("");
    dispatch(filterClasificationList({ filterText: "" }));
  };

  const handleClasificationFilterChange = (event: { target: { id?: string; value: string } }) => {
    setClasificationFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(filterClasificationList({ filterText: event.target.value }));
    }, 1000);
  };

  const handleClasificationRowClick = (code: string) => {
    if (code !== "") {
      const codeEntity = clasificationList.find(elm => elm.Id === code);
      const taxRateId = codeEntity ? getIdFromRateValue(taxTypeList, codeEntity.Impuesto) : undefined;
      dispatch(setProductAttribute({ attribute: "CodigoClasificacion", value: code }));
      if (taxRateId) dispatch(setProductAttribute({ attribute: "IdImpuesto", value: taxRateId }));
    }
    setDialogOpen(false);
  };

  const rows = clasificationList.map(row => ({
    id: row.Id,
    taxRate: row.Impuesto,
    description: row.Descripcion,
  }));

  const columns = [
    { field: "id", headerName: "Código", hidden: true },
    { field: "taxRate", headerName: "IVA", type: "number" },
    { field: "description", headerName: "Descripcion" },
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6" textAlign="center" fontWeight="700">
          Información del Producto
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} sm={6}>
            <Select
              id="tipo-select-id"
              label="Seleccione el tipo de producto"
              value={product.Tipo.toString()}
              onChange={event => dispatch(setProductAttribute({ attribute: "Tipo", value: event.target.value }))}
            >
              {productTypes}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              id="id-linea-select-id"
              label="Seleccione la línea del producto"
              value={product.IdLinea.toString()}
              onChange={event => dispatch(setProductAttribute({ attribute: "IdLinea", value: event.target.value }))}
            >
              {categories}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <TextField required id="Codigo" value={product.Codigo} label="Código" onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="CodigoProveedor"
              value={product.CodigoProveedor}
              label="Codigo proveedor"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={10} sm={6}>
            <TextField
              required
              id="CodigoClasificacion"
              value={product.CodigoClasificacion}
              label="Codigo CABYS"
              inputProps={{ maxLength: 13 }}
              onChange={event => dispatch(validateProductCode({ code: event.target.value }))}
            />
          </Grid>
          <Grid item xs={2} sm={1}>
            <IconButton
              className={classes.icon}
              aria-label="upload picture"
              component="span"
              onClick={handleClasificationClick}
            >
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={5}>
            <LabelField
              id="TasaIva"
              value={getDescriptionFromRateId(taxTypeList, product.IdImpuesto)}
              label="Tasa del IVA"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="Descripcion"
              value={product.Descripcion}
              label="Descripción"
              onChange={handleChange}
            />
          </Grid>
          <Grid item container xs={12} spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                id="PrecioCosto"
                value={product.PrecioCosto.toString()}
                label="Precio costo"
                numericFormat
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="untaxPrice1"
              value={untaxPrice1.toString()}
              label="Precio sin impuesto"
              numericFormat
              onChange={handleUntaxPriceChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="PrecioVenta1"
              value={product.PrecioVenta1.toString()}
              label="Precio de venta 1"
              numericFormat
              onChange={handlePriceChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="untaxPrice2"
              value={untaxPrice2.toString()}
              label="Precio sin impuesto"
              numericFormat
              onChange={handleUntaxPriceChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="PrecioVenta2"
              value={product.PrecioVenta2.toString()}
              label="Precio de venta 2"
              numericFormat
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="untaxPrice3"
              value={untaxPrice3.toString()}
              label="Precio sin impuesto"
              numericFormat
              onChange={handleUntaxPriceChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="PrecioVenta3"
              value={product.PrecioVenta3.toString()}
              label="Precio de venta3"
              numericFormat
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="untaxPrice4"
              value={untaxPrice4.toString()}
              label="Precio sin impuesto"
              numericFormat
              onChange={handleUntaxPriceChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="PrecioVenta4"
              value={product.PrecioVenta4.toString()}
              label="Precio de venta 4"
              numericFormat
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="untaxPrice5"
              value={untaxPrice5.toString()}
              label="Precio sin impuesto"
              numericFormat
              onChange={handleUntaxPriceChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="PrecioVenta5"
              value={product.PrecioVenta5.toString()}
              label="Precio de venta 5"
              numericFormat
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField id="Observacion" value={product.Observacion} label="Observación" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              componentsProps={{
                typography: { variant: "body1", color: "text.primary" },
              }}
              control={
                <Checkbox
                  checked={product.Activo}
                  onChange={() => dispatch(setProductAttribute({ attribute: "Activo", value: !product.Activo }))}
                  name="ProductoActivoChk"
                  color="primary"
                />
              }
              label="Producto activo"
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.footer}>
        <Grid container justifyContent="center" gap={1}>
          <Button disabled={disabled} label="Guardar" onClick={() => dispatch(saveProduct())} />
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(5))} />
        </Grid>
      </Box>
      <Dialog id="clasification-dialog" onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="ClasificationFilter"
                value={clasificationFilter}
                label="Ingrese el criterio de búsqueda"
                onChange={handleClasificationFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DataGrid
                rowAction={handleClasificationRowClick}
                rowActionValue="id"
                showHeader
                dense
                columns={columns}
                rows={rows}
                rowsPerPage={10}
                rowsCount={Math.min(100, rows.length)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button negative label="Cerrar" onClick={() => setDialogOpen(false)} />
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";

import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";

import DataGrid from "components/data-grid";
import TextField from "components/text-field";
import LabelField from "components/label-field";
import Button from "components/button";
import { AddCircleIcon, RemoveCircleIcon, SearchIcon } from "utils/iconsHelper";

import { setActiveSection } from "state/ui/actions";
import { filterClasificationList } from "state/product/asyncActions";
import {
  setIssuerDetails,
  validateCustomerIdentifier,
  validateProductCode,
  setExonerationDetails,
  setProductDetails,
  addDetails,
  removeDetails,
  setActivityCode,
  saveReceipt,
} from "state/receipt/asyncActions";

import { formatCurrency, roundNumber } from "utils/utilities";

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: theme.palette.custom.pagesBackground,
    overflow: "auto",
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
  container: {
    padding: "20px",
    "@media screen and (max-width:960px)": {
      padding: "16px",
    },
    "@media screen and (max-width:600px)": {
      padding: "13px",
    },
    "@media screen and (max-width:414px)": {
      padding: "10px",
    },
  },
  bottom: {
    display: "flex",
    overflow: "auto",
    width: "100%",
  },
  outerButton: {
    padding: "8px",
  },
  innerButton: {
    padding: "0px",
  },
  icon: {
    padding: "7px",
  },
}));

let delayTimer = null;

function ReceiptPage({
  idTypeList,
  issuer,
  exonerationTypeList,
  clasificationList,
  exoneration,
  taxTypeList,
  company,
  product,
  productDetailList,
  summary,
  activityCode,
  successful,
  setExonerationDetails,
  setIssuerDetails,
  validateCustomerIdentifier,
  validateProductCode,
  setProductDetails,
  filterClasificationList,
  addDetails,
  removeDetails,
  setActivityCode,
  saveReceipt,
  setActiveSection,
}) {
  const { classes } = useStyles();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clasificationFilter, setClasificationFilter] = React.useState("");
  const idTypeItems = idTypeList.map((item) => {
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
  const handleIdTypeChange = (value) => {
    setIssuerDetails("typeId", value);
    setIssuerDetails("id", "");
    setIssuerDetails("name", "");
  };
  const handleClasificationClick = () => {
    setDialogOpen(true);
    setClasificationFilter("");
    filterClasificationList("");
  };
  const handleClasificationFilterChange = (event) => {
    setClasificationFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      filterClasificationList(event.target.value);
    }, 1000);
  };
  const handleClasificationRowClick = (code) => {
    if (code !== "") {
      const codeEntity = clasificationList.find((elm) => elm.Id === code);
      const taxRateId = codeEntity
        ? taxTypeList.find((elm) => elm.Valor === codeEntity.Impuesto).Id
        : undefined;
      setProductDetails("code", code);
      if (taxRateId) setProductDetails("taxTypeId", taxRateId);
    }
    setDialogOpen(false);
  };
  let idPlaceholder = "";
  let idMaxLength = 0;
  switch (issuer.typeId) {
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
  const rows = clasificationList.map((row) => ({
    id: row.Id,
    taxRate: row.Impuesto,
    description: row.Descripcion,
  }));
  const columns = [
    { field: "id", headerName: "Código", hidden: true },
    { field: "taxRate", headerName: "IVA", type: "number" },
    { field: "description", headerName: "Descripcion" },
  ];
  const addDisabled =
    product.code.length < 13 ||
    product.description === "" ||
    product.unit === "" ||
    product.quantity === "" ||
    product.price === "" ||
    product.price === 0;
  const activityItems = company.ActividadEconomicaEmpresa.map((item) => {
    return (
      <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Seleccione el tipo de Identificación
            </InputLabel>
            <Select
              disabled={successful}
              id="IdTipoIdentificacion"
              value={issuer.typeId}
              onChange={(event) => handleIdTypeChange(event.target.value)}
            >
              {idTypeItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            placeholder={idPlaceholder}
            inputProps={{ maxLength: idMaxLength }}
            required
            value={issuer.id}
            label="Identificación"
            onChange={(event) => validateCustomerIdentifier(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.name}
            label="Nombre"
            onChange={(event) => setIssuerDetails("name", event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.comercialName}
            label="Nombre comercial"
            onChange={(event) =>
              setIssuerDetails("comercialName", event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.address}
            label="Dirección"
            onChange={(event) =>
              setIssuerDetails("address", event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.phone}
            label="Teléfono"
            onChange={(event) => setIssuerDetails("phone", event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.email}
            label="Correo electrónico"
            onChange={(event) => setIssuerDetails("email", event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Seleccione el tipo de exoneración
            </InputLabel>
            <Select
              disabled={successful}
              id="IdTipoExoneracion"
              value={exoneration.type}
              onChange={(event) =>
                setExonerationDetails("type", event.target.value)
              }
            >
              {exonerationTypesItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            id="NumDocExoneracion"
            label="Documento de exoneración"
            value={exoneration.ref}
            onChange={(event) =>
              setExonerationDetails("ref", event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            id="NombreInstExoneracion"
            label="Nombre de institución"
            value={exoneration.exoneratedBy}
            onChange={(event) =>
              setExonerationDetails("exoneratedBy", event.target.value)
            }
          />
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={5} sm={3}>
            <DatePicker
              disabled={successful}
              label="Fecha exoneración"
              format="dd/MM/yyyy"
              value={exoneration.date}
              onChange={(date) => setExonerationDetails("date", date)}
              animateYearScrolling
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            id="PorcentajeExoneracion"
            value={exoneration.percentage}
            label="Porcentaje de exoneración"
            numericFormat
            onChange={(event) =>
              setExonerationDetails("percentage", event.target.value)
            }
          />
        </Grid>
        <Grid style={{ textAlign: "center" }} item xs={12}>
          <InputLabel className={classes.summaryTitle}>
            DETALLE DE FACTURA
          </InputLabel>
        </Grid>
        <Grid item xs={10} sm={4}>
          <TextField
            disabled={successful}
            label="Código CABYS"
            id="Codigo"
            inputProps={{ maxLength: 13 }}
            value={product.code}
            onChange={(event) => validateProductCode(event.target.value)}
          />
        </Grid>
        <Grid item sm={1}>
          <IconButton
            className={classes.icon}
            aria-label="upload picture"
            component="span"
            onClick={handleClasificationClick}
          >
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={7}>
          <LabelField
            id="TasaIva"
            value={
              taxTypeList.find((elm) => elm.Id === product.taxTypeId)
                .Descripcion
            }
            label="Tasa del IVA"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            label="Descripción"
            id="Descripcion"
            value={product.description}
            onChange={(event) =>
              setProductDetails("description", event.target.value)
            }
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            disabled={successful}
            label="Unidad"
            id="Unidad"
            value={product.unit}
            onChange={(event) => setProductDetails("unit", event.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            disabled={successful}
            label="Cantidad"
            id="Cantidad"
            numericFormat
            value={product.quantity}
            onChange={(event) =>
              setProductDetails("quantity", event.target.value)
            }
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled={successful}
            label="Precio"
            numericFormat
            value={product.price}
            onChange={(event) => setProductDetails("price", event.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            disabled={addDisabled}
            className={classes.outerButton}
            color="primary"
            component="span"
            onClick={() => addDetails()}
          >
            <AddCircleIcon />
          </IconButton>
        </Grid>
        <div className={classes.bottom}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right"> - </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productDetailList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.Codigo}</TableCell>
                  <TableCell>{row.Descripcion}</TableCell>
                  <TableCell align="right">{row.Cantidad}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(
                      roundNumber(row.Cantidad * row.PrecioVenta, 2),
                      2
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      disabled={successful}
                      className={classes.innerButton}
                      color="secondary"
                      component="span"
                      onClick={() => removeDetails(row.IdProducto)}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            disabled={summary.total === 0 || successful}
            label="Guardar"
            onClick={() => saveReceipt()}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button label="Regresar" onClick={() => setActiveSection(0)} />
        </Grid>
      </Grid>
      <Dialog
        id="clasification-dialog"
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
      >
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
                minWidth={722}
                dense
                columns={columns}
                rows={rows}
                rowsPerPage={10}
                rowsCount={Math.min(100, rows.length)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            negative
            label="Cerrar"
            onClick={() => setDialogOpen(false)}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    idTypeList: state.ui.idTypeList,
    clasificationList: state.product.clasificationList,
    issuer: state.receipt.issuer,
    exonerationTypeList: state.ui.exonerationTypeList,
    company: state.company.company,
    exoneration: state.receipt.exoneration,
    product: state.receipt.product,
    taxTypeList: state.ui.taxTypeList,
    productDetailList: state.receipt.productDetailList,
    activityCode: state.receipt.activityCode,
    summary: state.receipt.summary,
    successful: state.receipt.successful,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setIssuerDetails,
      validateCustomerIdentifier,
      validateProductCode,
      setExonerationDetails,
      setProductDetails,
      filterClasificationList,
      addDetails,
      removeDetails,
      setActivityCode,
      saveReceipt,
      setActiveSection,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptPage);

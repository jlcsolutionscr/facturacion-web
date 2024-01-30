import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Button from "components/button";
import DataGrid from "components/data-grid";
import DatePicker from "components/data-picker";
import LabelField from "components/label-field";
import Select from "components/select";
import TextField, { TextFieldOnChangeEventType } from "components/text-field";
import { filterClasificationList } from "state/product/asyncActions";
import { getClasificationList } from "state/product/reducer";
import {
  addDetails,
  removeDetails,
  saveReceipt,
  validateCustomerIdentifier,
  validateProductCode,
} from "state/receipt/asyncActions";
import {
  getActivityCode,
  getExonerationDetails,
  getIssuerDetails,
  getProductDetails,
  getProductDetailsList,
  getSuccessful,
  getSummary,
  setActivityCode,
  setExonerationDetails,
  setIssuerDetails,
  setProductDetails,
} from "state/receipt/reducer";
import { getCompany } from "state/session/reducer";
import { getExonerationTypeList, getIdTypeList, getTaxTypeList, setActiveSection } from "state/ui/reducer";
import { AddCircleIcon, RemoveCircleIcon, SearchIcon } from "utils/iconsHelper";
import { formatCurrency, getIdFromRateValue, parseStringToNumber, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxWidth: "900px",
    margin: "15px auto",
    "@media screen and (max-width:959px)": {
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      margin: "0",
    },
    "@media screen and (max-width:429px)": {
      margin: "0",
    },
  },
  container: {
    padding: "20px",
    "@media screen and (max-width:959px)": {
      padding: "15px",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "5px",
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

let delayTimer: ReturnType<typeof setTimeout> | null = null;

export default function ReceiptPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [clasificationFilter, setClasificationFilter] = useState("");

  const idTypeList = useSelector(getIdTypeList);
  const issuer = useSelector(getIssuerDetails);
  const exonerationTypeList = useSelector(getExonerationTypeList);
  const clasificationList = useSelector(getClasificationList);
  const exoneration = useSelector(getExonerationDetails);
  const taxTypeList = useSelector(getTaxTypeList);
  const company = useSelector(getCompany);
  const productDetail = useSelector(getProductDetails);
  const productDetailsList = useSelector(getProductDetailsList);
  const summary = useSelector(getSummary);
  const activityCode = useSelector(getActivityCode);
  const successful = useSelector(getSuccessful);

  const handleIdTypeChange = (value: string) => {
    dispatch(setIssuerDetails({ attribute: "typeId", value: parseInt(value) }));
    dispatch(setIssuerDetails({ attribute: "id", value: "" }));
    dispatch(setIssuerDetails({ attribute: "name", value: "" }));
  };

  const handleClasificationClick = () => {
    setDialogOpen(true);
    setClasificationFilter("");
    dispatch(filterClasificationList({ filterText: "" }));
  };

  const handleClasificationFilterChange = (event: TextFieldOnChangeEventType) => {
    setClasificationFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(filterClasificationList({ filterText: event.target.value }));
    }, 1000);
  };

  const handleClasificationRowClick = (id: string) => {
    if (id !== "") {
      const codeEntity = clasificationList.find(elm => elm.Id === parseInt(id));
      const taxRateId = codeEntity ? getIdFromRateValue(taxTypeList, codeEntity.Impuesto) : undefined;
      dispatch(setProductDetails({ attribute: "code", value: id }));
      if (taxRateId) dispatch(setProductDetails({ attribute: "taxTypeId", value: taxRateId }));
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

  const idTypeItems = idTypeList.map(item => {
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

  const activityItems = company
    ? company.ActividadEconomicaEmpresa.map(item => {
        return (
          <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
            {item.Descripcion}
          </MenuItem>
        );
      })
    : [];

  const addDisabled =
    productDetail.code.length < 13 ||
    productDetail.description === "" ||
    productDetail.unit === "" ||
    productDetail.quantity === 0 ||
    productDetail.price === 0;

  const saveDisabled =
    summary.total === 0 ||
    successful ||
    issuer.id === "" ||
    issuer.name === "" ||
    issuer.address === "" ||
    issuer.phone === "" ||
    issuer.email === "";

  return (
    <div className={classes.root}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12} sm={6}>
          <Select
            style={{ width: "100%" }}
            id="codigo-actividad-select-id"
            label="Seleccione la Actividad Económica"
            value={activityCode.toString()}
            onChange={event => dispatch(setActivityCode(event.target.value))}
          >
            {activityItems}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            style={{ width: "100%" }}
            disabled={successful}
            id="id-tipo-identificacion-select-id"
            label="Seleccione el tipo de Identificación"
            value={issuer.typeId.toString()}
            onChange={event => handleIdTypeChange(event.target.value)}
          >
            {idTypeItems}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            disabled={successful}
            placeholder={idPlaceholder}
            inputProps={{ maxLength: idMaxLength }}
            required
            value={issuer.id}
            label="Identificación"
            onChange={event => dispatch(validateCustomerIdentifier({ identifier: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.name}
            label="Nombre"
            onChange={event => dispatch(setIssuerDetails({ attribute: "name", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            disabled={successful}
            value={issuer.comercialName}
            label="Nombre comercial"
            onChange={event => dispatch(setIssuerDetails({ attribute: "comercialName", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.address}
            label="Dirección"
            onChange={event => dispatch(setIssuerDetails({ attribute: "address", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.phone}
            label="Teléfono"
            onChange={event => dispatch(setIssuerDetails({ attribute: "phone", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            disabled={successful}
            required
            value={issuer.email}
            label="Correo electrónico"
            onChange={event => dispatch(setIssuerDetails({ attribute: "email", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            style={{ width: "100%" }}
            disabled={successful}
            id="id-tipo-exoneracion-select-id"
            label="Seleccione el tipo de exoneración"
            value={exoneration.type.toString()}
            onChange={event => dispatch(setExonerationDetails({ attribute: "type", value: event.target.value }))}
          >
            {exonerationTypesItems}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            disabled={successful}
            id="NumDocExoneracion"
            label="Documento de exoneración"
            value={exoneration.ref}
            onChange={event => dispatch(setExonerationDetails({ attribute: "ref", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            id="NombreInstExoneracion"
            label="Nombre de institución"
            value={exoneration.exoneratedBy}
            onChange={event =>
              dispatch(setExonerationDetails({ attribute: "exoneratedBy", value: event.target.value }))
            }
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <DatePicker
            disabled={successful}
            label="Fecha exoneración"
            value={exoneration.date}
            onChange={date => dispatch(setExonerationDetails({ attribute: "date", value: date }))}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <TextField
            disabled={successful}
            id="PorcentajeExoneracion"
            value={exoneration.percentage.toString()}
            label="Porcentaje de exoneración"
            numericFormat
            onChange={event => dispatch(setExonerationDetails({ attribute: "percentage", value: event.target.value }))}
          />
        </Grid>
        <Grid style={{ textAlign: "center" }} item xs={12}>
          <InputLabel>DETALLE DE FACTURA</InputLabel>
        </Grid>
        <Grid item xs={6} sm={6}>
          <TextField
            disabled={successful}
            label="Código CABYS"
            id="Codigo"
            inputProps={{ maxLength: 13 }}
            value={productDetail.code}
            onChange={event => dispatch(validateProductCode({ code: event.target.value }))}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            className={classes.icon}
            aria-label="upload picture"
            component="span"
            onClick={handleClasificationClick}
          >
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item xs={4}>
          <LabelField id="TasaIva" value={productDetail.taxRate.toString()} label="Tasa del IVA" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={successful}
            label="Descripción"
            id="Descripcion"
            value={productDetail.description}
            onChange={event => dispatch(setProductDetails({ attribute: "description", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            disabled={successful}
            label="Unidad"
            id="Unidad"
            value={productDetail.unit}
            onChange={event => dispatch(setProductDetails({ attribute: "unit", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            disabled={successful}
            label="Cantidad"
            id="Cantidad"
            numericFormat
            value={productDetail.quantity.toString()}
            onChange={event =>
              dispatch(setProductDetails({ attribute: "quantity", value: parseStringToNumber(event.target.value) }))
            }
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled={successful}
            label="Precio"
            numericFormat
            value={productDetail.price.toString()}
            onChange={event =>
              dispatch(setProductDetails({ attribute: "price", value: parseStringToNumber(event.target.value) }))
            }
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            disabled={addDisabled}
            className={classes.outerButton}
            color="primary"
            component="span"
            onClick={() => dispatch(addDetails())}
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
              {productDetailsList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(roundNumber(row.quantity * row.pricePlusTaxes, 2), 2)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      disabled={successful}
                      className={classes.innerButton}
                      color="secondary"
                      component="span"
                      onClick={() => dispatch(removeDetails({ id: row.id }))}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Grid item xs={12} display="flex" gap={2} flexDirection="row">
          <Button disabled={saveDisabled} label="Guardar" onClick={() => dispatch(saveReceipt())} />
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
        </Grid>
      </Grid>
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
        <DialogActions>
          <Button negative label="Cerrar" onClick={() => setDialogOpen(false)} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

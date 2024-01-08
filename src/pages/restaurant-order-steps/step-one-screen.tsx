import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";

import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";

import LabelField from "components/label-field";
import TextField from "components/text-field";
import ListDropdown from "components/list-dropdown";
import Button from "components/button";
import Select from "components/select";
import { AddCircleIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, roundNumber } from "utils/utilities";

import { setActiveSection } from "state/ui/actions";
import { setCustomerAttribute } from "state/customer/asyncActions";
import { filterProductList } from "state/product/asyncActions";
import {
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  addDetails,
  removeDetails,
  setStatus,
  saveWorkingOrder,
} from "state/working-order/asyncActions";

const useStyles = makeStyles()((theme) => ({
  root: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  switch: {
    color: theme.palette.text.primary,
  },
  bottom: {
    margin: "0",
    display: "flex",
    overflow: "hidden",
  },
  buttonContainer: {
    display: "flex",
    margin: "10px 0 0 20px",
    width: "100%",
    height: "50px",
    "@media screen and (max-width:960px)": {
      margin: "10px 0 0 15px",
    },
    "@media screen and (max-width:600px)": {
      margin: "10px 0 0 10px",
    },
    "@media screen and (max-width:414px)": {
      margin: "10px 0 0 5px",
    },
  },
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

function StepOneScreen({
  index,
  value,
  permissions,
  workingOrderId,
  customerName,
  product,
  description,
  quantity,
  price,
  status,
  productList,
  productDetailsList,
  summary,
  servicePointList,
  setCustomerAttribute,
  setStatus,
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  filterProductList,
  addDetails,
  removeDetails,
  saveWorkingOrder,
}) {
  const { classes } = useStyles();
  const myRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);
  const [filter, setFilter] = React.useState("");
  const [serviceIncluded, setServiceIncluded] = React.useState(false);
  const handleCustomerNameChange = (event) => {
    setCustomerAttribute("Nombre", event.target.value);
    setStatus("on-progress");
  };
  const handleOnFilterChange = (event) => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      filterProductList(event.target.value, 2);
    }, 1000);
  };
  const handleItemSelected = (item: IdDescriptionType) => {
    getProduct({ id: item.Id });
    setFilter("");
  };
  const handlePriceChange = (event) => {
    const isPriceChangeEnabled =
      permissions.filter((role) => [52].includes(role.IdRole)).length > 0;
    isPriceChangeEnabled && setPrice(event.target.value);
  };
  const buttonEnabled =
    product !== null &&
    description !== "" &&
    quantity !== null &&
    price !== null;
  const paymentItems = servicePointList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  const display = value !== index ? "none" : "flex";
  return (
    <div ref={myRef} className={classes.root} style={{ display: display }}>
      <div className={classes.container}>
        <div>
          <Grid container spacing={2}>
            {workingOrderId === 0 && (
              <Grid item xs={12} className={classes.centered}>
                <Select
                  id="punto-servicio-select-id"
                  label="Seleccione el punto de servicio:"
                  value={customerName}
                  onChange={handleCustomerNameChange}
                >
                  {paymentItems}
                </Select>
              </Grid>
            )}
            {workingOrderId > 0 && (
              <Grid item xs={12} md={6}>
                <LabelField label="Punto de servicio" value={customerName} />
              </Grid>
            )}
            <Grid item xs={12}>
              <ListDropdown
                label="Seleccione un producto"
                items={productList}
                value={filter}
                onItemSelected={handleItemSelected}
                onChange={handleOnFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                id="Descripcion"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Cantidad"
                id="Cantidad"
                value={quantity}
                numericFormat
                onChange={(event) => setQuantity(event.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Precio"
                value={price}
                numericFormat
                onChange={handlePriceChange}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                className={classes.outerButton}
                color="primary"
                disabled={!buttonEnabled}
                component="span"
                onClick={() => addDetails()}
              >
                <AddCircleIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                classes={{ root: classes.switch }}
                control={
                  <Switch
                    checked={serviceIncluded}
                    onChange={() => setServiceIncluded(!serviceIncluded)}
                    name="servIncluded"
                  />
                }
                label="Incluir Imp Serv"
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.bottom}>
          <Grid container spacing={2} style={{ overflowY: "auto" }}>
            <Grid item xs={12}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right"> - </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDetailsList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="right">{row.Cantidad}</TableCell>
                      <TableCell>{`${row.Codigo} - ${row.Descripcion}`}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          roundNumber(row.Cantidad * row.PrecioVenta, 2),
                          2
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          className={classes.innerButton}
                          color="secondary"
                          component="span"
                          onClick={() => removeDetails(row.IdProducto, index)}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            disabled={status !== "on-progress" || summary.total === 0}
            label={workingOrderId > 0 ? "Actualizar" : "Agregar"}
            onClick={() => saveWorkingOrder()}
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    permissions: state.session.permissions,
    customerName: state.customer.customer.Nombre,
    servicePointList: state.workingOrder.servicePointList,
    workingOrderId: state.workingOrder.workingOrderId,
    description: state.workingOrder.description,
    quantity: state.workingOrder.quantity,
    product: state.product.product,
    price: state.workingOrder.price,
    productList: state.product.list,
    productDetailsList: state.workingOrder.productDetailsList,
    summary: state.workingOrder.summary,
    status: state.workingOrder.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setCustomerAttribute,
      setStatus,
      getProduct,
      setDescription,
      setQuantity,
      setPrice,
      filterProductList,
      addDetails,
      removeDetails,
      saveWorkingOrder,
      setActiveSection,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(StepOneScreen);

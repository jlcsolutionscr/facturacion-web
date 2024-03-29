import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";

import LabelField from "components/label-field";
import TextField from "components/text-field";
import ListDropdown from "components/list-dropdown";
import Button from "components/button";
import { AddCircleIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, roundNumber } from "utils/utilities";

import { setActiveSection } from "store/ui/actions";
import { setCustomerAttribute } from "store/customer/actions";
import { filterProductList } from "store/product/actions";
import {
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  addDetails,
  removeDetails,
  setStatus,
  saveWorkingOrder,
} from "store/working-order/actions";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.background.pages,
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
    "@media (max-width:960px)": {
      margin: "10px 0 0 15px",
    },
    "@media (max-width:600px)": {
      margin: "10px 0 0 10px",
    },
    "@media (max-width:414px)": {
      margin: "10px 0 0 5px",
    },
  },
}));

let delayTimer = null;

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
  detailsList,
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
  const classes = useStyles();
  const myRef = React.useRef(null);
  React.useEffect(() => {
    myRef.current.scrollTo(0, 0);
  }, [value]);
  const [filter, setFilter] = React.useState("");
  const [serviceIncluded, setServiceIncluded] = React.useState(false);
  const handleCustomerNameChange = event => {
    setCustomerAttribute("Nombre", event.target.value);
    setStatus("on-progress");
  };
  const handleOnFilterChange = event => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      filterProductList(event.target.value, 2);
    }, 1000);
  };
  const handleItemSelected = item => {
    getProduct(item.Id, 2);
    setFilter("");
  };
  const handlePriceChange = event => {
    const isPriceChangeEnabled = permissions.filter(role => [52].includes(role.IdRole)).length > 0;
    isPriceChangeEnabled && setPrice(event.target.value);
  };
  const buttonEnabled = product !== null && description !== "" && quantity !== null && price !== null;
  const paymentItems = servicePointList.map(item => {
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
                <FormControl style={{ width: "250px", textAlign: "left" }}>
                  <InputLabel id="demo-simple-select-label">Seleccione el punto de servicio:</InputLabel>
                  <Select id="punto-servicio-id" value={customerName} onChange={handleCustomerNameChange}>
                    {paymentItems}
                  </Select>
                </FormControl>
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
                onChange={event => setDescription(event.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Cantidad"
                id="Cantidad"
                value={quantity}
                numericFormat
                onChange={event => setQuantity(event.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Precio" value={price} numericFormat onChange={handlePriceChange} />
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
                  {detailsList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="right">{row.Cantidad}</TableCell>
                      <TableCell>{`${row.Codigo} - ${row.Descripcion}`}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(roundNumber(row.Cantidad * row.PrecioVenta, 2), 2)}
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

const mapStateToProps = state => {
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
    detailsList: state.workingOrder.detailsList,
    summary: state.workingOrder.summary,
    status: state.workingOrder.status,
  };
};

const mapDispatchToProps = dispatch => {
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

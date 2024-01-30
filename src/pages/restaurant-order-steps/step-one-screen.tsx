import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { IdDescriptionType } from "types/domain";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Button from "components/button";
import LabelField from "components/label-field";
import ListDropdown, { ListDropdownOnChangeEventType } from "components/list-dropdown";
import Select from "components/select";
import TextField, { TextFieldOnChangeEventType } from "components/text-field";
import { filterProductList, getProductListByPageNumber } from "state/product/asyncActions";
import { getProductList, getProductListCount, getProductListPage } from "state/product/reducer";
import { getPermissions } from "state/session/reducer";
import { addDetails, getProduct, removeDetails, saveWorkingOrder } from "state/working-order/asyncActions";
import {
  getCustomerDetails,
  getProductDetails,
  getProductDetailsList,
  getServicePointList,
  getStatus,
  getSummary,
  getWorkingOrderId,
  setCustomerDetails,
  setDescription,
  setPrice,
  setQuantity,
  setStatus,
} from "state/working-order/reducer";
import { ROWS_PER_PRODUCT } from "utils/constants";
import { AddCircleIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  root: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    padding: "20px",
    "@media screen and (max-width:960px)": {
      padding: "15px",
    },
    "@media screen and (max-width:600px)": {
      padding: "10px",
    },
    "@media screen and (max-width:430px)": {
      padding: "5px",
    },
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
    "@media screen and (max-width:430px)": {
      margin: "10px 0 0 5px",
    },
  },
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

interface StepOneScreenProps {
  index: number;
  value: number;
}

export default function StepOneScreen({ index, value }: StepOneScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [filter, setFilter] = React.useState("");
  const [serviceIncluded, setServiceIncluded] = React.useState(false);
  const myRef = React.useRef<HTMLDivElement>(null);

  const permissions = useSelector(getPermissions);
  const customerDetails = useSelector(getCustomerDetails);
  const servicePointList = useSelector(getServicePointList);
  const workingOrderId = useSelector(getWorkingOrderId);
  const productDetails = useSelector(getProductDetails);
  const productList = useSelector(getProductList);
  const productListPage = useSelector(getProductListPage);
  const productListCount = useSelector(getProductListCount);
  const productDetailsList = useSelector(getProductDetailsList);
  const summary = useSelector(getSummary);
  const status = useSelector(getStatus);

  React.useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

  const handleCustomerNameChange = (event: TextFieldOnChangeEventType) => {
    dispatch(setCustomerDetails({ attribute: "name", value: event.target.value }));
    dispatch(setStatus("on-progress"));
  };

  const handleOnFilterChange = (event: ListDropdownOnChangeEventType) => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(filterProductList({ filterText: event.target.value, type: 2, rowsPerPage: ROWS_PER_PRODUCT }));
    }, 1000);
  };

  const handleItemSelected = (item: IdDescriptionType) => {
    dispatch(getProduct({ id: item.Id, filterType: 2 }));
    setFilter("");
  };

  const handlePriceChange = (event: TextFieldOnChangeEventType) => {
    const isPriceChangeEnabled = permissions.filter(role => [52].includes(role.IdRole)).length > 0;
    isPriceChangeEnabled && setPrice(event.target.value);
  };

  const paymentItems = servicePointList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });

  const buttonEnabled = productDetails.description !== "" && productDetails.quantity > 0 && productDetails.price > 0;
  const display = value !== index ? "none" : "flex";

  return (
    <div ref={myRef} className={classes.root} style={{ display: display }}>
      <div className={classes.container}>
        <div>
          <Grid container spacing={2}>
            {workingOrderId === 0 && (
              <Grid item xs={12}>
                <Select
                  id="punto-servicio-select-id"
                  label="Seleccione el punto de servicio:"
                  value={customerDetails.name}
                  onChange={handleCustomerNameChange}
                >
                  {paymentItems}
                </Select>
              </Grid>
            )}
            {workingOrderId > 0 && (
              <Grid item xs={12} md={6}>
                <LabelField label="Punto de servicio" value={customerDetails.name} />
              </Grid>
            )}
            <Grid item xs={12}>
              <ListDropdown
                disabled={false}
                label="Seleccione un producto"
                page={productListPage - 1}
                rowsCount={productListCount}
                rows={productList}
                value={filter}
                rowsPerPage={ROWS_PER_PRODUCT}
                onItemSelected={handleItemSelected}
                onChange={handleOnFilterChange}
                onPageChange={pageNumber =>
                  dispatch(
                    getProductListByPageNumber({
                      pageNumber: pageNumber + 1,
                      filterText: filter,
                      type: 2,
                      rowsPerPage: ROWS_PER_PRODUCT,
                    })
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                id="Descripcion"
                value={productDetails.description}
                onChange={event => dispatch(setDescription(event.target.value))}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Cantidad"
                id="Cantidad"
                value={productDetails.quantity.toString()}
                numericFormat
                onChange={event => dispatch(setQuantity(event.target.value))}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Precio"
                value={productDetails.price.toString()}
                numericFormat
                onChange={handlePriceChange}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                color="primary"
                disabled={!buttonEnabled}
                component="span"
                onClick={() => dispatch(addDetails())}
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
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell>{`${row.code} - ${row.description}`}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(roundNumber(row.quantity * row.pricePlusTaxes, 2), 2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="secondary"
                          component="span"
                          onClick={() => dispatch(removeDetails({ id: row.id, pos: index }))}
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
            onClick={() => dispatch(saveWorkingOrder())}
          />
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { IdDescriptionType } from "types/domain";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import ListDropdown, { ListDropdownOnChangeEventType } from "components/list-dropdown";
import TextField, { TextFieldOnChangeEventType } from "components/text-field";
import { addDetails, getProduct, removeDetails } from "state/invoice/asyncActions";
import {
  getProductDetails,
  getProductDetailsList,
  getSuccessful,
  setDescription,
  setPrice,
  setQuantity,
} from "state/invoice/reducer";
import { filterProductList, getProductListByPageNumber } from "state/product/asyncActions";
import { getProductList, getProductListCount, getProductListPage } from "state/product/reducer";
import { getPermissions } from "state/session/reducer";
import { ROWS_PER_PRODUCT } from "utils/constants";
import { AddCircleIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, parseStringToNumber, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
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
  formControl: {
    minWidth: "150px",
    width: "fit-content",
  },
  bottom: {
    margin: "10px 0 10px 0",
    display: "flex",
    overflow: "hidden",
  },
  outerButton: {
    padding: "8px",
  },
  innerButton: {
    padding: "0px",
  },
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

interface StepTwoScreenProps {
  index: number;
  value: number;
}

export default function StepTwoScreen({ index, value }: StepTwoScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [filterType, setFilterType] = React.useState(2);
  const [filter, setFilter] = React.useState("");
  const myRef = React.useRef<HTMLDivElement>(null);

  const permissions = useSelector(getPermissions);
  const productListPage = useSelector(getProductListPage);
  const productListCount = useSelector(getProductListCount);
  const productDetails = useSelector(getProductDetails);
  const productList = useSelector(getProductList);
  const productDetailsList = useSelector(getProductDetailsList);
  const successful = useSelector(getSuccessful);

  React.useEffect(() => {
    if (value === 1) myRef.current?.scrollTo(0, 0);
  }, [value]);

  const handleOnFilterChange = (event: ListDropdownOnChangeEventType) => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(filterProductList({ filterText: event.target.value, type: filterType, rowsPerPage: ROWS_PER_PRODUCT }));
    }, 1000);
  };

  const handleItemSelected = (item: IdDescriptionType) => {
    dispatch(getProduct({ id: item.Id }));
    setFilter("");
  };

  const handleFilterTypeChange = () => {
    const newFilterType = filterType === 1 ? 2 : 1;
    setFilterType(newFilterType);
    setFilter("");
    dispatch(filterProductList({ filterText: "", type: newFilterType, rowsPerPage: ROWS_PER_PRODUCT }));
  };

  const handlePriceChange = (event: TextFieldOnChangeEventType) => {
    isPriceChangeEnabled && dispatch(setPrice(parseStringToNumber(event.target.value)));
  };

  const isPriceChangeEnabled = permissions.filter(role => [1, 52].includes(role.IdRole)).length > 0;
  const products = productList.map(item => ({
    ...item,
    Descripcion: filterType === 1 ? `${item.Codigo} - ${item.Descripcion}` : item.Descripcion,
  }));
  const buttonEnabled =
    productDetails.description !== "" &&
    productDetails.quantity > 0 &&
    productDetails.price > 0 &&
    successful === false;
  const display = value !== index ? "none" : "flex";

  return (
    <div ref={myRef} className={classes.root} style={{ display: display }}>
      <div className={classes.container}>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={10} sm={10.5} md={11}>
              <ListDropdown
                disabled={successful}
                label="Seleccione un producto"
                page={productListPage - 1}
                rowsCount={productListCount}
                rows={products}
                value={filter}
                rowsPerPage={ROWS_PER_PRODUCT}
                onItemSelected={handleItemSelected}
                onChange={handleOnFilterChange}
                onPageChange={pageNumber =>
                  dispatch(
                    getProductListByPageNumber({
                      pageNumber: pageNumber + 1,
                      filterText: filter,
                      type: filterType,
                      rowsPerPage: ROWS_PER_PRODUCT,
                    })
                  )
                }
              />
            </Grid>
            <Grid item xs={2} sm={1.5} md={1}>
              <Switch value={filterType === 1} onChange={handleFilterTypeChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={successful}
                label="Descripción"
                id="Descripcion"
                value={productDetails.description}
                onChange={event => dispatch(setDescription(event.target.value))}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                disabled={successful}
                label="Cantidad"
                id="Cantidad"
                value={productDetails.quantity.toString()}
                numericFormat
                onChange={event => dispatch(setQuantity(parseStringToNumber(event.target.value)))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled={successful}
                label="Precio"
                value={productDetails.price.toString()}
                numericFormat
                onChange={handlePriceChange}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                className={classes.outerButton}
                color="primary"
                disabled={!buttonEnabled}
                component="span"
                onClick={() => dispatch(addDetails())}
              >
                <AddCircleIcon />
              </IconButton>
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
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{`${row.code} - ${row.description}`}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(roundNumber(row.quantity * row.pricePlusTaxes, 2), 2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
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
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

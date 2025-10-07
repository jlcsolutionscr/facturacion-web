import { ListDropDown, TextField, type ListDropdownOnChangeEventType } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { CodeDescriptionType, IdDescriptionType, PermissionType, ProductDetailsType } from "types/domain";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { filterProductList, getProductListByPageNumber } from "state/product/asyncActions";
import { ROWS_PER_PRODUCT, TRANSITION_ANIMATION } from "utils/constants";
import { AddCircleIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, parseStringToNumber, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  container: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    padding: "20px",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      padding: "15px",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "10px 5px 5px 5px",
    },
  },
  body: {
    display: "flex",
    flexDirection: "column",
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
  permissions: PermissionType[];
  productListPage: number;
  productListCount: number;
  productList: CodeDescriptionType[];
  productDetails: ProductDetailsType;
  productDetailsList: ProductDetailsType[];
  stepDisabled: boolean;
  getProductDetails: (id: number) => void;
  addDetails: () => void;
  removeDetails: (id: string, pos: number) => void;
  setProductDetails: (attribute: string, value: number | string) => void;
  className?: string;
}

export default function StepTwoScreen({
  index,
  value,
  permissions,
  productListPage,
  productListCount,
  productList,
  productDetails,
  productDetailsList,
  stepDisabled,
  getProductDetails,
  addDetails,
  removeDetails,
  setProductDetails,
  className,
}: StepTwoScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [filterType, setFilterType] = useState(2);
  const [filter, setFilter] = useState("");
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    getProductDetails(item.Id);
    setFilter("");
  };

  const handleFilterTypeChange = () => {
    const newFilterType = filterType === 1 ? 2 : 1;
    setFilterType(newFilterType);
    setFilter("");
    dispatch(filterProductList({ filterText: "", type: newFilterType, rowsPerPage: ROWS_PER_PRODUCT }));
  };

  const isDescriptionChangeEnabled = permissions.filter(role => [1, 50].includes(role.IdRole)).length > 0;
  const isPriceChangeEnabled = permissions.filter(role => [1, 52].includes(role.IdRole)).length > 0;
  const products = productList.map(item => ({
    ...item,
    Descripcion: filterType === 1 ? `${item.Codigo} - ${item.Descripcion}` : item.Descripcion,
  }));
  const buttonEnabled =
    productDetails.id !== "" &&
    productDetails.description !== "" &&
    productDetails.quantity > 0 &&
    productDetails.price > 0 &&
    stepDisabled === false;
  const display = value !== index ? "none" : "flex";

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} style={{ display: display }}>
      <div className={classes.body}>
        <Grid container spacing={2}>
          <Grid item xs={10} sm={10.5} md={11}>
            <ListDropDown
              disabled={stepDisabled}
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
              disabled={stepDisabled || !isDescriptionChangeEnabled}
              label="Descripción"
              id="Descripcion"
              value={productDetails.description}
              onChange={event => setProductDetails("description", event.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled={stepDisabled}
              label="Cantidad"
              id="Cantidad"
              value={productDetails.quantity.toString()}
              numericFormat
              onChange={event => setProductDetails("quantity", parseStringToNumber(event.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled={stepDisabled || !isPriceChangeEnabled}
              label="Precio"
              value={productDetails.price.toString()}
              numericFormat
              onChange={event => setProductDetails("price", parseStringToNumber(event.target.value))}
            />
          </Grid>
          <Grid item xs={2}>
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
        </Grid>
        <div className={classes.bottom}>
          <Grid container style={{ overflowY: "auto" }}>
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
                          onClick={() => removeDetails(row.id, index)}
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

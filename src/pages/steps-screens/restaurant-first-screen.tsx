import {
  ListDropDown,
  TextField,
  type ListDropdownOnChangeEventType,
  type TextFieldOnChangeEventType,
} from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { IdDescriptionType } from "types/domain";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import {
  filterProductList,
  getProductDetails as getProductDetailsAction,
  getProductListByPageNumber,
} from "state/product/asyncActions";
import { getProductList, getProductListCount, getProductListPage } from "state/product/reducer";
import { getPermissions } from "state/session/reducer";
import { addDetails } from "state/working-order/asyncActions";
import { getProductDetails, setDescription, setPrice, setQuantity } from "state/working-order/reducer";
import { FORM_TYPE, ROWS_PER_PRODUCT, TRANSITION_ANIMATION } from "utils/constants";
import { AddCircleIcon } from "utils/iconsHelper";
import { parseStringToNumber } from "utils/utilities";

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
      padding: "10 5px 5px 5px",
    },
  },
  body: {
    display: "flex",
    flexDirection: "column",
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
    "@media screen and (max-width:959px)": {
      margin: "10px 0 0 15px",
    },
    "@media screen and (max-width:599px)": {
      margin: "10px 0 0 10px",
    },
    "@media screen and (max-width:429px)": {
      margin: "10px 0 0 5px",
    },
  },
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

interface StepOneScreenProps {
  index: number;
  value: number;
  className?: string;
}

export default function StepOneScreen({ index, value, className }: StepOneScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState("");
  const myRef = useRef<HTMLDivElement>(null);

  const permissions = useSelector(getPermissions);
  const productDetails = useSelector(getProductDetails);
  const productList = useSelector(getProductList);
  const productListPage = useSelector(getProductListPage);
  const productListCount = useSelector(getProductListCount);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

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
    dispatch(getProductDetailsAction({ id: item.Id, type: FORM_TYPE.ORDER }));
    setFilter("");
  };

  const handlePriceChange = (event: TextFieldOnChangeEventType) => {
    const isPriceChangeEnabled = permissions.filter(role => [52].includes(role.IdRole)).length > 0;
    isPriceChangeEnabled && setPrice(parseStringToNumber(event.target.value));
  };

  const buttonEnabled = productDetails.description !== "" && productDetails.quantity > 0 && productDetails.price > 0;
  const display = value !== index ? "none" : "flex";

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} style={{ display: display }}>
      <div className={classes.body}>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ListDropDown
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
            <Grid item xs={2}>
              <TextField
                label="Cantidad"
                id="Cantidad"
                value={productDetails.quantity.toString()}
                numericFormat
                onChange={event => dispatch(setQuantity(parseStringToNumber(event.target.value)))}
              />
            </Grid>
            <Grid item xs={4} md={3}>
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
          </Grid>
        </div>
      </div>
    </div>
  );
}

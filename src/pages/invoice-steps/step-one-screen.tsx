import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { IdDescriptionType } from "types/domain";
import Grid from "@mui/material/Grid";

import LabelField from "components/label-field";
import ListDropdown, { ListDropdownOnChangeEventType } from "components/list-dropdown";
import TextField from "components/text-field";
import { filterCustomerList, getCustomerListByPageNumber } from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { getCustomerDetails as getCustomerDetailsAction } from "state/invoice/asyncActions";
import { getCustomerDetails, getSuccessful, setCustomerAttribute } from "state/invoice/reducer";
import { ROWS_PER_CUSTOMER } from "utils/constants";
import { convertToDateString } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  container: {
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
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

interface StepOneScreenProps {
  index: number;
  value: number;
}

export default function StepOneScreen({ index, value }: StepOneScreenProps) {
  const { classes } = useStyles();
  const myRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const customer = useSelector(getCustomerDetails);
  const customerListCount = useSelector(getCustomerListCount);
  const customerListPage = useSelector(getCustomerListPage);
  const customerList = useSelector(getCustomerList);
  const successful = useSelector(getSuccessful);

  React.useEffect(() => {
    if (value === 0) myRef.current?.scrollTo(0, 0);
  }, [value]);

  const [filterText, setFilterText] = React.useState("");

  const handleOnFilterChange = (event: ListDropdownOnChangeEventType) => {
    setFilterText(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(filterCustomerList({ filterText: event.target.value, rowsPerPage: ROWS_PER_CUSTOMER }));
    }, 1000);
  };

  const handleOnPageChange = (pageNumber: number) => {
    dispatch(getCustomerListByPageNumber({ pageNumber: pageNumber + 1, filterText, rowsPerPage: ROWS_PER_CUSTOMER }));
  };

  const handleItemSelected = (item: IdDescriptionType) => {
    dispatch(getCustomerDetailsAction({ id: item.Id }));
    setFilterText("");
  };

  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ListDropdown
            disabled={successful}
            label="Seleccione un cliente"
            page={customerListPage - 1}
            rowsCount={customerListCount}
            rows={customerList}
            value={filterText}
            rowsPerPage={ROWS_PER_CUSTOMER}
            onItemSelected={handleItemSelected}
            onChange={handleOnFilterChange}
            onPageChange={handleOnPageChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            disabled={customer.id !== 1}
            value={customer.name}
            label="Nombre del cliente"
            onChange={event =>
              dispatch(
                setCustomerAttribute({
                  attribute: "name",
                  value: event.target.value,
                })
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Nombre comercial" value={customer ? customer.comercialName : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Correo electrónico" value={customer ? customer.email : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Tasa de Impuesto" value={customer ? `${customer.taxRate.toString()}%` : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Tipo de exoneración" value={customer ? customer.exonerationType.toString() : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Código del documento" value={customer ? customer.exonerationRef : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Nombre de la institución" value={customer ? customer.exoneratedBy : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Fecha de emisión" value={convertToDateString(customer.exonerationDate)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField
            label="Porcentaje de exoneración"
            value={customer ? customer.exonerationPercentage.toString() : ""}
          />
        </Grid>
      </Grid>
    </div>
  );
}

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import LabelField from "components/label-field";
import TextField from "components/text-field";
import ListDropdown from "components/list-dropdown";

import { convertToDateString } from "utils/utilities";
import { ROWS_PER_CUSTOMER } from "utils/constants";

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.background.pages,
  },
}));

let delayTimer = null;

export default function StepOneScreen({
  index,
  value,
  customer,
  customerListCount,
  customerListPage,
  customerList,
  customerListDisabled,
  customerNameEditDisabled,
  filterCustomerList,
  getCustomerListByPageNumber,
  getCustomer,
  handleCustomerNameChange,
}) {
  const classes = useStyles();
  const myRef = React.useRef(null);
  React.useEffect(() => {
    if (value === 0) myRef.current.scrollTo(0, 0);
  }, [value]);

  const [filter, setFilter] = React.useState("");

  const handleOnFilterChange = event => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      filterCustomerList(event.target.value);
    }, 1000);
  };

  const handleOnPageChange = pageNumber => {
    getCustomerListByPageNumber(pageNumber + 1, filter);
  };

  const handleItemSelected = item => {
    getCustomer(item.Id);
    setFilter("");
  };

  return (
    <div ref={myRef} className={classes.container} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ListDropdown
            disabled={customerListDisabled}
            label="Seleccione un cliente"
            page={customerListPage - 1}
            rowsCount={customerListCount}
            rows={customerList}
            value={filter}
            rowsPerPage={ROWS_PER_CUSTOMER}
            onItemSelected={handleItemSelected}
            onChange={handleOnFilterChange}
            onPageChange={handleOnPageChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            disabled={customerNameEditDisabled}
            value={customer?.Nombre ?? ""}
            label="Nombre del cliente"
            onChange={event => handleCustomerNameChange(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField label="Nombre comercial" value={customer?.NombreComercial ?? ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField label="Correo electrónico" value={customer?.CorreoElectronico ?? ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField label="Tipo de exoneración" value={customer?.IdTipoExoneracion ?? ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField label="Código del documento" value={customer?.NumDocExoneracion ?? ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField label="Nombre de la institución" value={customer?.NombreInstExoneracion ?? ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Fecha de emisión"
            value={customer?.FechaEmisionDoc ? convertToDateString(customer.FechaEmisionDoc) : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField label="Porcentaje de exoneración" value={customer?.PorcentajeExoneracion ?? ""} />
        </Grid>
      </Grid>
    </div>
  );
}

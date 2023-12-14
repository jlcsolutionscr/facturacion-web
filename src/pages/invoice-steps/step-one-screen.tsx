import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

import LabelField from "components/label-field";
import TextField from "components/text-field";
import ListDropdown from "components/list-dropdown";
import {
  getCustomer,
  setCustomerAttribute,
  filterCustomerList,
  getCustomerListByPageNumber,
} from "state/customer/asyncActions";
import { convertToDateString } from "utils/utilities";
import { ROWS_PER_CUSTOMER } from "utils/constants";

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.background.pages,
  },
}));

let delayTimer = null;

function StepOneScreen({
  index,
  value,
  customer,
  customerListCount,
  customerListPage,
  customerList,
  successful,
  filterCustomerList,
  getCustomerListByPageNumber,
  getCustomer,
  setCustomerAttribute,
}) {
  const classes = useStyles();
  const myRef = React.useRef(null);
  React.useEffect(() => {
    if (value === 0) myRef.current.scrollTo(0, 0);
  }, [value]);

  const [filter, setFilter] = React.useState("");

  const handleOnFilterChange = (event) => {
    setFilter(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      filterCustomerList(event.target.value);
    }, 1000);
  };

  const handleOnPageChange = (pageNumber) => {
    getCustomerListByPageNumber(pageNumber + 1, filter);
  };

  const handleItemSelected = (item) => {
    getCustomer(item.Id);
    setFilter("");
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
            disabled={customer.IdCliente !== 1}
            value={customer.Nombre}
            label="Nombre del cliente"
            onChange={(event) =>
              setCustomerAttribute("Nombre", event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Nombre comercial"
            value={customer ? customer.NombreComercial : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Correo electrónico"
            value={customer ? customer.CorreoElectronico : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Tipo de exoneración"
            value={customer ? customer.IdTipoExoneracion : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Código del documento"
            value={customer ? customer.NumDocExoneracion : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Nombre de la institución"
            value={customer ? customer.NombreInstExoneracion : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Fecha de emisión"
            value={
              customer ? convertToDateString(customer.FechaEmisionDoc) : ""
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabelField
            label="Porcentaje de exoneración"
            value={customer ? customer.PorcentajeExoneracion : ""}
          />
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    customer: state.customer.customer,
    customerListCount: state.customer.listCount,
    customerListPage: state.customer.listPage,
    customerList: state.customer.list,
    successful: state.invoice.successful,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCustomer,
      setCustomerAttribute,
      filterCustomerList,
      getCustomerListByPageNumber,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StepOneScreen);

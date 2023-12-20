import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

import LabelField from "components/label-field";
import TextField from "components/text-field";
import ListDropdown from "components/list-dropdown";
import {
  getCustomer as getCustomerAction,
  filterCustomerList,
  getCustomerListByPageNumber,
} from "state/customer/asyncActions";
import {
  getCustomer,
  getCustomerList,
  getCustomerListCount,
  getCustomerListPage,
  setCustomerAttribute,
} from "state/customer/reducer";
import { convertToDateString } from "utils/utilities";
import { ROWS_PER_CUSTOMER } from "utils/constants";
import { getSuccessful } from "state/invoice/reducer";
import { IdDescriptionType } from "types/domain";

const useStyles = makeStyles()((theme) => ({
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.custom.pagesBackground,
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

  const customer = useSelector(getCustomer);
  const customerListCount = useSelector(getCustomerListCount);
  const customerListPage = useSelector(getCustomerListPage);
  const customerList = useSelector(getCustomerList);
  const successful = useSelector(getSuccessful);

  React.useEffect(() => {
    if (value === 0) myRef.current?.scrollTo(0, 0);
  }, [value]);

  const [filterText, setFilterText] = React.useState("");

  const handleOnFilterChange = (event: { target: { value: string } }) => {
    setFilterText(event.target.value);
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    delayTimer = setTimeout(() => {
      dispatch(filterCustomerList({ filterText: event.target.value }));
    }, 1000);
  };

  const handleOnPageChange = (pageNumber: number) => {
    dispatch(
      getCustomerListByPageNumber({ pageNumber: pageNumber + 1, filterText })
    );
  };

  const handleItemSelected = (item: IdDescriptionType) => {
    dispatch(getCustomerAction({ id: item.Id }));
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
        <Grid item xs={12} md={6}>
          <TextField
            required
            disabled={customer.IdCliente !== 1}
            value={customer.Nombre}
            label="Nombre del cliente"
            onChange={(event) =>
              dispatch(
                setCustomerAttribute({
                  attribute: "Nombre",
                  value: event.target.value,
                })
              )
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
            value={customer ? customer.IdTipoExoneracion.toString() : ""}
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
            value={customer ? customer.PorcentajeExoneracion.toString() : ""}
          />
        </Grid>
      </Grid>
    </div>
  );
}

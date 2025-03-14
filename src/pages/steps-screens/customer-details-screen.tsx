import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { CustomerDetailsType, IdDescriptionType } from "types/domain";
import Grid from "@mui/material/Grid";

import LabelField from "components/label-field";
import ListDropdown, { ListDropdownOnChangeEventType } from "components/list-dropdown";
import TextField from "components/text-field";
import { filterCustomerList, getCustomerListByPageNumber } from "state/customer/asyncActions";
import { getExonerationNameList, getExonerationTypeList } from "state/ui/reducer";
import { ROWS_PER_CUSTOMER } from "utils/constants";
import { convertToDateString } from "utils/utilities";

const useStyles = makeStyles()(() => ({
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
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
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

interface StepOneScreenProps {
  index: number;
  value: number;
  customer: CustomerDetailsType;
  customerListCount: number;
  customerListPage: number;
  customerList: IdDescriptionType[];
  listDisabled: boolean;
  getCustomerDetails: (id: number) => void;
  setCustomerName: (value: string) => void;
  className?: string;
}

export default function StepOneScreen({
  index,
  value,
  customer,
  customerListCount,
  customerListPage,
  customerList,
  listDisabled,
  getCustomerDetails,
  setCustomerName,
  className,
}: StepOneScreenProps) {
  const { classes } = useStyles();
  const myRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const exonerationTypeList = useSelector(getExonerationTypeList);
  const exonerationNameList = useSelector(getExonerationNameList);

  useEffect(() => {
    if (value === 0) myRef.current?.scrollTo(0, 0);
  }, [value]);

  const [filterText, setFilterText] = useState("");

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
    getCustomerDetails(item.Id);
    setFilterText("");
  };

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ListDropdown
            disabled={listDisabled}
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
            readOnly={customer.id !== 1}
            value={customer.name}
            label="Nombre del cliente"
            onChange={event => setCustomerName(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Nombre comercial" value={customer ? customer.comercialName : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Correo electrónico" value={customer ? customer.email : ""} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField
            label="Tipo de exoneración"
            value={
              customer
                ? exonerationTypeList.filter(item => item.Id === customer.exonerationType)[0]?.Descripcion ??
                  "Tipo no encontrado"
                : ""
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField
            label="Nombre de la institución"
            value={
              customer
                ? exonerationNameList.filter(item => item.Id === customer.exoneratedById)[0]?.Descripcion ??
                  "Institución no encontrada"
                : ""
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelField label="Código del documento" value={customer ? customer.exonerationRef : ""} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <LabelField label="Artículo" value={customer ? customer.exonerationRef2 : ""} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <LabelField label="Inciso" value={customer ? customer.exonerationRef3 : ""} />
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

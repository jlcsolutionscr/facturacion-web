import { Button, ListDropDown, ListDropdownOnChangeEventType, Select, TextField } from "jlc-component-library";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IdDescriptionType } from "types/domain";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import { DialogStatus, DialogType } from "pages/restaurant/order-summary";
import {
  filterCustomerList,
  getCustomerDetails as getCustomerDetailsAction,
  getCustomerListByPageNumber,
} from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { generateInvoiceTicket } from "state/invoice/asyncActions";
import { getCompany } from "state/session/reducer";
import { generateInvoice } from "state/working-order/asyncActions";
import {
  getActivityCode,
  getCustomerDetails,
  getInvoiceId,
  getPaymentDetailsList,
  setActivityCode,
  setCustomerAttribute,
  setPaymentDetailsList,
} from "state/working-order/reducer";
import { FORM_TYPE, ORDER_STATUS, ROWS_PER_CUSTOMER } from "utils/constants";
import { formatCurrency } from "utils/utilities";

const paymentMethods: { id: number; description: string }[] = [
  { id: 1, description: "EFECTIVO" },
  { id: 2, description: "TARJETA" },
  { id: 4, description: "TRANSFERENCIA" },
];

let delayTimer: ReturnType<typeof setTimeout> | null = null;

type PaymentDialogProps = {
  summary: {
    taxed: number;
    exonerated: number;
    exempt: number;
    subTotal: number;
    taxes: number;
    total: number;
  };
  status: string;
  setDialogStatus: (value: DialogStatus) => void;
  classes: any;
};

export default function PaymentDialog({ summary, status, setDialogStatus, classes }: PaymentDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>(summary.total.toString());
  const [filterText, setFilterText] = useState("");

  const dispatch = useDispatch();

  const customerDetails = useSelector(getCustomerDetails);
  const paymentDetails = useSelector(getPaymentDetailsList);
  const invoiceId = useSelector(getInvoiceId);
  const activityCode = useSelector(getActivityCode);
  const company = useSelector(getCompany);
  const customerListCount = useSelector(getCustomerListCount);
  const customerListPage = useSelector(getCustomerListPage);
  const customerList = useSelector(getCustomerList);

  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;

  const customerEditDisabled = status === ORDER_STATUS.CONVERTED;

  const activityItems = company
    ? company.ActividadEconomicaEmpresa.map(item => (
        <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
          {item.Descripcion}
        </MenuItem>
      ))
    : [];

  const paymentItems = paymentMethods.map(item => (
    <MenuItem key={item.id} value={item.id}>
      {item.description}
    </MenuItem>
  ));

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
    dispatch(getCustomerDetailsAction({ id: item.Id, type: FORM_TYPE.ORDER }));
    setFilterText("");
  };

  const handleCustomerNameChange = (value: string) => {
    dispatch(setCustomerAttribute({ attribute: "name", value }));
  };

  return (
    <>
      <DialogContent>
        <Grid container xs={12} spacing={1.5}>
          <Grid xs={12}>
            <ListDropDown
              disabled={customerEditDisabled}
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
          <Grid xs={12}>
            <TextField
              required
              readOnly={customerEditDisabled || customerDetails.id !== 1}
              value={customerDetails.name}
              label="Nombre del cliente"
              onChange={event => handleCustomerNameChange(event.target.value)}
            />
          </Grid>
          {activityItems.length > 1 && (
            <Grid xs={12} sm={7} md={6} justifyContent="center">
              <Select
                id="codigo-actividad-select-id"
                label="Seleccione la Actividad Económica"
                value={activityCode.toString()}
                onChange={event => setActivityCode(event.target.value)}
              >
                {activityItems}
              </Select>
            </Grid>
          )}
          <Grid container xs={12}>
            <Grid container xs={12} sm={6}>
              <Grid container>
                <Grid xs={12}>
                  <Typography className={classes.summaryTitle}>RESUMEN</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography className={classes.summaryRow}>Gravado</Typography>
                </Grid>
                <Grid xs={6} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>{formatCurrency(taxed)}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography className={classes.summaryRow}>Exonerado</Typography>
                </Grid>
                <Grid xs={6} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>{formatCurrency(exonerated)}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography className={classes.summaryRow}>Excento</Typography>
                </Grid>
                <Grid xs={6} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>{formatCurrency(exempt)}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography className={classes.summaryRow}>SubTotal</Typography>
                </Grid>
                <Grid xs={6} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>{formatCurrency(subTotal)}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography className={classes.summaryRow}>Impuesto</Typography>
                </Grid>
                <Grid xs={6} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>{formatCurrency(taxes)}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography className={classes.summaryRow}>Total</Typography>
                </Grid>
                <Grid xs={6} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>{formatCurrency(total)}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container xs={12} sm={6} justifyContent="center">
              <Grid xs={7} sm={12}>
                <Select
                  id="forma-pago-select-id"
                  label="Seleccione la forma de pago:"
                  value={paymentDetails[0] ? paymentDetails[0].paymentId.toString() : ""}
                  onChange={event =>
                    dispatch(
                      setPaymentDetailsList([
                        {
                          paymentId: event.target.value,
                          description:
                            paymentMethods.find(method => method.id === parseInt(event.target.value))?.description ??
                            "NO ESPECIFICADO",
                          amount: total,
                        },
                      ])
                    )
                  }
                >
                  {paymentItems}
                </Select>
              </Grid>
              <Grid xs={5} sm={12}>
                <TextField
                  numericFormat
                  value={paymentAmount}
                  label="Monto de pago:"
                  onChange={event => setPaymentAmount(event.target.value)}
                />
              </Grid>
              <Grid xs={12} textAlign="center">
                <Typography
                  style={{ fontWeight: "bold", fontSize: 22 }}
                >{`Cambio: ${formatCurrency(parseFloat(paymentAmount) - total)}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px", justifyContent: "center" }}>
        {status === ORDER_STATUS.READY ? (
          <Button label="Facturar" autoFocus onClick={() => dispatch(generateInvoice())} />
        ) : (
          <Grid xs="auto">
            <Button label="Imprimir Factura" onClick={() => dispatch(generateInvoiceTicket({ id: invoiceId }))} />
          </Grid>
        )}
        <Button
          negative
          label="Cerrar"
          onClick={() => setDialogStatus({ status: false, id: 0, type: DialogType.PAYMENT })}
        />
      </DialogActions>
    </>
  );
}

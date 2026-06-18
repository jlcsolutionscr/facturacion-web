import { Button, ListDropDown, ListDropdownOnChangeEventType, Select, TextField } from "jlc-component-library";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { IdDescriptionType, PaymentInfoType, PaymentMethodType, WorkingOrderProductDetailsType } from "types/domain";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import { DialogStatus, DialogType } from "./order-summary";
import { filterCustomerList, getCustomerListByPageNumber } from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { generateInvoiceTicket } from "state/invoice/asyncActions";
import { getCompany } from "state/session/reducer";
import { resetPaymentInfo } from "state/working-order/reducer";
import { formatCurrency, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  summaryTitle: {
    marginTop: "0",
    fontWeight: "700",
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  columnRight: {
    textAlign: "right",
  },
  summaryRow: {
    color: theme.palette.text.primary,
    lineHeight: "normal",
  },
}));

const ROWS_PER_CUSTOMER = 8;

let delayTimer: ReturnType<typeof setTimeout> | null = null;

type PaymentDialogProps = {
  invoiceId: number;
  orderId: number;
  paymentInfo: PaymentInfoType;
  summaryProductDetailsList: WorkingOrderProductDetailsType[];
  splitPayment: boolean;
  getCustomerDetails: (customerId: number) => void;
  setCustomerAttribute: (attribute: { attribute: string; value: string }) => void;
  setActivityCode: (value: string) => void;
  setPaymentMethodList: (list: PaymentMethodType[]) => void;
  setCashAmount: (value: string) => void;
  generateInvoice: () => void;
  setDialogStatus: (value: DialogStatus) => void;
  setSplitPayment: (value: boolean) => void;
  handleClose: () => void;
  setSummaryProductList?: (payload: { inSummary: boolean; index?: number }) => void;
};

export default function PaymentDialog({
  invoiceId,
  orderId,
  paymentInfo,
  summaryProductDetailsList,
  splitPayment,
  getCustomerDetails,
  setCustomerAttribute,
  setActivityCode,
  setPaymentMethodList,
  setCashAmount,
  generateInvoice,
  setDialogStatus,
  setSplitPayment,
  handleClose,
  setSummaryProductList,
}: PaymentDialogProps) {
  const { classes } = useStyles();
  const [filterText, setFilterText] = useState("");
  const [cashPayment, setCashPayment] = useState<string>(paymentInfo.summary.total.toString());
  const [cardPayment, setCardPayment] = useState("0");
  const [transferPayment, setTransferPayment] = useState("0");

  const dispatch = useDispatch();

  const company = useSelector(getCompany);
  const customerListCount = useSelector(getCustomerListCount);
  const customerListPage = useSelector(getCustomerListPage);
  const customerList = useSelector(getCustomerList);

  useEffect(() => {
    setCashPayment(paymentInfo.summary.total.toString());
    setCardPayment("0");
    setTransferPayment("0");
  }, [paymentInfo.summary.total]);

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

  const handleCustomerNameChange = (value: string) => {
    setCustomerAttribute({ attribute: "name", value });
  };

  const { taxed, exonerated, exempt, subTotal, taxes, total, cashAmount } = paymentInfo.summary;

  const customerEditDisabled = invoiceId > 0;

  const activityItems = company
    ? company.ActividadEconomicaEmpresa.map(item => (
        <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
          {item.Descripcion}
        </MenuItem>
      ))
    : [];

  const handlePaymentOptionChange = (type: string, value: string) => {
    const floatValue = value === "" ? 0 : parseFloat(value);
    if (type === "CASH") {
      setCashPayment(value);
      setCardPayment((total - floatValue).toString());
      setTransferPayment("0");
    } else if (type === "CARD") {
      setCardPayment(value);
      setTransferPayment((total - parseFloat(cashPayment) - floatValue).toString());
    } else {
      if (floatValue === 0) setCashPayment(total.toString());
      setTransferPayment(value);
    }
  };

  const handleSbumitButtonClick = () => {
    const paymentList = [];
    if (cashPayment !== "0") {
      paymentList.push({
        paymentId: 1,
        description: "EFECTIVO",
        amount: parseFloat(cashPayment),
      });
    }
    if (cardPayment !== "0") {
      paymentList.push({
        paymentId: 2,
        description: "TARJETA",
        amount: parseFloat(cardPayment),
      });
    }
    if (transferPayment !== "0") {
      paymentList.push({
        paymentId: 4,
        description: "TRANSFERENCIA",
        amount: parseFloat(transferPayment),
      });
    }
    setPaymentMethodList(paymentList);
    generateInvoice();
  };

  return (
    <>
      <DialogContent>
        <Grid container display="flex" gap={2}>
          {splitPayment && (
            <Grid container xs={6.5}>
              <Grid xs={12} height="320px" overflow="hidden auto">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right" width="20px">
                        {" - "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryProductDetailsList.map((row, index) => (
                      <TableRow style={{ display: row.paid ? "none" : "table-row" }} key={row.id}>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{`${row.code} - ${row.description}`}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(roundNumber(parseFloat(row.quantity) * parseFloat(row.price), 2), 2)}
                        </TableCell>
                        <TableCell align="right" width="20px">
                          <Checkbox
                            style={{ padding: 0 }}
                            disabled={invoiceId > 0}
                            checked={row.inSummary}
                            onChange={() =>
                              setSummaryProductList &&
                              setSummaryProductList({ inSummary: !row.inSummary, index: index })
                            }
                            name="cierreRetiroEfectivo"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}
          <Grid container xs={splitPayment ? 5 : 12} spacing={1.5}>
            <Grid xs={12}>
              <ListDropDown
                disabled={customerEditDisabled || invoiceId > 0}
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
                readOnly={customerEditDisabled || paymentInfo.customerDetails.id !== 1}
                value={paymentInfo.customerDetails.name}
                label="Nombre del cliente"
                onChange={event => handleCustomerNameChange(event.target.value)}
              />
            </Grid>
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
              <Grid container xs={12} sm={6} justifyContent="center" alignItems="center">
                {company?.RegimenSimplificado && (
                  <>
                    {activityItems.length > 1 && (
                      <Grid xs={12} sm={7} md={6} justifyContent="center">
                        <Select
                          disabled={invoiceId > 0}
                          id="codigo-actividad-select-id"
                          label="Seleccione la Actividad Económica"
                          value={paymentInfo.activityCode.toString()}
                          onChange={event => setActivityCode(event.target.value)}
                        >
                          {activityItems}
                        </Select>
                      </Grid>
                    )}
                  </>
                )}
                <Grid xs={5} textAlign="center">
                  <Typography>Efectivo:</Typography>
                </Grid>
                <Grid xs={7}>
                  <TextField
                    readOnly={invoiceId > 0}
                    numericFormat
                    value={cashPayment}
                    label="Monto en efectivo:"
                    onBlur={() => cashPayment === "" && setCashPayment("0")}
                    onChange={event => handlePaymentOptionChange("CASH", event.target.value)}
                  />
                </Grid>
                <Grid xs={5} textAlign="center">
                  <Typography>Tarjeta:</Typography>
                </Grid>
                <Grid xs={7}>
                  <TextField
                    readOnly={invoiceId > 0}
                    numericFormat
                    value={cardPayment}
                    label="Monto en tarjeta:"
                    onBlur={() => cardPayment === "" && setCardPayment("0")}
                    onChange={event => handlePaymentOptionChange("CARD", event.target.value)}
                  />
                </Grid>
                <Grid xs={5} textAlign="center">
                  <Typography>Transferencia:</Typography>
                </Grid>
                <Grid xs={7}>
                  <TextField
                    readOnly={invoiceId > 0}
                    numericFormat
                    value={transferPayment}
                    label="Monto en transferencia:"
                    onBlur={() => transferPayment === "" && setTransferPayment("0")}
                    onChange={event => handlePaymentOptionChange("BANK", event.target.value)}
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    readOnly={invoiceId > 0}
                    numericFormat
                    value={cashAmount.toString()}
                    label="Monto de pago:"
                    onChange={event => dispatch(setCashAmount(event.target.value))}
                  />
                </Grid>
                <Grid xs={12} textAlign="center">
                  <Typography
                    style={{ fontWeight: "bold", fontSize: 22 }}
                  >{`Cambio: ${cashAmount.toString() !== "" ? formatCurrency(cashAmount - total) : "0.00"}`}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px", justifyContent: "center" }}>
        {invoiceId === 0 ? (
          <Button
            disabled={total !== parseFloat(cashPayment) + parseFloat(cardPayment) + parseFloat(transferPayment)}
            label="Facturar"
            autoFocus
            onClick={handleSbumitButtonClick}
          />
        ) : (
          <Grid xs="auto">
            <Button label="Imprimir Factura" onClick={() => dispatch(generateInvoiceTicket({ id: invoiceId }))} />
          </Grid>
        )}
        {orderId > 0 && !splitPayment && setSummaryProductList && paymentInfo.totalPaid !== paymentInfo.totalSaved && (
          <Button
            label="Dividir"
            autoFocus
            onClick={() => {
              setSplitPayment(true);
              setSummaryProductList({ inSummary: false });
            }}
          />
        )}
        {orderId > 0 && invoiceId > 0 && splitPayment && paymentInfo.totalPaid < paymentInfo.totalSaved && (
          <Button label="Nueva Factura" autoFocus onClick={() => dispatch(resetPaymentInfo())} />
        )}
        <Button
          negative
          label="Cerrar"
          onClick={() => {
            if (invoiceId > 0) {
              handleClose();
            } else {
              setSplitPayment(false);
              setSummaryProductList && setSummaryProductList({ inSummary: true });
              setDialogStatus({ status: false, id: 0, type: DialogType.PAYMENT });
            }
          }}
        />
      </DialogActions>
    </>
  );
}

import { Button, ListDropDown, ListDropdownOnChangeEventType, Select, TextField } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { IdDescriptionType } from "types/domain";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {
  filterCustomerList,
  getCustomerDetails as getCustomerDetailsAction,
  getCustomerListByPageNumber,
} from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { generateInvoiceTicket } from "state/invoice/asyncActions";
import { getCompany } from "state/session/reducer";
import { generateInvoice, removeDetails, revokeWorkingOrder, saveWorkingOrder } from "state/working-order/asyncActions";
import {
  getActivityCode,
  getCustomerDetails,
  getInvoiceId,
  getPaymentDetailsList,
  getProductDetailsList,
  getStatus,
  getSummary,
  getWorkingOrderId,
  setActivityCode,
  setCustomerAttribute,
  setPaymentDetailsList,
} from "state/working-order/reducer";
import { FORM_TYPE, ORDER_STATUS, ROWS_PER_CUSTOMER, TRANSITION_ANIMATION } from "utils/constants";
import { EditIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, roundNumber } from "utils/utilities";

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
  summary: {
    flexDirection: "column",
    maxWidth: "300px",
    textAlign: "center",
  },
  details: {
    marginTop: "0",
    textAlign: "left",
    " & .MuiGrid-item": {
      paddingTop: "8px",
    },
  },
  summaryTitle: {
    marginTop: "0",
    fontWeight: "700",
    color: theme.palette.text.primary,
  },
  columnRight: {
    textAlign: "right",
  },
  summaryRow: {
    color: theme.palette.text.primary,
  },
  centered: {
    display: "flex",
    margin: "auto",
    justifyContent: "center",
  },
  dialogActions: {
    margin: "0 20px 10px 20px",
  },
}));

let delayTimer: ReturnType<typeof setTimeout> | null = null;

interface RestaurantFinalScreenProps {
  index: number;
  value: number;
  className?: string;
}

export default function RestaurantFinalScreen({ value, index, className }: RestaurantFinalScreenProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const { classes } = useStyles();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);

  const customerListCount = useSelector(getCustomerListCount);
  const customerListPage = useSelector(getCustomerListPage);
  const customerList = useSelector(getCustomerList);

  const summary = useSelector(getSummary);
  const workingOrderId = useSelector(getWorkingOrderId);
  const invoiceId = useSelector(getInvoiceId);
  const company = useSelector(getCompany);
  const activityCode = useSelector(getActivityCode);
  const customerDetails = useSelector(getCustomerDetails);
  const paymentDetails = useSelector(getPaymentDetailsList);
  const productDetailsList = useSelector(getProductDetailsList);
  const status = useSelector(getStatus);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

  const paymentMethods: { id: number; description: string }[] = [
    { id: 1, description: "EFECTIVO" },
    { id: 2, description: "TARJETA" },
    { id: 3, description: "CHEQUE" },
    { id: 4, description: "TRANSFERENCIA" },
  ];

  const paymentItems = paymentMethods.map(item => (
    <MenuItem key={item.id} value={item.id}>
      {item.description}
    </MenuItem>
  ));

  const activityItems = company
    ? company.ActividadEconomicaEmpresa.map(item => (
        <MenuItem key={item.CodigoActividad} value={item.CodigoActividad}>
          {item.Descripcion}
        </MenuItem>
      ))
    : [];

  const { taxed, exonerated, exempt, subTotal, taxes, total } = summary;
  const buttonDisabled = total === 0;

  const customerEditDisabled = status === ORDER_STATUS.CONVERTED;

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

  const handleRevokeButtonClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmButtonClick = () => {
    setDialogOpen(false);
    dispatch(revokeWorkingOrder({ id: workingOrderId }));
  };

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <TextField
            required
            readOnly={customerEditDisabled || customerDetails.id !== 1}
            value={customerDetails.name}
            label="Nombre del cliente"
            onChange={event => handleCustomerNameChange(event.target.value)}
          />
        </Grid>
        {activityItems.length > 1 && (
          <Grid item xs={12} className={classes.centered}>
            <Grid item xs={12} sm={7} md={6}>
              <Select
                id="codigo-actividad-select-id"
                label="Seleccione la Actividad Económica"
                value={activityCode.toString()}
                onChange={event => setActivityCode(event.target.value)}
              >
                {activityItems}
              </Select>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} textAlign="center">
          <InputLabel className={classes.summaryTitle}>DETALLE DE LA ORDEN</InputLabel>
        </Grid>
        <Grid container item>
          {productDetailsList.map((row, index) => {
            return (
              <Grid key={row.id} container item>
                <Grid item xs={9}>
                  <Typography overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                    {row.description}
                  </Typography>
                </Grid>
                <Grid item xs={3} textAlign="end">
                  <Typography>{formatCurrency(roundNumber(row.quantity * row.pricePlusTaxes, 2), 2)}</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography>{`${row.quantity} Und x ${formatCurrency(row.pricePlusTaxes, 2)}`}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    style={{ padding: 0 }}
                    color="primary"
                    component="span"
                    onClick={() => dispatch(removeDetails({ id: row.id, pos: index }))}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={1} textAlign="end">
                  <IconButton
                    style={{ padding: 0 }}
                    color="secondary"
                    component="span"
                    onClick={() => dispatch(removeDetails({ id: row.id, pos: index }))}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={11} sm={6} md={5} className={`${classes.summary} ${classes.centered}`}>
            <InputLabel className={classes.summaryTitle}>RESUMEN ORDEN DE SERVICIO</InputLabel>
            <Grid container className={classes.details}>
              <Grid item xs={6}>
                <InputLabel className={classes.summaryRow}>Gravado</InputLabel>
              </Grid>
              <Grid item xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(taxed)}</InputLabel>
              </Grid>
              <Grid item xs={6}>
                <InputLabel className={classes.summaryRow}>Exonerado</InputLabel>
              </Grid>
              <Grid item xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(exonerated)}</InputLabel>
              </Grid>
              <Grid item xs={6}>
                <InputLabel className={classes.summaryRow}>Excento</InputLabel>
              </Grid>
              <Grid item xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(exempt)}</InputLabel>
              </Grid>
              <Grid item xs={6}>
                <InputLabel className={classes.summaryRow}>SubTotal</InputLabel>
              </Grid>
              <Grid item xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(subTotal)}</InputLabel>
              </Grid>
              <Grid item xs={6}>
                <InputLabel className={classes.summaryRow}>Impuesto</InputLabel>
              </Grid>
              <Grid item xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(taxes)}</InputLabel>
              </Grid>
              <Grid item xs={6}>
                <InputLabel className={classes.summaryRow}>Total</InputLabel>
              </Grid>
              <Grid item xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(total)}</InputLabel>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {status === ORDER_STATUS.READY && (
          <>
            <Grid item xs={10} sm={6} md={4} className={classes.centered}>
              <Select
                id="forma-pago-select-id"
                label="Seleccione la forma de pago:"
                value={paymentDetails[0] ? paymentDetails[0].paymentId.toString() : ""}
                disabled={buttonDisabled}
                onChange={event =>
                  setPaymentDetailsList([
                    {
                      paymentId: event.target.value,
                      description:
                        paymentMethods.find(method => method.id === parseInt(event.target.value))?.description ??
                        "NO ESPECIFICADO",
                      amount: total,
                    },
                  ])
                }
              >
                {paymentItems}
              </Select>
            </Grid>
            <Grid item xs={12} className={classes.centered}>
              {status === ORDER_STATUS.READY && total > 0 && (
                <Button label="Facturar" onClick={() => dispatch(generateInvoice())} />
              )}
            </Grid>
          </>
        )}
        {status === ORDER_STATUS.ON_PROGRESS && (
          <Grid item container gap={2} justifyContent="center">
            <Grid item>
              <Button
                disabled={buttonDisabled}
                label={workingOrderId > 0 ? "Actualizar" : "Agregar"}
                onClick={() => dispatch(saveWorkingOrder())}
              />
            </Grid>
          </Grid>
        )}
        {workingOrderId > 0 && status !== ORDER_STATUS.CONVERTED && (
          <Grid item container gap={2} justifyContent="center">
            <Grid item>
              <Button label="Anular" onClick={handleRevokeButtonClick} />
            </Grid>
          </Grid>
        )}
        {status === ORDER_STATUS.CONVERTED && (
          <Grid item xs={12} className={classes.centered}>
            <Button label="Imprimir Factura" onClick={() => dispatch(generateInvoiceTicket({ id: invoiceId }))} />
          </Grid>
        )}
      </Grid>
      <Dialog id="revoke-dialog" onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogTitle>Anular orden de servicio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la orden para la ${workingOrderId}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button negative label="Cerrar" onClick={() => setDialogOpen(false)} />
          <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

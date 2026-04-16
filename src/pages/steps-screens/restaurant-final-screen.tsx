import {
  Button,
  LabelField,
  ListDropDown,
  ListDropdownOnChangeEventType,
  Select,
  TextField,
} from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { IdDescriptionType } from "types/domain";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import {
  filterCustomerList,
  getCustomerDetails as getCustomerDetailsAction,
  getCustomerListByPageNumber,
} from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { generateInvoiceTicket } from "state/invoice/asyncActions";
import { getCompany, getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import {
  generateInvoice,
  removeDetails,
  revokeWorkingOrder,
  saveWorkingOrder,
  updateDetails,
} from "state/working-order/asyncActions";
import {
  getActivityCode,
  getCustomerDetails,
  getInvoiceId,
  getPaymentDetailsList,
  getProductDetails,
  getProductDetailsList,
  getStatus,
  getSummary,
  getWorkingOrderId,
  resetWorkingOrder,
  setActivityCode,
  setCustomerAttribute,
  setPaymentDetailsList,
  setPrice,
  setProductDetails,
  setQuantity,
} from "state/working-order/reducer";
import { FORM_TYPE, ORDER_STATUS, ROWS_PER_CUSTOMER } from "utils/constants";
import { EditIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { formatCurrency, parseStringToNumber, roundNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
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
  isSplitMode: boolean;
  value?: number;
}

enum dialogType {
  CLEAR = "CLEAR",
  REVOKE = "REVOKE",
  UPDATE = "UPDATE",
}

export default function RestaurantFinalScreen({ isSplitMode, value }: RestaurantFinalScreenProps) {
  const [dialogStatus, setDialogStatus] = useState({ status: false, id: 0, type: dialogType.CLEAR });
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
  const productDetails = useSelector(getProductDetails);
  const paymentDetails = useSelector(getPaymentDetailsList);
  const productDetailsList = useSelector(getProductDetailsList);
  const status = useSelector(getStatus);
  const permissions = useSelector(getPermissions);

  const isPriceChangeEnabled = permissions.filter(role => [1, 52].includes(role.IdRole)).length > 0;

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
    setDialogStatus({ status: true, id: workingOrderId, type: dialogType.REVOKE });
  };

  const handleProductUpdate = (details: any, index: number) => {
    dispatch(setProductDetails(details));
    setDialogStatus({ status: true, id: index, type: dialogType.UPDATE });
  };

  const clearOrderContent = () => {
    const handleConfirmButtonClick = () => {
      setDialogStatus({ status: false, id: 0, type: dialogType.CLEAR });
      dispatch(resetWorkingOrder());
    };

    return (
      <>
        <DialogTitle>Limpiar orden de servicio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Desea proceder con la eliminación de la información actual?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            negative
            label="Cerrar"
            onClick={() => setDialogStatus({ status: false, id: 0, type: dialogType.CLEAR })}
          />
          <Button label="Limpiar" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </>
    );
  };

  const revokeOrderContent = () => {
    const handleConfirmButtonClick = () => {
      setDialogStatus({ status: false, id: 0, type: dialogType.REVOKE });
      dispatch(revokeWorkingOrder({ id: dialogStatus.id }));
    };

    return (
      <>
        <DialogTitle>Anular orden de servicio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Desea proceder con la anulación de la orden para la ${workingOrderId}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            negative
            label="Cerrar"
            onClick={() => setDialogStatus({ status: false, id: 0, type: dialogType.REVOKE })}
          />
          <Button label="Anular" autoFocus onClick={handleConfirmButtonClick} />
        </DialogActions>
      </>
    );
  };

  const updateItemContent = () => {
    const handleUpdate = () => {
      dispatch(updateDetails({ pos: dialogStatus.id }));
      setDialogStatus({ status: false, id: 0, type: dialogType.UPDATE });
    };
    return (
      <>
        <DialogTitle>Actualizar producto</DialogTitle>
        <DialogContent>
          <Box sx={{ paddingTop: { xs: 1, sm: 2 } }}>
            <Grid container gap={{ xs: 1, sm: 2 }}>
              <Grid xs={12}>
                <LabelField label="Descripción" id="Descripcion" value={productDetails.description} />
              </Grid>
              <Grid xs={3}>
                <TextField
                  label="Cantidad"
                  id="Cantidad"
                  value={productDetails.quantity.toString()}
                  numericFormat
                  onChange={event => dispatch(setQuantity(parseStringToNumber(event.target.value)))}
                />
              </Grid>
              <Grid xs={6}>
                <TextField
                  readOnly={!isPriceChangeEnabled}
                  label="Precio"
                  value={productDetails.price.toString()}
                  numericFormat
                  onChange={event => dispatch(setPrice(parseStringToNumber(event.target.value)))}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            negative
            label="Cerrar"
            onClick={() => setDialogStatus({ status: false, id: 0, type: dialogType.UPDATE })}
          />
          <Button
            disabled={productDetails.quantity == 0 || productDetails.price == 0}
            label="Aplicar"
            autoFocus
            onClick={handleUpdate}
          />
        </DialogActions>
      </>
    );
  };

  return (
    <>
      <Grid container overflow="auto" pt={1} gap={2} ref={myRef} justifyContent="center">
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
          <Grid xs={12} className={classes.centered}>
            <Grid xs={12} sm={7} md={6}>
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
        <Grid xs={12} textAlign="center">
          <InputLabel className={classes.summaryTitle}>DETALLE DE LA ORDEN</InputLabel>
        </Grid>
        <Grid container xs={12} mx={{ xs: 0.5, sm: 0 }} justifyContent="center">
          {productDetailsList.map((row, index) => {
            return (
              <Grid key={row.id} container xs={12}>
                <Grid xs={9}>
                  <Typography overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                    {row.description}
                  </Typography>
                </Grid>
                <Grid xs={3} textAlign="end">
                  <Typography>{formatCurrency(roundNumber(row.quantity * row.price, 2), 2)}</Typography>
                </Grid>
                <Grid xs={10}>
                  <Typography>{`${row.quantity} Und x ${formatCurrency(row.price, 2)}`}</Typography>
                </Grid>
                <Grid xs={1}>
                  <IconButton
                    style={{ padding: 0 }}
                    color="primary"
                    component="span"
                    onClick={() => handleProductUpdate(row, index)}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid xs={1} textAlign="end">
                  <IconButton
                    style={{ padding: 0 }}
                    color="secondary"
                    component="span"
                    onClick={() => dispatch(removeDetails({ pos: index }))}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <Grid container xs={12}>
          <Grid container xs={12} sm={isSplitMode ? 12 : 8} className={`${classes.summary} ${classes.centered}`}>
            <InputLabel className={classes.summaryTitle}>RESUMEN ORDEN DE SERVICIO</InputLabel>
            <Grid container className={classes.details}>
              <Grid xs={6}>
                <InputLabel className={classes.summaryRow}>Gravado</InputLabel>
              </Grid>
              <Grid xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(taxed)}</InputLabel>
              </Grid>
              <Grid xs={6}>
                <InputLabel className={classes.summaryRow}>Exonerado</InputLabel>
              </Grid>
              <Grid xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(exonerated)}</InputLabel>
              </Grid>
              <Grid xs={6}>
                <InputLabel className={classes.summaryRow}>Excento</InputLabel>
              </Grid>
              <Grid xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(exempt)}</InputLabel>
              </Grid>
              <Grid xs={6}>
                <InputLabel className={classes.summaryRow}>SubTotal</InputLabel>
              </Grid>
              <Grid xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(subTotal)}</InputLabel>
              </Grid>
              <Grid xs={6}>
                <InputLabel className={classes.summaryRow}>Impuesto</InputLabel>
              </Grid>
              <Grid xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(taxes)}</InputLabel>
              </Grid>
              <Grid xs={6}>
                <InputLabel className={classes.summaryRow}>Total</InputLabel>
              </Grid>
              <Grid xs={6} className={classes.columnRight}>
                <InputLabel className={classes.summaryRow}>{formatCurrency(total)}</InputLabel>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {status === ORDER_STATUS.READY && (
          <Grid container xs={12}>
            <Grid xs={10} sm={6} md={4} className={classes.centered}>
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
          </Grid>
        )}
        <Grid container xs={12} gap={2} pb={1} justifyContent="center">
          {status === ORDER_STATUS.READY && (
            <Grid>
              {status === ORDER_STATUS.READY && total > 0 && (
                <Button label="Facturar" onClick={() => dispatch(generateInvoice())} />
              )}
            </Grid>
          )}
          {status === ORDER_STATUS.ON_PROGRESS && (
            <Grid>
              <Button
                disabled={buttonDisabled}
                label={workingOrderId > 0 ? "Actualizar" : "Guardar"}
                onClick={() => dispatch(saveWorkingOrder())}
              />
            </Grid>
          )}
          {workingOrderId > 0 && status !== ORDER_STATUS.CONVERTED && (
            <Grid>
              <Button label="Anular" onClick={handleRevokeButtonClick} />
            </Grid>
          )}
          {workingOrderId === 0 && (
            <Grid xs="auto">
              <Button
                disabled={total === 0}
                label="Limpiar"
                onClick={() => setDialogStatus({ status: true, id: 0, type: dialogType.CLEAR })}
              />
            </Grid>
          )}
          {status === ORDER_STATUS.CONVERTED && (
            <Grid xs="auto">
              <Button label="Imprimir Factura" onClick={() => dispatch(generateInvoiceTicket({ id: invoiceId }))} />
            </Grid>
          )}
          {isSplitMode && (
            <Grid xs="auto">
              <Button
                label="Regresar"
                onClick={() => {
                  dispatch(resetWorkingOrder());
                  dispatch(setActiveSection(11));
                }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Dialog
        id="revoke-dialog"
        onClose={() => setDialogStatus({ status: false, id: 0, type: dialogStatus.type })}
        open={dialogStatus.status}
      >
        {dialogStatus.type === dialogType.CLEAR
          ? clearOrderContent()
          : dialogStatus.type === dialogType.REVOKE
            ? revokeOrderContent()
            : updateItemContent()}
      </Dialog>
    </>
  );
}

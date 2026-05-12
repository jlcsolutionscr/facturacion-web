import { Button, TextField } from "jlc-component-library";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import { getCashCloseDetails, saveCashCloseDetails } from "state/session/asyncActions";
import {
  getCashCloseEntity,
  getCompanyMode,
  getCompanyRoles,
  getIsCashCloseSaved,
  setNextCashAmount,
} from "state/session/reducer";
import { formatCurrency, parseStringToNumber } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  summary: {
    flexDirection: "column",
    maxWidth: "300px",
    textAlign: "center",
  },
  summaryDetails: {
    justifyContent: "center",
    width: "100%",
    height: "auto",
    maxHeight: "calc(100% - 186px)",
    overflow: "hidden auto",
    "@media screen and (min-width:900px)": {
      maxHeight: "calc(100% - 194px)",
    },
  },
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
  centered: {
    display: "flex",
    margin: "auto",
    justifyContent: "center",
  },
}));

type RevokeOrderDialogProps = {
  onDialogClose: () => void;
};

export default function RevokeOrderDialog({ onDialogClose }: RevokeOrderDialogProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const cashCloseDetails = useSelector(getCashCloseEntity);
  const isCashClosedSaved = useSelector(getIsCashCloseSaved);
  const companyRoles = useSelector(getCompanyRoles);
  const companyMode = useSelector(getCompanyMode);

  const generateWorkingOrder = companyRoles.filter(role => [1, 201].includes(role.IdRole)).length > 0;
  const generateLayaway = companyRoles.filter(role => [1, 202].includes(role.IdRole)).length > 0;
  const cxcPayments = companyRoles.filter(role => [1, 300].includes(role.IdRole)).length > 0;
  const cxpPayments = companyRoles.filter(role => [1, 301].includes(role.IdRole)).length > 0;

  useEffect(() => {
    dispatch(getCashCloseDetails());
  }, [dispatch]);

  const cashCloseDate = cashCloseDetails ? new Date(cashCloseDetails.FechaCierre).toLocaleString("es-CR") : "";

  return (
    <>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>Cierre de efectivo de caja</DialogTitle>
      <DialogContent>
        <Grid container xs={12} spacing={2}>
          <Grid container>
            {cashCloseDetails === null ? (
              <Grid xs={12}>
                <Typography className={classes.summaryTitle}>Cargando la información. . .</Typography>
              </Grid>
            ) : (
              <>
                <Grid xs={12}>
                  <Typography className={classes.summaryTitle}>{`Fecha cierre: ${cashCloseDate}`}</Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography sx={{ fontWeight: "700" }} className={classes.summaryRow}>
                    Fondo de inicio
                  </Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography sx={{ fontWeight: "700" }} className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.FondoInicio)}
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography className={classes.summaryTitle}>DETALLE DE INGRESOS</Typography>
                </Grid>
                {generateLayaway && (
                  <>
                    <Grid xs={8}>
                      <Typography className={classes.summaryRow}>Adelanto de apartados</Typography>
                    </Grid>
                    <Grid xs={4} className={classes.columnRight}>
                      <Typography className={classes.summaryRow}>
                        {formatCurrency(cashCloseDetails.AdelantosApartadoEfectivo)}
                      </Typography>
                    </Grid>
                  </>
                )}
                {generateWorkingOrder && companyMode === 1 && (
                  <>
                    <Grid xs={8}>
                      <Typography className={classes.summaryRow}>Adelanto de ordenes de servicio</Typography>
                    </Grid>
                    <Grid xs={4} className={classes.columnRight}>
                      <Typography className={classes.summaryRow}>
                        {formatCurrency(cashCloseDetails.AdelantosOrdenEfectivo)}
                      </Typography>
                    </Grid>
                  </>
                )}
                {cxcPayments && (
                  <>
                    <Grid xs={8}>
                      <Typography className={classes.summaryRow}>Pagos a CxC en efectivo</Typography>
                    </Grid>
                    <Grid xs={4} className={classes.columnRight}>
                      <Typography className={classes.summaryRow}>
                        {formatCurrency(cashCloseDetails.PagosCxCEfectivo)}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid xs={8}>
                  <Typography className={classes.summaryRow}>Ventas en efectivo</Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.VentasEfectivo)}
                  </Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography className={classes.summaryRow}>Otros ingresos en efectivo</Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.IngresosEfectivo)}
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography className={classes.summaryTitle}>DETALLE DE EGRESOS</Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography className={classes.summaryRow}>Compras en efectivo</Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.ComprasEfectivo)}
                  </Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography className={classes.summaryRow}>Otros egresos en efectivo</Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.EgresosEfectivo)}
                  </Typography>
                </Grid>
                {cxpPayments && (
                  <>
                    <Grid xs={8}>
                      <Typography className={classes.summaryRow}>Pagos a CxP en efectivo</Typography>
                    </Grid>
                    <Grid xs={4} className={classes.columnRight}>
                      <Typography className={classes.summaryRow}>
                        {formatCurrency(cashCloseDetails.PagosCxPEfectivo)}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid container xs={12} justifyContent="flex-end">
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Monto para cierre de efectivo"
                      value={cashCloseDetails.FondoCierre.toString()}
                      numericFormat
                      onChange={event => dispatch(setNextCashAmount(parseStringToNumber(event.target.value)))}
                    />
                  </Grid>
                </Grid>
                <Grid xs={8}>
                  <Typography sx={{ fontWeight: "700" }} className={classes.summaryRow}>
                    Retiro en efectivo
                  </Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography sx={{ fontWeight: "700" }} className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.RetiroEfectivo)}
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography className={classes.summaryTitle}>DETALLE DE VENTAS</Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography className={classes.summaryRow}>Ventas en efectivo</Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.VentasEfectivo)}
                  </Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography className={classes.summaryRow}>Ventas con tarjeta</Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.VentasTarjeta)}
                  </Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography className={classes.summaryRow}>Ventas con transferencia</Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography className={classes.summaryRow}>
                    {formatCurrency(cashCloseDetails.VentasBancos)}
                  </Typography>
                </Grid>
                <Grid xs={8}>
                  <Typography sx={{ fontWeight: "700" }} className={classes.summaryRow}>
                    Total de ventas
                  </Typography>
                </Grid>
                <Grid xs={4} className={classes.columnRight}>
                  <Typography sx={{ fontWeight: "700" }} className={classes.summaryRow}>
                    {formatCurrency(
                      cashCloseDetails.VentasEfectivo + cashCloseDetails.VentasTarjeta + cashCloseDetails.VentasBancos
                    )}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px", justifyContent: "center" }}>
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Button disabled={isCashClosedSaved} label="Guardar" onClick={() => dispatch(saveCashCloseDetails())} />
          </Grid>
          <Grid xs={6}>
            <Button negative label="Cerrar" onClick={() => onDialogClose()} />
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
}

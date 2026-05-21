import { Select } from "jlc-component-library";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { getCompany } from "state/company/asyncActions";
import { setInvoiceParameters } from "state/invoice/asyncActions";
import { setReceiptParameters } from "state/receipt/asyncActions";
import {
  getBranchId,
  getBranchList,
  getCompanyMode,
  getPermissions,
  getUserCode,
  setBranchId,
} from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { getServicePointList } from "state/working-order/asyncActions";
import { TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(theme => ({
  root: {
    display: "flex",
    height: "100%",
    margin: "0",
    padding: "0 5px 5px 5px",
    overflow: "hidden",
    "@media screen and (min-width:414px)": {
      padding: "0",
    },
  },
  branches: {
    display: "flex",
    backgroundColor: "transparent",
    borderRadius: theme.shape.borderRadius,
    margin: "10px 0",
    height: "40px",
    alignContent: "center",
    justifyContent: "center",
    padding: "0",
  },
  branchText: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(18),
    fontStyle: "italic",
    fontWeight: 600,
    marginBottom: 0,
    color: "#000",
    backgroundColor: "transparent",
    transition: `color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:599px)": {
      fontSize: theme.typography.pxToRem(16),
    },
    "@media screen and (max-width:429px)": {
      fontSize: theme.typography.pxToRem(14),
      color: theme.palette.text.primary,
    },
  },
  buttonContainer: {
    height: "calc(100% - 35px)",
    overflowY: "auto",
    scrollbarWidth: "thin",
    maxWidth: "600px",
    marginInline: "auto",
    "@media screen and (min-width:600px)": {
      marginTop: "0",
    },
  },
  button: {
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    color: "rgba(255,255,255,0.85)",
    boxShadow: "2px 2px 4px #777",
    width: "100%",
    marginBottom: "2px",
    border: "none",
    height: "50px",
    borderRadius: "7px",
    "&:hover": {
      color: "#FFF",
      backgroundColor: theme.palette.mode === "dark" ? "#4d4949" : "#27546c",
      boxShadow: "none",
    },
    "&.Mui-disabled": {
      color: "rgba(255,255,255,0.65)",
      opacity: 0.6,
    },
    "@media screen and (min-width:414px)": {
      height: "60px",
    },
  },
}));

export default function MenuPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const permissions = useSelector(getPermissions);
  const branchId = useSelector(getBranchId);
  const branchList = useSelector(getBranchList);
  const userCode = useSelector(getUserCode);
  const companyMode = useSelector(getCompanyMode);

  const updateCompanyInfo = permissions.filter(role => [1, 61].includes(role.IdRole)).length > 0;
  const manageCustomers = permissions.filter(role => [1, 100].includes(role.IdRole)).length > 0;
  const manageServicePoint = permissions.filter(role => [1, 110].includes(role.IdRole)).length > 0;
  const manageProducts = permissions.filter(role => [1, 103].includes(role.IdRole)).length > 0;
  const generateInvoice = permissions.filter(role => [1, 203].includes(role.IdRole)).length > 0;
  const generateReceipt = permissions.filter(role => [1, 400].includes(role.IdRole)).length > 0;
  const manageDocuments = permissions.filter(role => [1, 402].includes(role.IdRole)).length > 0;
  const reportingMenu = permissions.filter(role => [1, 2, 57].includes(role.IdRole)).length > 0;
  const generateProforma = permissions.filter(role => [1, 200].includes(role.IdRole)).length > 0;
  const generateWorkingOrder = permissions.filter(role => [1, 201].includes(role.IdRole)).length > 0;
  const switchBrand = permissions.filter(role => [1, 2, 48].includes(role.IdRole)).length > 0;

  const branchItems = branchList.map(item => (
    <MenuItem key={item.Id} value={item.Id}>
      {item.Descripcion}
    </MenuItem>
  ));

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12} justifyContent="center" className={classes.branches}>
        {branchList.length > 1 && switchBrand ? (
          <Select
            id="sucursal-select-id"
            label="Seleccione la sucursal:"
            value={branchId.toString()}
            onChange={event => dispatch(setBranchId(event.target.value))}
            maxWidth="300px"
          >
            {branchItems}
          </Select>
        ) : (
          <Typography className={classes.branchText} align="center" paragraph>
            {`Sucursal: ${branchList.find(branch => branch.Id === branchId)?.Descripcion}`}
          </Typography>
        )}
      </Grid>
      <div className={classes.buttonContainer}>
        <Grid container item xs={12} gap={{ xs: 1.5, sm: 2 }} justifyContent="center">
          <Grid item xs={5} sm={3}>
            <Button
              className={classes.button}
              disabled={["ADMIN", "CONTADOR"].includes(userCode)}
              onClick={() => dispatch(setActiveSection(2))}
            >
              Mant. Usuario
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button disabled={!updateCompanyInfo} className={classes.button} onClick={() => dispatch(getCompany())}>
              Mant. Empresa
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={userCode.toUpperCase() !== "ADMIN"}
              className={classes.button}
              onClick={() => dispatch(setActiveSection(16))}
            >
              Categorías
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={companyMode === 1 || !manageServicePoint}
              className={classes.button}
              onClick={() => dispatch(setActiveSection(18))}
            >
              Puntos de servicio
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={!manageCustomers}
              className={classes.button}
              onClick={() => dispatch(setActiveSection(4))}
            >
              Listado Clientes
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button disabled={!manageProducts} className={classes.button} onClick={() => dispatch(setActiveSection(5))}>
              Listado Productos
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={!generateInvoice}
              className={classes.button}
              onClick={() => {
                dispatch(setInvoiceParameters({ id: 6 }));
              }}
            >
              Facturación
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={!generateWorkingOrder}
              className={classes.button}
              onClick={() => {
                if (companyMode === 1) {
                  dispatch(setActiveSection(11));
                } else {
                  dispatch(getServicePointList({ activeFilter: true }));
                }
              }}
            >
              Orden de servicio
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={!generateProforma}
              className={classes.button}
              onClick={() => dispatch(setActiveSection(10))}
            >
              Proforma
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={!generateInvoice}
              className={classes.button}
              onClick={() => dispatch(setActiveSection(8))}
            >
              Listado Facturas
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={!manageDocuments}
              className={classes.button}
              onClick={() => dispatch(setActiveSection(9))}
            >
              Listado Documentos
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button disabled={!reportingMenu} className={classes.button} onClick={() => dispatch(setActiveSection(20))}>
              Reportes
            </Button>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Button
              disabled={!generateReceipt}
              className={classes.button}
              onClick={() => dispatch(setReceiptParameters({ id: 7 }))}
            >
              Registrar Compra
            </Button>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}

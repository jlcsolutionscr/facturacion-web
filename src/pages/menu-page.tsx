import { Select } from "jlc-component-library";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { getCompany, getLogo } from "state/company/asyncActions";
import { getCustomerListFirstPage } from "state/customer/asyncActions";
import { getDocumentListFirstPage } from "state/document/asyncActions";
import { getInvoiceListFirstPage, setInvoiceParameters } from "state/invoice/asyncActions";
import { getProductListFirstPage } from "state/product/asyncActions";
import { getProformaListFirstPage } from "state/proforma/asyncActions";
import { setReceiptParameters } from "state/receipt/asyncActions";
import { getBranchId, getBranchList, getPermissions, getUserCode, setBranchId } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { getWorkingOrderListFirstPage } from "state/working-order/asyncActions";
import { ROWS_PER_CUSTOMER, ROWS_PER_PRODUCT, TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(theme => ({
  root: {
    display: "flex",
    textAlign: "center",
    height: "100%",
    margin: "0",
    padding: "0 5px 5px 5px",
    overflow: "hidden",
    "@media screen and (min-width:430px)": {
      padding: "0",
    },
  },
  branches: {
    backgroundColor: "transparent",
    borderRadius: theme.shape.borderRadius,
    margin: "0 auto",
    height: "35px",
    alignContent: "center",
    justifyContent: "center",
    padding: "0",
    "@media screen and (min-width:430px)": {
      height: "38px",
    },
    "@media screen and (min-width:600px)": {
      height: "75px",
    },
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
    "@media screen and (min-width:430px)": {
      height: "calc(100% - 38px)",
      marginBottom: "10px",
    },
    "@media screen and (min-width:600px)": {
      height: "calc(100% - 75px)",
      marginBottom: "0",
    },
  },
  button: {
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    color: "rgba(255,255,255,0.85)",
    width: "100%",
    marginBottom: "2px",
    border: "none",
    borderRadius: "2px",
    boxShadow: "none",
    padding: "10px 0",
    "&:hover": {
      color: "#FFF",
      backgroundColor: theme.palette.mode === "dark" ? "#4d4949" : "#27546c",
      boxShadow: "none",
    },
    "&.Mui-disabled": {
      color: "rgba(255,255,255,0.65)",
      backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    },
    "@media screen and (min-width:430px)": {
      width: "280px",
      padding: "8px",
      borderRadius: "25px",
      border: "1px solid #FFFFFF",
      marginBottom: "8px",
      boxShadow: "3px 3px 6px rgba(0,0,0,0.55)",
      transition: `background-color ${TRANSITION_ANIMATION}, color ${TRANSITION_ANIMATION}`,
      "&:hover": {
        boxShadow: "4px 4px 6px rgba(0,0,0,0.55)",
      },
    },
    "@media screen and (min-width:600px)": {
      width: "270px",
      padding: "13px",
      marginBottom: "12px",
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

  const updateCompanyInfo = permissions.filter(role => [1, 61].includes(role.IdRole)).length > 0;
  const manageCustomers = permissions.filter(role => [1, 100].includes(role.IdRole)).length > 0;
  const manageProducts = permissions.filter(role => [1, 103].includes(role.IdRole)).length > 0;
  const generateInvoice = permissions.filter(role => [1, 203].includes(role.IdRole)).length > 0;
  const generateReceipt = permissions.filter(role => [1, 400].includes(role.IdRole)).length > 0;
  const manageDocuments = permissions.filter(role => [1, 402].includes(role.IdRole)).length > 0;
  const reportingMenu = permissions.filter(role => [1, 2, 57].includes(role.IdRole)).length > 0;
  const generateProforma = permissions.filter(role => [1, 200].includes(role.IdRole)).length > 0;
  const generateWorkingOrder = permissions.filter(role => [1, 201].includes(role.IdRole)).length > 0;
  const switchBrand = permissions.filter(role => [1, 2, 48].includes(role.IdRole)).length > 0;
  const branchItems = branchList.map(item => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });
  return (
    <Grid className={classes.root} container>
      <Grid item xs={12} alignItems="center" className={classes.branches}>
        {branchList.length > 1 && switchBrand ? (
          <Select
            id="sucursal-select-id"
            label="Seleccione la sucursal:"
            value={branchId.toString()}
            onChange={event => dispatch(setBranchId(event.target.value))}
            maxWidth="570px"
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
        <Grid container item xs={12}>
          <Grid item xs={12} sm={6}>
            <Button disabled={!updateCompanyInfo} className={classes.button} onClick={() => dispatch(getCompany())}>
              Actualizar empresa
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              className={classes.button}
              disabled={["ADMIN", "CONTADOR"].includes(userCode)}
              onClick={() => dispatch(setActiveSection(2))}
            >
              Actualizar usuario
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button disabled={!updateCompanyInfo} className={classes.button} onClick={() => dispatch(getLogo())}>
              Actualizar logotipo
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!manageCustomers}
              className={classes.button}
              onClick={() =>
                dispatch(
                  getCustomerListFirstPage({
                    id: 4,
                    filterText: "",
                    rowsPerPage: ROWS_PER_CUSTOMER,
                  })
                )
              }
            >
              Catálogo de clientes
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!manageProducts}
              className={classes.button}
              onClick={() =>
                dispatch(
                  getProductListFirstPage({
                    id: 5,
                    filterText: "",
                    type: 2,
                    rowsPerPage: ROWS_PER_PRODUCT,
                  })
                )
              }
            >
              Catálogo de productos
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!generateInvoice}
              className={classes.button}
              onClick={() => dispatch(setInvoiceParameters({ id: 6 }))}
            >
              Facturar
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!generateReceipt}
              className={classes.button}
              onClick={() => dispatch(setReceiptParameters({ id: 7 }))}
            >
              Factura de compra
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!generateInvoice}
              className={classes.button}
              onClick={() => dispatch(getInvoiceListFirstPage({ id: 8 }))}
            >
              Facturas electrónicas
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!manageDocuments}
              className={classes.button}
              onClick={() => dispatch(getDocumentListFirstPage({ id: 9 }))}
            >
              Documentos electrónicos
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!generateProforma}
              className={classes.button}
              onClick={() => dispatch(getProformaListFirstPage({ id: 10 }))}
            >
              Factura proforma
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!generateWorkingOrder}
              className={classes.button}
              onClick={() => dispatch(getWorkingOrderListFirstPage({ id: 11 }))}
            >
              Ordenes de servicio
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button disabled={!reportingMenu} className={classes.button} onClick={() => dispatch(setActiveSection(20))}>
              Menu de reportes
            </Button>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}

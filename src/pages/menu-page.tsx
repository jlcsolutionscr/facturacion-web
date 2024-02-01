import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import Select from "components/select";
import { getCompany } from "state/company/asyncActions";
import { getCustomerListFirstPage } from "state/customer/asyncActions";
import { getDocumentListFirstPage } from "state/document/asyncActions";
import { getInvoiceListFirstPage, setInvoiceParameters } from "state/invoice/asyncActions";
import { getProductListFirstPage } from "state/product/asyncActions";
import { setReceiptParameters } from "state/receipt/asyncActions";
import { getBranchId, getBranchList, getPermissions, setBranchId } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { getWorkingOrderListFirstPage } from "state/working-order/asyncActions";
import { ROWS_PER_CUSTOMER, ROWS_PER_PRODUCT, TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(theme => ({
  root: {
    display: "flex",
    textAlign: "center",
    maxWidth: "640px",
    margin: "20px auto auto auto",
    "@media screen and (max-width:599px)": {
      margin: "10px auto auto auto",
    },
    "@media screen and (max-width:429px)": {
      margin: "5px 0 auto 0",
      padding: "5px",
    },
  },
  branches: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    margin: "0 auto",
    padding: "9px",
    width: "590px",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:599px)": {
      width: "400px",
    },
    "@media screen and (max-width:429px)": {
      width: "100%",
    },
  },
  branchText: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: theme.typography.pxToRem(18),
    fontStyle: "italic",
    fontWeight: 600,
    marginBottom: 0,
    color: theme.palette.text.primary,
    transition: `color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:599px)": {
      fontSize: theme.typography.pxToRem(16),
    },
    "@media screen and (max-width:429px)": {
      fontSize: theme.typography.pxToRem(14),
    },
  },
  button: {
    marginTop: "25px",
    width: "270px",
    padding: "13px",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    color: "rgba(255,255,255,0.85)",
    borderRadius: "25px",
    border: "1px solid #FFFFFF",
    boxShadow: "3px 3px 6px rgba(0,0,0,0.55)",
    transition: `background-color ${TRANSITION_ANIMATION}, color ${TRANSITION_ANIMATION}`,
    "&:hover": {
      color: "#FFF",
      backgroundColor: theme.palette.mode === "dark" ? "#4d4949" : "#27546c",
      boxShadow: "4px 4px 6px rgba(0,0,0,0.55)",
    },
    "&:disabled": {
      color: "rgba(255,255,255,0.65)",
      backgroundColor: "#595959",
    },
    "@media screen and (max-width:599px)": {
      width: "300px",
      marginTop: "6px",
      padding: "8px",
    },
    "@media screen and (max-width:429px)": {
      width: "100%",
      marginTop: "2px",
      border: "none",
      borderRadius: "2px",
      boxShadow: "none",
      padding: "10px 0",
      "&:hover": {
        boxShadow: "none",
      },
    },
  },
}));

export default function MenuPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const permissions = useSelector(getPermissions);
  const branchId = useSelector(getBranchId);
  const branchList = useSelector(getBranchList);

  const updateCompanyInfo = permissions.filter(role => [1, 61].includes(role.IdRole)).length > 0;
  const manageCustomers = permissions.filter(role => [1, 100].includes(role.IdRole)).length > 0;
  const manageProducts = permissions.filter(role => [1, 103].includes(role.IdRole)).length > 0;
  const generateInvoice = permissions.filter(role => [1, 203].includes(role.IdRole)).length > 0;
  const manageDocuments = permissions.filter(role => [1, 402].includes(role.IdRole)).length > 0;
  const reportingMenu = permissions.filter(role => [1, 2, 57].includes(role.IdRole)).length > 0;
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
      <Grid item xs={12} alignItems="center">
        <div className={classes.branches}>
          {branchList.length > 1 && switchBrand ? (
            <Select
              id="sucursal-select-id"
              label="Seleccione la sucursal:"
              value={branchId.toString()}
              onChange={event => dispatch(setBranchId(event.target.value))}
            >
              {branchItems}
            </Select>
          ) : (
            <Typography className={classes.branchText} align="center" paragraph>
              {`Sucursal: ${branchList.find(branch => branch.Id === branchId)?.Descripcion}`}
            </Typography>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button disabled={!updateCompanyInfo} classes={{ root: classes.button }} onClick={() => dispatch(getCompany())}>
          Actualizar empresa
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          disabled={!updateCompanyInfo}
          classes={{ root: classes.button }}
          onClick={() => dispatch(setActiveSection(2))}
        >
          Agregar logotipo
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          disabled={!manageCustomers}
          classes={{ root: classes.button }}
          onClick={() =>
            dispatch(
              getCustomerListFirstPage({
                id: 3,
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
          classes={{ root: classes.button }}
          onClick={() =>
            dispatch(
              getProductListFirstPage({
                id: 4,
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
          classes={{ root: classes.button }}
          onClick={() => dispatch(setInvoiceParameters({ id: 5 }))}
        >
          Facturar
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          disabled={!generateInvoice}
          classes={{ root: classes.button }}
          onClick={() => dispatch(setReceiptParameters({ id: 6 }))}
        >
          Factura de compra
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          disabled={!generateInvoice}
          classes={{ root: classes.button }}
          onClick={() => dispatch(getInvoiceListFirstPage({ id: 7 }))}
        >
          Facturas electrónicas
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          disabled={!manageDocuments}
          classes={{ root: classes.button }}
          onClick={() => dispatch(getDocumentListFirstPage({ id: 8 }))}
        >
          Documentos electrónicos
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          disabled={!generateWorkingOrder}
          classes={{ root: classes.button }}
          onClick={() => dispatch(getWorkingOrderListFirstPage({ id: 9 }))}
        >
          Ordenes de servicio
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          disabled={!reportingMenu}
          classes={{ root: classes.button }}
          onClick={() => dispatch(setActiveSection(20))}
        >
          Menu de reportes
        </Button>
      </Grid>
    </Grid>
  );
}

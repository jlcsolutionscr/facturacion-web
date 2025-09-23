import { SyntheticEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import StepOneScreen from "./steps-screens/customer-details-screen";
import StepThreeScreen from "./steps-screens/invoice-final-screen";
import StepTwoScreen from "./steps-screens/product-details-screen";
import { getCustomerDetails as getCustomerDetailsAction } from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { addDetails, removeDetails } from "state/invoice/asyncActions";
import {
  getActivityCode,
  getComment,
  getCurrency,
  getCustomerDetails,
  getInvoiceId,
  getPaymentDetailsList,
  getProductDetails,
  getProductDetailsList,
  getSuccessful,
  getSummary,
  getVendorId,
  setCustomerAttribute,
  setProductDetails,
} from "state/invoice/reducer";
import { getProductDetails as getProductDetailsAction } from "state/product/asyncActions";
import { getProductList, getProductListCount, getProductListPage } from "state/product/reducer";
import { getCompany, getPermissions, getVendorList } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { FORM_TYPE, TRANSITION_ANIMATION } from "utils/constants";
import { BackArrowIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    maxWidth: "900px",
    width: "100%",
    margin: "10px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "100%",
      margin: "0px",
    },
  },
  tabs: {
    "@media screen and (max-width:599px)": {
      borderTop: "solid 2px #FFF",
    },
  },
  tab: {
    backgroundColor: theme.palette.background.paper,
    transition: `background-color ${TRANSITION_ANIMATION}`,
  },
  backButton: {
    position: "absolute",
    marginTop: "5px",
    zIndex: "10",
  },
  icon: {
    color: "#FFF",
  },
}));

export default function InvoicePage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const customer = useSelector(getCustomerDetails);
  const customerListCount = useSelector(getCustomerListCount);
  const customerListPage = useSelector(getCustomerListPage);
  const customerList = useSelector(getCustomerList);
  const permissions = useSelector(getPermissions);
  const productListPage = useSelector(getProductListPage);
  const productListCount = useSelector(getProductListCount);
  const productDetails = useSelector(getProductDetails);
  const productList = useSelector(getProductList);
  const productDetailsList = useSelector(getProductDetailsList);
  const invoiceId = useSelector(getInvoiceId);
  const company = useSelector(getCompany);
  const summary = useSelector(getSummary);
  const activityCode = useSelector(getActivityCode);
  const paymentDetails = useSelector(getPaymentDetailsList);
  const vendorId = useSelector(getVendorId);
  const comment = useSelector(getComment);
  const currency = useSelector(getCurrency);
  const successful = useSelector(getSuccessful);
  const vendorList = useSelector(getVendorList);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="close" component="span" onClick={() => dispatch(setActiveSection(0))}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs className={classes.tabs} centered value={value} indicatorColor="secondary" onChange={handleChange}>
        <Tab label="Cliente" />
        <Tab label="Detalle" />
        <Tab label="Generar" />
      </Tabs>
      <StepOneScreen
        className={classes.tab}
        value={value}
        index={0}
        customer={customer}
        customerListCount={customerListCount}
        customerListPage={customerListPage}
        customerList={customerList}
        listDisabled={successful}
        getCustomerDetails={(id: number) => dispatch(getCustomerDetailsAction({ id, type: FORM_TYPE.INVOICE }))}
        setCustomerName={(value: string) => dispatch(setCustomerAttribute({ attribute: "name", value }))}
      />
      <StepTwoScreen
        className={classes.tab}
        value={value}
        index={1}
        permissions={permissions}
        productListPage={productListPage}
        productListCount={productListCount}
        productList={productList}
        productDetails={productDetails}
        productDetailsList={productDetailsList}
        stepDisabled={successful}
        getProductDetails={(id: number) => dispatch(getProductDetailsAction({ id, type: FORM_TYPE.INVOICE }))}
        setProductDetails={(attribute: string, value: number | string) =>
          dispatch(setProductDetails({ ...productDetails, [attribute]: value }))
        }
        addDetails={() => dispatch(addDetails())}
        removeDetails={(id: string) => dispatch(removeDetails({ id }))}
      />
      <StepThreeScreen
        className={classes.tab}
        value={value}
        invoiceId={invoiceId}
        company={company}
        summary={summary}
        activityCode={activityCode}
        paymentDetails={paymentDetails}
        vendorId={vendorId}
        currency={currency}
        comment={comment}
        vendorList={vendorList}
        successful={successful}
        setValue={setValue}
        index={2}
      />
    </div>
  );
}

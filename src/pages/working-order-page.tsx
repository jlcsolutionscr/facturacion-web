import { SyntheticEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import StepOneScreen from "./steps-screens/customer-details-screen";
import StepTwoScreen from "./steps-screens/product-details-screen";
import StepFourScreen from "./steps-screens/working-order-final-screen";
import StepThreeScreen from "./steps-screens/working-order-third-screen";
import { getCustomerDetails as getCustomerDetailsAction } from "state/customer/asyncActions";
import { getCustomerList, getCustomerListCount, getCustomerListPage } from "state/customer/reducer";
import { getProductDetails as getProductDetailsAction } from "state/product/asyncActions";
import { getProductList, getProductListCount, getProductListPage } from "state/product/reducer";
import { getCompany, getPermissions, getVendorList } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { addDetails, removeDetails } from "state/working-order/asyncActions";
import {
  getActivityCode,
  getCashAdvance,
  getCurrency,
  getCustomerDetails,
  getDeliveryDetails,
  getInvoiceId,
  getPaymentDetailsList,
  getProductDetails,
  getProductDetailsList,
  getStatus,
  getSummary,
  getVendorId,
  getWorkingOrderId,
  setCustomerAttribute,
  setProductDetails,
} from "state/working-order/reducer";
import { FORM_TYPE, ORDER_STATUS, TRANSITION_ANIMATION } from "utils/constants";
import { BackArrowIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#08415c",
    maxWidth: "900px",
    width: "100%",
    margin: "15px auto",
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
    color: "#FFF",
    "& .MuiTab-root": {
      color: "#FFF",
    },
    "& .Mui-selected": {
      color: "#90CAF9",
    },
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

export default function WorkingOrderPage() {
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
  const delivery = useSelector(getDeliveryDetails);
  const company = useSelector(getCompany);
  const summary = useSelector(getSummary);
  const activityCode = useSelector(getActivityCode);
  const paymentDetails = useSelector(getPaymentDetailsList);
  const vendorId = useSelector(getVendorId);
  const currency = useSelector(getCurrency);
  const workingOrderId = useSelector(getWorkingOrderId);
  const vendorList = useSelector(getVendorList);
  const cashAdvance = useSelector(getCashAdvance);
  const status = useSelector(getStatus);
  const invoiceId = useSelector(getInvoiceId);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBackAction = () => {
    dispatch(setActiveSection(9));
  };

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => handleBackAction()}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs className={classes.tabs} centered value={value} indicatorColor="secondary" onChange={handleChange}>
        <Tab label="Cliente" />
        <Tab label="Detalle" />
        <Tab label="Otros" />
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
        listDisabled={status === ORDER_STATUS.CONVERTED}
        getCustomerDetails={(id: number) => dispatch(getCustomerDetailsAction({ id, type: FORM_TYPE.ORDER }))}
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
        stepDisabled={status === ORDER_STATUS.CONVERTED}
        getProductDetails={(id: number) => dispatch(getProductDetailsAction({ id, type: FORM_TYPE.ORDER }))}
        setProductDetails={(attribute: string, value: number | string) =>
          dispatch(setProductDetails({ ...productDetails, [attribute]: value }))
        }
        addDetails={() => dispatch(addDetails())}
        removeDetails={(id: string, pos: number) => dispatch(removeDetails({ id, pos }))}
      />
      <StepThreeScreen className={classes.tab} value={value} index={2} delivery={delivery} status={status} />
      <StepFourScreen
        className={classes.tab}
        value={value}
        index={3}
        company={company}
        summary={summary}
        activityCode={activityCode}
        paymentDetails={paymentDetails}
        vendorId={vendorId}
        workingOrderId={workingOrderId}
        vendorList={vendorList}
        currency={currency}
        cashAdvance={cashAdvance}
        status={status}
        invoiceId={invoiceId}
        setValue={setValue}
      />
    </div>
  );
}

import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";

import { setActiveSection } from "store/ui/actions";

import {
  setActivityCode,
  setPaymentId,
  setVendorId,
  setComment,
  saveInvoice,
  setInvoiceParameters,
  generateInvoiceTicket,
} from "store/invoice/actions";

import { getProduct, setDescription, setQuantity, setPrice, addDetails, removeDetails } from "store/invoice/actions";

import { filterProductList, getProductListByPageNumber } from "store/product/actions";

import {
  getCustomer,
  setCustomerAttribute,
  filterCustomerList,
  getCustomerListByPageNumber,
} from "store/customer/actions";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import IconButton from "@material-ui/core/IconButton";

import { BackArrowIcon } from "utils/iconsHelper";
import StepOneScreen from "./invoice-steps/step-one-screen";
import StepTwoScreen from "./invoice-steps/step-two-screen";
import StepThreeScreen from "./invoice-steps/step-three-screen";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    backgroundColor: theme.palette.background.navbar,
    maxWidth: "900px",
    margin: "10px auto 0 auto",
  },
  tabs: {
    color: theme.palette.primary.navbar,
  },
  backButton: {
    position: "absolute",
    zIndex: "10",
  },
  icon: {
    color: "#FFF",
  },
}));

function InvoicePage({
  setActiveSection,
  customer,
  customerListCount,
  customerListPage,
  customerList,
  successful,
  filterCustomerList,
  getCustomerListByPageNumber,
  getCustomer,
  setCustomerAttribute,
  company,
  summary,
  activityCode,
  paymentId,
  vendorId,
  comment,
  invoiceId,
  vendorList,
  setPaymentId,
  setVendorId,
  setComment,
  saveInvoice,
  setInvoiceParameters,
  generateInvoiceTicket,
  setActivityCode,
  permissions,
  productListPage,
  productListCount,
  productList,
  product,
  description,
  quantity,
  price,
  detailsList,
  getProduct,
  setDescription,
  setQuantity,
  setPrice,
  filterProductList,
  getProductListByPageNumber,
  addDetails,
  removeDetails,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => setActiveSection(0)}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs className={classes.tabs} centered value={value} indicatorColor="secondary" onChange={handleChange}>
        <Tab label="Cliente" />
        <Tab label="Detalle" />
        <Tab label="Generar" />
      </Tabs>
      <StepOneScreen
        value={value}
        index={0}
        customer={customer}
        customerList={customerList}
        customerListCount={customerListCount}
        customerListPage={customerListPage}
        successful={successful}
        filterCustomerList={filterCustomerList}
        getCustomerListByPageNumber={getCustomerListByPageNumber}
        getCustomer={getCustomer}
        setCustomerAttribute={setCustomerAttribute}
      />
      <StepTwoScreen
        value={value}
        index={1}
        vendorList={vendorList}
        permissions={permissions}
        productListPage={productListPage}
        productListCount={productListCount}
        productList={productList}
        product={product}
        description={description}
        quantity={quantity}
        price={price}
        detailsList={detailsList}
        successful={successful}
        getProduct={getProduct}
        setDescription={setDescription}
        setQuantity={setQuantity}
        setPrice={setPrice}
        filterProductList={filterProductList}
        getProductListByPageNumber={getProductListByPageNumber}
        addDetails={addDetails}
        removeDetails={removeDetails}
      />
      <StepThreeScreen
        value={value}
        setValue={setValue}
        index={2}
        company={company}
        summary={summary}
        activityCode={activityCode}
        paymentId={paymentId}
        vendorId={vendorId}
        comment={comment}
        successful={successful}
        invoiceId={invoiceId}
        vendorList={vendorList}
        setPaymentId={setPaymentId}
        setVendorId={setVendorId}
        setComment={setComment}
        saveInvoice={saveInvoice}
        setInvoiceParameters={setInvoiceParameters}
        generateInvoiceTicket={generateInvoiceTicket}
        setActivityCode={setActivityCode}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    customer: state.customer.customer,
    customerListCount: state.customer.listCount,
    customerListPage: state.customer.listPage,
    customerList: state.customer.list,
    successful: state.invoice.successful,
    company: state.company.company,
    invoiceId: state.invoice.invoiceId,
    activityCode: state.invoice.activityCode,
    paymentId: state.invoice.paymentId,
    summary: state.invoice.summary,
    comment: state.invoice.comment,
    branchList: state.ui.branchList,
    vendorList: state.session.vendorList,
    vendorId: state.invoice.vendorId,
    error: state.invoice.error,
    permissions: state.session.permissions,
    description: state.invoice.description,
    quantity: state.invoice.quantity,
    product: state.product.product,
    price: state.invoice.price,
    productListPage: state.product.listPage,
    productListCount: state.product.listCount,
    productList: state.product.list,
    detailsList: state.invoice.detailsList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setActiveSection,
      getProduct,
      setDescription,
      setQuantity,
      setPrice,
      filterProductList,
      getProductListByPageNumber,
      addDetails,
      removeDetails,
      setActivityCode,
      setPaymentId,
      setVendorId,
      setComment,
      saveInvoice,
      setInvoiceParameters,
      generateInvoiceTicket,
      getCustomer,
      setCustomerAttribute,
      filterCustomerList,
      getCustomerListByPageNumber,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoicePage);

import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";

import { setActiveSection } from "store/ui/actions";

import {
  getCustomer,
  setCustomerAttribute,
  filterCustomerList,
  getCustomerListByPageNumber,
} from "store/customer/actions";

import { filterProductList, getProductListByPageNumber } from "store/product/actions";

import {
  saveProforma,
  setProformaParameters,
  getProduct,
  setProformaAttributes,
  addDetails,
  removeDetails,
} from "store/proforma/actions";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import IconButton from "@material-ui/core/IconButton";

import { BackArrowIcon } from "utils/iconsHelper";
import StepOneScreen from "./step-screens/select-customer-screen";
import StepTwoScreen from "./step-screens/select-products-screen";
import StepThreeScreen from "./step-screens/proforma-final-screen";

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
  finalStepContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "2%",
    backgroundColor: theme.palette.background.pages,
  },
  summary: {
    flexDirection: "column",
    maxWidth: "300px",
    textAlign: "center",
  },
  details: {
    marginTop: "5px",
    textAlign: "left",
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
  saveInvoice,
  setInvoiceParameters,
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
  setProformaAttributes,
  filterProductList,
  getProductListByPageNumber,
  addDetails,
  removeDetails,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleCustomerNameChange = value => {
    setCustomerAttribute("Nombre", value);
  };

  const customerListDisabled = successful;
  const customerNameEditDisabled = successful || customer.IdCliente !== 1;

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => setActiveSection(10)}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs
        className={classes.tabs}
        centered
        value={value}
        indicatorColor="secondary"
        onChange={(_event, value) => setValue(value)}
      >
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
        customerListDisabled={customerListDisabled}
        customerNameEditDisabled={customerNameEditDisabled}
        filterCustomerList={filterCustomerList}
        getCustomerListByPageNumber={getCustomerListByPageNumber}
        getCustomer={getCustomer}
        handleCustomerNameChange={handleCustomerNameChange}
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
        isEditDisabled={successful}
        getProduct={getProduct}
        setProductAttribute={setProformaAttributes}
        filterProductList={filterProductList}
        getProductListByPageNumber={getProductListByPageNumber}
        addDetails={addDetails}
        removeDetails={removeDetails}
      />
      <StepThreeScreen
        value={value}
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
        setProformaAttributes={setProformaAttributes}
        saveInvoice={saveInvoice}
        setInvoiceParameters={setInvoiceParameters}
        setValue={setValue}
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
      setProformaAttributes,
      filterProductList,
      getProductListByPageNumber,
      addDetails,
      removeDetails,
      saveProforma,
      setProformaParameters,
      getCustomer,
      setCustomerAttribute,
      filterCustomerList,
      getCustomerListByPageNumber,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoicePage);

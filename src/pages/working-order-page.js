import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";

import { setActiveSection } from "store/ui/actions";

import { filterProductList, getProductListByPageNumber } from "store/product/actions";

import {
  getCustomer,
  setCustomerAttribute,
  filterCustomerList,
  getCustomerListByPageNumber,
} from "store/customer/actions";

import {
  getProduct,
  setOrderAttributes,
  setDeliveryAttribute,
  addDetails,
  removeDetails,
  saveWorkingOrder,
  generateWorkingOrderTicket,
  generateInvoice,
  generateInvoiceTicket,
} from "store/working-order/actions";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import IconButton from "@material-ui/core/IconButton";

import { BackArrowIcon } from "utils/iconsHelper";
import StepOneScreen from "./step-screens/select-customer-screen";
import StepTwoScreen from "./step-screens/select-products-screen";
import StepThreeScreen from "./step-screens/working-order-three-screen";
import StepFourScreen from "./step-screens/working-order-final-screen";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    backgroundColor: theme.palette.background.navbar,
    color: theme.palette.primary.navbar,
    maxWidth: "900px",
    margin: "10px auto 0 auto",
  },
  backButton: {
    position: "absolute",
    zIndex: "10",
  },
  icon: {
    color: "#FFF",
  },
}));

function WorkingOrderPage({
  setActiveSection,
  customer,
  customerListCount,
  customerListPage,
  customerList,
  status,
  filterCustomerList,
  getCustomerListByPageNumber,
  getCustomer,
  setStatus,
  setCustomerAttribute,
  permissions,
  productListPage,
  productListCount,
  productList,
  product,
  description,
  quantity,
  price,
  detailsList,
  delivery,
  vendorList,
  getProduct,
  filterProductList,
  getProductListByPageNumber,
  addDetails,
  removeDetails,
  company,
  summary,
  activityCode,
  paymentId,
  vendorId,
  order,
  setPaymentId,
  setDeliveryAttribute,
  saveWorkingOrder,
  generateWorkingOrderTicket,
  generateInvoice,
  generateInvoiceTicket,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleCustomerNameChange = event => {
    setCustomerAttribute("Nombre", event.target.value);
    setStatus("on-progress");
  };

  const customerListDisabled = status === "converted";
  const customerNameEditDisabled = status === "converted" || customer.IdCliente !== 1;

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => setActiveSection(9)}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs centered value={value} indicatorColor="secondary" onChange={(_event, newValue) => setValue(newValue)}>
        <Tab label="Cliente" />
        <Tab label="Detalle" />
        <Tab label="Otros" />
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
        isEditDisabled={status === "converted"}
        getProduct={getProduct}
        setProductAttribute={setOrderAttributes}
        filterProductList={filterProductList}
        getProductListByPageNumber={getProductListByPageNumber}
        addDetails={addDetails}
        removeDetails={removeDetails}
      />
      <StepThreeScreen
        value={value}
        index={2}
        delivery={delivery}
        status={status}
        setDeliveryAttribute={setDeliveryAttribute}
      />
      <StepFourScreen
        value={value}
        index={3}
        company={company}
        summary={summary}
        activityCode={activityCode}
        paymentId={paymentId}
        vendorId={vendorId}
        order={order}
        vendorList={vendorList}
        status={status}
        setOrderAttributes={setOrderAttributes}
        setDeliveryAttribute={setDeliveryAttribute}
        saveWorkingOrder={saveWorkingOrder}
        generateWorkingOrderTicket={generateWorkingOrderTicket}
        generateInvoice={generateInvoice}
        generateInvoiceTicket={generateInvoiceTicket}
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
    status: state.workingOrder.status,
    permissions: state.session.permissions,
    description: state.workingOrder.description,
    quantity: state.workingOrder.quantity,
    product: state.product.product,
    price: state.workingOrder.price,
    productListPage: state.product.listPage,
    productListCount: state.product.listCount,
    productList: state.product.list,
    detailsList: state.workingOrder.detailsList,
    vendorList: state.session.vendorList,
    delivery: state.workingOrder.delivery,
    order: state.workingOrder.order,
    company: state.company.company,
    summary: state.workingOrder.summary,
    activityCode: state.workingOrder.activityCode,
    paymentId: state.workingOrder.paymentId,
    vendorId: state.workingOrder.vendorId,
    branchList: state.ui.branchList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setActiveSection,
      getCustomer,
      setCustomerAttribute,
      filterCustomerList,
      getCustomerListByPageNumber,
      getProduct,
      filterProductList,
      getProductListByPageNumber,
      addDetails,
      removeDetails,
      setOrderAttributes,
      setDeliveryAttribute,
      saveWorkingOrder,
      generateWorkingOrderTicket,
      generateInvoice,
      generateInvoiceTicket,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkingOrderPage);

import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";

import { setActiveSection } from "store/ui/actions";

import { setCustomerAttribute } from "store/customer/actions";
import { filterProductList } from "store/product/actions";
import {
  getProduct,
  setOrderAttributes,
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
import StepOneScreen from "./step-screens/restaurant-select-products-screen";
import StepTwoScreen from "./step-screens/restaurant-final-screen";

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

function RestaurantOrderPage({
  permissions,
  setActiveSection,
  workingOrderId,
  customerName,
  product,
  description,
  quantity,
  price,
  status,
  productList,
  detailsList,
  summary,
  servicePointList,
  setCustomerAttribute,
  setOrderAttributes,
  getProduct,
  filterProductList,
  addDetails,
  removeDetails,
  saveWorkingOrder,
  company,
  activityCode,
  paymentId,
  generateWorkingOrderTicket,
  generateInvoice,
  generateInvoiceTicket,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const generateInvoiceEnabled = permissions.filter(role => [1, 203].includes(role.IdRole)).length > 0;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <IconButton aria-label="upload picture" component="span" onClick={() => setActiveSection(9)}>
          <BackArrowIcon className={classes.icon} />
        </IconButton>
      </div>
      <Tabs centered value={value} indicatorColor="secondary" onChange={handleChange}>
        <Tab label="Detalle" />
        <Tab label="Generar" disabled={!generateInvoiceEnabled} />
      </Tabs>
      <StepOneScreen
        value={value}
        index={0}
        permissions={permissions}
        workingOrderId={workingOrderId}
        customerName={customerName}
        product={product}
        description={description}
        quantity={quantity}
        price={price}
        status={status}
        productList={productList}
        detailsList={detailsList}
        summary={summary}
        servicePointList={servicePointList}
        setCustomerAttribute={setCustomerAttribute}
        setOrderAttributes={setOrderAttributes}
        getProduct={getProduct}
        filterProductList={filterProductList}
        addDetails={addDetails}
        removeDetails={removeDetails}
        saveWorkingOrder={saveWorkingOrder}
      />
      <StepTwoScreen
        value={value}
        index={1}
        company={company}
        activityCode={activityCode}
        paymentId={paymentId}
        setProductAttribute={setOrderAttributes}
        generateWorkingOrderTicket={generateWorkingOrderTicket}
        generateInvoice={generateInvoice}
        generateInvoiceTicket={generateInvoiceTicket}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    permissions: state.session.permissions,
    customerName: state.customer.customer.Nombre,
    servicePointList: state.workingOrder.servicePointList,
    workingOrderId: state.workingOrder.workingOrderId,
    description: state.workingOrder.description,
    quantity: state.workingOrder.quantity,
    product: state.product.product,
    price: state.workingOrder.price,
    productList: state.product.list,
    detailsList: state.workingOrder.detailsList,
    summary: state.workingOrder.summary,
    status: state.workingOrder.status,
    company: state.company.company,
    activityCode: state.workingOrder.activityCode,
    paymentId: state.workingOrder.paymentId,
    branchList: state.ui.branchList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setCustomerAttribute,
      setOrderAttributes,
      getProduct,
      filterProductList,
      addDetails,
      removeDetails,
      saveWorkingOrder,
      setActiveSection,
      generateWorkingOrderTicket,
      generateInvoice,
      generateInvoiceTicket,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantOrderPage);

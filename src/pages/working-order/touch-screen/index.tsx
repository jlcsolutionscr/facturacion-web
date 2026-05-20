import { useDispatch, useSelector } from "react-redux";

import TouchScreenSalesPage from "components/touch-screen-sales";
import OrderSummary from "components/touch-screen-sales/order-summary";
import { getCustomerDetails as getCustomerDetailsAction } from "state/customer/asyncActions";
import { generateInvoiceTicket } from "state/invoice/asyncActions";
import { getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import {
  addDetails,
  generateInvoice,
  removeDetails,
  revokeWorkingOrder,
  saveWorkingOrder,
  updateDetails,
} from "state/working-order/asyncActions";
import {
  getActivityCode,
  getCustomerDetails,
  getDeliveryDetails,
  getInvoiceId,
  getPaymentDetailsList,
  getProductDetails,
  getProductDetailsList,
  getStatus,
  getSummary,
  getWorkingOrderId,
  resetWorkingOrder,
  setActivityCode,
  setCustomerAttribute,
  setDeliveryAttribute,
  setPaymentDetailsList,
  setProductDetails,
  setSummary,
} from "state/working-order/reducer";
import { FORM_TYPE, ORDER_STATUS } from "utils/constants";

export default function TouchScreenWorkingOrderPage() {
  const dispatch = useDispatch();

  const permissions = useSelector(getPermissions);
  const status = useSelector(getStatus);
  const summary = useSelector(getSummary);
  const workingOrderId = useSelector(getWorkingOrderId);
  const productDetails = useSelector(getProductDetails);
  const productDetailsList = useSelector(getProductDetailsList);
  const invoiceId = useSelector(getInvoiceId);
  const delivery = useSelector(getDeliveryDetails);
  const customerDetails = useSelector(getCustomerDetails);
  const paymentDetailsList = useSelector(getPaymentDetailsList);
  const activityCode = useSelector(getActivityCode);

  const revokeOrders = permissions.filter(role => [1, 49].includes(role.IdRole)).length > 0;
  const isPriceChangeEnabled = permissions.filter(role => [1, 52].includes(role.IdRole)).length > 0;

  const revokeEnabled = workingOrderId > 0 && status !== ORDER_STATUS.CONVERTED && revokeOrders;

  return (
    <TouchScreenSalesPage
      addProductDetails={value => dispatch(addDetails({ id: value }))}
      handleClose={() => dispatch(setActiveSection(11))}
    >
      <OrderSummary
        id={workingOrderId}
        summary={summary}
        extraDetails={delivery.details}
        productDetails={productDetails}
        productDetailsList={productDetailsList}
        customerDetails={customerDetails}
        paymentDetailsList={paymentDetailsList}
        activityCode={activityCode}
        revokeAlertMessage={`Desea proceder con la anulación de la orden para la ${workingOrderId}?`}
        isPriceChangeEnabled={isPriceChangeEnabled}
        ticketsButtonEnabled={workingOrderId > 0}
        invoiceButtonEnabled={status === ORDER_STATUS.READY && summary.total > 0}
        saveButtonEnabled={status === ORDER_STATUS.ON_PROGRESS}
        revokeButtonEnabled={revokeEnabled}
        resetButtonEnabled={workingOrderId === 0}
        printButtonEnabled={status === ORDER_STATUS.CONVERTED}
        getCustomerDetails={customerId => dispatch(getCustomerDetailsAction({ id: customerId, type: FORM_TYPE.ORDER }))}
        setCustomerAttribute={attribute => dispatch(setCustomerAttribute(attribute))}
        setActivityCode={value => dispatch(setActivityCode(value))}
        setPaymentDetailsList={list => dispatch(setPaymentDetailsList(list))}
        setSummary={value => dispatch(setSummary(value))}
        setProductDetails={details => dispatch(setProductDetails(details))}
        updateProductDetailsList={value => dispatch(updateDetails({ pos: value }))}
        handleProductRemove={value => dispatch(removeDetails({ pos: value }))}
        handlePrintTicket={() => dispatch(generateInvoiceTicket({ id: invoiceId }))}
        handleSave={() =>
          status === ORDER_STATUS.ON_PROGRESS ? dispatch(saveWorkingOrder()) : dispatch(generateInvoice())
        }
        generateInvoice={() => dispatch(generateInvoice())}
        handleClose={() => dispatch(setActiveSection(11))}
        setExtraDetails={value =>
          dispatch(
            setDeliveryAttribute({
              attribute: "details",
              value,
            })
          )
        }
        handleReset={() => dispatch(resetWorkingOrder())}
        handleRevoke={() => dispatch(revokeWorkingOrder({ id: workingOrderId }))}
      />
    </TouchScreenSalesPage>
  );
}

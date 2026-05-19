import { useDispatch, useSelector } from "react-redux";

import TouchScreenSalesPage from "components/touch-screen-sales";
import OrderSummary from "components/touch-screen-sales/order-summary";
import { getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import {
  addDetails,
  generateInvoice,
  printWorkingOrderTicket,
  removeDetails,
  revokeWorkingOrder,
  updateDetails,
} from "state/working-order/asyncActions";
import {
  getDeliveryDetails,
  getInvoiceId,
  getProductDetails,
  getProductDetailsList,
  getStatus,
  getSummary,
  getWorkingOrderId,
  resetWorkingOrder,
  setDeliveryAttribute,
  setProductDetails,
} from "state/working-order/reducer";
import { ORDER_STATUS } from "utils/constants";

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
        status={status}
        extraDetails={delivery.details}
        productDetails={productDetails}
        productDetailsList={productDetailsList}
        revokeAlertMessage={`Desea proceder con la anulación de la orden para la ${workingOrderId}?`}
        isPriceChangeEnabled={isPriceChangeEnabled}
        ticketsButtonEnabled={workingOrderId > 0}
        invoiceButtonEnabled={status === ORDER_STATUS.READY}
        saveButtonEnabled={status === ORDER_STATUS.ON_PROGRESS}
        revokeButtonEnabled={revokeEnabled}
        resetButtonEnabled={workingOrderId === 0}
        printButtonEnabled={status === ORDER_STATUS.CONVERTED}
        setProductDetails={details => dispatch(setProductDetails(details))}
        updateProductDetailsList={value => dispatch(updateDetails({ pos: value }))}
        handleProductRemove={value => dispatch(removeDetails({ pos: value }))}
        handlePrintTicket={() => dispatch(printWorkingOrderTicket({ ticketId: invoiceId }))}
        handleSubmit={() => dispatch(generateInvoice())}
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

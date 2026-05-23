import { useDispatch, useSelector } from "react-redux";

import TouchScreenSalesPage from "components/touch-screen-sales";
import OrderSummary from "components/touch-screen-sales/order-summary";
import { getCustomerDetails as getCustomerDetailsAction } from "state/customer/asyncActions";
import { getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import {
  addDetails,
  generateInvoice,
  getServicePointList,
  removeDetails,
  revokeWorkingOrder,
  saveWorkingOrder,
  setSummaryProductList,
  translateOrderServicePoint,
  updateDetails,
} from "state/working-order/asyncActions";
import {
  getDeliveryDetails,
  getInvoiceId,
  getPaymentInfo,
  getProductDetails,
  getProductDetailsList,
  getServicePointId,
  getWorkingOrderId,
  resetWorkingOrder,
  setActivityCode,
  setCashAmount,
  setCustomerAttribute,
  setDeliveryAttribute,
  setPaymentMethodList,
  setProductDetails,
} from "state/working-order/reducer";
import { FORM_TYPE } from "utils/constants";

export default function TouchScreenWorkingOrderPage() {
  const dispatch = useDispatch();

  const permissions = useSelector(getPermissions);
  const workingOrderId = useSelector(getWorkingOrderId);
  const servicePointId = useSelector(getServicePointId);
  const productDetails = useSelector(getProductDetails);
  const productDetailsList = useSelector(getProductDetailsList);
  const invoiceId = useSelector(getInvoiceId);
  const delivery = useSelector(getDeliveryDetails);
  const paymentInfo = useSelector(getPaymentInfo);

  const revokeOrders = permissions.filter(role => [1, 49].includes(role.IdRole)).length > 0;
  const isPriceChangeEnabled = permissions.filter(role => [1, 52].includes(role.IdRole)).length > 0;
  const revokeEnabled = workingOrderId > 0 && invoiceId === 0 && paymentInfo.totalPaid === 0 && revokeOrders;

  const handleClosing = () => {
    dispatch(getServicePointList({ activeFilter: true }));
    dispatch(setActiveSection(11));
  };

  return (
    <TouchScreenSalesPage
      disabledAddProduct={paymentInfo.totalPaid > 0}
      addProductDetails={value => dispatch(addDetails({ id: value }))}
      handleClose={handleClosing}
    >
      <OrderSummary
        orderId={workingOrderId}
        servicePointId={servicePointId}
        invoiceId={invoiceId}
        extraDetails={delivery.details}
        productDetails={productDetails}
        productDetailsList={productDetailsList}
        paymentInfo={paymentInfo}
        revokeAlertMessage={`Desea proceder con la anulación de la orden para la ${workingOrderId}?`}
        isPriceChangeEnabled={isPriceChangeEnabled}
        ticketsButtonEnabled={workingOrderId > 0 && paymentInfo.totalPaid === 0}
        invoiceButtonEnabled={
          invoiceId === 0 &&
          paymentInfo.totalSaved > 0 &&
          paymentInfo.totalSaved - paymentInfo.totalPaid === paymentInfo.summary.total
        }
        saveButtonEnabled={paymentInfo.totalPaid === 0 && paymentInfo.totalSaved !== paymentInfo.summary.total}
        revokeButtonEnabled={revokeEnabled}
        resetButtonEnabled={workingOrderId === 0}
        getCustomerDetails={customerId => dispatch(getCustomerDetailsAction({ id: customerId, type: FORM_TYPE.ORDER }))}
        setCustomerAttribute={attribute => dispatch(setCustomerAttribute(attribute))}
        setActivityCode={value => dispatch(setActivityCode(value))}
        setPaymentMethodList={list => dispatch(setPaymentMethodList(list))}
        setCashAmount={value => dispatch(setCashAmount(value))}
        setProductDetails={details => dispatch(setProductDetails(details))}
        updateProductDetailsList={value => dispatch(updateDetails({ pos: value }))}
        handleProductRemove={value => dispatch(removeDetails({ pos: value }))}
        handleSave={() => dispatch(saveWorkingOrder())}
        generateInvoice={() => dispatch(generateInvoice())}
        handleClose={handleClosing}
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
        setSummaryProductList={payload =>
          dispatch(setSummaryProductList({ inSummary: payload.inSummary, index: payload.index }))
        }
        handleTranslate={newServicePointId => dispatch(translateOrderServicePoint({ id: newServicePointId }))}
      />
    </TouchScreenSalesPage>
  );
}

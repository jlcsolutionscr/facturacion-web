import { useDispatch, useSelector } from "react-redux";
import { PaymentInfoType } from "types/domain";

import TouchScreenSalesPage from "components/touch-screen-sales";
import OrderSummary from "components/touch-screen-sales/order-summary";
import { getCustomerDetails as getCustomerDetailsAction } from "state/customer/asyncActions";
import { addDetails, removeDetails, revokeInvoice, saveInvoice, updateDetails } from "state/invoice/asyncActions";
import {
  getActivityCode,
  getCustomerDetails,
  getInvoiceId,
  getPaymentMethodList,
  getProductDetails,
  getProductDetailsList,
  getSummary,
  resetInvoice,
  setActivityCode,
  setCashAmount,
  setCustomerAttribute,
  setPaymentMethodList,
  setProductDetails,
} from "state/invoice/reducer";
import { getPermissions } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { FORM_TYPE } from "utils/constants";

export default function TouchScreenWorkingOrderPage() {
  const dispatch = useDispatch();

  const permissions = useSelector(getPermissions);
  const summary = useSelector(getSummary);
  const invoiceId = useSelector(getInvoiceId);
  const productDetails = useSelector(getProductDetails);
  const productDetailsList = useSelector(getProductDetailsList);
  const customerDetails = useSelector(getCustomerDetails);
  const paymentMethodList = useSelector(getPaymentMethodList);
  const activityCode = useSelector(getActivityCode);

  const paymentInfo: PaymentInfoType = {
    totalSaved: summary.total,
    totalPaid: 0,
    customerDetails,
    summary,
    paymentMethodList,
    activityCode,
  };

  const isPriceChangeEnabled = permissions.filter(role => [1, 52].includes(role.IdRole)).length > 0;

  const handleInvoiceClose = () => {
    dispatch(resetInvoice());
    dispatch(setActiveSection(0));
  };

  return (
    <TouchScreenSalesPage
      disabledAddProduct={invoiceId > 0}
      addProductDetails={id => dispatch(addDetails({ id }))}
      handleClose={() => dispatch(setActiveSection(0))}
    >
      <OrderSummary
        orderId={0}
        invoiceId={invoiceId}
        productDetails={productDetails}
        productDetailsList={productDetailsList.map(product => ({
          ...product,
          orderId: 0,
          paid: false,
          inSummary: true,
        }))}
        paymentInfo={paymentInfo}
        revokeAlertMessage={`Desea proceder con la anulación de la factura: ${invoiceId}?`}
        isPriceChangeEnabled={isPriceChangeEnabled}
        ticketsButtonEnabled={false}
        invoiceButtonEnabled={invoiceId === 0}
        saveButtonEnabled={false}
        revokeButtonEnabled={false}
        resetButtonEnabled={invoiceId === 0}
        getCustomerDetails={customerId =>
          dispatch(getCustomerDetailsAction({ id: customerId, type: FORM_TYPE.INVOICE }))
        }
        setCustomerAttribute={attribute => dispatch(setCustomerAttribute(attribute))}
        setActivityCode={value => dispatch(setActivityCode(value))}
        setPaymentMethodList={list => dispatch(setPaymentMethodList(list))}
        setCashAmount={value => dispatch(setCashAmount(value))}
        setProductDetails={details => dispatch(setProductDetails(details))}
        updateProductDetailsList={value => dispatch(updateDetails({ pos: value }))}
        handleProductRemove={value => dispatch(removeDetails({ pos: value }))}
        generateInvoice={() => dispatch(saveInvoice())}
        handleReset={() => dispatch(resetInvoice())}
        handleRevoke={() => dispatch(revokeInvoice({ id: invoiceId }))}
        handleClose={handleInvoiceClose}
      />
    </TouchScreenSalesPage>
  );
}

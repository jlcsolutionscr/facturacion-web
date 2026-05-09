import { CustomerDetailsType, DetalleProductoType } from "types/domain";

import { ORDER_STATUS } from "utils/constants";
import { defaultPaymentDetails, defaultProductDetails } from "utils/defaults";
import { getProductSummary } from "utils/domainHelper";
import { convertToDateString, roundNumber } from "utils/utilities";

export function parseWorkingOrderEntity(workingOrder: any) {
  const customerDetails: CustomerDetailsType = {
    id: workingOrder.IdCliente,
    name: workingOrder.NombreCliente,
    comercialName: workingOrder.NombreComercial,
    email: workingOrder.CorreoElectronico,
    phoneNumber: workingOrder.Telefono,
    activityCode: workingOrder.Cliente.CodigoActividad,
    exonerationType: workingOrder.Cliente.IdTipoExoneracion,
    exoneratedById: workingOrder.Cliente.IdNombreInstExoneracion,
    exonerationRef: workingOrder.Cliente.NumDocExoneracion,
    exonerationRef2: workingOrder.Cliente.ArticuloExoneracion,
    exonerationRef3: workingOrder.Cliente.IncisoExoneracion,
    exonerationPercentage: workingOrder.Cliente.PorcentajeExoneracion,
    exonerationDate: workingOrder.Cliente.FechaEmisionDoc,
    priceTypeId: workingOrder.Cliente.IdTipoPrecio,
  };
  const productDetailsList = workingOrder.DetalleOrdenServicio.map((item: DetalleProductoType) => ({
    id: item.IdProducto,
    orderId: workingOrder.IdOrden,
    quantity: item.Cantidad,
    code: item.Codigo,
    description: item.Descripcion,
    additionalInformation: item.InformacionAdicional,
    taxRate: item.PorcentajeIVA,
    unit: "UND",
    price: roundNumber(item.PrecioVenta * (1 + item.PorcentajeIVA / 100), 2),
    costPrice: item.Producto.PrecioCosto,
    disccountRate: 0,
  }));
  const summary = getProductSummary(productDetailsList, customerDetails.exonerationPercentage);
  return {
    id: workingOrder.IdOrden,
    consecutive: workingOrder.ConsecOrdenServicio,
    date: convertToDateString(workingOrder.Fecha),
    cashAdvance: workingOrder.MontoAdelanto,
    invoiceId: 0,
    status: ORDER_STATUS.READY,
    activityCode: workingOrder.CodigoActividad,
    customerDetails,
    productDetails: defaultProductDetails,
    productDetailsList,
    paymentDetailsList: [defaultPaymentDetails],
    vendorId: workingOrder.IdVendedor,
    currency: workingOrder.IdTipoMoneda,
    summary,
    delivery: {
      phone: workingOrder.Telefono,
      address: workingOrder.Direccion,
      description: workingOrder.Descripcion,
      date: workingOrder.FechaEntrega,
      time: workingOrder.HoraEntrega,
      details: workingOrder.OtrosDetalles,
    },
  };
}

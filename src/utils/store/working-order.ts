import { CustomerDetailsType, DetalleProductoType, PaymentInfoType, WorkingOrderType } from "types/domain";

import { ORDER_STATUS } from "utils/constants";
import { defaultPaymentMethod, defaultProductDetails } from "utils/defaults";
import { getProductSummary } from "utils/domainHelper";
import { convertToDateString, roundNumber } from "utils/utilities";

export function parseWorkingOrderEntity(entity: any, servicePointId: number) {
  const customerDetails: CustomerDetailsType = {
    id: entity.IdCliente,
    name: entity.NombreCliente,
    comercialName: entity.NombreComercial,
    email: entity.CorreoElectronico,
    phoneNumber: entity.Telefono,
    activityCode: entity.Cliente.CodigoActividad,
    exonerationType: entity.Cliente.IdTipoExoneracion,
    exoneratedById: entity.Cliente.IdNombreInstExoneracion,
    exonerationRef: entity.Cliente.NumDocExoneracion,
    exonerationRef2: entity.Cliente.ArticuloExoneracion,
    exonerationRef3: entity.Cliente.IncisoExoneracion,
    exonerationPercentage: entity.Cliente.PorcentajeExoneracion,
    exonerationDate: entity.Cliente.FechaEmisionDoc,
    priceTypeId: entity.Cliente.IdTipoPrecio,
  };
  const productDetailsList = entity.DetalleOrdenServicio.map((item: DetalleProductoType) => ({
    id: item.IdProducto,
    orderId: entity.IdOrden,
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
  const workingOrder: WorkingOrderType = {
    id: entity.IdOrden,
    servicePointId: servicePointId,
    consecutive: entity.ConsecOrdenServicio,
    date: convertToDateString(entity.Fecha),
    cashAdvance: entity.MontoAdelanto,
    invoiceId: 0,
    status: ORDER_STATUS.READY,
    activityCode: entity.CodigoActividad,
    productDetails: defaultProductDetails,
    productDetailsList,
    vendorId: entity.IdVendedor,
    currency: entity.IdTipoMoneda,
    delivery: {
      phone: entity.Telefono,
      address: entity.Direccion,
      description: entity.Descripcion,
      date: entity.FechaEntrega,
      time: entity.HoraEntrega,
      details: entity.OtrosDetalles,
    },
    total: 0,
  };
  const paymentInfo: PaymentInfoType = {
    customerDetails,
    paymentMethodList: [defaultPaymentMethod],
    pendingProductList: [],
    summaryProductList: productDetailsList,
    summary,
  };
  return { workingOrder, paymentInfo };
}

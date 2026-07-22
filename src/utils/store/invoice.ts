import { CustomerDetailsType, DetalleProductoType, InvoiceType, ProductDetailsType } from "types/domain";

import { defaultPaymentMethod, defaultProductDetails } from "utils/defaults";
import { getProductsSummary } from "utils/domainHelper";
import { convertToDateString, roundNumber } from "utils/utilities";

export function parseInvoiceEntity(entity: any) {
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
  const productDetailsList: ProductDetailsType[] = [];
  entity.DetalleFactura.forEach((item: DetalleProductoType) => {
    const orderItem = {
      id: item.IdProducto,
      orderId: entity.IdOrden,
      quantity: item.Cantidad.toString(),
      code: item.Producto.Codigo,
      description: item.Descripcion,
      additionalInformation: "",
      taxRate: item.PorcentajeIVA,
      unit: "UND",
      price: roundNumber(item.PrecioVenta * (1 + item.PorcentajeIVA / 100), 2).toString(),
      costPrice: item.Producto.PrecioCosto,
      disccountRate: 0,
      isService: item.Producto.EsServicio,
    };
    productDetailsList.push(orderItem);
  });
  const summary = getProductsSummary(productDetailsList, customerDetails.exonerationPercentage);
  const invoice: InvoiceType = {
    invoiceId: entity.IdFactura,
    consecutive: entity.ConsecFactura,
    date: convertToDateString(entity.Fecha),
    activityCode: entity.CodigoActividad,
    customerDetails,
    cashAdvance: 0,
    productDetails: defaultProductDetails,
    productDetailsList,
    paymentMethodList: [defaultPaymentMethod],
    summary,
    comment: entity.TextoAdicional,
    currency: entity.IdTipoMoneda,
    paid: !entity.PendientePago,
  };
  return { invoice };
}

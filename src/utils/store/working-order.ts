import {
  CompanyType,
  CustomerDetailsType,
  DetalleProductoType,
  PaymentInfoType,
  WorkingOrderProductDetailsType,
  WorkingOrderType,
} from "types/domain";

import { ORDER_STATUS } from "utils/constants";
import { defaultPaymentMethod, defaultProductDetails } from "utils/defaults";
import { getProductsSummary } from "utils/domainHelper";
import { convertToDateString, roundNumber } from "utils/utilities";

export function parseWorkingOrderEntity(entity: any, company: CompanyType | null, servicePointId: number) {
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
  const productDetailsList: WorkingOrderProductDetailsType[] = [];
  let totalSaved = 0;
  let totalPaid = 0;
  entity.DetalleOrdenServicio.forEach((item: DetalleProductoType) => {
    const orderItem = {
      id: item.IdProducto,
      orderId: entity.IdOrden,
      quantity: item.Cantidad.toString(),
      code: item.Codigo,
      description: item.Descripcion,
      additionalInformation: item.InformacionAdicional,
      taxRate: item.PorcentajeIVA,
      unit: "UND",
      price: roundNumber(item.PrecioVenta * (1 + item.PorcentajeIVA / 100), 2).toString(),
      costPrice: item.Producto.PrecioCosto,
      disccountRate: 0,
      paid: item.Pagado,
      inSummary: item.Pagado ? false : true,
      isService: item.Producto.EsServicio,
    };
    productDetailsList.push(orderItem);
    const total = parseFloat(orderItem.quantity) * parseFloat(orderItem.price);
    totalSaved += total;
    totalPaid += item.Pagado ? total : 0;
  });
  const summary = getProductsSummary(
    productDetailsList.filter(product => !product.paid && product.inSummary),
    customerDetails.exonerationPercentage
  );
  const workingOrder: WorkingOrderType = {
    id: entity.IdOrden,
    servicePointId: servicePointId,
    consecutive: entity.ConsecOrdenServicio,
    date: convertToDateString(entity.Fecha),
    cashAdvance: entity.MontoAdelanto,
    invoiceId: 0,
    status: ORDER_STATUS.READY,
    productDetails: defaultProductDetails,
    productDetailsList,
    delivery: {
      phone: entity.Telefono,
      address: entity.Direccion,
      description: entity.Descripcion,
      date: entity.FechaEntrega,
      time: entity.HoraEntrega,
      details: entity.OtrosDetalles,
    },
  };
  const paymentInfo: PaymentInfoType = {
    customerDetails,
    totalSaved,
    totalPaid,
    activityCode: company?.ActividadEconomicaEmpresa[0] ? company?.ActividadEconomicaEmpresa[0].CodigoActividad : 0,
    paymentMethodList: [defaultPaymentMethod],
    summary,
  };
  return { workingOrder, paymentInfo };
}

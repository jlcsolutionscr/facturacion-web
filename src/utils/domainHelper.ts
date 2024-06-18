import { saveAs } from "file-saver";
import {
  CompanyType,
  CustomerDetailsType,
  CustomerType,
  DetallePagoType,
  DetalleProductoType,
  IdDescriptionValueType,
  InvoiceType,
  PaymentDetailsType,
  ProductDetailsType,
  ProductType,
  ReceiptType,
  SummaryType,
  WorkingOrderType,
} from "types/domain";

import { defaultCustomerDetails, defaultProductDetails } from "./defaults";
import {
  convertToDateString,
  convertToDateTimeString,
  encryptString,
  getTaxeRateFromId,
  getWithResponse,
  post,
  postWithResponse,
  roundNumber,
} from "./utilities";

const SERVICE_URL = import.meta.env.VITE_APP_SERVER_URL;
const APP_URL = `${SERVICE_URL}/puntoventa`;

type DetalleFacturaType = {
  IdFactura: number;
  IdProducto: number;
  Descripcion: string;
  Cantidad: number;
  PrecioVenta: number;
  Excento: boolean;
  PrecioCosto: number;
  PorcentajeIVA: number;
  PorcDescuento: number;
};

type DetalleOrdenServicioType = {
  IdOrden: number;
  IdProducto: number;
  Descripcion: string;
  Cantidad: number;
  PrecioVenta: number;
  Excento: boolean;
  PorcentajeIVA: number;
  PorcDescuento: number;
};

type DetalleFacturaCompraType = {
  Linea: number;
  Cantidad: number;
  Codigo: string;
  Descripcion: string;
  IdImpuesto: number;
  PorcentajeIVA: number;
  UnidadMedida: string;
  PrecioVenta: number;
};

type DetalleProformaType = {
  IdProforma: number;
  IdProducto: number;
  Descripcion: string;
  Cantidad: number;
  PrecioVenta: number;
  Excento: boolean;
  PrecioCosto: number;
  PorcentajeIVA: number;
  PorcDescuento: number;
};

export async function requestUserLogin(user: string, password: string, id: string) {
  const ecryptedPass = encryptString(password);
  const endpoint =
    APP_URL + "/validarcredencialesweb?usuario=" + user + "&clave=" + ecryptedPass + "&identificacion=" + id;
  const company = await getWithResponse(endpoint, "");
  return company;
}

export async function getCompanyEntity(token: string, companyId: number) {
  const data = "{NombreMetodo: 'ObtenerEmpresa', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return {
    IdEmpresa: response.IdEmpresa,
    NombreEmpresa: response.NombreEmpresa,
    NombreComercial: response.NombreComercial,
    IdTipoIdentificacion: response.IdTipoIdentificacion,
    Identificacion: response.Identificacion,
    IdProvincia: response.IdProvincia,
    IdCanton: response.IdCanton,
    IdDistrito: response.IdDistrito,
    IdBarrio: response.IdBarrio,
    IdTipoMoneda: response.IdTipoMoneda,
    Direccion: response.Direccion,
    Telefono1: response.Telefono1,
    Telefono2: response.Telefono2,
    TipoContrato: response.TipoContrato,
    CantidadDisponible: response.CantidadDisponible,
    FechaVence: response.FechaVence,
    LineasPorFactura: response.LineasPorFactura,
    Contabiliza: response.Contabiliza,
    AutoCompletaProducto: response.AutoCompletaProducto,
    RegimenSimplificado: response.RegimenSimplificado,
    PermiteFacturar: response.PermiteFacturar,
    RecepcionGastos: response.RecepcionGastos,
    AsignaVendedorPorDefecto: response.AsignaVendedorPorDefecto,
    IngresaPagoCliente: response.IngresaPagoCliente,
    PrecioVentaIncluyeIVA: response.PrecioVentaIncluyeIVA,
    CorreoNotificacion: response.CorreoNotificacion,
    MontoRedondeoDescuento: response.MontoRedondeoDescuento,
    LeyendaFactura: response.LeyendaFactura,
    LeyendaProforma: response.LeyendaProforma,
    LeyendaApartado: response.LeyendaApartado,
    LeyendaOrdenServicio: response.LeyendaOrdenServicio,
    Modalidad: response.Modalidad,
    ActividadEconomicaEmpresa: response.ActividadEconomicaEmpresa,
  };
}

export async function saveCompanyEntity(token: string, company: CompanyType) {
  const data = "{NombreMetodo: 'ActualizarEmpresa', Entidad: '" + JSON.stringify(company) + "'}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getCompanyLogo(token: string, companyId: number) {
  const data = "{NombreMetodo: 'ObtenerLogotipoEmpresa', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function saveCompanyLogo(token: string, companyId: number, strLogo: string) {
  const data =
    "{NombreMetodo: 'ActualizarLogoEmpresa', Parametros: {IdEmpresa: " + companyId + ", Logotipo: '" + strLogo + "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function validateCredentials(token: string, userCode: string, userPass: string) {
  const data =
    "{NombreMetodo: 'ValidarCredencialesHacienda', Parametros: {CodigoUsuario: '" +
    userCode +
    "', Clave: '" +
    userPass +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function validateCertificate(token: string, strPin: string, strCertificate: string) {
  const data =
    "{NombreMetodo: 'ValidarCertificadoHacienda', Parametros: {PinCertificado: '" +
    strPin +
    "', Certificado: '" +
    strCertificate +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getCredentialsEntity(token: string, companyId: number) {
  const data = "{NombreMetodo: 'ObtenerCredencialesHacienda', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function saveCredentialsEntity(
  token: string,
  companyId: number,
  userCode: string,
  userPass: string,
  strCertificateName: string,
  strPin: string,
  strCertificate: string
) {
  const data =
    "{NombreMetodo: 'AgregarCredencialesHacienda', Parametros: {IdEmpresa: " +
    companyId +
    ", Usuario: '" +
    userCode +
    "', Clave: '" +
    userPass +
    "', NombreCertificado: '" +
    strCertificateName +
    "', PinCertificado: '" +
    strPin +
    "', Certificado: '" +
    strCertificate +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function updateCredentialsEntity(
  token: string,
  companyId: number,
  userCode: string,
  userPass: string,
  strCertificateName: string,
  strPin: string,
  strCertificate: string
) {
  const data =
    "{NombreMetodo: 'ActualizarCredencialesHacienda', Parametros: {IdEmpresa: " +
    companyId +
    ", Usuario: '" +
    userCode +
    "', Clave: '" +
    userPass +
    "', NombreCertificado: '" +
    strCertificateName +
    "', PinCertificado: '" +
    strPin +
    "', Certificado: '" +
    strCertificate +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getCantonList(token: string, provinceId: number) {
  const data = "{NombreMetodo: 'ObtenerListadoCantones', Parametros: {IdProvincia: " + provinceId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getDistritoList(token: string, provinceId: number, cantonId: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoDistritos', Parametros: {IdProvincia: " +
    provinceId +
    ", IdCanton: " +
    cantonId +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getBarrioList(token: string, provinceId: number, cantonId: number, districtId: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoBarrios', Parametros: {IdProvincia: " +
    provinceId +
    ", IdCanton: " +
    cantonId +
    ", IdDistrito: " +
    districtId +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getEconomicActivityList(token: string, id: number) {
  const data = "{NombreMetodo: 'ObtenerListadoActividadEconomica', Parametros: {Identificacion: '" + id + "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getBranchList(token: string, companyId: number) {
  const data = "{NombreMetodo: 'ObtenerListadoSucursales', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getVendorList(token: string, companyId: number) {
  const data = "{NombreMetodo: 'ObtenerListadoVendedores', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getReportData(
  token: string,
  reportName: string,
  companyId: number,
  branchId: number,
  startDate: string,
  endDate: string
) {
  const data =
    "{NombreMetodo: 'ObtenerDatosReporte', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", NombreReporte: '" +
    reportName +
    "', FechaInicial: '" +
    startDate +
    "', FechaFinal: '" +
    endDate +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getCustomerListCount(token: string, companyId: number, strFilter: string) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaClientes', Parametros: {IdEmpresa: " +
    companyId +
    ", Nombre: '" +
    strFilter +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function getCustomerListPerPage(
  token: string,
  companyId: number,
  pageNumber: number,
  rowsPerPage: number,
  strFilter: string
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoClientes', Parametros: {IdEmpresa: " +
    companyId +
    ", NumeroPagina: " +
    pageNumber +
    ", FilasPorPagina: " +
    rowsPerPage +
    ", Nombre: '" +
    strFilter +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getCustomerEntity(token: string, customerId: number) {
  const data = "{NombreMetodo: 'ObtenerCliente', Parametros: {IdCliente: " + customerId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getCustomerByIdentifier(token: string, companyId: number, identifier: string) {
  const data =
    "{NombreMetodo: 'ValidaIdentificacionCliente', Parametros: {IdEmpresa: " +
    companyId +
    ", Identificacion: '" +
    identifier +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function saveCustomerEntity(token: string, customer: CustomerType) {
  const entidad = JSON.stringify(customer);
  const data =
    "{NombreMetodo: '" + (customer.IdCliente ? "ActualizarCliente" : "AgregarCliente") + "', Entidad: " + entidad + "}";
  const response = await post(APP_URL + "/ejecutar", token, data);
  if (response === null) return null;
  return response;
}

export async function getProductCategoryList(token: string, companyId: number) {
  const data = "{NombreMetodo: 'ObtenerListadoLineas', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getProductProviderList(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoProveedores', Parametros: {IdEmpresa: " +
    companyId +
    ", NumeroPagina: 1, FilasPorPagina: 0}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getProductListCount(
  token: string,
  companyId: number,
  branchId: number,
  activeOnly: boolean,
  filterText: string,
  type: number
) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaProductos', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", IncluyeServicios: 'true', FiltraActivos: '" +
    activeOnly +
    "', IdLinea: 0, Codigo: '" +
    (type === 1 ? filterText : "") +
    "', Descripcion: '" +
    (type === 2 ? filterText : "") +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function getProductListPerPage(
  token: string,
  companyId: number,
  branchId: number,
  activeOnly: boolean,
  page: number,
  rowsPerPage: number,
  filterText: string,
  type: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoProductos', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", NumeroPagina: " +
    page +
    ", FilasPorPagina: " +
    rowsPerPage +
    ", IncluyeServicios: 'true', FiltraActivos: '" +
    activeOnly +
    "', IdLinea: 0, Codigo: '" +
    (type === 1 ? filterText : "") +
    "', Descripcion: '" +
    (type === 2 ? filterText : "") +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getProductEntity(token: string, productId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'ObtenerProducto', Parametros: {IdProducto: " + productId + ", IdSucursal: " + branchId + "}}";
  const product = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (product === null) return null;
  return product;
}

export async function getProductClasification(token: string, code: string) {
  const data = "{NombreMetodo: 'ObtenerClasificacionProducto', Parametros: {Codigo: '" + code + "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (!response) return null;
  return { id: response.Id, value: response.Impuesto };
}

export async function saveProductEntity(token: string, product: ProductType) {
  const entidad = JSON.stringify(product);
  const data =
    "{NombreMetodo: '" +
    (product.IdProducto ? "ActualizarProducto" : "AgregarProducto") +
    "', Entidad: " +
    entidad +
    "}";
  const response = await post(APP_URL + "/ejecutar", token, data);
  if (response === null) return null;
  return response;
}

export async function getExonerationTypeList(token: string) {
  const data = "{NombreMetodo: 'ObtenerListadoTipoExoneracion'}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getPaymentBankId(token: string, companyId: number, paymentMethod: number) {
  let data;
  if (paymentMethod === 1 || paymentMethod === 2) {
    data = "{NombreMetodo: 'ObtenerListadoBancoAdquiriente', Parametros: {IdEmpresa: " + companyId + "}}";
  } else {
    data = "{NombreMetodo: 'ObtenerListadoCuentasBanco', Parametros: {IdEmpresa: " + companyId + "}}";
  }
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  if (response.length === 0) return null;
  return response[0].Id;
}

export async function getServicePointList(
  token: string,
  companyId: number,
  branchId: number,
  active: boolean,
  strDescription: string
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoPuntoDeServicio', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", FiltraActivos: '" +
    active +
    "', Descripcion: '" +
    strDescription +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export function getCustomerPrice(
  customerPriceType: number,
  product: ProductType,
  taxRateTypeList: IdDescriptionValueType[]
) {
  let customerPrice = 0;
  const taxRate = getTaxeRateFromId(taxRateTypeList, product.IdImpuesto);
  switch (customerPriceType) {
    case 1:
      customerPrice = product.PrecioVenta1;
      break;
    case 2:
      customerPrice = product.PrecioVenta2;
      break;
    case 3:
      customerPrice = product.PrecioVenta3;
      break;
    case 4:
      customerPrice = product.PrecioVenta4;
      break;
    case 5:
      customerPrice = product.PrecioVenta5;
      break;
    default:
      customerPrice = product.PrecioVenta1;
  }
  return { taxRate, price: customerPrice };
}

export function getTaxedPrice(
  productTaxRate: number,
  productPrice: number,
  priceIncludedTaxes: boolean,
  customerTaxRate: number
) {
  const taxRate = customerTaxRate;
  const untaxedPrice = priceIncludedTaxes ? roundNumber(productPrice / (1 + productTaxRate / 100), 3) : productPrice;
  let pricePlusTaxes = priceIncludedTaxes ? untaxedPrice : productPrice;
  if (taxRate > 0) pricePlusTaxes = roundNumber(untaxedPrice * (1 + taxRate / 100), 2);
  return { taxRate, price: untaxedPrice, pricePlusTaxes };
}

export function getProductSummary(products: ProductDetailsType[], disccountedDercentage: number) {
  let taxed = 0;
  let exonerated = 0;
  let exempt = 0;
  let subTotal = 0;
  let taxes = 0;
  let total = 0;
  const totalCost = 0;
  products.forEach(item => {
    const untaxPrice = item.price;
    if (item.taxRate > 0) {
      let taxesAmount = (untaxPrice * item.taxRate) / 100;
      if (disccountedDercentage > 0) {
        const disccountedPrice = untaxPrice * (1 - disccountedDercentage / 100);
        taxed += roundNumber(disccountedPrice, 2) * item.quantity;
        exonerated += roundNumber(untaxPrice - disccountedPrice, 2) * item.quantity;
        taxesAmount = (disccountedPrice * item.taxRate) / 100;
      } else {
        taxed += roundNumber(untaxPrice, 2) * item.quantity;
      }
      taxes += roundNumber(taxesAmount, 2) * item.quantity;
    } else {
      exempt += roundNumber(untaxPrice, 2) * item.quantity;
    }
  });
  subTotal = taxed + exonerated + exempt;
  total = subTotal + taxes;
  return {
    taxed: roundNumber(taxed, 2),
    exonerated: roundNumber(exonerated, 2),
    exempt: roundNumber(exempt, 2),
    subTotal: roundNumber(subTotal, 2),
    taxes: roundNumber(taxes, 2),
    total: roundNumber(total, 2),
    totalCost: roundNumber(totalCost, 2),
  };
}

export async function saveInvoiceEntity(
  token: string,
  userId: number,
  companyId: number,
  branchId: number,
  activityCode: number,
  paymentDetailsList: PaymentDetailsType[],
  cashAdvance: number,
  currencyType: number,
  vendorId: number,
  orderId: number,
  customerDetails: CustomerDetailsType,
  productDetailsList: ProductDetailsType[],
  summary: SummaryType,
  comment: string
) {
  const bankId = await getPaymentBankId(token, companyId, paymentDetailsList[0].paymentId);
  const invoiceDetails: DetalleFacturaType[] = [];
  productDetailsList.forEach(item => {
    const detail = {
      IdFactura: 0,
      IdProducto: parseInt(item.id),
      Descripcion: item.description,
      Cantidad: item.quantity,
      PrecioVenta: roundNumber(item.price / (1 + item.taxRate / 100), 3),
      Excento: item.taxRate === 0,
      PrecioCosto: item.costPrice,
      PorcentajeIVA: item.taxRate,
      PorcDescuento: item.disccountRate,
    };
    invoiceDetails.push(detail);
  });
  const invoicePayments = [
    {
      IdConsecutivo: 0,
      IdFactura: 0,
      IdFormaPago: paymentDetailsList[0].paymentId,
      IdTipoMoneda: currencyType,
      IdCuentaBanco: bankId,
      TipoTarjeta: "",
      NroMovimiento: "",
      MontoLocal: summary.total - cashAdvance,
      TipoDeCambio: 1,
    },
  ];
  const invoiceDate = convertToDateTimeString(new Date());
  const invoice = {
    IdEmpresa: companyId,
    IdSucursal: branchId,
    CodigoActividad: activityCode,
    IdTerminal: 1,
    IdFactura: 0,
    IdUsuario: userId,
    IdTipoMoneda: 1,
    TipoDeCambioDolar: 0,
    IdCliente: customerDetails.id,
    NombreCliente: customerDetails.name,
    IdCondicionVenta: 1,
    PlazoCredito: 0,
    Fecha: invoiceDate,
    TextoAdicional: comment,
    IdVendedor: vendorId,
    Excento: summary.exempt,
    Gravado: summary.taxed,
    Exonerado: summary.exonerated,
    Descuento: 0,
    Impuesto: summary.taxes,
    TotalCosto: summary.totalCost,
    MontoPagado: summary.total,
    MontoAdelanto: cashAdvance,
    IdTipoExoneracion: customerDetails.exonerationType,
    NumDocExoneracion: customerDetails.exonerationRef,
    NombreInstExoneracion: customerDetails.exoneratedBy,
    FechaEmisionDoc: convertToDateTimeString(customerDetails.exonerationDate),
    PorcentajeExoneracion: customerDetails.exonerationPercentage,
    IdCxC: 0,
    IdAsiento: 0,
    IdMovBanco: 0,
    IdOrdenServicio: orderId,
    IdProforma: 0,
    DetalleFactura: invoiceDetails,
    DesglosePagoFactura: invoicePayments,
  };
  const data = "{NombreMetodo: 'AgregarFactura', Entidad: " + JSON.stringify(invoice) + "}";
  const invoiceId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  const ids = invoiceId.split("-");
  return {
    id: ids[0],
    consecutive: ids[1],
  };
}

export async function revokeInvoiceEntity(token: string, invoiceId: number, idUser: number) {
  const data = "{NombreMetodo: 'AnularFactura', Parametros: {IdFactura: " + invoiceId + ", IdUsuario: " + idUser + "}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getInvoiceEntity(token: string, invoiceId: number) {
  const data = "{NombreMetodo: 'ObtenerFactura', Parametros: {IdFactura: " + invoiceId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getProcessedInvoiceListCount(token: string, companyId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaFacturas', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function getProcessedInvoiceListPerPage(
  token: string,
  companyId: number,
  branchId: number,
  pageNumber: number,
  rowPerPage: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoFacturas', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", NumeroPagina: " +
    pageNumber +
    ",FilasPorPagina: " +
    rowPerPage +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function saveWorkingOrderEntity(
  token: string,
  userId: number,
  branchId: number,
  companyId: number,
  order: WorkingOrderType
) {
  const workingOrderDetails: DetalleOrdenServicioType[] = [];
  order.productDetailsList.forEach(item => {
    const detail = {
      IdOrden: order.id,
      IdProducto: parseInt(item.id),
      Codigo: item.code,
      Descripcion: item.description,
      Cantidad: item.quantity,
      PrecioVenta: roundNumber(item.price / (1 + item.taxRate / 100), 3),
      Excento: item.taxRate === 0,
      PorcentajeIVA: item.taxRate,
      PorcDescuento: item.disccountRate,
    };
    workingOrderDetails.push(detail);
  });
  const workingOrderDate = convertToDateTimeString(new Date());
  const workingOrder = {
    IdEmpresa: companyId,
    IdSucursal: branchId,
    IdTerminal: 1,
    IdOrden: order.id,
    ConsecOrdenServicio: order?.consecutive,
    IdUsuario: userId,
    IdTipoMoneda: 1,
    IdCliente: order.customerDetails.id,
    NombreCliente: order.customerDetails.name,
    Fecha: workingOrderDate,
    IdVendedor: order.vendorId,
    Telefono: order.delivery.phone,
    Direccion: order.delivery.address,
    Descripcion: order.delivery.description,
    FechaEntrega: order.delivery.date,
    HoraEntrega: order.delivery.time,
    OtrosDetalles: order.delivery.details,
    Excento: order.summary.exempt,
    Gravado: order.summary.taxed,
    Exonerado: order.summary.exonerated,
    Descuento: 0,
    Impuesto: order.summary.taxes,
    MontoAdelanto: order.cashAdvance,
    MontoPagado: 0,
    Nulo: false,
    DetalleOrdenServicio: workingOrderDetails,
  };
  const data =
    "{NombreMetodo: '" +
    (order.id === 0 ? "AgregarOrdenServicio" : "ActualizarOrdenServicio") +
    "', Entidad: " +
    JSON.stringify(workingOrder) +
    "}";
  if (order.id === 0) {
    const workingOrderId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
    const ids = workingOrderId.split("-");
    return {
      id: ids[0],
      consecutive: ids[1],
    };
  } else {
    await post(APP_URL + "/ejecutar", token, data);
  }
}

export async function revokeWorkingOrderEntity(token: string, orderId: number, idUser: number) {
  const data =
    "{NombreMetodo: 'AnularOrdenServicio', Parametros: {IdOrdenServicio: " + orderId + ", IdUsuario: " + idUser + "}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getWorkingOrderEntity(token: string, orderId: number) {
  const data = "{NombreMetodo: 'ObtenerOrdenServicio', Parametros: {IdOrdenServicio: " + orderId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getWorkingOrderListCount(
  token: string,
  companyId: number,
  branchId: number,
  bolApplied: boolean
) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaOrdenServicio', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", Aplicado: '" +
    bolApplied +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function getWorkingOrderListPerPage(
  token: string,
  companyId: number,
  branchId: number,
  bolApplied: boolean,
  pageNumber: number,
  rowPerPage: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoOrdenServicio', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", NumeroPagina: " +
    pageNumber +
    ", Aplicado: '" +
    bolApplied +
    "', FilasPorPagina: " +
    rowPerPage +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getDocumentListCount(token: string, companyId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'ObtenerTotalDocumentosElectronicosProcesados', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function getDocumentListPerPage(
  token: string,
  companyId: number,
  branchId: number,
  pageNumber: number,
  rowPerPage: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoDocumentosElectronicosProcesados', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", NumeroPagina: " +
    pageNumber +
    ",FilasPorPagina: " +
    rowPerPage +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getDocumentEntity(token: string, idDocument: number) {
  const data = "{NombreMetodo: 'ObtenerDocumentoElectronico', Parametros: {IdDocumento: " + idDocument + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function sendDocumentByEmail(token: string, idDocument: number, emailTo: string) {
  const data =
    "{NombreMetodo: 'EnviarNotificacionDocumentoElectronico', Parametros: {IdDocumento: " +
    idDocument +
    ", CorreoReceptor: '" +
    emailTo +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function sendReportEmail(
  token: string,
  companyId: number,
  branchId: number,
  reportName: string,
  startDate: string,
  endDate: string
) {
  if (reportName !== "") {
    const data =
      "{NombreMetodo: 'EnviarReportePorCorreoElectronico', Parametros: {IdEmpresa: " +
      companyId +
      ", IdSucursal: " +
      branchId +
      ", NombreReporte: '" +
      reportName +
      "', FechaInicial: '" +
      startDate +
      "', FechaFinal: '" +
      endDate +
      "', FormatoReporte: 'PDF'}}";
    await post(APP_URL + "/ejecutar", token, data);
  }
}

export async function generateInvoicePDF(token: string, invoiceId: number, ref: number) {
  const data = "{NombreMetodo: 'ObtenerFacturaPDF', Parametros: {IdFactura: " + invoiceId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/octet-stream" });
    saveAs(file, `Factura-${ref}.pdf`);
  }
}

export async function generateWorkingOrderPDF(token: string, orderId: number, ref: number) {
  const data = "{NombreMetodo: 'ObtenerOrdenServicioPDF', Parametros: {IdOrden: " + orderId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/octet-stream" });
    saveAs(file, `OrdenServicio-${ref}.pdf`);
  }
}

export async function saveReceiptEntity(
  token: string,
  userId: number,
  branchId: number,
  companyId: number,
  receipt: ReceiptType
) {
  const receiptDetails: DetalleFacturaCompraType[] = [];
  receipt.productDetailsList.forEach((item, index) => {
    const detail = {
      Linea: index + 1,
      Cantidad: item.quantity,
      Codigo: item.code,
      Descripcion: item.description,
      IdImpuesto: item.taxRateType ?? 13,
      PorcentajeIVA: item.taxRate,
      UnidadMedida: item.unit,
      PrecioVenta: roundNumber(item.price / (1 + item.taxRate / 100), 3),
    };
    receiptDetails.push(detail);
  });
  const receiptDate = convertToDateTimeString(new Date());
  const newReceipt = {
    IdEmpresa: companyId,
    CodigoActividad: receipt.activityCode,
    IdSucursal: branchId,
    IdTerminal: 1,
    IdUsuario: userId,
    IdTipoMoneda: 1,
    Fecha: receiptDate,
    IdCondicionVenta: 1,
    PlazoCredito: 0,
    NombreEmisor: receipt.issuer.name,
    IdTipoIdentificacion: receipt.issuer.typeId,
    IdentificacionEmisor: receipt.issuer.id,
    NombreComercialEmisor: receipt.issuer.comercialName,
    TelefonoEmisor: receipt.issuer.phone,
    IdProvinciaEmisor: 1,
    IdCantonEmisor: 1,
    IdDistritoEmisor: 1,
    IdBarrioEmisor: 1,
    DireccionEmisor: receipt.issuer.address,
    CorreoElectronicoEmisor: receipt.issuer.email,
    IdTipoExoneracion: receipt.exoneration.type,
    NumDocExoneracion: receipt.exoneration.ref,
    NombreInstExoneracion: receipt.exoneration.exoneratedBy,
    FechaEmisionDoc: convertToDateTimeString(receipt.exoneration.date),
    PorcentajeExoneracion: receipt.exoneration.percentage,
    TextoAdicional: "",
    Excento: receipt.summary.exempt,
    Gravado: receipt.summary.taxed,
    Exonerado: receipt.summary.exonerated,
    Descuento: 0,
    Impuesto: receipt.summary.taxes,
    DetalleFacturaCompra: receiptDetails,
  };
  const data = "{NombreMetodo: 'AgregarFacturaCompra', Entidad: " + JSON.stringify(newReceipt) + "}";
  const receiptId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return receiptId;
}

export async function getProductClasificationList(token: string, filterText: string) {
  const data =
    "{NombreMetodo: 'ObtenerListadoClasificacionProducto', Parametros: {NumeroPagina: 1, FilasPorPagina: " +
    100 +
    ", Descripcion: '" +
    filterText +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function saveProformaEntity(
  token: string,
  userId: number,
  companyId: number,
  branchId: number,
  vendorId: number,
  customerDetails: CustomerDetailsType,
  productDetailsList: ProductDetailsType[],
  summary: SummaryType,
  comment: string
) {
  const proformaDetails: DetalleProformaType[] = [];
  productDetailsList.forEach(item => {
    const detail = {
      IdProforma: 0,
      IdProducto: parseInt(item.id),
      Codigo: item.code,
      Descripcion: item.description,
      Cantidad: item.quantity,
      PrecioVenta: roundNumber(item.price / (1 + item.taxRate / 100), 3),
      PrecioCosto: item.costPrice,
      Excento: item.taxRate === 0,
      PorcentajeIVA: item.taxRate,
      PorcDescuento: 0,
    };
    proformaDetails.push(detail);
  });
  const proformaDate = convertToDateTimeString(new Date());
  const proforma = {
    IdEmpresa: companyId,
    IdSucursal: branchId,
    IdProforma: 0,
    IdUsuario: userId,
    IdTipoMoneda: 1,
    IdCliente: customerDetails.id,
    NombreCliente: customerDetails.name,
    Fecha: proformaDate,
    TextoAdicional: comment,
    Telefono: "",
    IdVendedor: vendorId,
    Excento: summary.exempt,
    Gravado: summary.taxed,
    Exonerado: summary.exonerated,
    Descuento: 0,
    Impuesto: summary.taxes,
    DetalleProforma: proformaDetails,
  };
  const data = "{NombreMetodo: 'AgregarProforma', Entidad: " + JSON.stringify(proforma) + "}";
  const proformaId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  const ids = proformaId.split("-");
  return {
    id: ids[0],
    consecutive: ids[1],
  };
}

export async function revokeProformaEntity(token: string, proformaId: number, idUser: number) {
  const data =
    "{NombreMetodo: 'AnularProforma', Parametros: {IdProforma: " + proformaId + ", IdUsuario: " + idUser + "}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function generateProformaPDF(token: string, proformaId: number, ref: number) {
  const data = "{NombreMetodo: 'ObtenerProformaPDF', Parametros: {IdProforma: " + proformaId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/octet-stream" });
    saveAs(file, `OrdenServicio-${ref}.pdf`);
  }
}

export async function getProformaListCount(token: string, companyId: number, branchId: number, bolApplied: boolean) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaProformas', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", Aplicado: '" +
    bolApplied +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function getProformaListPerPage(
  token: string,
  companyId: number,
  branchId: number,
  bolApplied: boolean,
  pageNumber: number,
  rowPerPage: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoProformas', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", NumeroPagina: " +
    pageNumber +
    ", Aplicado: '" +
    bolApplied +
    "', FilasPorPagina: " +
    rowPerPage +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export function parseInvoiceEntity(entity: any, taxTypeList: IdDescriptionValueType[]) {
  const customerDetails = {
    id: entity.IdCliente,
    name: entity.NombreCliente,
    exonerationType: entity.Cliente.IdTipoExoneracion,
    exonerationRef: entity.Cliente.NumDocExoneracion,
    exoneratedBy: entity.Cliente.NumDocExoneracion,
    exonerationPercentage: entity.Cliente.PorcentajeExoneracion,
    exonerationDate: entity.Cliente.FechaEmisionDoc,
    priceTypeId: entity.Cliente.IdTipoPrecio,
    taxRate: getTaxeRateFromId(taxTypeList, entity.Cliente.IdImpuesto),
  };
  const productDetailsList = entity.DetalleOrdenServicio.map((item: DetalleProductoType) => ({
    id: item.IdProducto,
    quantity: item.Cantidad,
    code: item.Codigo,
    description: item.Descripcion,
    taxRate: item.PorcentajeIVA,
    unit: "UND",
    price: item.PrecioVenta,
    pricePlusTaxes: roundNumber(item.PrecioVenta * (1 + item.PorcentajeIVA / 100), 2),
    costPrice: item.Producto.PrecioCosto,
  }));
  const paymentDetailsList = entity.DesglosePagoFactura.map((item: DetallePagoType) => ({
    paymentId: item.IdFormaPago,
    description: "",
    amount: item.MontoLocal,
  }));
  const summary = getProductSummary(productDetailsList, customerDetails.exonerationPercentage);
  const invoice: InvoiceType = {
    invoiceId: entity.IdFactura,
    consecutive: entity.ConsecOrdenServicio,
    date: convertToDateString(entity.Fecha),
    cashAdvance: entity.MontoAdelanto,
    activityCode: entity.CodigoActividad,
    customerDetails: defaultCustomerDetails,
    productDetails: defaultProductDetails,
    productDetailsList,
    paymentDetailsList: paymentDetailsList,
    vendorId: entity.IdVendedor,
    comment: entity.TextoAdicional,
    successful: true,
    summary: { ...summary, cashAmount: 0 },
  };
  return invoice;
}

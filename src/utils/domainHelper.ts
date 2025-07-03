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
  ProformaType,
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
const HACIENDA_SERVER_URL = import.meta.env.VITE_HACIENDA_SERVER_URL;
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

export async function getEconomicActivityList(id: string) {
  const response = await fetch(HACIENDA_SERVER_URL + "/fe/ae?identificacion=" + id);
  if (!response.ok) {
    let error = "";
    try {
      error = await response.json();
    } catch {
      error = "Error al obtener los datos de las actividades económicas de contribuyente.";
    }
    throw new Error(error);
  } else {
    const data = await response.json();
    if (data) {
      const actividadesList = data.actividades.map((actividad: { codigo: string; descripcion: string }) => ({
        Id: parseInt(actividad.codigo),
        Descripcion: actividad.descripcion,
      }));
      return actividadesList;
    } else {
      return [];
    }
  }
}

export async function getDollarExchangeValue(token: string) {
  let dollarExchange = 0;
  const dateFilter = convertToDateString(new Date());
  const data = "{NombreMetodo: 'ObtenerTipoCambioDolar', Parametros: {Fecha: '" + dateFilter + "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === "0") {
    let error = "";
    try {
      const response = await fetch(HACIENDA_SERVER_URL + "/indicadores/tc/dolar");
      if (!response.ok) {
        error = "Error al obtener el tipo de cambio para la moneda de la transacción en proceso.";
      } else {
        const data = await response.json();
        if (data?.venta) {
          dollarExchange = data.venta.valor;
        } else {
          error = "Error al obtener el tipo de cambio para la moneda de la transacción en proceso.";
        }
      }
    } catch {
      error = "Error al obtener el tipo de cambio para la moneda de la transacción en proceso.";
    }
    if (error !== "") throw new Error(error);
    else {
      const data =
        "{NombreMetodo: 'AgregarTipoCambioDolar', Parametros: {Fecha: '" +
        dateFilter +
        "', Valor: " +
        dollarExchange +
        "}}";
      await post(APP_URL + "/ejecutar", token, data);
      return dollarExchange;
    }
  } else {
    return parseFloat(response);
  }
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
  await post(APP_URL + "/ejecutar", token, data);
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
  return { id: response.Id, value: response.Impuesto, description: response.Descripcion };
}

export async function saveProductEntity(token: string, product: ProductType) {
  const entidad = JSON.stringify(product);
  const data =
    "{NombreMetodo: '" +
    (product.IdProducto ? "ActualizarProducto" : "AgregarProducto") +
    "', Entidad: " +
    entidad +
    "}";
  await post(APP_URL + "/ejecutar", token, data);
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
  priceIncludedTaxes: boolean,
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
  if (!priceIncludedTaxes) {
    const taxPercentage = 1 + taxRate / 100;
    customerPrice = roundNumber(customerPrice / taxPercentage, 2);
  }
  return { taxRate, price: customerPrice };
}

export function getTaxedPrice(productTaxRate: number, productPrice: number, priceIncludedTaxes: boolean) {
  const taxRate = productTaxRate;
  const untaxedPrice = priceIncludedTaxes ? roundNumber(productPrice / (1 + productTaxRate / 100), 3) : productPrice;
  let pricePlusTaxes = priceIncludedTaxes ? untaxedPrice : productPrice;
  if (taxRate > 0) pricePlusTaxes = roundNumber(untaxedPrice * (1 + taxRate / 100), 2);
  return { taxRate, price: untaxedPrice, pricePlusTaxes };
}

export function getProductSummary(products: ProductDetailsType[], exonerationPercentage: number) {
  let taxed = 0;
  let exonerated = 0;
  let exempt = 0;
  let subTotal = 0;
  let taxes = 0;
  let total = 0;
  const totalCost = 0;
  products.forEach(item => {
    const subtotal = item.price * item.quantity;
    if (item.taxRate > 0) {
      let taxesAmount = (subtotal * item.taxRate) / 100;
      let taxedAmount = subtotal;
      if (exonerationPercentage > 0) {
        const taxedRate = Math.max(item.taxRate - exonerationPercentage, 0);
        const exoneratedRate = item.taxRate - taxedRate;
        taxedAmount = roundNumber((subtotal * taxedRate) / item.taxRate, 2);
        const exoneratedAmount = roundNumber((subtotal * exoneratedRate) / item.taxRate, 2);
        taxesAmount = roundNumber((taxedAmount * item.taxRate) / 100, 2);
        exonerated += exoneratedAmount;
      }
      taxed += taxedAmount;
      taxes += taxesAmount;
    } else {
      exempt += subtotal;
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
  currency: number,
  vendorId: number,
  orderId: number,
  customerDetails: CustomerDetailsType,
  productDetailsList: ProductDetailsType[],
  summary: SummaryType,
  comment: string
) {
  let dollarExchange = 0;
  if (currency === 2) {
    dollarExchange = await getDollarExchangeValue(token);
  }
  const bankId = await getPaymentBankId(token, companyId, paymentDetailsList[0].paymentId);
  const invoiceDetails: DetalleFacturaType[] = [];
  productDetailsList.forEach(item => {
    const detail = {
      IdFactura: 0,
      IdProducto: parseInt(item.id),
      Descripcion: item.description,
      Cantidad: item.quantity,
      PrecioVenta: roundNumber(item.pricePlusTaxes / (1 + item.taxRate / 100), 3),
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
      IdTipoMoneda: currency,
      IdCuentaBanco: bankId,
      TipoTarjeta: "",
      NroMovimiento: "",
      MontoLocal: summary.total - cashAdvance,
      TipoDeCambio: dollarExchange,
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
    IdTipoMoneda: currency,
    TipoDeCambioDolar: dollarExchange,
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
    ArticuloExoneracion: customerDetails.exonerationRef2,
    IncisoExoneracion: customerDetails.exonerationRef3,
    IdNombreInstExoneracion: customerDetails.exoneratedById,
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
  const references = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return {
    id: references.Id,
    consecutive: references.Consec,
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
      PrecioVenta: roundNumber(item.pricePlusTaxes / (1 + item.taxRate / 100), 3),
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
    IdTipoMoneda: order.currency,
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
    const references = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
    return {
      id: references.Id,
      consecutive: references.Consec,
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

export async function sendDocumentEmail(token: string, idDocument: number, emailTo: string) {
  const data =
    "{NombreMetodo: 'EnviarNotificacionDocumentoElectronico', Parametros: {IdDocumento: " +
    idDocument +
    ", CorreoReceptor: '" +
    emailTo +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function sendProformaEmail(token: string, id: number, emailTo: string) {
  const data =
    "{NombreMetodo: 'GenerarNotificacionProforma', Parametros: {IdProforma: " +
    id +
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
  let dollarExchange = 0;
  if (receipt.currency === 2) {
    dollarExchange = await getDollarExchangeValue(token);
  }
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
      PrecioVenta: item.price,
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
    IdTipoMoneda: receipt.currency,
    TipoDeCambioDolar: dollarExchange,
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
    DireccionEmisor: receipt.issuer.address,
    CorreoElectronicoEmisor: receipt.issuer.email,
    IdTipoExoneracion: receipt.exoneration.type,
    NumDocExoneracion: receipt.exoneration.ref,
    ArticuloExoneracion: receipt.exoneration.ref2,
    IncisoExoneracion: receipt.exoneration.ref3,
    IdNombreInstExoneracion: receipt.exoneration.exoneratedById,
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
  const references = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return references.Id;
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
  entity: ProformaType
) {
  const { vendorId, currency, customerDetails, productDetailsList, summary, comment } = entity;
  const proformaDetails: DetalleProformaType[] = [];
  productDetailsList.forEach(item => {
    const detail = {
      IdProforma: 0,
      IdProducto: parseInt(item.id),
      Codigo: item.code,
      Descripcion: item.description,
      Cantidad: item.quantity,
      PrecioVenta: roundNumber(item.pricePlusTaxes / (1 + item.taxRate / 100), 3),
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
    IdTipoMoneda: currency,
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
  const references = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return {
    id: references.Id,
    consecutive: references.Consec,
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
    saveAs(file, `proforma-${ref}.pdf`);
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

export function parseInvoiceEntity(entity: any) {
  const customerDetails: CustomerDetailsType = {
    id: entity.IdCliente,
    name: entity.NombreCliente,
    comercialName: entity.NombreComercial,
    email: entity.CorreoElectronico,
    phoneNumber: entity.Telefono,
    exonerationType: entity.Cliente.IdTipoExoneracion,
    exonerationRef: entity.Cliente.NumDocExoneracion,
    exonerationRef2: entity.Cliente.ArticuloExoneracion,
    exonerationRef3: entity.Cliente.IncisoExoneracion,
    exoneratedById: entity.Cliente.IdNombreInstExoneracion,
    exonerationPercentage: entity.Cliente.PorcentajeExoneracion,
    exonerationDate: entity.Cliente.FechaEmisionDoc,
    priceTypeId: entity.Cliente.IdTipoPrecio,
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
    currency: entity.currency,
    successful: true,
    summary: { ...summary, cashAmount: 0 },
  };
  return invoice;
}

// @ts-ignore
import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";
import { saveAs } from "file-saver";
import {
  BranchType,
  CashCloseType,
  CategoryType,
  CompanyType,
  CredentialsType,
  CustomerDetailsType,
  CustomerEntityType,
  PaymentInfoType,
  PaymentMethodType,
  ProductDetailsType,
  ProductType,
  ProformaType,
  ReceiptType,
  ServicePointType,
  SummaryType,
  WorkingOrderType,
} from "types/domain";

import {
  convertToDateTimeString,
  encryptString,
  formatCurrency,
  get,
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

export async function requestUserPasswordReset(email: string) {
  const endpoint = APP_URL + "/generarnotificacionrestablecerclaveusuario?correonotificacion=" + email;
  await get(endpoint, "");
}

export async function validateProcessingToken(id: string) {
  const endpoint = APP_URL + "/validarregistroautenticacion?session=" + id;
  await get(endpoint, "");
}

export async function resetUserPassword(id: string, password: string) {
  const ecryptedPass = encryptString(password);
  const endpoint = APP_URL + "/restablecerclaveusuario?session=" + id + "&clave=" + ecryptedPass;
  await get(endpoint, "");
}

export async function updateUserEmail(token: string, userId: number, userEmail: string) {
  const data =
    "{NombreMetodo: 'GenerarAutorizacionActualizacionCorreoUsuario', Parametros: {IdUsuario: " +
    userId +
    ", CorreoNotificacion: '" +
    userEmail +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function authorizeUserEmail(id: string) {
  const endpoint = APP_URL + "/autorizarcorreousuario?session=" + id;
  await get(endpoint, "");
}

export async function getCompanyEntity(token: string, companyId: number) {
  const data = "{NombreMetodo: 'ObtenerEmpresa', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  // eslint-disable-next-line
  const { Distrito, ...rest } = response;
  return rest;
}

export async function getBranchEntity(token: string, companyId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'ObtenerSucursalPorEmpresa', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return {
    IdEmpresa: response.IdEmpresa,
    IdSucursal: response.IdSucursal,
    NombreSucursal: response.NombreSucursal,
    Direccion: response.Direccion,
    Telefono: response.Telefono,
    CorreoElectronico: response.CorreoElectronico,
    MontoCierreEfectivo: response.MontoCierreEfectivo,
  };
}
export async function saveCompanyEntity(
  token: string,
  company: CompanyType,
  logo?: string,
  branch?: BranchType,
  credentials?: CredentialsType
) {
  const logoData = logo ? ", Logotipo: '" + logo + "'" : "";
  const branchData = branch ? ", Sucursal: " + JSON.stringify(branch) : "";
  const credentialsData = credentials ? ", Credenciales: " + JSON.stringify(credentials) : "";
  const data =
    "{NombreMetodo: 'ActualizarEmpresa', Parametros: {Empresa: " +
    JSON.stringify({ ...company, Logotipo: "" }) +
    logoData +
    branchData +
    credentialsData +
    "}}";
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
  return response;
}

export async function saveCredentialsEntity(
  token: string,
  companyId: number,
  userCode: string,
  userPass: string,
  strCertificateName: string,
  strPin: string,
  strCertificate: string,
  isInserting: boolean
) {
  const data =
    "{NombreMetodo: '" +
    (isInserting ? "AgregarCredencialesHacienda" : "ActualizarCredencialesHacienda") +
    "', Parametros: {IdEmpresa: " +
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

export async function saveUserPassword(token: string, userId: number, newPassword: string) {
  const ecryptedPass = encryptString(newPassword);
  const data =
    "{NombreMetodo: 'ActualizarClaveUsuario', Parametros: {IdUsuario: " + userId + ", Clave: '" + ecryptedPass + "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
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

export async function getCustomerData(id: string) {
  const controller = new AbortController();
  const signal = controller.signal;

  // Set a timeout of 5 seconds
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 5000);

  const response = await fetch(HACIENDA_SERVER_URL + "/fe/ae?identificacion=" + id, { signal });
  clearTimeout(timeoutId);
  if (!response.ok) {
    let error = "";
    try {
      error = await response.json();
    } catch {
      error = "Error al obtener los datos del contribuyente.";
    }
    throw new Error(error);
  } else {
    const data = await response.json();
    if (data) {
      const list: { Llave: string; Descripcion: string }[] = data.actividades.map(
        (actividad: { codigo: string; descripcion: string }) => {
          return {
            Llave: actividad.codigo,
            Descripcion: `${actividad.codigo} - ${actividad.descripcion}`,
          };
        }
      );
      return { name: data.nombre, economicActivityList: list };
    } else {
      throw new Error("Datos no encontrados en el Ministerio de Hacienda");
    }
  }
}

export async function getDollarExchangeValue() {
  try {
    const response = await fetch(HACIENDA_SERVER_URL + "/indicadores/tc/dolar");
    if (!response.ok) {
      throw new Error("Error al obtener el tipo de cambio para la moneda de la transacción en proceso.");
    } else {
      const data = await response.json();
      if (data?.venta) {
        return parseFloat(data.venta.valor);
      } else {
        throw new Error("Error al obtener el tipo de cambio para la moneda de la transacción en proceso.");
      }
    }
  } catch {
    throw new Error("Error al obtener el tipo de cambio para la moneda de la transacción en proceso.");
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

export async function saveCustomerEntity(token: string, customer: CustomerEntityType) {
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
  imageIncluded: boolean,
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
    "', IncluyeImagen: '" +
    imageIncluded +
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

export async function getCategoryEntity(token: string, id: number) {
  const data = "{NombreMetodo: 'ObtenerLinea', Parametros: {IdLinea: " + id + "}}";
  const servicePoint = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (servicePoint === null) return null;
  return servicePoint;
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

export async function saveCategoryEntity(token: string, category: CategoryType) {
  const entidad = JSON.stringify(category);
  const data =
    "{NombreMetodo: '" + (category.IdLinea ? "ActualizarLinea" : "AgregarLinea") + "', Entidad: " + entidad + "}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function saveServicePointEntity(token: string, servicePoint: ServicePointType) {
  const entidad = JSON.stringify(servicePoint);
  const data =
    "{NombreMetodo: '" +
    (servicePoint.IdPunto ? "ActualizarPuntoDeServicio" : "AgregarPuntoDeServicio") +
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

export async function getServicePointEntity(token: string, id: number) {
  const data = "{NombreMetodo: 'ObtenerPuntoDeServicio', Parametros: {IdPuntoDeServicio: " + id + "}}";
  const servicePoint = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (servicePoint === null) return null;
  return servicePoint;
}

export function getProductsSummary(products: ProductDetailsType[], exonerationPercentage: number) {
  let taxed = 0;
  let exonerated = 0;
  let exempt = 0;
  let subTotal = 0;
  let taxes = 0;
  let total = 0;
  const totalCost = 0;
  products.forEach(item => {
    const priceNoTaxes = roundNumber(parseFloat(item.price) / (1 + item.taxRate / 100), 3);
    const subtotal = priceNoTaxes * parseFloat(item.quantity);
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
    cashAmount: roundNumber(total, 2),
  };
}

export async function saveInvoiceEntity(
  token: string,
  userId: number,
  companyId: number,
  branchId: number,
  activityCode: number,
  paymentMethodList: PaymentMethodType[],
  currency: number,
  vendorId: number,
  orderId: number,
  customerDetails: CustomerDetailsType,
  productDetailsList: ProductDetailsType[],
  summary: SummaryType,
  comment: string,
  closeOrder: boolean
) {
  let dollarExchange = 1;
  if (currency === 2) {
    dollarExchange = await getDollarExchangeValue();
  }
  const bankId = await getPaymentBankId(token, companyId, paymentMethodList[0].paymentId);
  const invoiceDetails: DetalleFacturaType[] = [];
  productDetailsList.forEach(item => {
    const priceNoTaxes = roundNumber(parseFloat(item.price) / (1 + item.taxRate / 100), 3);
    const index = invoiceDetails.findIndex(
      detail => detail.IdProducto === item.id && detail.PrecioVenta === priceNoTaxes
    );
    if (index !== -1) {
      invoiceDetails[index].Cantidad += parseFloat(item.quantity);
    } else {
      const detail = {
        IdFactura: 0,
        IdProducto: item.id,
        Descripcion: item.description,
        Cantidad: parseFloat(item.quantity),
        PrecioVenta: priceNoTaxes,
        Excento: item.taxRate === 0,
        PrecioCosto: item.costPrice,
        PorcentajeIVA: item.taxRate,
        PorcDescuento: item.disccountRate,
      };
      invoiceDetails.push(detail);
    }
  });
  const invoicePayments = paymentMethodList.map(item => ({
    IdConsecutivo: 0,
    IdFactura: 0,
    IdFormaPago: item.paymentId,
    IdTipoMoneda: currency,
    IdCuentaBanco: bankId,
    TipoTarjeta: "",
    NroMovimiento: "",
    MontoLocal: item.amount,
    TipoDeCambio: dollarExchange,
  }));
  const invoiceDate = convertToDateTimeString(new Date());
  const invoice = {
    IdFactura: 0,
    IdEmpresa: companyId,
    IdSucursal: branchId,
    IdTerminal: 1,
    IdUsuario: userId,
    IdTipoMoneda: currency,
    TipoDeCambioDolar: dollarExchange,
    IdCliente: customerDetails.id,
    NombreCliente: customerDetails.name,
    CodigoActividad: activityCode,
    CodigoActividadReceptor: customerDetails.activityCode,
    IdCondicionVenta: 1,
    PlazoCredito: 0,
    Fecha: invoiceDate,
    Telefono: customerDetails.phoneNumber,
    TextoAdicional: comment,
    IdVendedor: vendorId,
    Excento: summary.exempt,
    Gravado: summary.taxed,
    Exonerado: summary.exonerated,
    Descuento: 0,
    Impuesto: summary.taxes,
    MontoPagado: summary.cashAmount,
    MontoAdelanto: 0,
    TotalCosto: summary.totalCost,
    IdTipoExoneracion: customerDetails.exonerationType,
    IdNombreInstExoneracion: customerDetails.exoneratedById,
    NumDocExoneracion: customerDetails.exonerationRef,
    ArticuloExoneracion: customerDetails.exonerationRef2,
    IncisoExoneracion: customerDetails.exonerationRef3,
    FechaEmisionDoc: convertToDateTimeString(customerDetails.exonerationDate),
    PorcentajeExoneracion: customerDetails.exonerationPercentage,
    IdCxC: 0,
    IdAsiento: 0,
    IdMovBanco: 0,
    IdOrdenServicio: orderId,
    CerrarOrdenServicio: closeOrder,
    IdProforma: 0,
    DetalleFactura: invoiceDetails,
    DesglosePagoFactura: invoicePayments,
  };
  const data = "{NombreMetodo: 'AgregarFactura', Entidad: " + JSON.stringify(invoice) + "}";
  const ids = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  const references = ids.split("-");
  return {
    id: references[0],
    consecutive: references[1],
  };
}

export async function revokeInvoiceEntity(token: string, invoiceId: number, idUser: number) {
  const data = "{NombreMetodo: 'AnularFactura', Parametros: {IdFactura: " + invoiceId + ", IdUsuario: " + idUser + "}}";
  await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
}

export async function getProcessedInvoiceListCount(token: string, companyId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaFacturas', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", ExcluyeNulos: true}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
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
    ", ExcluyeNulos: true" +
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
  order: WorkingOrderType,
  paymentInfo: PaymentInfoType
) {
  const workingOrderDetails: DetalleOrdenServicioType[] = [];
  order.productDetailsList.forEach(item => {
    const detail = {
      IdOrden: order.id,
      IdProducto: item.id,
      Codigo: item.code,
      Descripcion: item.description,
      InformacionAdicional: item.additionalInformation,
      Cantidad: parseFloat(item.quantity),
      PrecioVenta: roundNumber(parseFloat(item.price) / (1 + item.taxRate / 100), 3),
      Excento: item.taxRate === 0,
      PorcentajeIVA: item.taxRate,
      PorcDescuento: item.disccountRate,
      Pagado: item.paid,
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
    IdCliente: paymentInfo.customerDetails.id,
    NombreCliente: paymentInfo.customerDetails.name,
    Fecha: workingOrderDate,
    IdVendedor: order.vendorId,
    Telefono: order.delivery.phone,
    Direccion: order.delivery.address,
    Descripcion: order.delivery.description,
    FechaEntrega: order.delivery.date,
    HoraEntrega: order.delivery.time,
    OtrosDetalles: order.delivery.details,
    Excento: paymentInfo.summary.exempt,
    Gravado: paymentInfo.summary.taxed,
    Exonerado: paymentInfo.summary.exonerated,
    Descuento: 0,
    Impuesto: paymentInfo.summary.taxes,
    MontoAdelanto: order.cashAdvance,
    MontoPagado: 0,
    Nulo: false,
    DetalleOrdenServicio: workingOrderDetails,
    IdPuntoDeServicio: order.servicePointId,
  };
  const data =
    "{NombreMetodo: '" +
    (order.id === 0 ? "AgregarOrdenServicio" : "ActualizarOrdenServicio") +
    "', Entidad: " +
    JSON.stringify(workingOrder) +
    "}";
  if (order.id === 0) {
    const ids = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
    const references = ids.split("-");
    return {
      id: references[0],
      consecutive: references[1],
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
    ", ExcluyeNulos: true, FiltraEstado: true, Aplicado: '" +
    bolApplied +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
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
    ", ExcluyeNulos: true, FiltraEstado: true, Aplicado: '" +
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
  return response;
}

export async function reprocesingDocument(token: string, idDocument: number) {
  const data = "{NombreMetodo: 'ReprocesarDocumentoElectronico', Parametros: {IdDocumento: " + idDocument + "}}";
  await post(APP_URL + "/ejecutar", token, data);
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

export async function generateInvoicePDF(token: string, invoiceId: number) {
  const data = "{NombreMetodo: 'ObtenerFacturaPDF', Parametros: {IdFactura: " + invoiceId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(file);
    window.open(pdfUrl);
  }
}

export async function generateWorkingOrderPDF(token: string, orderId: number) {
  const data = "{NombreMetodo: 'ObtenerOrdenServicioPDF', Parametros: {IdOrden: " + orderId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(file);
    window.open(pdfUrl);
  }
}

export async function generateInvoiceTicketPDF(token: string, invoiceId: number) {
  const data = "{NombreMetodo: 'GenerarTiqueteFacturaPDF', Parametros: {IdFactura: " + invoiceId + ", LargoLinea: 80}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(file);
    window.open(pdfUrl);
  }
}

export async function generateWorkingOrderTicketPDF(token: string, invoiceId: number) {
  const data =
    "{NombreMetodo: 'GenerarTiqueteOrdenServicioPDF', Parametros: {IdOrden: " + invoiceId + ", LargoLinea: 80}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(file);
    window.open(pdfUrl);
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
    dollarExchange = await getDollarExchangeValue();
  }
  const receiptDetails: DetalleFacturaCompraType[] = [];
  receipt.productDetailsList.forEach((item, index) => {
    const detail = {
      Linea: index + 1,
      Cantidad: parseFloat(item.quantity),
      Codigo: item.code,
      Descripcion: item.description,
      IdImpuesto: item.taxRateType ?? 13,
      PorcentajeIVA: item.taxRate,
      UnidadMedida: item.unit,
      PrecioVenta: parseFloat(item.price),
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
    CodigoActividadEmisor: receipt.issuer.activityCode,
    NumeroReferencia: receipt.issuer.reference,
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
  const ids = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  const references = ids.split("-");
  return references[0];
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
      IdProducto: item.id,
      Codigo: item.code,
      Descripcion: item.description,
      Cantidad: parseFloat(item.quantity),
      PrecioVenta: roundNumber(parseFloat(item.price) / (1 + item.taxRate / 100), 3),
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
  const ids = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  const references = ids.split("-");
  return {
    id: references[0],
    consecutive: references[1],
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
    ", ExcluyeNulos: true, FiltraEstado: true, Aplicado: '" +
    bolApplied +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
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
    ", ExcluyeNulos: true, FiltraEstado: true, Aplicado: '" +
    bolApplied +
    "', FilasPorPagina: " +
    rowPerPage +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function generateCashCloseDetails(token: string, companyId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'GenerarDatosCierreCaja', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function saveCashCloseDetails(token: string, cashCloseEntity: CashCloseType) {
  const data = "{NombreMetodo: 'GuardarDatosCierreCaja', Entidad: " + JSON.stringify(cashCloseEntity) + "}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function abortCashCloseProcess(token: string, companyId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'AbortarCierreCaja', Parametros: {IdEmpresa: " + companyId + ", IdSucursal: " + branchId + "}}";
  const response = await post(APP_URL + "/ejecutar", token, data);
  return response;
}

export async function generateCashClosePDF(token: string, cashCloseId: number) {
  const data =
    "{NombreMetodo: 'GenerarTiqueteCierreCajaPDF', Parametros: {IdCierreCaja: " + cashCloseId + ", LargoLinea: 80}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(file);
    window.open(pdfUrl);
  }
}

export async function getCashCloseListCount(token: string, companyId: number, branchId: number) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaCierreCaja', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getCashCloseListPerPage(
  token: string,
  companyId: number,
  branchId: number,
  pageNumber: number,
  rowPerPage: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoCierreCaja', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", NumeroPagina: " +
    pageNumber +
    ", FilasPorPagina: " +
    rowPerPage +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getCashCloseEntity(token: string, cashCloseId: number) {
  const data = "{NombreMetodo: 'ObtenerCierreCaja', Parametros: {IdCierre: " + cashCloseId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getPrintingTickets(
  token: string,
  companyId: number,
  branchId: number,
  orderId: number,
  pendingFiltering: boolean
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoTiqueteOrdenServicio', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", IdOrden: " +
    orderId +
    ", FiltrarPendientes: " +
    pendingFiltering +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function updatePrintedTickets(token: string, ticketId: number) {
  const data =
    "{NombreMetodo: 'ActualizarEstadoTiqueteOrdenServicio', Parametros: {IdTiquete: " +
    ticketId +
    ", Impreso: 'false'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function printPendingTickets(tickets: any, printerServerAddress: string) {
  return new Promise((resolve, reject) => {
    const promiseParams = [];
    for (let i = 0; i < tickets.length; i++) {
      let result: any;
      const ticket = tickets[i];
      const ticketLines = JSON.parse(ticket.DetalleTiqueteDespachoMercancia);
      const lines = ticketLines.map((line: { Descripcion: string; Valor: number }) => [
        line.Descripcion,
        formatCurrency(line.Valor),
      ]);
      const encoder = new ReceiptPrinterEncoder({ columns: 48 });
      let strDetails = ticket.Descripcion;
      const detailsLines = [];
      while (strDetails.length > 0) {
        if (strDetails.length > 46) {
          detailsLines.push([strDetails.substring(0, 46)]);
          strDetails = strDetails.substring(46);
        } else {
          detailsLines.push([strDetails]);
          strDetails = "";
        }
      }

      try {
        const header = encoder
          .height(2)
          .align("center")
          .newline(2)
          .line(ticket.Etiqueta)
          .line("PEDIDO EN PROCESO")
          .newline()
          .line("DETALLE DE ORDEN")
          .line("-".repeat(46))
          .table(
            [
              { width: 34, marginLeft: 1, align: "left" },
              { width: 12, marginRight: 1, align: "right" },
            ],
            lines
          )
          .line("-".repeat(46))
          .newline()
          .encode();
        const details = detailsLines.length
          ? encoder
              .table([{ width: 46, marginLeft: 1, align: "center" }], detailsLines)
              .align("center")
              .newline()
              .encode()
          : new Uint8Array(0);
        const footer = encoder.line("FIN DE PEDIDO").newline(4).cut("partial").encode();
        result = [...header, ...details, ...footer];
      } catch (ex: any) {
        console.error("Encoding failed:" + ex.message);
        reject("Error al procesar la información del tiquete!");
      }
      promiseParams.push({
        data: btoa(String.fromCharCode.apply(null, [...result])),
        address: printerServerAddress,
        printer: ticket.Impresora,
        ticketId: ticket.IdTiquete,
      });
    }
    const printingPromises = promiseParams.map(param =>
      sentBytesToWSPrinter(param.data, param.address, param.printer, param.ticketId)
    );
    return Promise.all(printingPromises)
      .then(() => {
        resolve("Finished");
      })
      .catch(() => {
        reject(new Error("No se logró imprimir los tiquetes de la orden. Por favor intente la reimpresión!"));
      });
  });
}

function sentBytesToWSPrinter(base64: string, printerServerAddress: string, printerName: string, ticketId: number) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(printerServerAddress);
    socket.onerror = function (error) {
      console.error("Unabled to connect to socket", error);
      reject(new Error("No se logró comunicar con el servidor de impresión. Por favor intente la reimpresión!"));
    };
    socket.onopen = function () {
      const message = {
        commands: [
          {
            command: "sendBytes",
            base64,
          },
        ],
        printer: printerName,
      };
      socket.send(JSON.stringify(message));
      socket.close(1000, "Work complete");
      const queryUrl = "/cambiarestadoaimpresotiqueteordenservicio?idtiquete=" + ticketId + "&status=impreso";
      get(APP_URL + queryUrl, "");
      resolve("Success!");
    };
  });
}

import {
  encryptString,
  roundNumber,
  getWithResponse,
  post,
  postWithResponse,
  convertToDateTimeString,
  getTaxeRateFromId,
} from "./utilities";
import { saveAs } from "file-saver";

const SERVICE_URL = process.env.REACT_APP_SERVER_URL;
const APP_URL = `${SERVICE_URL}/puntoventa`;

export async function userLogin(user, password, id) {
  const ecryptedPass = encryptString(password);
  const endpoint =
    APP_URL + "/validarcredencialesweb?usuario=" + user + "&clave=" + ecryptedPass + "&identificacion=" + id;
  const company = await getWithResponse(endpoint, "");
  return company;
}

export async function getCompanyEntity(token, companyId) {
  const data = "{NombreMetodo: 'ObtenerEmpresa', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function saveCompanyEntity(token, entity) {
  const data = "{NombreMetodo: 'ActualizarEmpresa', Entidad: '" + JSON.stringify(entity) + "'}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getCompanyLogo(token, companyId) {
  const data = "{NombreMetodo: 'ObtenerLogotipoEmpresa', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function saveCompanyLogo(token, companyId, strLogo) {
  const data =
    "{NombreMetodo: 'ActualizarLogoEmpresa', Parametros: {IdEmpresa: " + companyId + ", Logotipo: '" + strLogo + "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function validateCredentials(token, userCode, userPass) {
  const data =
    "{NombreMetodo: 'ValidarCredencialesHacienda', Parametros: {CodigoUsuario: '" +
    userCode +
    "', Clave: '" +
    userPass +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function validateCertificate(token, strPin, strCertificate) {
  const data =
    "{NombreMetodo: 'ValidarCertificadoHacienda', Parametros: {PinCertificado: '" +
    strPin +
    "', Certificado: '" +
    strCertificate +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getCredentialsEntity(token, intIdEmpresa) {
  const data = "{NombreMetodo: 'ObtenerCredencialesHacienda', Parametros: {IdEmpresa: " + intIdEmpresa + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function saveCredentialsEntity(
  token,
  intIdEmpresa,
  userCode,
  userPass,
  strCertificateName,
  strPin,
  strCertificate
) {
  const data =
    "{NombreMetodo: 'AgregarCredencialesHacienda', Parametros: {IdEmpresa: " +
    intIdEmpresa +
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
  token,
  intIdEmpresa,
  userCode,
  userPass,
  strCertificateName,
  strPin,
  strCertificate
) {
  const data =
    "{NombreMetodo: 'ActualizarCredencialesHacienda', Parametros: {IdEmpresa: " +
    intIdEmpresa +
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

export async function getCantonList(token, idProvincia) {
  const data = "{NombreMetodo: 'ObtenerListadoCantones', Parametros: {IdProvincia: " + idProvincia + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getDistritoList(token, idProvincia, idCanton) {
  const data =
    "{NombreMetodo: 'ObtenerListadoDistritos', Parametros: {IdProvincia: " +
    idProvincia +
    ", IdCanton: " +
    idCanton +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getBarrioList(token, idProvincia, idCanton, idDistrito) {
  const data =
    "{NombreMetodo: 'ObtenerListadoBarrios', Parametros: {IdProvincia: " +
    idProvincia +
    ", IdCanton: " +
    idCanton +
    ", IdDistrito: " +
    idDistrito +
    "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getEconomicActivities(token, id) {
  const data = "{NombreMetodo: 'ObtenerListadoActividadEconomica', Parametros: {Identificacion: '" + id + "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getBranchList(token, companyId) {
  const data = "{NombreMetodo: 'ObtenerListadoSucursales', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getVendorList(token, companyId) {
  const data = "{NombreMetodo: 'ObtenerListadoVendedores', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getReportData(token, reportName, companyId, branchId, startDate, endDate) {
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

export async function getCustomerListCount(token, companyId, strFilter) {
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

export async function getCustomerListPerPage(token, companyId, pageNumber, rowsPerPage, strFilter) {
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

export async function getCustomerEntity(token, customerId) {
  const data = "{NombreMetodo: 'ObtenerCliente', Parametros: {IdCliente: " + customerId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getCustomerByIdentifier(token, companyId, identifier) {
  const data =
    "{NombreMetodo: 'ValidaIdentificacionCliente', Parametros: {IdEmpresa: " +
    companyId +
    ", Identificacion: '" +
    identifier +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function saveCustomerEntity(token, customer) {
  const entidad = JSON.stringify({ ...customer, FechaEmisionDoc: convertToDateTimeString(customer.FechaEmisionDoc) });
  const data =
    "{NombreMetodo: '" + (customer.IdCliente ? "ActualizarCliente" : "AgregarCliente") + "', Entidad: " + entidad + "}";
  const response = await post(APP_URL + "/ejecutar", token, data);
  if (response === null) return null;
  return response;
}

export async function getProductCategoryList(token, companyId) {
  const data = "{NombreMetodo: 'ObtenerListadoLineas', Parametros: {IdEmpresa: " + companyId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getProductProviderList(token, companyId) {
  const data =
    "{NombreMetodo: 'ObtenerListadoProveedores', Parametros: {IdEmpresa: " +
    companyId +
    ", NumeroPagina: 1, FilasPorPagina: 0}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getProductListCount(token, companyId, branchId, activeOnly, filterText, type) {
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
  token,
  companyId,
  branchId,
  activeOnly,
  page,
  rowsPerPage,
  filterText,
  type
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

export async function getProductEntity(token, idProduct, branchId) {
  const data =
    "{NombreMetodo: 'ObtenerProducto', Parametros: {IdProducto: " + idProduct + ", IdSucursal: " + branchId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function getProductClasification(token, code) {
  const data = "{NombreMetodo: 'ObtenerClasificacionProducto', Parametros: {Codigo: '" + code + "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function saveProductEntity(token, product) {
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

export async function getExonerationTypeList(token) {
  const data = "{NombreMetodo: 'ObtenerListadoTipoExoneracion'}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export async function getPaymentBankId(token, companyId, paymentMethod) {
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

export async function getServicePointList(token, companyId, branchId, bolActive, strDescription) {
  const data =
    "{NombreMetodo: 'ObtenerListadoPuntoDeServicio', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    ", FiltraActivos: '" +
    bolActive +
    "', Descripcion: '" +
    strDescription +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export function getCustomerPrice(company, customer, product, rentTypeList) {
  let customerPrice = 0;
  let taxRate = getTaxeRateFromId(rentTypeList, product.IdImpuesto);
  switch (customer.IdTipoPrecio) {
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
  customerPrice = roundNumber(customerPrice / (1 + taxRate / 100), 3);
  if (customer.AplicaTasaDiferenciada) {
    taxRate = getTaxeRateFromId(rentTypeList, customer.IdImpuesto);
  }
  if (company.PrecioVentaIncluyeIVA && taxRate > 0) customerPrice = customerPrice * (1 + taxRate / 100);
  return roundNumber(customerPrice, 2);
}

export function getProductSummary(products, exonerationPercentage) {
  let gravado = 0;
  let exonerado = 0;
  let excento = 0;
  let subTotal = 0;
  let impuesto = 0;
  let total = 0;
  let totalCosto = 0;
  products.forEach(item => {
    const precioUnitario = roundNumber(item.PrecioVenta / (1 + item.PorcentajeIVA / 100), 3);
    if (item.PorcentajeIVA > 0) {
      let impuestoUnitario = (precioUnitario * item.PorcentajeIVA) / 100;
      if (exonerationPercentage > 0) {
        const gravadoParcial = precioUnitario * (1 - exonerationPercentage / 100);
        gravado += roundNumber(gravadoParcial, 2) * item.Cantidad;
        exonerado += roundNumber(precioUnitario - gravadoParcial, 2) * item.Cantidad;
        impuestoUnitario = (gravadoParcial * item.PorcentajeIVA) / 100;
      } else {
        gravado += roundNumber(precioUnitario, 2) * item.Cantidad;
      }
      impuesto += roundNumber(impuestoUnitario, 2) * item.Cantidad;
    } else {
      excento += roundNumber(precioUnitario, 2) * item.Cantidad;
    }
  });
  subTotal = gravado + exonerado + excento;
  total = subTotal + impuesto;
  return {
    gravado: roundNumber(gravado, 2),
    exonerado: roundNumber(exonerado, 2),
    excento: roundNumber(excento, 2),
    subTotal: roundNumber(subTotal, 2),
    impuesto: roundNumber(impuesto, 2),
    total: roundNumber(total, 2),
    totalCosto: roundNumber(totalCosto, 2),
  };
}

export async function saveInvoiceEntity(
  token,
  userId,
  detailsList,
  activityCode,
  paymentId,
  vendorId,
  cashAdvance,
  orderId,
  branchId,
  company,
  customer,
  summary,
  comment
) {
  const bankId = await getPaymentBankId(token, company.IdEmpresa, paymentId);
  const invoiceDetails = [];
  detailsList.forEach(item => {
    const detail = {
      IdFactura: 0,
      IdProducto: item.IdProducto,
      Descripcion: item.Descripcion,
      Cantidad: item.Cantidad,
      PrecioVenta: roundNumber(item.PrecioVenta / (1 + item.PorcentajeIVA / 100), 3),
      Excento: item.Excento,
      PrecioCosto: item.PrecioCosto,
      CostoInstalacion: 0,
      PorcentajeIVA: item.PorcentajeIVA,
    };
    invoiceDetails.push(detail);
  });
  const invoicePayments = [
    {
      IdConsecutivo: 0,
      IdFactura: 0,
      IdFormaPago: paymentId,
      IdTipoMoneda: company.IdTipoMoneda,
      IdCuentaBanco: bankId,
      TipoTarjeta: "",
      NroMovimiento: "",
      MontoLocal: summary.total - cashAdvance,
      TipoDeCambio: 1,
    },
  ];
  const invoiceDate = convertToDateTimeString(new Date());
  const invoice = {
    IdEmpresa: company.IdEmpresa,
    IdSucursal: branchId,
    CodigoActividad: activityCode,
    IdTerminal: 1,
    IdFactura: 0,
    IdUsuario: userId,
    IdTipoMoneda: 1,
    TipoDeCambioDolar: 0,
    IdCliente: customer.IdCliente,
    NombreCliente: customer.Nombre,
    IdCondicionVenta: 1,
    PlazoCredito: 0,
    Fecha: invoiceDate,
    TextoAdicional: comment,
    IdVendedor: vendorId,
    Excento: summary.excento,
    Gravado: summary.gravado,
    Exonerado: summary.exonerado,
    Descuento: 0,
    Impuesto: summary.impuesto,
    TotalCosto: summary.totalCosto,
    MontoPagado: summary.total,
    MontoAdelanto: cashAdvance,
    IdTipoExoneracion: customer.IdTipoExoneracion,
    NumDocExoneracion: customer.NumDocExoneracion,
    NombreInstExoneracion: customer.NombreInstExoneracion,
    FechaEmisionDoc: convertToDateTimeString(customer.FechaEmisionDoc),
    PorcentajeExoneracion: customer.PorcentajeExoneracion,
    IdCxC: 0,
    IdAsiento: 0,
    IdMovBanco: 0,
    IdOrdenServicio: orderId,
    IdProforma: 0,
    DetalleFactura: invoiceDetails,
    DesglosePagoFactura: invoicePayments,
  };
  const data = "{NombreMetodo: 'AgregarFactura', Entidad: " + JSON.stringify(invoice) + "}";
  let invoiceId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return invoiceId.split("-")[0];
}

export async function revokeInvoiceEntity(token, invoiceId, idUser) {
  const data = "{NombreMetodo: 'AnularFactura', Parametros: {IdFactura: " + invoiceId + ", IdUsuario: " + idUser + "}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getInvoiceEntity(token, invoiceId) {
  const data = "{NombreMetodo: 'ObtenerFactura', Parametros: {IdFactura: " + invoiceId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getProcessedInvoiceListCount(token, companyId, branchId) {
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

export async function getProcessedInvoiceListPerPage(token, companyId, branchId, pageNumber, rowPerPage) {
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
  token,
  order,
  userId,
  detailsList,
  branchId,
  vendorId,
  company,
  customer,
  summary,
  deliveryPhone,
  deliveryAddress,
  deliveryDescription,
  deliveryDate,
  deliveryTime,
  deliveryDetails
) {
  const workingOrderDetails = [];
  detailsList.forEach(item => {
    const detail = {
      IdOrden: order?.IdOrden,
      IdProducto: item.IdProducto,
      Codigo: item.Codigo,
      Descripcion: item.Descripcion,
      Cantidad: item.Cantidad,
      PrecioVenta: roundNumber(item.PrecioVenta / (1 + item.PorcentajeIVA / 100), 3),
      Excento: item.Excento,
      PorcentajeIVA: item.PorcentajeIVA,
      PorcDescuento: 0,
    };
    workingOrderDetails.push(detail);
  });
  const workingOrderDate = convertToDateTimeString(new Date());
  const workingOrder = {
    IdEmpresa: company.IdEmpresa,
    IdSucursal: branchId,
    IdTerminal: 1,
    IdOrden: order?.IdOrden,
    ConsecOrdenServicio: order?.ConsecOrdenServicio,
    IdUsuario: userId,
    IdTipoMoneda: 1,
    IdCliente: customer.IdCliente,
    NombreCliente: customer.Nombre,
    Fecha: workingOrderDate,
    IdVendedor: vendorId,
    Telefono: deliveryPhone,
    Direccion: deliveryAddress,
    Descripcion: deliveryDescription,
    FechaEntrega: deliveryDate,
    HoraEntrega: deliveryTime,
    OtrosDetalles: deliveryDetails,
    Excento: summary.excento,
    Gravado: summary.gravado,
    Exonerado: summary.exonerado,
    Descuento: 0,
    Impuesto: summary.impuesto,
    MontoAdelanto: 0,
    MontoPagado: 0,
    Nulo: false,
    DetalleOrdenServicio: workingOrderDetails,
  };
  const data =
    "{NombreMetodo: '" +
    (order === null ? "AgregarOrdenServicio" : "ActualizarOrdenServicio") +
    "', Entidad: " +
    JSON.stringify(workingOrder) +
    "}";
  if (order === null) {
    let invoiceId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
    const ids = invoiceId.split("-");
    return {
      IdOrden: ids[0],
      ConsecOrdenServicio: ids[1],
      MontoAdelanto: 0,
    };
  } else {
    await post(APP_URL + "/ejecutar", token, data);
  }
}

export async function revokeWorkingOrderEntity(token, workingOrderId, idUser) {
  const data =
    "{NombreMetodo: 'AnularOrdenServicio', Parametros: {IdOrdenServicio: " +
    workingOrderId +
    ", IdUsuario: " +
    idUser +
    "}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getWorkingOrderEntity(token, workingOrderId) {
  const data = "{NombreMetodo: 'ObtenerOrdenServicio', Parametros: {IdOrdenServicio: " + workingOrderId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return response;
}

export async function getWorkingOrderListCount(token, companyId, branchId, bolApplied) {
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

export async function getWorkingOrderListPerPage(token, companyId, branchId, bolApplied, pageNumber, rowPerPage) {
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

export async function getDocumentListCount(token, companyId, branchId) {
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

export async function getDocumentListPerPage(token, companyId, branchId, pageNumber, rowPerPage) {
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

export async function getDocumentEntity(token, idDocument) {
  const data = "{NombreMetodo: 'ObtenerDocumentoElectronico', Parametros: {IdDocumento: " + idDocument + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return null;
  return response;
}

export async function sendDocumentByEmail(token, idDocument, emailTo) {
  const data =
    "{NombreMetodo: 'EnviarNotificacionDocumentoElectronico', Parametros: {IdDocumento: " +
    idDocument +
    ", CorreoReceptor: '" +
    emailTo +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function sendReportEmail(token, companyId, branchId, reportName, startDate, endDate) {
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

export async function generateInvoicePDF(token, invoiceId, ref) {
  const data = "{NombreMetodo: 'ObtenerFacturaPDF', Parametros: {IdFactura: " + invoiceId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/octet-stream" });
    saveAs(file, `Factura-${ref}.pdf`);
  }
}

export async function generateWorkingOrderPDF(token, workingOrderId, ref) {
  const data = "{NombreMetodo: 'ObtenerOrdenServicioPDF', Parametros: {IdOrden: " + workingOrderId + "}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), c => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/octet-stream" });
    saveAs(file, `OrdenServicio-${ref}.pdf`);
  }
}

export async function saveReceiptEntity(
  token,
  userId,
  branchId,
  activityCode,
  company,
  issuer,
  exoneration,
  detailsList,
  summary
) {
  const receiptDetails = [];
  detailsList.forEach((item, index) => {
    const detail = {
      Linea: index + 1,
      Cantidad: item.Cantidad,
      Codigo: item.Codigo,
      Descripcion: item.Descripcion,
      IdImpuesto: item.IdImpuesto,
      PorcentajeIVA: item.PorcentajeIVA,
      UnidadMedida: item.UnidadMedida,
      PrecioVenta: roundNumber(item.PrecioVenta / (1 + item.PorcentajeIVA / 100), 3),
    };
    receiptDetails.push(detail);
  });
  const receiptDate = convertToDateTimeString(new Date());
  const receipt = {
    IdEmpresa: company.IdEmpresa,
    CodigoActividad: activityCode,
    IdSucursal: branchId,
    IdTerminal: 1,
    IdUsuario: userId,
    IdTipoMoneda: 1,
    Fecha: receiptDate,
    IdCondicionVenta: 1,
    PlazoCredito: 0,
    NombreEmisor: issuer.name,
    IdTipoIdentificacion: issuer.idType,
    IdentificacionEmisor: issuer.id,
    NombreComercialEmisor: issuer.comercialName,
    TelefonoEmisor: issuer.phone,
    IdProvinciaEmisor: 1,
    IdCantonEmisor: 1,
    IdDistritoEmisor: 1,
    IdBarrioEmisor: 1,
    DireccionEmisor: issuer.address,
    CorreoElectronicoEmisor: issuer.email,
    IdTipoExoneracion: exoneration.type,
    NumDocExoneracion: exoneration.ref,
    NombreInstExoneracion: exoneration.issuerName,
    FechaEmisionDoc: convertToDateTimeString(exoneration.date),
    PorcentajeExoneracion: exoneration.percentage,
    TextoAdicional: "",
    Excento: summary.excento,
    Gravado: summary.gravado,
    Exonerado: summary.exonerado,
    Descuento: 0,
    Impuesto: summary.impuesto,
    DetalleFacturaCompra: receiptDetails,
  };
  const data = "{NombreMetodo: 'AgregarFacturaCompra', Entidad: " + JSON.stringify(receipt) + "}";
  let receiptId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  return receiptId;
}

export async function getProductClasificationList(token, filter) {
  const data =
    "{NombreMetodo: 'ObtenerListadoClasificacionProducto', Parametros: {NumeroPagina: 1, FilasPorPagina: " +
    100 +
    ", Descripcion: '" +
    filter +
    "'}}";
  const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data);
  if (response === null) return [];
  return response;
}

export function getPriceFromTaxRate(price, taxRate, withTaxes) {
  function withTaxesFunc(a, b) {
    return a * b;
  }
  function noTaxesFunc(a, b) {
    return a / b;
  }
  const taxOperation = withTaxes ? withTaxesFunc : noTaxesFunc;
  const rate = taxRate / 100;
  const untaxPrice = taxOperation(price, 1 + rate);
  return untaxPrice;
}

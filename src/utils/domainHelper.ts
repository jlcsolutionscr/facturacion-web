import {
  CompanyType,
  CustomerType,
  ProductType,
  IdValueType,
  ProductDetailsType,
  PaymentDetailsType,
  CustomerDetailsType,
  SummaryType,
  WorkingOrderType,
  ReceiptType,
} from "types/domain";
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
  CostoInstalacion: number;
  PorcentajeIVA: number;
};

type DetalleOrdenServicioType = {
  IdConsecutivo: number;
  IdOrden: number;
  IdProducto: number;
  Descripcion: string;
  Cantidad: number;
  PrecioVenta: number;
  Excento: boolean;
  PorcentajeIVA: number;
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

type ClienteType = {
  IdEmpresa: number;
  IdCliente: number;
  IdTipoIdentificacion: number;
  Identificacion: string;
  Direccion: string;
  Nombre: string;
  NombreComercial: string;
  Telefono: string;
  Celular: string;
  Fax: string;
  CorreoElectronico: string;
  IdVendedor: number;
  IdTipoPrecio: number;
  AplicaTasaDiferenciada: boolean;
  IdImpuesto: number;
  IdTipoExoneracion: number;
  NumDocExoneracion: string;
  NombreInstExoneracion: string;
  FechaEmisionDoc: string;
  PorcentajeExoneracion: number;
  PermiteCredito: boolean;
};

type ProductoType = {
  IdEmpresa: number;
  IdProducto: number;
  Tipo: number;
  IdLinea: number;
  Codigo: string;
  CodigoProveedor: string;
  CodigoClasificacion: string;
  IdProveedor: number;
  Descripcion: string;
  PrecioCosto: number;
  PrecioVenta1: number;
  PrecioVenta2: number;
  PrecioVenta3: number;
  PrecioVenta4: number;
  PrecioVenta5: number;
  PorcDescuento: number;
  IdImpuesto: number;
  IndExistencia: number;
  Imagen: string;
  Marca: string;
  Observacion: string;
  ModificaPrecio: boolean;
  Activo: boolean;
};

export async function requestUserLogin(
  user: string,
  password: string,
  id: string
) {
  const ecryptedPass = encryptString(password);
  const endpoint =
    APP_URL +
    "/validarcredencialesweb?usuario=" +
    user +
    "&clave=" +
    ecryptedPass +
    "&identificacion=" +
    id;
  const company = await getWithResponse(endpoint, "");
  return company;
}

export async function getCompanyEntity(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerEmpresa', Parametros: {IdEmpresa: " +
    companyId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  return response;
}

export async function saveCompanyEntity(token: string, company: CompanyType) {
  const data =
    "{NombreMetodo: 'ActualizarEmpresa', Entidad: '" +
    JSON.stringify(company) +
    "'}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getCompanyLogo(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerLogotipoEmpresa', Parametros: {IdEmpresa: " +
    companyId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  return response;
}

export async function saveCompanyLogo(
  token: string,
  companyId: number,
  strLogo: string
) {
  const data =
    "{NombreMetodo: 'ActualizarLogoEmpresa', Parametros: {IdEmpresa: " +
    companyId +
    ", Logotipo: '" +
    strLogo +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function validateCredentials(
  token: string,
  userCode: string,
  userPass: string
) {
  const data =
    "{NombreMetodo: 'ValidarCredencialesHacienda', Parametros: {CodigoUsuario: '" +
    userCode +
    "', Clave: '" +
    userPass +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function validateCertificate(
  token: string,
  strPin: string,
  strCertificate: string
) {
  const data =
    "{NombreMetodo: 'ValidarCertificadoHacienda', Parametros: {PinCertificado: '" +
    strPin +
    "', Certificado: '" +
    strCertificate +
    "'}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getCredentialsEntity(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerCredencialesHacienda', Parametros: {IdEmpresa: " +
    companyId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const data =
    "{NombreMetodo: 'ObtenerListadoCantones', Parametros: {IdProvincia: " +
    provinceId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getDistritoList(
  token: string,
  provinceId: number,
  cantonId: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoDistritos', Parametros: {IdProvincia: " +
    provinceId +
    ", IdCanton: " +
    cantonId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getBarrioList(
  token: string,
  provinceId: number,
  cantonId: number,
  districtId: number
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoBarrios', Parametros: {IdProvincia: " +
    provinceId +
    ", IdCanton: " +
    cantonId +
    ", IdDistrito: " +
    districtId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getEconomicActivities(token: string, id: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoActividadEconomica', Parametros: {Identificacion: '" +
    id +
    "'}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getBranchList(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoSucursales', Parametros: {IdEmpresa: " +
    companyId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getVendorList(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoVendedores', Parametros: {IdEmpresa: " +
    companyId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getCustomerListCount(
  token: string,
  companyId: number,
  strFilter: string
) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaClientes', Parametros: {IdEmpresa: " +
    companyId +
    ", Nombre: '" +
    strFilter +
    "'}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getCustomerEntity(token: string, customerId: number) {
  const data =
    "{NombreMetodo: 'ObtenerCliente', Parametros: {IdCliente: " +
    customerId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  return response;
}

export async function getCustomerByIdentifier(
  token: string,
  companyId: number,
  identifier: string
) {
  const data =
    "{NombreMetodo: 'ValidaIdentificacionCliente', Parametros: {IdEmpresa: " +
    companyId +
    ", Identificacion: '" +
    identifier +
    "'}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  return parseCustomerToEntity(response);
}

export async function saveCustomerEntity(
  token: string,
  customer: CustomerType
) {
  const entidad = JSON.stringify({
    ...parseEntityToCustomer(customer),
    FechaEmisionDoc: convertToDateTimeString(customer.exonerationDate),
  });
  const data =
    "{NombreMetodo: '" +
    (customer.id ? "ActualizarCliente" : "AgregarCliente") +
    "', Entidad: " +
    entidad +
    "}";
  const response = await post(APP_URL + "/ejecutar", token, data);
  if (response === null) return null;
  return response;
}

export async function getProductCategoryList(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoLineas', Parametros: {IdEmpresa: " +
    companyId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getProductProviderList(token: string, companyId: number) {
  const data =
    "{NombreMetodo: 'ObtenerListadoProveedores', Parametros: {IdEmpresa: " +
    companyId +
    ", NumeroPagina: 1, FilasPorPagina: 0}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getProductEntity(
  token: string,
  productId: number,
  branchId: number,
  companyId: number,
  taxTypeList: IdValueType[]
) {
  const data =
    "{NombreMetodo: 'ObtenerProducto', Parametros: {IdProducto: " +
    productId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const product = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (product === null) return null;
  return parseProductToEntity(product, companyId, taxTypeList);
}

export async function getProductClasification(token: string, code: string) {
  const data =
    "{NombreMetodo: 'ObtenerClasificacionProducto', Parametros: {Codigo: '" +
    code +
    "'}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (!response) return null;
  return { id: response.Id, value: response.Impuesto };
}

export async function saveProductEntity(token: string, product: ProductType) {
  const entidad = JSON.stringify(parseEntityToProduct(product));
  const data =
    "{NombreMetodo: '" +
    (product.id ? "ActualizarProducto" : "AgregarProducto") +
    "', Entidad: " +
    entidad +
    "}";
  const response = await post(APP_URL + "/ejecutar", token, data);
  if (response === null) return null;
  return response;
}

export async function getExonerationTypeList(token: string) {
  const data = "{NombreMetodo: 'ObtenerListadoTipoExoneracion'}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getPaymentBankId(
  token: string,
  companyId: number,
  paymentMethod: number
) {
  let data;
  if (paymentMethod === 1 || paymentMethod === 2) {
    data =
      "{NombreMetodo: 'ObtenerListadoBancoAdquiriente', Parametros: {IdEmpresa: " +
      companyId +
      "}}";
  } else {
    data =
      "{NombreMetodo: 'ObtenerListadoCuentasBanco', Parametros: {IdEmpresa: " +
      companyId +
      "}}";
  }
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export function getCustomerPrice(
  company: CompanyType,
  customer: CustomerDetailsType,
  product: ProductType
) {
  let customerPrice = 0;
  let taxRate = product.taxRate;
  switch (customer.priceTypeId) {
    case 1:
      customerPrice = product.taxPrice1;
      break;
    case 2:
      customerPrice = product.taxPrice2;
      break;
    case 3:
      customerPrice = product.taxPrice3;
      break;
    case 4:
      customerPrice = product.taxPrice4;
      break;
    case 5:
      customerPrice = product.taxPrice5;
      break;
    default:
      customerPrice = product.taxPrice1;
  }
  customerPrice = roundNumber(customerPrice / (1 + taxRate / 100), 3);
  if (customer.differentiatedTaxRateApply) {
    taxRate = customer.taxRate;
  }
  if (company.ivaTaxIncluded && taxRate > 0)
    customerPrice = customerPrice * (1 + taxRate / 100);
  return { taxRate, finalPrice: roundNumber(customerPrice, 2) };
}

export function getProductSummary(
  products: ProductDetailsType[],
  percentage: number
) {
  let taxed = 0;
  let exonerated = 0;
  let exempt = 0;
  let subTotal = 0;
  let taxes = 0;
  let total = 0;
  const totalCost = 0;
  products.forEach((item) => {
    const precioUnitario = roundNumber(
      item.price / (1 + item.taxRate / 100),
      3
    );
    if (item.taxRate > 0) {
      let impuestoUnitario = (precioUnitario * item.taxRate) / 100;
      if (percentage > 0) {
        const gravadoParcial = precioUnitario * (1 - percentage / 100);
        taxed += roundNumber(gravadoParcial, 2) * item.quantity;
        exonerated +=
          roundNumber(precioUnitario - gravadoParcial, 2) * item.quantity;
        impuestoUnitario = (gravadoParcial * item.taxRate) / 100;
      } else {
        taxed += roundNumber(precioUnitario, 2) * item.quantity;
      }
      taxes += roundNumber(impuestoUnitario, 2) * item.quantity;
    } else {
      exempt += roundNumber(precioUnitario, 2) * item.quantity;
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
  productDetailList: ProductDetailsType[],
  summary: SummaryType,
  comment: string
) {
  const bankId = await getPaymentBankId(
    token,
    companyId,
    paymentDetailsList[0].paymentId
  );
  const invoiceDetails: DetalleFacturaType[] = [];
  productDetailList.forEach((item) => {
    const detail = {
      IdFactura: 0,
      IdProducto: item.id ?? 0,
      Descripcion: item.description,
      Cantidad: item.quantity,
      PrecioVenta: roundNumber(item.price / (1 + item.taxRate / 100), 3),
      Excento: item.taxRate === 0,
      PrecioCosto: item.costPrice ?? 0,
      CostoInstalacion: 0,
      PorcentajeIVA: item.taxRate,
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
  const data =
    "{NombreMetodo: 'AgregarFactura', Entidad: " +
    JSON.stringify(invoice) +
    "}";
  const invoiceId = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  return invoiceId.split("-")[0];
}

export async function revokeInvoiceEntity(
  token: string,
  invoiceId: number,
  idUser: number
) {
  const data =
    "{NombreMetodo: 'AnularFactura', Parametros: {IdFactura: " +
    invoiceId +
    ", IdUsuario: " +
    idUser +
    "}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getInvoiceEntity(token: string, invoiceId: number) {
  const data =
    "{NombreMetodo: 'ObtenerFactura', Parametros: {IdFactura: " +
    invoiceId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  return response;
}

export async function getProcessedInvoiceListCount(
  token: string,
  companyId: number,
  branchId: number
) {
  const data =
    "{NombreMetodo: 'ObtenerTotalListaFacturas', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  order.productDetailList.forEach((item, index) => {
    const detail = {
      IdConsecutivo: index,
      IdOrden: order?.id ?? 0,
      IdProducto: item.id ?? 0,
      Codigo: item.code,
      Descripcion: item.description,
      Cantidad: item.quantity,
      PrecioVenta: roundNumber(item.price / (1 + item.taxRate / 100), 3),
      Excento: item.taxRate === 0,
      PorcentajeIVA: item.taxRate,
      PorcDescuento: 0,
    };
    workingOrderDetails.push(detail);
  });
  const workingOrderDate = convertToDateTimeString(new Date());
  const workingOrder = {
    IdEmpresa: companyId,
    IdSucursal: branchId,
    IdTerminal: 1,
    IdOrden: order?.id,
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
    const invoiceId = await postWithResponse(
      APP_URL + "/ejecutarconsulta",
      token,
      JSON.parse(data)
    );
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

export async function revokeWorkingOrderEntity(
  token: string,
  orderId: number,
  idUser: number
) {
  const data =
    "{NombreMetodo: 'AnularOrdenServicio', Parametros: {IdOrdenServicio: " +
    orderId +
    ", IdUsuario: " +
    idUser +
    "}}";
  await post(APP_URL + "/ejecutar", token, data);
}

export async function getWorkingOrderEntity(token: string, orderId: number) {
  const data =
    "{NombreMetodo: 'ObtenerOrdenServicio', Parametros: {IdOrdenServicio: " +
    orderId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getDocumentListCount(
  token: string,
  companyId: number,
  branchId: number
) {
  const data =
    "{NombreMetodo: 'ObtenerTotalDocumentosElectronicosProcesados', Parametros: {IdEmpresa: " +
    companyId +
    ", IdSucursal: " +
    branchId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
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
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export async function getDocumentEntity(token: string, idDocument: number) {
  const data =
    "{NombreMetodo: 'ObtenerDocumentoElectronico', Parametros: {IdDocumento: " +
    idDocument +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return null;
  return response;
}

export async function sendDocumentByEmail(
  token: string,
  idDocument: number,
  emailTo: string
) {
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

export async function generateInvoicePDF(
  token: string,
  invoiceId: number,
  ref: string
) {
  const data =
    "{NombreMetodo: 'ObtenerFacturaPDF', Parametros: {IdFactura: " +
    invoiceId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), (c) => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/octet-stream" });
    saveAs(file, `Factura-${ref}.pdf`);
  }
}

export async function generateWorkingOrderPDF(
  token: string,
  orderId: number,
  ref: string
) {
  const data =
    "{NombreMetodo: 'ObtenerOrdenServicioPDF', Parametros: {IdOrden: " +
    orderId +
    "}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response.length > 0) {
    const byteArray = Uint8Array.from(atob(response), (c) => c.charCodeAt(0));
    const file = new Blob([byteArray], { type: "application/octet-stream" });
    saveAs(file, `OrdenServicio-${ref}.pdf`);
  }
}

export async function saveReceiptEntity(
  token: string,
  userId: number,
  branchId: number,
  company: CompanyType,
  receipt: ReceiptType
) {
  const receiptDetails: DetalleFacturaCompraType[] = [];
  receipt.productDetailList.forEach((item, index) => {
    const detail = {
      Linea: index + 1,
      Cantidad: item.quantity,
      Codigo: item.code,
      Descripcion: item.description,
      IdImpuesto: item.taxRateType ?? 8,
      PorcentajeIVA: item.taxRate,
      UnidadMedida: item.unit,
      PrecioVenta: roundNumber(item.price / (1 + item.taxRate / 100), 3),
    };
    receiptDetails.push(detail);
  });
  const receiptDate = convertToDateTimeString(new Date());
  const newReceipt = {
    IdEmpresa: company.id,
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
  const data =
    "{NombreMetodo: 'AgregarFacturaCompra', Entidad: " +
    JSON.stringify(newReceipt) +
    "}";
  const receiptId = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  return receiptId;
}

export async function getProductClasificationList(
  token: string,
  filter: string
) {
  const data =
    "{NombreMetodo: 'ObtenerListadoClasificacionProducto', Parametros: {NumeroPagina: 1, FilasPorPagina: " +
    100 +
    ", Descripcion: '" +
    filter +
    "'}}";
  const response = await postWithResponse(
    APP_URL + "/ejecutarconsulta",
    token,
    JSON.parse(data)
  );
  if (response === null) return [];
  return response;
}

export function getPriceFromTaxRate(
  price: number,
  taxRate: number,
  withTaxes: boolean
) {
  function withTaxesFunc(a: number, b: number) {
    return a * b;
  }
  function noTaxesFunc(a: number, b: number) {
    return a / b;
  }
  const taxOperation = withTaxes ? withTaxesFunc : noTaxesFunc;
  const rate = taxRate / 100;
  const finalPrice = taxOperation(price, 1 + rate);
  return finalPrice;
}

function parseCustomerToEntity(customer: ClienteType) {
  return {
    id: customer.IdCliente,
    typeId: customer.IdTipoIdentificacion,
    identifier: customer.Identificacion,
    name: customer.Nombre,
    companyName: customer.NombreComercial,
    address: customer.Direccion,
    phoneNumber: customer.Telefono,
    faxNumber: customer.Fax,
    email: customer.CorreoElectronico,
    vendorId: customer.IdVendedor,
    priceTypeId: customer.IdTipoPrecio,
    differentiatedTaxRateApply: customer.AplicaTasaDiferenciada,
    taxTypeId: customer.IdImpuesto,
    exonerationType: customer.IdTipoExoneracion,
    exonerationRef: customer.NumDocExoneracion,
    ExoneratedBy: customer.NombreInstExoneracion,
    exonerationDate: customer.FechaEmisionDoc,
    exonerationPercentage: customer.PorcentajeExoneracion,
    creditAllowed: customer.PermiteCredito,
  };
}

function parseEntityToCustomer(entity: CustomerType) {
  return {
    IdCliente: entity.id,
    IdTipoIdentificacion: entity.typeId,
    Identificacion: entity.identifier,
    Nombre: entity.name,
    NombreComercial: entity.companyName,
    Direccion: entity.address,
    Telefono: entity.phoneNumber,
    Fax: entity.faxNumber,
    CorreoElectronico: entity.email,
    IdVendedor: entity.vendorId,
    idTipoPrecio: entity.priceTypeId,
    AplicaTasaDiferenciada: entity.differentiatedTaxRateApply,
    IdImpuesto: entity.taxTypeId,
    IdTipoExoneracion: entity.exonerationType,
    NumDocExoneracion: entity.exonerationRef,
    NombreInstExoneracion: entity.exoneratedBy,
    FechaEmisionDoc: entity.exonerationDate,
    PorcentajeExoneracion: entity.exonerationPercentage,
    PermiteCredito: entity.creditAllowed,
  };
}

function parseProductToEntity(
  product: ProductoType,
  companyId: number,
  taxTypeList: IdValueType[]
) {
  const parseProduct: ProductType = {
    id: product.IdProducto,
    companyId: companyId,
    type: product.Tipo,
    category: product.IdLinea,
    code: product.Codigo,
    providerCode: product.CodigoProveedor,
    cabysCode: product.CodigoClasificacion,
    image: "",
    taxTypeId: product.IdImpuesto,
    taxRate: getTaxeRateFromId(taxTypeList, product.IdImpuesto),
    providerId: product.IdProveedor,
    description: product.Descripcion,
    costPrice: product.PrecioCosto,
    untaxPrice1: getPriceFromTaxRate(
      product.PrecioVenta1,
      getTaxeRateFromId(taxTypeList, product.IdImpuesto),
      false
    ),
    taxPrice1: product.PrecioVenta1,
    untaxPrice2: getPriceFromTaxRate(
      product.PrecioVenta2,
      getTaxeRateFromId(taxTypeList, product.IdImpuesto),
      false
    ),
    taxPrice2: product.PrecioVenta2,
    untaxPrice3: getPriceFromTaxRate(
      product.PrecioVenta3,
      getTaxeRateFromId(taxTypeList, product.IdImpuesto),
      false
    ),
    taxPrice3: product.PrecioVenta3,
    untaxPrice4: getPriceFromTaxRate(
      product.PrecioVenta4,
      getTaxeRateFromId(taxTypeList, product.IdImpuesto),
      false
    ),
    taxPrice4: product.PrecioVenta4,
    untaxPrice5: getPriceFromTaxRate(
      product.PrecioVenta5,
      getTaxeRateFromId(taxTypeList, product.IdImpuesto),
      false
    ),
    taxPrice5: product.PrecioVenta5,
    observation: product.Observacion,
    brand: product.Marca,
    active: product.Activo,
    discountPercentage: product.PorcDescuento,
    priceChangeAllowed: product.ModificaPrecio,
    minInventory: product.IndExistencia,
  };
  return parseProduct;
}

function parseEntityToProduct(product: ProductType) {
  const parseProduct: ProductoType = {
    IdProducto: product.id ?? 0,
    IdEmpresa: product.companyId,
    Tipo: product.type,
    IdLinea: product.category,
    Codigo: product.code,
    CodigoProveedor: product.providerCode,
    CodigoClasificacion: product.cabysCode,
    Imagen: "",
    IdImpuesto: product.taxTypeId,
    IdProveedor: product.providerId,
    Descripcion: product.description,
    PrecioCosto: product.costPrice,
    PrecioVenta1: product.taxPrice1,
    PrecioVenta2: product.taxPrice2,
    PrecioVenta3: product.taxPrice3,
    PrecioVenta4: product.taxPrice4,
    PrecioVenta5: product.taxPrice5,
    IndExistencia: product.minInventory,
    PorcDescuento: product.discountPercentage,
    ModificaPrecio: product.priceChangeAllowed,
    Observacion: product.observation,
    Marca: product.brand,
    Activo: product.active,
  };
  return parseProduct;
}

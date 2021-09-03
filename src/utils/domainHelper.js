import { encryptString, roundNumber, getWithResponse, post, postWithResponse } from './utilities'
import { saveAs } from 'file-saver'

const SERVICE_URL = process.env.REACT_APP_SERVER_URL
const APP_URL = `${SERVICE_URL}/PuntoventaWCF.svc`

export async function userLogin(user, password, id) {
  try {
    const ecryptedPass = encryptString(password)
    const endpoint = APP_URL + '/validarcredencialesweb?usuario=' + user + '&clave=' + ecryptedPass + '&identificacion=' + id
    const company = await getWithResponse(endpoint, '')
    return company
  } catch (e) {
    throw e
  }
}

export async function getCompanyEntity(token, idCompany) {
  try {
    const data = "{NombreMetodo: 'ObtenerEmpresa', Parametros: {IdEmpresa: " + idCompany + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch {
    throw new Error('Error al comunicarse con el servicio web. Intente más tarde. . .')
  }
}

export async function saveCompanyEntity(token, entity) {
  try {
    const data = "{NombreMetodo: 'ActualizarEmpresa', Entidad: '" + JSON.stringify(entity) + "'}";
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e
  }
}

export async function saveCompanyLogo(token, idCompany, strLogo) {
  try {
    const data = "{NombreMetodo: 'ActualizarLogoEmpresa', Parametros: {IdEmpresa: " + idCompany + ", Logotipo: '" + strLogo + "'}}";
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e
  }
}

export async function saveCompanyCertificate(token, idCompany, strCertificate) {
  try {
    const data = "{NombreMetodo: 'ActualizarCertificadoEmpresa', Parametros: {IdEmpresa: " + idCompany + ", Certificado: '" + strCertificate + "'}}";
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e
  }
}

export async function getCantonList(token, idProvincia) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoCantones', Parametros: {IdProvincia: " + idProvincia + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getDistritoList(token, idProvincia, idCanton) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoDistritos', Parametros: {IdProvincia: " + idProvincia + ", IdCanton: " + idCanton + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getBarrioList(token, idProvincia, idCanton, idDistrito) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoBarrios', Parametros: {IdProvincia: " + idProvincia + ", IdCanton: " + idCanton + ", IdDistrito: " + idDistrito + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getBranchList(token, idCompany) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoSucursales', Parametros: {IdEmpresa: " + idCompany + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getReportData(token, reportName, idCompany, idBranch, startDate, endDate) {
  try {
    const data = "{NombreMetodo: 'ObtenerDatosReporte', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NombreReporte: '" + reportName + "', FechaInicial: '" + startDate + "', FechaFinal: '" + endDate + "'}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e
  }
}

export async function getIdTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipoIdentificacion'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getRentTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipoImpuesto'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getPriceTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipodePrecio'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getCustomerList(token, companyId, strFilter) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoClientes', Parametros: {IdEmpresa: " + companyId + ", NumeroPagina: 1, FilasPorPagina: 0, Nombre: '" + strFilter + "'}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getCustomerEntity(token, idCustomer) {
  try {
    const data = "{NombreMetodo: 'ObtenerCliente', Parametros: {IdCliente: " + idCustomer + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return { ...response, FechaEmisionDoc: response.FechaEmisionDoc.DateTime.substr(0,10) }
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function saveCustomerEntity(token, customer) {
  try {

    const entidad = JSON.stringify({ ...customer, FechaEmisionDoc: {DateTime: customer.FechaEmisionDoc + ' 22:59:59 GMT-06:00'}})
    const data = "{NombreMetodo: '" + (customer.IdCliente ? "ActualizarCliente" : "AgregarCliente") + "', Entidad: " + entidad + "}"
    const response = await post(APP_URL + "/ejecutar", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getProductTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipoProducto'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getProductCategoryList(token, idCompany) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoLineas', Parametros: {IdEmpresa: " + idCompany + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getProductProviderList(token, idCompany) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoProveedores', Parametros: {IdEmpresa: " + idCompany + ", NumeroPagina: 1, FilasPorPagina: 0}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getProductList(token, idCompany, idBranch, activeOnly, filterText, type) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoProductos', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NumeroPagina: 1, FilasPorPagina: 50, IncluyeServicios: 'true', FiltraActivos: '" + activeOnly + "', IdLinea: 0, Codigo: '" + (type === 1 ? filterText : '') + "', Descripcion: '" + (type === 2 ? filterText : '') + "'}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getProductEntity(token, idProduct, idBranch) {
  try {
    const data = "{NombreMetodo: 'ObtenerProducto', Parametros: {IdProducto: " + idProduct + ", IdSucursal: " + idBranch + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function saveProductEntity(token, product) {
  try {
    const entidad = JSON.stringify(product)
    const data = "{NombreMetodo: '" + (product.IdProducto ? "ActualizarProducto" : "AgregarProducto") + "', Entidad: " + entidad + "}"
    const response = await post(APP_URL + "/ejecutar", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getExonerationTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipoExoneracion'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getPaymentBankId(token, idCompany, paymentMethod) {
  try {
    let data
    if (paymentMethod === 1 || paymentMethod === 2) {
      data = "{NombreMetodo: 'ObtenerListadoBancoAdquiriente', Parametros: {IdEmpresa: " + idCompany + "}}"
    } else {
      data = "{NombreMetodo: 'ObtenerListadoCuentasBanco', Parametros: {IdEmpresa: " + idCompany + "}}"
    }
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    if (response.length === 0) return null
    return response[0].Id
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export function getCustomerPrice(customer, product) {
  let customerPrice = 0
  switch (customer.IdTipoPrecio) {
    case 1:
      customerPrice = product.PrecioVenta1
      break
    case 2:
      customerPrice = product.PrecioVenta2
      break
    case 3:
      customerPrice = product.PrecioVenta3
      break
    case 4:
      customerPrice = product.PrecioVenta4
      break
    case 5:
      customerPrice = product.PrecioVenta5
      break
    default:
      customerPrice = product.PrecioVenta1
  }
  if (customer.AplicaTasaDiferenciada) {
    customerPrice = roundNumber(customerPrice / (1 + (product.ParametroImpuesto.TasaImpuesto / 100)), 3)
    customerPrice = roundNumber(customerPrice * (1 + (customer.ParametroImpuesto.TasaImpuesto / 100)), 2)
  }
  return customerPrice
}

export function getProductSummary(products, exonerationPercentage) {
  try {
    let gravado = 0
    let exonerado = 0
    let excento = 0
    let subTotal = 0
    let impuesto = 0
    let total = 0
    let totalCosto = 0
    products.forEach(item => {
      const precioUnitario = roundNumber(item.PrecioVenta / (1 + (item.PorcentajeIVA / 100)), 3)
      if (item.PorcentajeIVA > 0) {
        let impuestoUnitario = precioUnitario * item.PorcentajeIVA / 100
        if (exonerationPercentage > 0) {
          const gravadoParcial = precioUnitario * (1 - (exonerationPercentage / 100))
          gravado += roundNumber(gravadoParcial, 2) * item.Cantidad
          exonerado += roundNumber((precioUnitario - gravadoParcial), 2) * item.Cantidad
          impuestoUnitario = gravadoParcial * item.PorcentajeIVA / 100
        } else {
          gravado += roundNumber(precioUnitario, 2) * item.Cantidad
        }
        impuesto += roundNumber(impuestoUnitario, 2) * item.Cantidad
      } else {
        excento += roundNumber(precioUnitario, 2) * item.Cantidad
      }
    })
    subTotal = gravado + exonerado + excento
    total = subTotal + impuesto
    return {
      gravado: roundNumber(gravado, 2),
      exonerado: roundNumber(exonerado, 2),
      excento: roundNumber(excento, 2),
      subTotal: roundNumber(subTotal, 2),
      impuesto: roundNumber(impuesto, 2),
      total: roundNumber(total, 2),
      totalCosto: roundNumber(totalCosto, 2)
    }
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function saveInvoiceEntity(
  token,
  userId,
  productDetails,
  paymentId,
  orderId,
  branchId,
  company,
  customer,
  summary,
  comment
) {
  try {
    const bankId = await getPaymentBankId(token, company.IdEmpresa, paymentId)
    const invoiceDetails = []
    productDetails.forEach(item => {
      const detail = {
        IdFactura: 0,
        IdProducto: item.IdProducto,
        Descripcion: item.Descripcion,
        Cantidad: item.Cantidad,
        PrecioVenta: roundNumber(item.PrecioVenta / (1 + (item.PorcentajeIVA / 100)), 3),
        Excento: item.Excento,
        PrecioCosto: item.PrecioCosto,
        CostoInstalacion: 0,
        PorcentajeIVA: item.PorcentajeIVA
      }
      invoiceDetails.push(detail)
    })
    const invoicePayments = [{
      IdConsecutivo: 0,
      IdFactura: 0,
      IdFormaPago: paymentId,
      IdTipoMoneda: company.IdTipoMoneda,
      IdCuentaBanco: bankId,
      TipoTarjeta: '',
      NroMovimiento: '',
      MontoLocal: summary.total,
      MontoForaneo: summary.total
    }]
    const invoiceDate = new Date()
    const dd = (invoiceDate.getDate() < 10 ? '0' : '') + invoiceDate.getDate()
    const MM = ((invoiceDate.getMonth() + 1) < 10 ? '0' : '') + (invoiceDate.getMonth() + 1)
    const HH = (invoiceDate.getHours() < 10 ? '0' : '') + invoiceDate.getHours()
    const mm = (invoiceDate.getMinutes() < 10 ? '0' : '') + invoiceDate.getMinutes()
    const ss = (invoiceDate.getSeconds() < 10 ? '0' : '') + invoiceDate.getSeconds()
    const timeString = dd + '/' + MM + '/' + invoiceDate.getFullYear() + ' ' + HH + ':' + mm + ':' + ss + ' GMT-06:00'
    const invoice = {
      IdEmpresa: company.IdEmpresa,
      IdSucursal: branchId,
      IdTerminal: 1,
      IdFactura: 0,
      IdUsuario: userId,
      IdTipoMoneda: 1,
      TipoDeCambioDolar: 0,
      IdCliente: customer.IdCliente,
      NombreCliente: customer.Nombre,
      IdCondicionVenta: 1,
      PlazoCredito: 0,
      Fecha: {DateTime: timeString},
      TextoAdicional: comment,
      IdVendedor: 1,
      Excento: summary.excento,
      Gravado: summary.gravado,
      Exonerado: summary.exonerado,
      Descuento: 0,
      Impuesto: summary.impuesto,
      TotalCosto: summary.totalCosto,
      MontoPagado: summary.total,
      IdTipoExoneracion: customer.IdTipoExoneracion,
      NumDocExoneracion: customer.NumDocExoneracion,
      NombreInstExoneracion: customer.NombreInstExoneracion,
      FechaEmisionDoc: {DateTime: customer.FechaEmisionDoc + ' 22:59:59 GMT-06:00'},
      PorcentajeExoneracion: customer.PorcentajeExoneracion,
      IdCxC: 0,
      IdAsiento: 0,
      IdMovBanco: 0,
      IdOrdenServicio: orderId,
      IdProforma: 0,
      DetalleFactura: invoiceDetails,
      DesglosePagoFactura: invoicePayments
    }
    const data = "{NombreMetodo: 'AgregarFactura', Entidad: " + JSON.stringify(invoice) + "}"
    let invoiceId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    return invoiceId.split("-")[0]
  } catch (e) {
    throw e.message ? e.message : e
  }
}


export async function revokeInvoiceEntity(token, invoiceId, idUser) {
  try {
    const data = "{NombreMetodo: 'AnularFactura', Parametros: {IdFactura: " + invoiceId + ", IdUsuario: " + idUser + "}}"
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getInvoiceEntity(token, invoiceId) {
  try {
    const data = "{NombreMetodo: 'ObtenerFactura', Parametros: {IdFactura: " + invoiceId + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return { ...response, Fecha: response.Fecha.DateTime.substr(0,10) }
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getProcessedInvoiceListCount(token, idCompany, idBranch) {
  try {
    const data = "{NombreMetodo: 'ObtenerTotalListaFacturas', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getProcessedInvoiceListPerPage(token, idCompany, idBranch, pageNumber, rowPerPage) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoFacturas', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NumeroPagina: " + pageNumber + ",FilasPorPagina: " + rowPerPage + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function saveWorkingOrderEntity(
  token,
  orderId,
  userId,
  productDetails,
  branchId,
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
  try {
    const workingOrderDetails = []
    productDetails.forEach(item => {
      const detail = {
        IdOrden: orderId,
        IdProducto: item.IdProducto,
        Codigo: item.Codigo,
        Descripcion: item.Descripcion,
        Cantidad: item.Cantidad,
        PrecioVenta: roundNumber(item.PrecioVenta / (1 + (item.PorcentajeIVA / 100)), 3),
        Excento: item.Excento,
        PorcentajeIVA: item.PorcentajeIVA,
        PorcDescuento: 0
      }
      workingOrderDetails.push(detail)
    })
    const workingOrderDate = new Date()
    const dd = (workingOrderDate.getDate() < 10 ? '0' : '') + workingOrderDate.getDate()
    const MM = ((workingOrderDate.getMonth() + 1) < 10 ? '0' : '') + (workingOrderDate.getMonth() + 1)
    const HH = (workingOrderDate.getHours() < 10 ? '0' : '') + workingOrderDate.getHours()
    const mm = (workingOrderDate.getMinutes() < 10 ? '0' : '') + workingOrderDate.getMinutes()
    const ss = (workingOrderDate.getSeconds() < 10 ? '0' : '') + workingOrderDate.getSeconds()
    const timeString = dd + '/' + MM + '/' + workingOrderDate.getFullYear() + ' ' + HH + ':' + mm + ':' + ss + ' GMT-06:00'
    const workingOrder = {
      IdEmpresa: company.IdEmpresa,
      IdSucursal: branchId,
      IdTerminal: 1,
      IdOrden: orderId,
      IdUsuario: userId,
      IdTipoMoneda: 1,
      IdCliente: customer.IdCliente,
      NombreCliente: customer.Nombre,
      Fecha: {DateTime: timeString},
      IdVendedor: 1,
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
      DetalleOrdenServicio: workingOrderDetails
    }
    const data = "{NombreMetodo: '" + (orderId === 0 ? "AgregarOrdenServicio" : "ActualizarOrdenServicio") + "', Entidad: " + JSON.stringify(workingOrder) + "}"
    if (orderId === 0) {
      let invoiceId = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
      return invoiceId.split("-")[0]
    } else {
      await post(APP_URL + "/ejecutar", token, data)
    }
  } catch (e) {
    throw e.message ? e.message : e
  }
}


export async function revokeWorkingOrderEntity(token, workingOrderId, idUser) {
  try {
    const data = "{NombreMetodo: 'AnularOrdenServicio', Parametros: {IdOrdenServicio: " + workingOrderId + ", IdUsuario: " + idUser + "}}"
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getWorkingOrderEntity(token, workingOrderId) {
  try {
    const data = "{NombreMetodo: 'ObtenerOrdenServicio', Parametros: {IdOrdenServicio: " + workingOrderId + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return { ...response, Fecha: response.Fecha.DateTime.substr(0,10), Cliente: { ...response.Cliente, FechaEmisionDoc: response.Cliente.FechaEmisionDoc.DateTime.substr(0,10) } }
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getWorkingOrderListCount(token, idCompany, idBranch, bolApplied) {
  try {
    const data = "{NombreMetodo: 'ObtenerTotalListaOrdenServicio', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", Aplicado: '" + bolApplied + "'}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getWorkingOrderListPerPage(token, idCompany, idBranch, bolApplied, pageNumber, rowPerPage) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoOrdenServicio', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NumeroPagina: " + pageNumber + ", Aplicado: '" + bolApplied + "', FilasPorPagina: " + rowPerPage + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getDocumentListCount(token, idCompany, idBranch) {
  try {
    const data = "{NombreMetodo: 'ObtenerTotalDocumentosElectronicosProcesados', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getDocumentListPerPage(token, idCompany, idBranch, pageNumber, rowPerPage) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoDocumentosElectronicosProcesados', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NumeroPagina: " + pageNumber + ",FilasPorPagina: " + rowPerPage + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function getDocumentEntity(token, idDocument) {
  try {
    const data = "{NombreMetodo: 'ObtenerDocumentoElectronico', Parametros: {IdDocumento: " + idDocument + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function sendDocumentByEmail(token, idDocument, emailTo) {
  try {
    const data = "{NombreMetodo: 'EnviarNotificacionDocumentoElectronico', Parametros: {IdDocumento: " + idDocument + ", CorreoReceptor: '" + emailTo + "'}}"
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e.message
  }
}

export async function sendReportEmail(token, idCompany, idBranch, reportName, startDate, endDate) {
  try {
    if (reportName !== '') {
      const data = "{NombreMetodo: 'EnviarReportePorCorreoElectronico', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NombreReporte: '" + reportName + "', FechaInicial: '" + startDate + "', FechaFinal: '" + endDate + "', FormatoReporte: 'PDF'}}"
      await post(APP_URL + "/ejecutar", token, data)
    }
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function generateInvoicePDF(token, invoiceId, ref) {
  try {
    const data = "{NombreMetodo: 'ObtenerFacturaPDF', Parametros: {IdFactura: " + invoiceId + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response.length > 0) {
      const byteArray = new Uint8Array(response);
      const file = new Blob([byteArray], { type: "application/octet-stream" })
      saveAs(file, `Factura-${ref}.pdf`)
    }
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function sendInvoicePDF(token, invoiceId) {
  try {
    const data = "{NombreMetodo: 'GenerarNotificacionFactura', Parametros: {IdFactura: " + invoiceId + "}}"
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function generateWorkingOrderPDF(token, workingOrderId, ref) {
  try {
    const data = "{NombreMetodo: 'ObtenerOrdenServicioPDF', Parametros: {IdOrdenServicio: " + workingOrderId + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response.length > 0) {
      const byteArray = new Uint8Array(response);
      const file = new Blob([byteArray], { type: "application/octet-stream" })
      saveAs(file, `Factura-${ref}.pdf`)
    }
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export async function sendWorkingOrderPDF(token, workingOrderId) {
  try {
    const data = "{NombreMetodo: 'GenerarNotificacionFactura', Parametros: {IdOrdenServicio: " + workingOrderId + "}}"
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e.message ? e.message : e
  }
}

export function getPriceTransformed(price, taxId, withTaxes) {
  function withTaxesFunc (a, b) { return a * b }
  function noTaxesFunc (a, b) { return a / b }
  let untaxPrice = 0
  const taxOperation = withTaxes ? withTaxesFunc : noTaxesFunc
  switch (taxId) {
    case 1:
      untaxPrice = price
      break;
    case 2:
      untaxPrice = taxOperation(price, 1.01)
      break;
    case 3:
      untaxPrice = taxOperation(price, 1.02)
      break;
    case 4:
      untaxPrice = taxOperation(price, 1.04)
      break;
    case 5:
      untaxPrice = price
      break;
    case 6:
      untaxPrice = taxOperation(price, 1.04)
      break;
    case 7:
      untaxPrice = taxOperation(price, 1.08)
      break;
    case 8:
      untaxPrice = taxOperation(price, 1.13)
      break;
    default:
      untaxPrice = price
  }
  return untaxPrice
}

export function getPriceTransformedWithRate(price, taxRate, withTaxes) {
  function withTaxesFunc (a, b) { return a * b }
  function noTaxesFunc (a, b) { return a / b }
  const taxOperation = withTaxes ? withTaxesFunc : noTaxesFunc
  const rate = taxRate / 100
  const untaxPrice = taxOperation(price, (1 + rate))
  return untaxPrice
}

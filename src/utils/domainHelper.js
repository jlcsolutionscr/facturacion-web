import { encryptString, roundNumber, getWithResponse, post, postWithResponse } from './utilities'
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

export async function getReportData(token, reportType, idCompany, idBranch, startDate, endDate) {
  try {
    const data = "{NombreMetodo: 'ObtenerDatosReporte', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", TipoReporte: " + reportType + ", FechaInicial: '" + startDate + "', FechaFinal: '" + endDate + "'}}"
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
    throw e.message
  }
}

export async function getRentTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipoImpuesto'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getPriceTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipodePrecio'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getCustomerList(token, companyId) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoClientes', Parametros: {IdEmpresa: " + companyId + ", NumeroPagina: 1, FilasPorPagina: 0}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response.map(item => ({IdCliente: item.Id, Nombre: item.Descripcion }))
  } catch (e) {
    throw e.message
  }
}

export async function getCustomerEntity(token, idCustomer) {
  try {
    const data = "{NombreMetodo: 'ObtenerCliente', Parametros: {IdCliente: " + idCustomer + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return { ...response, FechaEmisionDoc: response.FechaEmisionDoc.DateTime.substr(0,10) }
  } catch (e) {
    throw e.message
  }
}

export async function saveCustomerEntity(token, customer) {
  try {
    const entidad = JSON.stringify(customer)
    let data = ""
    if (customer.IdCliente) {
      console.log('Actualizando cliente', entidad)

      data = "{NombreMetodo: 'ActualizarCliente', Entidad: " + entidad + "}"
    } else {
      data = "{NombreMetodo: 'AgregarCliente', Entidad: " + entidad + "}"
    }
    const response = await post(APP_URL + "/ejecutar", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProductTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipoProducto'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProductCategoryList(token, idCompany) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoLineas', Parametros: {IdEmpresa: " + idCompany + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProductProviderList(token, idCompany) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoProveedores', Parametros: {IdEmpresa: " + idCompany + ", NumeroPagina: 1, FilasPorPagina: 0}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProductList(token, idCompany, idBranch, filterText) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoProductos', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NumeroPagina: 1, FilasPorPagina: 50, IncluyeServicios: 'true', FiltraActivos: 'true', IdLinea: 0, Codigo: '', Descripcion: '" + filterText + "'}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProductEntity(token, idProduct, idBranch) {
  try {
    const data = "{NombreMetodo: 'ObtenerProducto', Parametros: {IdProducto: " + idProduct + ", IdSucursal: " + idBranch + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message
  }
}

export async function saveProductEntity(token, product) {
  try {
    const entidad = JSON.stringify(product)
    let data = ""
    if (product.IdProducto)
      data = "{NombreMetodo: 'ActualizarProducto', Entidad: " + entidad + "}"
    else
      data = "{NombreMetodo: 'AgregarProducto', Entidad: " + entidad + "}"
    const response = await post(APP_URL + "/ejecutar", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getExonerationTypeList(token) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoTipoExoneracion'}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
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
    throw e.message
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

export function getInvoiceSummary(products, exonerationPercentage) {
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
    throw e.message
  }
}

export async function saveInvoiceEntity(
  token,
  userId,
  productDetails,
  paymentId,
  branchId,
  company,
  customer,
  summary) {
  try {
    const bankId = await getPaymentBankId(token, company.IdEmpresa, paymentId)
    const detalleFactura = []
    productDetails.forEach(item => {
      const detalle = {
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
      detalleFactura.push(detalle)
    })
    const desglosePagoFactura = [{
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
    const fechaFactura = new Date()
    const dd = (fechaFactura.getDate() < 10 ? '0' : '') + fechaFactura.getDate()
    const MM = ((fechaFactura.getMonth() + 1) < 10 ? '0' : '') + (fechaFactura.getMonth() + 1)
    const HH = (fechaFactura.getHours() < 10 ? '0' : '') + fechaFactura.getHours()
    const mm = (fechaFactura.getMinutes() < 10 ? '0' : '') + fechaFactura.getMinutes()
    const ss = (fechaFactura.getSeconds() < 10 ? '0' : '') + fechaFactura.getSeconds()
    const timeString = dd + '/' + MM + '/' + fechaFactura.getFullYear() + ' ' + HH + ':' + mm + ':' + ss + ' GMT-07:00'
    const factura = {
      IdEmpresa: company.IdEmpresa,
      IdSucursal: branchId,
      IdTerminal: 1,
      IdFactura: 0,
      IdUsuario: userId,
      IdTipoMoneda: 1,
      TipoDeCambioDolar: 0,
      IdCliente: customer.IdCliente,
      NombreCliente: customer.NombreCliente,
      IdCondicionVenta: 1,
      PlazoCredito: 0,
      Fecha: {DateTime: timeString},
      TextoAdicional: '',
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
      FechaEmisionDoc: {DateTime: customer.FechaEmisionDoc + ' 22:59:59 GMT-07:00'},
      PorcentajeExoneracion: customer.PorcentajeExoneracion,
      IdCxC: 0,
      IdAsiento: 0,
      IdMovBanco: 0,
      IdOrdenServicio: 0,
      IdProforma: 0,
      DetalleFactura: detalleFactura,
      DesglosePagoFactura: desglosePagoFactura
    }
    let data = "{NombreMetodo: 'AgregarFactura', Entidad: " + JSON.stringify(factura) + "}"
    await post(APP_URL + "/ejecutarconsulta", token, data)
  } catch (e) {
    throw e.message
  }
}


export async function revokeInvoiceEntity(token, idInvoice, idUser) {
  try {
    const data = "{NombreMetodo: 'AnularFactura', Parametros: {IdFactura: " + idInvoice + ", IdUsuario: " + idUser + "}}"
    await post(APP_URL + "/ejecutar", token, data)
  } catch (e) {
    throw e.message
  }
}

export async function getInvoiceDetails(token, idInvoice) {
  try {
    const data = "{NombreMetodo: 'ObtenerFactura', Parametros: {IdFactura: " + idInvoice + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProcessedInvoiceListCount(token, idCompany, idBranch) {
  try {
    const data = "{NombreMetodo: 'ObtenerTotalListaFacturas', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProcessedInvoiceListPerPage(token, idCompany, idBranch, pageNumber, rowPerPage) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoFacturas', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NumeroPagina: " + pageNumber + ",FilasPorPagina: " + rowPerPage + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProcessedDocumentListCount(token, idCompany, idBranch) {
  try {
    const data = "{NombreMetodo: 'ObtenerTotalDocumentosElectronicosProcesados', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getProcessedDocumentListPerPage(token, idCompany, idBranch, pageNumber, rowPerPage) {
  try {
    const data = "{NombreMetodo: 'ObtenerListadoDocumentosElectronicosProcesados', Parametros: {IdEmpresa: " + idCompany + ", IdSucursal: " + idBranch + ", NumeroPagina: " + pageNumber + ",FilasPorPagina: " + rowPerPage + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return []
    return response
  } catch (e) {
    throw e.message
  }
}

export async function getDocumentEntity(token, idDocument) {
  try {
    const data = "{NombreMetodo: 'ObtenerDocumentoElectronico', Parametros: {IdDocumento: " + idDocument + "}}"
    const response = await postWithResponse(APP_URL + "/ejecutarconsulta", token, data)
    if (response === null) return null
    return response
  } catch (e) {
    throw e.message
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
    throw e.message
  }
}

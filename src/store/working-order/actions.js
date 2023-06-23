import { ROWS_PER_CUSTOMER, ROWS_PER_PRODUCT } from 'utils/constants'
import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_DETAILS_LIST,
  SET_SUMMARY,
  SET_ACTIVITY_CODE,
  SET_PAYMENT_ID,
  SET_VENDOR_ID,
  SET_DELIVERY_ATTRIBUTE,
  SET_ORDER,
  SET_INVOICE_ID,
  SET_STATUS,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  RESET_ORDER,
  SET_SERVICE_POINT_LIST
} from './types'

import {
  startLoader,
  stopLoader,
  setMessage,
  setActiveSection
} from 'store/ui/actions'

import { setCompany } from 'store/company/actions'
import { setPrinter, setVendorList } from 'store/session/actions'
import { setCustomer, setCustomerListPage, setCustomerListCount, setCustomerList } from 'store/customer/actions'
import { setProduct, filterProductList, setProductListPage, setProductListCount, setProductList } from 'store/product/actions'

import { roundNumber } from 'utils/utilities'
import {
  getCompanyEntity,
  getCustomerListCount,
  getCustomerListPerPage,
  getProductListCount,
  getProductListPerPage,
  getProductEntity,
  getVendorList,
  getCustomerPrice,
  getProductSummary,
  saveWorkingOrderEntity,
  getWorkingOrderListCount,
  getWorkingOrderListPerPage,
  revokeWorkingOrderEntity,
  generateWorkingOrderPDF,
  getWorkingOrderEntity,
  getInvoiceEntity,
  saveInvoiceEntity,
  getPriceFromTaxRate,
  getServicePointList
} from 'utils/domainHelper'

import { defaultCustomer } from 'utils/defaults'
import { printWorkingOrder, printInvoice, getDeviceFromUsb } from 'utils/printing'
import { getTaxeRateFromId } from 'utils/utilities'

export const setDescription = (description) => {
  return {
    type: SET_DESCRIPTION,
    payload: { description }
  }
}

export const setQuantity = (quantity) => {
  return {
    type: SET_QUANTITY,
    payload: { quantity }
  }
}

export const setPrice = (price) => {
  return {
    type: SET_PRICE,
    payload: { price }
  }
}

export const setDetailsList = (details) => {
  return {
    type: SET_DETAILS_LIST,
    payload: { details }
  }
}

export const setSummary = (summary) => {
  return {
    type: SET_SUMMARY,
    payload: { summary }
  }
}

export const setPaymentId = (id) => {
  return {
    type: SET_PAYMENT_ID,
    payload: { id }
  }
}

export const setVendorId = (id) => {
  return {
    type: SET_VENDOR_ID,
    payload: { id }
  }
}

export const setDeliveryAttribute = (attribute, value) => {
  return {
    type: SET_DELIVERY_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const setWorkingOrder = (order) => {
  return {
    type: SET_ORDER,
    payload: { order }
  }
}

export const setInvoiceId = (id) => {
  return {
    type: SET_INVOICE_ID,
    payload: { id }
  }
}

export const setActivityCode = (code) => {
  return {
    type: SET_ACTIVITY_CODE,
    payload: { code }
  }
}

export const setStatus = (status) => {
  return {
    type: SET_STATUS,
    payload: { status }
  }
}

export const setWorkingOrderListPage = (page) => {
  return {
    type: SET_LIST_PAGE,
    payload: { page }
  }
}

export const setWorkingOrderListCount = (count) => {
  return {
    type: SET_LIST_COUNT,
    payload: { count }
  }
}

export const setWorkingOrderList = (list) => {
  return {
    type: SET_LIST,
    payload: { list }
  }
}

export const resetWorkingOrder = () => {
  return {
    type: RESET_ORDER
  }
}

export const setServicePointList = (list) => {
  return {
    type: SET_SERVICE_POINT_LIST,
    payload: { list }
  }
}

export function setWorkingOrderParameters () {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    const { company } = getState().company
    dispatch(startLoader())
    try {
      let companyEntity = company
      if (companyEntity === null) {
        companyEntity = await getCompanyEntity(token, companyId)
        dispatch(setCompany(companyEntity))
      }
      const vendorList = await getVendorList(token, companyId)
      dispatch(setVendorList(vendorList))
      if (companyEntity.Modalidad === 1) {
        const customerCount = await getCustomerListCount(token, companyId, '')
        const customerList = await getCustomerListPerPage(token, companyId, 1, ROWS_PER_CUSTOMER, '')
        dispatch(setCustomerListPage(1))
        dispatch(setCustomerListCount(customerCount))
        dispatch(setCustomerList(customerList))
      } else {
        const servicePointList = await getServicePointList(token, companyId, branchId, true, '');
        dispatch(setServicePointList(servicePointList))
      }
      const productCount = await getProductListCount(token, companyId, branchId, true, '', 1)
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, ROWS_PER_PRODUCT, '', 1)
      dispatch(resetWorkingOrder())
      dispatch(setVendorId(vendorList[0].Id))
      dispatch(setCustomer(defaultCustomer))
      dispatch(setProductListPage(1))
      dispatch(setProductListCount(productCount))
      dispatch(setProductList(productList))
      dispatch(setActivityCode(companyEntity.ActividadEconomicaEmpresa[0].CodigoActividad))
      dispatch(setActiveSection(21))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error.message))
    }
  }
}

export function getProduct (idProduct, filterType) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { company } = getState().company
    const { customer } = getState().customer
    const { rentTypeList } = getState().ui
    dispatch(startLoader())
    try {
      const product = await getProductEntity(token, idProduct, 1)
      let price = product.PrecioVenta1
      if (customer != null) price = getCustomerPrice(company, customer, product, rentTypeList)
      dispatch(filterProductList('', filterType))
      dispatch(setDescription(product.Descripcion))
      dispatch(setQuantity(1))
      dispatch(setPrice(price))
      dispatch(setProduct(product))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setDescription(''))
      dispatch(setQuantity(1))
      dispatch(setPrice(0))
      dispatch(setMessage(error.message))
    }
  }
}

export function addDetails () {
  return async (dispatch, getState) => {
    const { rentTypeList } = getState().ui
    const { customer } = getState().customer
    const { product } = getState().product
    const { company } = getState().company
    const { detailsList, description, quantity, price } = getState().workingOrder
    try {
      if (product != null && description !== '' && quantity > 0 &&  price > 0) {
        let newProducts = null
        let tasaIva = getTaxeRateFromId(rentTypeList, product.IdImpuesto)
        if (tasaIva > 0 && customer.AplicaTasaDiferenciada) tasaIva = getTaxeRateFromId(rentTypeList, customer.IdImpuesto)
        let finalPrice = price
        if (!company.PrecioVentaIncluyeIVA && tasaIva > 0) finalPrice = price * (1 + (tasaIva / 100))
        const item = {
          IdProducto: product.IdProducto,
          Codigo: product.Codigo,
          Descripcion: description,
          Cantidad: quantity,
          PrecioVenta: finalPrice,
          Excento: tasaIva === 0,
          PrecioCosto: product.PrecioCosto,
          CostoInstalacion: 0,
          PorcentajeIVA: tasaIva
        }
        if (company.Modalidad === 1) {
          const index = detailsList.findIndex(item => item.IdProducto === product.IdProducto)
          if (index >= 0) {
            newProducts = [...detailsList.slice(0, index), { ...item, Cantidad: item.Cantidad + detailsList[index].Cantidad }, ...detailsList.slice(index + 1)]
          } else {
            newProducts = [...detailsList, item]
          }
        } else {
          newProducts = [...detailsList, item]
        }
        dispatch(setDetailsList(newProducts))
        const summary = getProductSummary(newProducts, customer.PorcentajeExoneracion)
        dispatch(setSummary(summary))
        dispatch(setProduct(null))
        dispatch(setDescription(''))
        dispatch(setQuantity(1))
        dispatch(setPrice(0))
      }
    } catch (error) {
      const message = error.message ? error.message : error
      dispatch(setMessage(message))
    }
  }
}

export const removeDetails = (id, pos) => {
  return (dispatch, getState) => {
    const { customer } = getState().customer
    const { detailsList } = getState().workingOrder
    const index = detailsList.findIndex((item, index) => item.IdProducto === id && index === pos)
    const newProducts = [...detailsList.slice(0, index), ...detailsList.slice(index + 1)]
    dispatch(setDetailsList(newProducts))
    const summary = getProductSummary(newProducts, customer.PorcentajeExoneracion)
    dispatch(setSummary(summary))
  }
}

export const saveWorkingOrder = () => {
  return async (dispatch, getState) => {
    const { token, userId, branchId } = getState().session
    const { company } = getState().company
    const { customer } = getState().customer
    const {
      order,
      detailsList,
      summary,
      delivery,
      listPage,
      vendorId
    } = getState().workingOrder
    dispatch(startLoader())
    try {
      const workingOrder = await saveWorkingOrderEntity(
        token,
        order,
        userId,
        detailsList,
        branchId,
        vendorId,
        company,
        customer,
        summary,
        delivery.phone,
        delivery.address,
        delivery.description,
        delivery.date,
        delivery.time,
        delivery.details
      )
      if (workingOrder) {
        dispatch(setWorkingOrder(workingOrder))
        dispatch(getWorkingOrderListFirstPage(null))
      } else {
        dispatch(getWorkingOrderListByPageNumber(listPage))
      }
      dispatch(setStatus('ready'))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error.message))
    }
  }
}

export const getWorkingOrderListFirstPage = (id) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId, company } = getState().session
    dispatch(startLoader())
    try {
      dispatch(setWorkingOrderListPage(1))
      const recordCount = await getWorkingOrderListCount(token, companyId, branchId, false)
      dispatch(setWorkingOrderListCount(recordCount))
      if (recordCount > 0) {
        const newList = await getWorkingOrderListPerPage(token, companyId, branchId, false, 1, company.Modalidad === 1 ? 10 : 100)
        dispatch(setWorkingOrderList(newList))
      } else {
        dispatch(setWorkingOrderList([]))
      }
      if (id) dispatch(setActiveSection(id))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export const getWorkingOrderListByPageNumber = (pageNumber) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session
    dispatch(startLoader())
    try {
      const newList = await getWorkingOrderListPerPage(token, companyId, branchId, false, pageNumber, 10)
      dispatch(setWorkingOrderListPage(pageNumber))
      dispatch(setWorkingOrderList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export const revokeWorkingOrder = (id) => {
  return async (dispatch, getState) => {
    const { token, userId } = getState().session
    dispatch(startLoader())
    try {
      await revokeWorkingOrderEntity(token, id, userId)
      dispatch(getWorkingOrderListFirstPage(null))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export const openWorkingOrder = (id) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session
    const { company } = getState().company
    dispatch(startLoader())
    try {
      const workingOrder = await getWorkingOrderEntity(token, id)
      const customerCount = await getCustomerListCount(token, companyId, '')
      const customerList = await getCustomerListPerPage(token, companyId, 1, ROWS_PER_CUSTOMER, '')
      const productCount = await getProductListCount(token, companyId, branchId, true, '', 1)
      const productList = await getProductListPerPage(token, companyId, branchId, true, 1, ROWS_PER_PRODUCT, '', 1)
      const vendorList = await getVendorList(token, companyId)
      dispatch(setVendorList(vendorList))
      let companyEntity = company
      if (companyEntity === null) {
        companyEntity = await getCompanyEntity(token, companyId)
        dispatch(setCompany(companyEntity))
      }
      dispatch(setActivityCode(companyEntity.ActividadEconomicaEmpresa[0].CodigoActividad))
      dispatch(setWorkingOrder({
        IdOrden: workingOrder.IdOrden,
        ConsecOrdenServicio: workingOrder.ConsecOrdenServicio,
        MontoAdelanto: workingOrder.MontoAdelanto
      }))
      dispatch(setCustomerListCount(customerCount))
      dispatch(setCustomerList(customerList))
      dispatch(setProductListCount(productCount))
      dispatch(setProductList(productList))
      const customer = {
        IdCliente: workingOrder.IdCliente,
        Nombre: workingOrder.NombreCliente,
        IdTipoExoneracion: workingOrder.Cliente.IdTipoExoneracion,
        NumDocExoneracion: workingOrder.Cliente.NumDocExoneracion,
        NombreInstExoneracion: workingOrder.Cliente.NombreInstExoneracion,
        FechaEmisionDoc: workingOrder.Cliente.FechaEmisionDoc,
        PorcentajeExoneracion: workingOrder.Cliente.PorcentajeExoneracion
      }
      dispatch(setCustomer(customer))
      const details = workingOrder.DetalleOrdenServicio.map(detail => ({
        IdProducto: detail.IdProducto,
        Codigo: detail.Codigo,
        Descripcion: detail.Descripcion,
        Cantidad: detail.Cantidad,
        PrecioVenta: roundNumber(getPriceFromTaxRate(detail.PrecioVenta, detail.PorcentajeIVA, true), 2),
        Excento: detail.Excento,
        PrecioCosto: detail.Producto.PrecioCosto,
        CostoInstalacion: 0,
        PorcentajeIVA: detail.PorcentajeIVA
      }))
      dispatch(setDetailsList(details))
      const summary = getProductSummary(details, workingOrder.PorcentajeExoneracion)
      dispatch(setSummary(summary))
      dispatch(setDeliveryAttribute('phone', workingOrder.Telefono))
      dispatch(setDeliveryAttribute('address', workingOrder.Direccion))
      dispatch(setDeliveryAttribute('description', workingOrder.Descripcion))
      dispatch(setDeliveryAttribute('date', workingOrder.FechaEntrega))
      dispatch(setDeliveryAttribute('time', workingOrder.HoraEntrega))
      dispatch(setDeliveryAttribute('details', workingOrder.OtrosDetalles))
      dispatch(setPaymentId(1))
      dispatch(setVendorId(workingOrder.IdVendedor))
      dispatch(setActiveSection(21))
      dispatch(setStatus('ready'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export const generateInvoice = () => {
  return async (dispatch, getState) => {
    const { token, userId, branchId } = getState().session
    const { company } = getState().company
    const { customer } = getState().customer
    const { activityCode, paymentId, vendorId, order, detailsList, summary } = getState().workingOrder
    dispatch(startLoader())
    try {
      const invoiceId = await saveInvoiceEntity(
        token,
        userId,
        detailsList,
        activityCode,
        paymentId,
        vendorId,
        order.MontoAdelanto,
        order.IdOrden,
        branchId,
        company,
        customer,
        summary,
        ''
      )
      dispatch(setInvoiceId(invoiceId))
      dispatch(getWorkingOrderListFirstPage(null))
      dispatch(setStatus('converted'))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error.message))
    }
  }
}

export const generateInvoiceTicket = () => {
  return async (dispatch, getState) => {
    const { token, printer, userCode, device, branchList, branchId } = getState().session
    const { company } = getState().company
    const { invoiceId } = getState().workingOrder
    dispatch(startLoader())
    try {
      const invoice = await getInvoiceEntity(token, invoiceId)
      const branchName = branchList.find(x => x.Id === branchId).Descripcion
      let localPrinter = await getDeviceFromUsb(printer)
      if (localPrinter !== printer) dispatch(setPrinter(localPrinter))
      if (localPrinter) {
        printInvoice(
          localPrinter,
          userCode,
          company,
          invoice,
          branchName,
          device.AnchoLinea
        )
      }
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export const generatePDF = (id, ref) => {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      await generateWorkingOrderPDF(token, id, ref)
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export const generateWorkingOrderTicket = (id) => {
  return async (dispatch, getState) => {
    const { token, printer, userCode, device, branchList, branchId } = getState().session
    const { company } = getState().company
    dispatch(startLoader())
    try {
      const invoice = await getWorkingOrderEntity(token, id)
      const branchName = branchList.find(x => x.Id === branchId).Descripcion
      let localPrinter = await getDeviceFromUsb(printer)
      if (localPrinter !== printer) dispatch(setPrinter(localPrinter))
      if (localPrinter) {
        printWorkingOrder(
          localPrinter,
          userCode,
          company,
          invoice,
          branchName,
          device.AnchoLinea
        )
      }
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_DETAILS_LIST,
  SET_SUMMARY,
  SET_PAYMENT_ID,
  SET_CASH_ADVANCE,
  SET_DELIVERY_ATTRIBUTE,
  SET_ID,
  SET_INVOICE_ID,
  SET_STATUS,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  RESET_ORDER
} from './types'

import {
  startLoader,
  stopLoader,
  setMessage,
  setActiveSection
} from 'store/ui/actions'

import { setPrinter } from 'store/session/actions'
import { setCompany } from 'store/company/actions'
import { setCustomer, setCustomerList } from 'store/customer/actions'
import { setProduct, setProductList } from 'store/product/actions'

import { roundNumber } from 'utils/utilities'
import {
  getCompanyEntity,
  getCustomerList,
  getProductList,
  getProductEntity,
  getCustomerPrice,
  getProductSummary,
  saveWorkingOrderEntity,
  getWorkingOrderListCount,
  getWorkingOrderListPerPage,
  revokeWorkingOrderEntity,
  generateWorkingOrderPDF,
  sendWorkingOrderPDF,
  getWorkingOrderEntity,
  getInvoiceEntity,
  saveInvoiceEntity,
  getPriceFromTaxRate
} from 'utils/domainHelper'

import { defaultCustomer } from 'utils/defaults'
import { printWorkingOrder, printInvoice, getDeviceFromUsb } from 'utils/printing'

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

export const setCashAdvance = (cash) => {
  return {
    type: SET_CASH_ADVANCE,
    payload: { cash }
  }
}

export const setDeliveryAttribute = (attribute, value) => {
  return {
    type: SET_DELIVERY_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const setWorkingOrderId = (id) => {
  return {
    type: SET_ID,
    payload: { id }
  }
}

export const setInvoiceId = (id) => {
  return {
    type: SET_INVOICE_ID,
    payload: { id }
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

export function setWorkingOrderParameters () {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    const { company } = getState().company
    dispatch(startLoader())
    try {
      const customerList = await getCustomerList(token, companyId, '')
      const productList = await getProductList(token, companyId, branchId, true, '', 1)
      if (company === null) {
        const companyEntity = await getCompanyEntity(token, companyId)
        dispatch(setCompany(companyEntity))
      }
      dispatch(resetWorkingOrder())
      dispatch(setCustomer(defaultCustomer))
      dispatch(setCustomerList([{Id: 1, Descripcion: 'CLIENTE CONTADO'}, ...customerList]))
      dispatch(setProductList(productList))
      dispatch(setActiveSection(21))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

export function getProduct (idProduct) {
  return async (dispatch, getState) => {
    const { token, company } = getState().session
    const { customer } = getState().customer
    dispatch(startLoader())
    try {
      const product = await getProductEntity(token, idProduct, 1)
      let price = product.PrecioVenta1
      if (customer != null) price = getCustomerPrice(customer, product, company)
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
      dispatch(setMessage(error))
    }
  }
}

export function filterProductList (text, type) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    dispatch(startLoader())
    try {
      let newList = await getProductList(token, companyId, branchId, true, text, type)
      dispatch(setProductList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

export function addDetails () {
  return async (dispatch, getState) => {
    const { company } = getState().session
    const { customer } = getState().customer
    const { product } = getState().product
    const { detailsList, description, quantity, price } = getState().workingOrder
    try {
      
      if (product != null && description !== '' && quantity > 0 &&  price > 0) {
        let newProducts = null
        let tasaIva = product.ParametroImpuesto.TasaImpuesto
        if (tasaIva > 0 && customer.AplicaTasaDiferenciada) tasaIva = customer.ParametroImpuesto.TasaImpuesto
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
        const index = detailsList.findIndex(item => item.IdProducto === product.IdProducto)
        if (index >= 0) {
          newProducts = [...detailsList.slice(0, index), { ...item, Cantidad: item.Cantidad + detailsList[index].Cantidad }, ...detailsList.slice(index + 1)]
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

export const removeDetails = (id) => {
  return (dispatch, getState) => {
    const { customer } = getState().customer
    const { detailsList } = getState().workingOrder
    const index = detailsList.findIndex(item => item.IdProducto === id)
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
      workingOrderId,
      detailsList,
      summary,
      delivery,
      listPage
    } = getState().workingOrder
    dispatch(startLoader())
    try {
      const newId = await saveWorkingOrderEntity(
        token,
        workingOrderId,
        userId,
        detailsList,
        branchId,
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
      if (newId) {
        dispatch(setWorkingOrderId(newId))
        dispatch(getWorkingOrderListFirstPage(null))
      } else {
        dispatch(getWorkingOrderListByPageNumber(listPage))
      }
      dispatch(setStatus('ready'))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

export const getWorkingOrderListFirstPage = (id) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session
    dispatch(startLoader())
    try {
      dispatch(setWorkingOrderListPage(1))
      const recordCount = await getWorkingOrderListCount(token, companyId, branchId, false)
      dispatch(setWorkingOrderListCount(recordCount))
      if (recordCount > 0) {
        const newList = await getWorkingOrderListPerPage(token, companyId, branchId, false, 1, 10)
        dispatch(setWorkingOrderList(newList))
      } else {
        dispatch(setWorkingOrderList([]))
      }
      if (id) dispatch(setActiveSection(id))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error))
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
      dispatch(setMessage(error))
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
      dispatch(setMessage(error))
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
      const customerList = await getCustomerList(token, companyId, '')
      const productList = await getProductList(token, companyId, branchId, true, '', 1)
      if (company === null) {
        const companyEntity = await getCompanyEntity(token, companyId)
        dispatch(setCompany(companyEntity))
      }
      dispatch(setWorkingOrderId(workingOrder.IdOrden))
      dispatch(setCashAdvance(workingOrder.MontoAdelanto))
      dispatch(setCustomerList([{Id: 1, Descripcion: 'CLIENTE CONTADO'}, ...customerList]))
      dispatch(setProductList(productList))
      const customer = {
        IdCliente: workingOrder.IdCliente,
        Nombre: workingOrder.NombreCliente,
        IdTipoExoneracion: workingOrder.Cliente.IdTipoExoneracion,
        ParametroExoneracion: {
          Descripcion: workingOrder.Cliente.ParametroExoneracion.Descripcion
        },
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
      dispatch(setActiveSection(21))
      dispatch(setStatus('ready'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error))
      dispatch(stopLoader())
    }
  }
}

export const generateInvoice = () => {
  return async (dispatch, getState) => {
    const { token, userId, branchId } = getState().session
    const { company } = getState().company
    const { customer } = getState().customer
    const { paymentId, cashAdvance, workingOrderId, detailsList, summary } = getState().workingOrder
    dispatch(startLoader())
    try {
      const invoiceId = await saveInvoiceEntity(
        token,
        userId,
        detailsList,
        paymentId,
        cashAdvance,
        workingOrderId,
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
      dispatch(setMessage(error))
    }
  }
}

export const generateInvoiceTicket = () => {
  return async (dispatch, getState) => {
    const { token, printer, userCode, company, device, branchList, branchId } = getState().session
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
      dispatch(setMessage(error))
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
      dispatch(setMessage(error))
      dispatch(stopLoader())
    }
  }
}

export const sendWorkingOrderNotification = (id) => {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      await sendWorkingOrderPDF(token, id)
      dispatch(setMessage('Correo enviado satisfactoriamente.', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error))
      dispatch(stopLoader())
    }
  }
}

export const generateWorkingOrderTicket = (id) => {
  return async (dispatch, getState) => {
    const { token, printer, userCode, company, device, branchList, branchId } = getState().session
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
      dispatch(setMessage(error))
      dispatch(stopLoader())
    }
  }
}

import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_DELIVERY_PHONE,
  SET_DELIVERY_ADDRESS,
  SET_DELIVERY_DESCRIPTION,
  SET_DELIVERY_DATE,
  SET_DELIVERY_TIME,
  SET_DELIVERY_DETAILS,
  SET_ID,
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
  getPriceTransformedWithRate
} from 'utils/domainHelper'

import { defaultCustomer } from 'utils/defaults'
import { printWorkingOrder, getDeviceFromUsb } from 'utils/printing'

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

export const setProductsDetail = (details) => {
  return {
    type: SET_PRODUCTS_DETAIL,
    payload: { details }
  }
}

export const setSummary = (summary) => {
  return {
    type: SET_SUMMARY,
    payload: { summary }
  }
}

export const setDeliveryPhone = (phone) => {
  return {
    type: SET_DELIVERY_PHONE,
    payload: { phone }
  }
}

export const setDeliveryAddress = (address) => {
  return {
    type: SET_DELIVERY_ADDRESS,
    payload: { address }
  }
}

export const setDeliveryDescription = (description) => {
  return {
    type: SET_DELIVERY_DESCRIPTION,
    payload: { description }
  }
}

export const setDeliveryDate = (date) => {
  return {
    type: SET_DELIVERY_DATE,
    payload: { date }
  }
}

export const setDeliveryTime = (time) => {
  return {
    type: SET_DELIVERY_TIME,
    payload: { time }
  }
}

export const setDeliveryDetails = (details) => {
  return {
    type: SET_DELIVERY_DETAILS,
    payload: { details }
  }
}

export const setWorkingOrderId = (id) => {
  return {
    type: SET_ID,
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
    const { token } = getState().session
    const { customer } = getState().customer
    dispatch(startLoader())
    try {
      const product = await getProductEntity(token, idProduct, 1)
      let price = product.PrecioVenta1
      if (customer != null) price = getCustomerPrice(customer, product)
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
    const { customer } = getState().customer
    const { product } = getState().product
    const { productDetails, description, quantity, price } = getState().workingOrder
    try {
      
      if (product != null && description !== '' && quantity > 0 &&  price > 0) {
        let newProducts = null
        let tasaIva = product.ParametroImpuesto.TasaImpuesto
        if (tasaIva > 0 && customer.AplicaTasaDiferenciada) tasaIva = customer.ParametroImpuesto.TasaImpuesto
        const item = {
          IdProducto: product.IdProducto,
          Codigo: product.Codigo,
          Descripcion: description,
          Cantidad: quantity,
          PrecioVenta: price,
          Excento: tasaIva === 0,
          PrecioCosto: product.PrecioCosto,
          CostoInstalacion: 0,
          PorcentajeIVA: tasaIva
        }
        const index = productDetails.findIndex(item => item.IdProducto === product.IdProducto)
        if (index >= 0) {
          newProducts = [...productDetails.slice(0, index), { ...item, Cantidad: item.Cantidad + productDetails[index].Cantidad }, ...productDetails.slice(index + 1)]
        } else {
          newProducts = [...productDetails, item]
        }
        dispatch(setProductsDetail(newProducts))
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
    const { productDetails } = getState().workingOrder
    const index = productDetails.findIndex(item => item.IdProducto === id)
    const newProducts = [...productDetails.slice(0, index), ...productDetails.slice(index + 1)]
    dispatch(setProductsDetail(newProducts))
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
      productDetails,
      summary,
      deliveryPhone,
      deliveryAddress,
      deliveryDescription,
      deliveryDate,
      deliveryTime,
      deliveryDetails
    } = getState().workingOrder
    dispatch(startLoader())
    try {
      const newId = await saveWorkingOrderEntity(
        token,
        workingOrderId,
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
      )
      if (newId) dispatch(setWorkingOrderId(newId))
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
    const { list } = getState().workingOrder
    dispatch(startLoader())
    try {
      await revokeWorkingOrderEntity(token, id, userId)
      const index = list.findIndex(item => item.IdFactura === id)
      const newList = [...list.slice(0, index), { ...list[index], Anulando: true }, ...list.slice(index + 1)]
      dispatch(setWorkingOrderList(newList))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
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
        PrecioVenta: roundNumber(getPriceTransformedWithRate(detail.PrecioVenta, detail.PorcentajeIVA, true), 2),
        Excento: detail.Excento,
        PrecioCosto: detail.Producto.PrecioCosto,
        CostoInstalacion: 0,
        PorcentajeIVA: detail.PorcentajeIVA
      }))
      dispatch(setProductsDetail(details))
      const summary = getProductSummary(details, workingOrder.PorcentajeExoneracion)
      dispatch(setSummary(summary))
      dispatch(setDeliveryPhone(workingOrder.Telefono))
      dispatch(setDeliveryAddress(workingOrder.Direccion))
      dispatch(setDeliveryDescription(workingOrder.Descripcion))
      dispatch(setDeliveryDate(workingOrder.FechaEntrega))
      dispatch(setDeliveryTime(workingOrder.HoraEntrega))
      dispatch(setDeliveryDetails(workingOrder.OtrosDetalles))
      dispatch(setActiveSection(21))
      dispatch(setStatus('ready'))
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

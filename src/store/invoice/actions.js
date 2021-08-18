import {
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_PAYMENT_ID,
  SET_SUCCESSFUL,
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST
} from './types'

import {
  startLoader,
  stopLoader,
  setMessage,
  setActiveSection
} from 'store/ui/actions'

import { setCompany } from 'store/company/actions'

import { setCustomer, setCustomerList } from 'store/customer/actions'

import { setProduct, setProductList } from 'store/product/actions'

import {
  getCompanyEntity,
  getCustomerList,
  getProductList,
  getProductEntity,
  getCustomerPrice,
  getInvoiceSummary,
  saveInvoiceEntity,
  getProcessedInvoiceListCount,
  getProcessedInvoiceListPerPage,
  revokeInvoiceEntity
} from 'utils/domainHelper'

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

export const setPaymentId = (id) => {
  return {
    type: SET_PAYMENT_ID,
    payload: { id }
  }
}

export const setSuccessful = (success) => {
  return {
    type: SET_SUCCESSFUL,
    payload: { success }
  }
}

export const setInvoiceListPage = (page) => {
  return {
    type: SET_LIST_PAGE,
    payload: { page }
  }
}

export const setInvoiceListCount = (count) => {
  return {
    type: SET_LIST_COUNT,
    payload: { count }
  }
}

export const setInvoiceList = (list) => {
  return {
    type: SET_LIST,
    payload: { list }
  }
}

export function setInvoiceParameters (id) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    const { company } = getState().company
    dispatch(startLoader())
    dispatch(setMessage(''))
    try {
      const customerList = await getCustomerList(token, companyId)
      const productList = await getProductList(token, companyId, 1, '')
      if (company === null) {
        const companyEntity = await getCompanyEntity(token, companyId)
        dispatch(setCompany(companyEntity))
      }
      dispatch(setActiveSection(id))
      const customer = {
        IdCliente: 1,
        Nombre: 'CLIENTE DE CONTADO',
        ParametroExoneracion: {
          Descripcion: 'Ley especial'
        },
        NumDocExoneracion: '',
        NombreInstExoneracion: '',
        FechaEmisionDoc: '01/01/2000',
        PorcentajeExoneracion: 0
      }
      dispatch(setCustomer(customer))
      dispatch(resetInvoice())
      dispatch(setCustomerList([customer, ...customerList]))
      dispatch(setProductList(productList))
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
    dispatch(setMessage(''))
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

export function filterProductList (text) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setMessage(''))
    try {
      let newList = await getProductList(token, companyId, 1, text)
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
    const { productDetails, description, quantity, price } = getState().invoice
    try {
      dispatch(setMessage(''))
      if (product != null && description !== '' && quantity > 0 &&  price > 0) {
        let newProducts = null
        let tasaIva = product.ParametroImpuesto.TasaImpuesto
        if (tasaIva > 0 && customer.AplicaTasaDiferenciada) tasaIva = customer.ParametroImpuesto.TasaImpuesto
        const item = {
          IdProducto: product.IdProducto,
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
        const summary = getInvoiceSummary(newProducts, customer.PorcentajeExoneracion)
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
    const { productDetails } = getState().invoice
    const index = productDetails.findIndex(item => item.IdProducto === id)
    const newProducts = [...productDetails.slice(0, index), ...productDetails.slice(index + 1)]
    dispatch(setProductsDetail(newProducts))
    const summary = getInvoiceSummary(newProducts, customer.PorcentajeExoneracion)
    dispatch(setSummary(summary))
  }
}

export const saveInvoice = () => {
  return async (dispatch, getState) => {
    const { token, userId, branchId } = getState().session
    const { company } = getState().company
    const { customer } = getState().customer
    const { paymentId, productDetails, summary } = getState().invoice
    dispatch(startLoader())
    dispatch(setMessage(''))
    try {
      await saveInvoiceEntity(
        token,
        userId,
        productDetails,
        paymentId,
        branchId,
        company,
        customer,
        summary
      )
      dispatch(setSuccessful(true))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

export const resetInvoice = () => {
  return async (dispatch) => {
    dispatch(setProduct(null))
    dispatch(setDescription(''))
    dispatch(setQuantity(1))
    dispatch(setPrice(0))
    dispatch(setProductsDetail([]))
    dispatch(setSummary({ gravado: 0, exonerado: 0, excento: 0, subTotal: 0, impuesto: 0,total: 0 }))
    dispatch(setPaymentId(1))
    dispatch(setSuccessful(false))
  }
}

export const getInvoiceListFirstPage = (id) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session
    dispatch(startLoader())
    try {
      dispatch(setInvoiceListPage(1))
      const recordCount = await getProcessedInvoiceListCount(token, companyId, branchId)
      dispatch(setInvoiceListCount(recordCount))
      if (recordCount > 0) {
        const newList = await getProcessedInvoiceListPerPage(token, companyId, branchId, 1, 10)
        dispatch(setInvoiceList(newList))
      } else {
        dispatch(setInvoiceList([]))
      }
      if (id) dispatch(setActiveSection(id))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error))
      dispatch(stopLoader())
    }
  }
}

export const getInvoiceListByPageNumber = (pageNumber) => {
  return async (dispatch, getState) => {
    const { token, companyId, branchId } = getState().session
    dispatch(startLoader())
    try {
      const newList = await getProcessedInvoiceListPerPage(token, companyId, branchId, pageNumber, 10)
      dispatch(setInvoiceListPage(pageNumber))
      dispatch(setInvoiceList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error))
      dispatch(stopLoader())
    }
  }
}

export const revokeInvoice = (idInvoice) => {
  return async (dispatch, getState) => {
    const { token, userId } = getState().session
    const { list } = getState().invoice
    dispatch(startLoader())
    try {
      await revokeInvoiceEntity(token, idInvoice, userId)
      const index = list.findIndex(item => item.IdFactura === idInvoice)
      const newList = [...list.slice(0, index), { ...list[index], Anulando: true }, ...list.slice(index + 1)]
      dispatch(setInvoiceList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error))
      dispatch(stopLoader())
    }
  }
}

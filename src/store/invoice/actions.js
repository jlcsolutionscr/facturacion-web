import {
  RESET_INVOICE,
  SET_DESCRIPTION,
  SET_QUANTITY,
  SET_PRICE,
  SET_PRODUCTS_DETAIL,
  SET_SUMMARY,
  SET_PAYMENT,
  SET_SUCCESSFUL
} from './types'

import {
  startLoader,
  stopLoader,
  setErrorMessage,
  setActiveSection
} from 'store/ui/actions'

import { setCustomer, setCustomerList } from 'store/customer/actions'

import { setProduct, setProductList } from 'store/product/actions'

import {
  getCustomerList,
  getProductList,
  getProductEntity,
  getCustomerPrice,
  getInvoiceSummary,
  saveInvoiceEntity
} from 'utils/domainHelper'

export const resetInvoice = () => {
  return {
    type: RESET_INVOICE
  }
}

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

export const setPayment = (method) => {
  return {
    type: SET_PAYMENT,
    payload: { method }
  }
}

export const setSuccessful = (success) => {
  return {
    type: SET_SUCCESSFUL,
    payload: { success }
  }
}

export function setInvoiceParameters () {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const customerList = await getCustomerList(token, companyId)
      const productList = await getProductList(token, companyId, 1, '')
      dispatch(setActiveSection(5))
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
      dispatch(setErrorMessage(error))
    }
  }
}

export function getProduct (idProduct) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { customer } = getState().customer
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
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
      dispatch(setErrorMessage(error))
    }
  }
}

export function filterProductList (text) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      let newList = await getProductList(token, companyId, 1, text)
      dispatch(setProductList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setErrorMessage(error))
    }
  }
}

export function addDetails () {
  return async (dispatch, getState) => {
    const { customer } = getState().customer
    const { product } = getState().product
    const { productDetails, description, quantity, price } = getState().invoice
    try {
      dispatch(setErrorMessage(''))
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
      const errorMessage = error.message ? error.message : error
      dispatch(setErrorMessage(errorMessage))
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

export function saveInvoice () {
  return async (dispatch, getState) => {
    const { serviceURL } = getState().config
    const { token, company } = getState().session
    const {
      paymentMethodId,
      customer,
      customerName,
      exonerationType,
      exonerationCode,
      exonerationEntity,
      exonerationDate,
      exonerationPercentage,
      products,
      excento,
      gravado,
      exonerado,
      impuesto,
      totalCosto,
      total
    } = getState().invoice
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      await saveInvoiceEntity(
        serviceURL,
        token,
        products,
        paymentMethodId,
        company,
        customer.IdCliente,
        customerName,
        excento,
        gravado,
        exonerado,
        impuesto,
        totalCosto,
        total,
        exonerationType,
        exonerationCode,
        exonerationEntity,
        exonerationDate,
        exonerationPercentage
      )
      dispatch(setSuccessful())
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setErrorMessage(error))
    }
  }
}

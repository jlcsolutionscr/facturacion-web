import {
  SET_PRODUCT_LIST,
  SET_PRODUCT,
  SET_PRODUCT_TYPE_LIST,
  SET_CATEGORY_LIST,
  SET_PROVIDER_LIST,
  SET_PRODUCT_ATTRIBUTE
} from './types'

import {
  startLoader,
  stopLoader,
  setRentTypeList,
  setActiveSection,
  setMessage
} from 'store/ui/actions'

import {
  getProductList,
  getProductTypeList,
  getProductCategoryList,
  getProductProviderList,
  getRentTypeList,
  getProductEntity,
  saveProductEntity
} from 'utils/domainHelper'

export const setProductList = (list) => {
  return {
    type: SET_PRODUCT_LIST,
    payload: { list }
  }
}

export const setProduct = (product) => {
  return {
    type: SET_PRODUCT,
    payload: { product }
  }
}

export const setProductTypeList = (list) => {
  return {
    type: SET_PRODUCT_TYPE_LIST,
    payload: { list }
  }
}

export const setCategoryList = (list) => {
  return {
    type: SET_CATEGORY_LIST,
    payload: { list }
  }
}

export const setProviderList = (list) => {
  return {
    type: SET_PROVIDER_LIST,
    payload: { list }
  }
}

export const setProductAttribute = (attribute, value) => {
  return {
    type: SET_PRODUCT_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export function setProductParameters (id) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    const { rentTypeList } = getState().ui
    const { productTypeList, categoryList, providerList } = getState().product
    dispatch(startLoader())
    try {
      let list = await getProductList(token, companyId, branchId, false, '', 1)
      dispatch(setProductList(list))
      if (productTypeList.length === 0) {
        list = await getProductTypeList(token)
        dispatch(setProductTypeList(list))
      }
      if (categoryList.length === 0) {
        list = await getProductCategoryList(token, companyId)
        dispatch(setCategoryList(list))
      }
      if (providerList.length === 0) {
        list = await getProductProviderList(token, companyId)
        dispatch(setProviderList(list))
      }
      if (rentTypeList.length === 0) {
        list = await getRentTypeList(token)
        dispatch(setRentTypeList(list))
      }
      const product = {
        IdEmpresa: companyId,
        IdProducto: 0,
        Tipo: 1,
        IdLinea: '',
        Codigo: '',
        CodigoProveedor: '',
        CodigoClasificacion: '',
        IdProveedor: '',
        Descripcion: '',
        PrecioCosto: 0,
        PrecioVenta1: 0,
        PrecioVenta2: 0,
        PrecioVenta3: 0,
        PrecioVenta4: 0,
        PrecioVenta5: 0,
        IdImpuesto: 8,
        Observacion: '',
        Marca: '',
        Activo: true
      }
      dispatch(setProduct(product))
      dispatch(setActiveSection(id))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

export function filterProductList (text, type) {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    dispatch(startLoader())
    try {
      const list = await getProductList(token, companyId, branchId, false, text, type)
      dispatch(setProductList(list))
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
    dispatch(startLoader())
    try {
      const product = await getProductEntity(token, idProduct, 1)
      dispatch(setProduct(product))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setProduct(null))
      dispatch(setMessage(error))
    }
  }
}

export function saveProduct () {
  return async (dispatch, getState) => {
    const { companyId, branchId, token } = getState().session
    const { product } = getState().product
    dispatch(startLoader())
    try {
      await saveProductEntity(token, product)
      const newList = await getProductList(token, companyId, branchId, false, '')
      dispatch(setProductList(newList))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}
import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER,
  SET_ID_TYPE_LIST,
  SET_PRICE_TYPE_LIST,
  SET_EXONERATION_TYPE_LIST,
  SET_CUSTOMER_ATTRIBUTE
} from './types'

import {
  startLoader,
  stopLoader,
  setActiveSection,
  setRentTypeList,
  setMessage
} from 'store/ui/actions'

import {
  getCustomerList,
  getIdTypeList,
  getRentTypeList,
  getPriceTypeList,
  getExonerationTypeList,
  getCustomerEntity,
  saveCustomerEntity
} from 'utils/domainHelper'

export const setCustomerList = (list) => {
  return {
    type: SET_CUSTOMER_LIST,
    payload: { list }
  }
}

export const setCustomer = (customer) => {
  return {
    type: SET_CUSTOMER,
    payload: { customer }
  }
}

export const setIdTypeList = (list) => {
  return {
    type: SET_ID_TYPE_LIST,
    payload: { list }
  }
}

export const setPriceTypeList = (list) => {
  return {
    type: SET_PRICE_TYPE_LIST,
    payload: { list }
  }
}

export const setExonerationTypeList = (list) => {
  return {
    type: SET_EXONERATION_TYPE_LIST,
    payload: { list }
  }
}

export const setCustomerAttribute = (attribute, value) => {
  return {
    type: SET_CUSTOMER_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export function setCustomerParameters (id) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    const { rentTypeList } = getState().ui
    const { idTypeList, priceTypeList, exonerationTypeList } = getState().customer
    dispatch(startLoader())
    try {
      const customerList = await getCustomerList(token, companyId, '')
      dispatch(setCustomerList(customerList))
      const customer = {
        IdCliente: 0,
        IdEmpresa: companyId,
        IdTipoIdentificacion: 0,
        Identificacion: '',
        Nombre: '',
        NombreComercial: '',
        Direccion: '',
        Telefono: '',
        Fax: '',
        CorreoElectronico: '',
        IdTipoPrecio: 1,
        AplicaTasaDiferenciada: false,
        IdImpuesto: 8,
        IdTipoExoneracion: 1,
        NumDocExoneracion: '',
        NombreInstExoneracion: '',
        FechaEmisionDoc: '01/01/2000',
        PorcentajeExoneracion: 0
      }
      dispatch(setCustomer(customer))
      if (idTypeList.length === 0) {
        const newList = await getIdTypeList(token)
        dispatch(setIdTypeList(newList))
      }
      if (rentTypeList.length === 0) {
        const newList = await getRentTypeList(token)
        dispatch(setRentTypeList(newList))
      }
      if (priceTypeList.length === 0) {
        const newList = await getPriceTypeList(token)
        dispatch(setPriceTypeList(newList))
      }
      if (exonerationTypeList.length === 0) {
        const newList = await getExonerationTypeList(token)
        dispatch(setExonerationTypeList(newList))
      }
      dispatch(setActiveSection(id))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

export function getCustomer (idCustomer) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      const customer = await getCustomerEntity(token, idCustomer)
      dispatch(setCustomer(customer))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setCustomer(null))
      dispatch(setMessage(error))
    }
  }
}

export function filterCustomerList (text) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    try {
      let newList = await getCustomerList(token, companyId, text)
      dispatch(setCustomerList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}

export function saveCustomer () {
  return async (dispatch, getState) => {
    const { token, companyId } = getState().session
    const { customer } = getState().customer
    dispatch(startLoader())
    try {
      await saveCustomerEntity(token, customer)
      const customerList = await getCustomerList(token, companyId)
      dispatch(setCustomerList(customerList))
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error))
    }
  }
}
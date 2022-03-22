import {
  SET_LIST_PAGE,
  SET_LIST_COUNT,
  SET_LIST,
  SET_CUSTOMER,
  SET_PRICE_TYPE_LIST,
  SET_CUSTOMER_ATTRIBUTE
} from './types'

import {
  startLoader,
  stopLoader,
  setActiveSection,
  setMessage
} from 'store/ui/actions'

import {
  getCustomerListCount,
  getCustomerListPerPage,
  getCustomerEntity,
  getCustomerByIdentifier,
  saveCustomerEntity
} from 'utils/domainHelper'

export const setCustomerListPage = (page) => {
  return {
    type: SET_LIST_PAGE,
    payload: { page }
  }
}

export const setCustomerListCount = (count) => {
  return {
    type: SET_LIST_COUNT,
    payload: { count }
  }
}

export const setCustomerList = (list) => {
  return {
    type: SET_LIST,
    payload: { list }
  }
}

export const setCustomer = (customer) => {
  return {
    type: SET_CUSTOMER,
    payload: { customer }
  }
}

export const setPriceTypeList = (list) => {
  return {
    type: SET_PRICE_TYPE_LIST,
    payload: { list }
  }
}

export const setCustomerAttribute = (attribute, value) => {
  return {
    type: SET_CUSTOMER_ATTRIBUTE,
    payload: { attribute, value }
  }
}

export const getCustomerListFirstPage = (id, filter) => {
  return async (dispatch, getState) => {
    const { token, companyId } = getState().session
    dispatch(startLoader())
    try {
      dispatch(setCustomerListPage(1))
      const recordCount = await getCustomerListCount(token, companyId, filter)
      dispatch(setCustomerListCount(recordCount))
      if (recordCount > 0) {
        const newList = await getCustomerListPerPage(token, companyId, 1, 8, filter)
        dispatch(setCustomerList(newList))
      } else {
        dispatch(setCustomerList([]))
      }
      if (id) dispatch(setActiveSection(id))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export const getCustomerListByPageNumber = (pageNumber, filter) => {
  return async (dispatch, getState) => {
    const { token, companyId } = getState().session
    dispatch(startLoader())
    try {
      const newList = await getCustomerListPerPage(token, companyId, pageNumber, 8, filter)
      dispatch(setCustomerListPage(pageNumber))
      dispatch(setCustomerList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(setMessage(error.message))
      dispatch(stopLoader())
    }
  }
}

export function openCustomer (idCustomer) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    try {
      let customer
      if (idCustomer) {
        customer = await getCustomerEntity(token, idCustomer)
      } else {
        customer = {
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
      }
      dispatch(setCustomer(customer))
      dispatch(setActiveSection(22))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error.message))
    }
  }
}

export function validateCustomerIdentifier (identifier) {
  return async (dispatch, getState) => {
    const { token, companyId } = getState().session
    dispatch(startLoader())
    try {
      const customer = await getCustomerByIdentifier(token, companyId, identifier)
      if (customer) {
        if (customer.IdCliente > 0) {
          dispatch(setMessage('Ya existe un cliente con la identificación ingresada'))
        } else {
          dispatch(setCustomerAttribute('Nombre', customer.Nombre))
        }
      } else {
        dispatch(setCustomerAttribute('Nombre', ''))
      }
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setCustomerAttribute('Nombre', ''))
      dispatch(setMessage(error.message))
    }
  }
}

export function saveCustomer () {
  return async (dispatch, getState) => {
    const { token } = getState().session
    const { customer } = getState().customer
    dispatch(startLoader())
    try {
      await saveCustomerEntity(token, customer)
      dispatch(setMessage('Transacción completada satisfactoriamente', 'INFO'))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error.message))
    }
  }
}

export function getCustomer (idCustomer) {
  return async (dispatch, getState) => {
    const { token } = getState().session
    dispatch(startLoader())
    try {
      const customer = await getCustomerEntity(token, idCustomer)
      dispatch(filterCustomerList(''))
      dispatch(setCustomer(customer))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error.message))
    }
  }
}

export function filterCustomerList (filter) {
  return async (dispatch, getState) => {
    const { companyId, token } = getState().session
    dispatch(startLoader())
    try {
      let newList = await getCustomerListPerPage(token, companyId, 1, 20, filter)
      dispatch(setCustomerList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setMessage(error.message))
    }
  }
}
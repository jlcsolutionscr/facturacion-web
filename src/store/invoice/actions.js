import { startLoader, stopLoader, setErrorMessage } from 'store/ui/actions'

import { setCustomerList } from 'store/customer/actions'

import { getCustomerList } from 'utils/domainHelper'

export function setParameters () {
  return async (dispatch, getState) => {
    const { serviceURL } = getState().config
    const { token, company } = getState().session
    dispatch(startLoader())
    dispatch(setErrorMessage(''))
    try {
      const newList = await getCustomerList(serviceURL, token, company.IdEmpresa)
      dispatch(setCustomerList(newList))
      dispatch(stopLoader())
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setErrorMessage(error))
    }
  }
}

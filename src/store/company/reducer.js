import {
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_REPORT_RESULTS
} from './types'

import { LOGOUT } from 'store/session/types'


const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_COMPANY:
      return { ...state, company: payload.company }
    case SET_COMPANY_ATTRIBUTE:
      return { ...state, company: {...state.company, [payload.attribute]: payload.value }}
    case SET_REPORT_RESULTS:
      return { ...state, reportResults: payload.list, reportSummary: payload.summary }
    case LOGOUT:
      return { ...state, company: null }
    default:
      return state
  }
}

export default companyReducer

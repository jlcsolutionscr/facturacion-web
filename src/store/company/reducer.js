import {
  SET_COMPANY,
  SET_CREDENTIALS,
  SET_ECONOMIC_ACTIVITY_LIST,
  SET_COMPANY_ATTRIBUTE,
  SET_CREDENTIALS_ATTRIBUTE,
  SET_REPORT_RESULTS
} from './types'

import { LOGOUT } from 'store/session/types'


const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_COMPANY:
      return { ...state, company: payload.company }
    case SET_CREDENTIALS:
      return { ...state, credentialsChanged: false, credentialsNew: !payload.credentials, credentials: payload.credentials }
    case SET_ECONOMIC_ACTIVITY_LIST:
      return { ...state, economicActivities: payload.list }
    case SET_COMPANY_ATTRIBUTE:
      return { ...state, company: {...state.company, [payload.attribute]: payload.value }}
    case SET_CREDENTIALS_ATTRIBUTE:
      return { ...state, credentialsChanged: true, credentials: { ...state.credentials, [payload.attribute]: payload.value }}
    case SET_REPORT_RESULTS:
      return { ...state, reportResults: payload.list, reportSummary: payload.summary }
    case LOGOUT:
      return { ...state, company: null }
    default:
      return state
  }
}

export default companyReducer

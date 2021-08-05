import {
  SET_ACTIVE_SECTION,
  SET_INVOICE_SESSION,
  SET_CANTON_LIST,
  SET_DISTRITO_LIST,
  SET_BARRIO_LIST,
  SET_BRANCH_LIST,
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_REPORT_RESULTS
} from './types'

const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_ACTIVE_SECTION:
      return { ...state, activeSection: payload.pageId }
    case SET_INVOICE_SESSION:
      return {
        ...state,
        companyId: payload.companyId,
        companyIdentifier: payload.companyIdentifier,
        companyName: payload.companyName,
        company: null
      }
    case SET_CANTON_LIST:
      return { ...state, cantonList: payload.list }
    case SET_DISTRITO_LIST:
      return { ...state, distritoList: payload.list }
    case SET_BARRIO_LIST:
      return { ...state, barrioList: payload.list }
    case SET_BRANCH_LIST:
      return { ...state, branchList: payload.list }
    case SET_COMPANY:
      return { ...state, company: payload.company }
    case SET_COMPANY_ATTRIBUTE:
      return { ...state, company: {...state.company, [payload.attribute]: payload.value }}
    case SET_REPORT_RESULTS:
      return { ...state, reportResults: payload.list, reportSummary: payload.summary }
    default:
      return state
  }
}

export default companyReducer

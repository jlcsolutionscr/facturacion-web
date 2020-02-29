import {
  SET_ACTIVE_SECTION,
  SET_VISITOR_SESSION,
  SET_COMPANY_LIST,
  SET_COMPANY,
  SET_COMPANY_ATTRIBUTE,
  SET_BRANCH_LIST,
  SET_BRANCH,
  SET_BRANCH_ATTRIBUTE,
  SET_USER_LIST,
  SET_USER,
  SET_ROLE_LIST,
  ADD_USER_ROLE,
  REMOVE_USER_ROLE,
  SET_USER_ATTRIBUTE,
  SET_EMPLOYEE_LIST,
  SET_EMPLOYEE,
  SET_EMPLOYEE_ATTRIBUTE,
  SET_SERVICE_LIST,
  SET_SERVICE,
  SET_SERVICE_ATTRIBUTE,
  SET_REGISTRY_LIST,
  SET_REGISTRY,
  SET_REPORT_RESULTS
} from './types'

const companyReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_ACTIVE_SECTION:
      return { ...state, activeSection: payload.pageId }
    case SET_VISITOR_SESSION:
      return {
        ...state,
        companyId: payload.companyId,
        companyIdentifier: payload.companyIdentifier,
        companyName: payload.companyName,
        company: null
      }
    case SET_COMPANY_LIST:
      return { ...state, companyList: payload.list }
    case SET_COMPANY:
      return { ...state, company: payload.entity }
    case SET_COMPANY_ATTRIBUTE:
      return { ...state, company: {...state.company, [payload.attribute]: payload.value }}
    case SET_BRANCH_LIST:
      return { ...state, branchList: payload.list }
    case SET_BRANCH:
      return { ...state, branch: payload.entity }
    case SET_BRANCH_ATTRIBUTE:
      return { ...state, branch: {...state.branch, [payload.attribute]: payload.value }}
    case SET_USER_LIST:
      return { ...state, userList: payload.list }
    case SET_USER:
      return { ...state, user: payload.entity }
    case SET_ROLE_LIST:
      return { ...state, roleList: payload.list }
    case ADD_USER_ROLE:
      return { ...state, user: state.user ? { ...state.user, RoleList: [...state.user.RoleList, {Id: payload.id, Description: payload.description}] } : {RoleList: [{Id: payload.id, Description: payload.description}]} }
    case REMOVE_USER_ROLE:
      return { ...state, user: { ...state.user, RoleList: state.user.RoleList.filter(item => item.Id !== payload.id) } }
    case SET_USER_ATTRIBUTE:
      return { ...state, user: state.user ? {...state.user, [payload.attribute]: payload.value} : {[payload.attribute]: payload.value, RoleList: []}}
    case SET_EMPLOYEE_LIST:
      return { ...state, employeeList: payload.list }
    case SET_EMPLOYEE:
    return { ...state, employee: payload.entity }
    case SET_EMPLOYEE_ATTRIBUTE:
      return { ...state, employee: {...state.employee, [payload.attribute]: payload.value }}
      case SET_SERVICE_LIST:
        return { ...state, serviceList: payload.list }
      case SET_SERVICE:
      return { ...state, service: payload.entity }
      case SET_SERVICE_ATTRIBUTE:
        return { ...state, service: {...state.service, [payload.attribute]: payload.value }}
    case SET_REGISTRY_LIST:
      return { ...state, registryList: payload.list }
    case SET_REGISTRY:
      return { ...state, registry: payload.entity }
    case SET_REPORT_RESULTS:
      return { ...state, reportResults: payload.list, reportSummary: payload.summary }
    default:
      return state
  }
}

export default companyReducer

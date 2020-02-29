export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeInfoSection: 0,
    errorMessage: ''
  },
  session: {
    productId: null,
    authenticated: false,
    rolesPerUser: [],
    token: null,
    loginError: ''
  },
  invoice: {
    activeSection: 0,
    companyId: null,
    companyIdentifier: '',
    companyName: '',
    company: null,
    cantonList: [],
    distritoList: [],
    barrioList: [],
    branchList: [],
    reportResults: [],
    reportSummary: null
  },
  visitortracking: {
    activeSection: 0,
    companyId: null,
    companyIdentifier: '',
    companyName: '',
    companyList: [],
    roleList: [],
    company: null,
    branchList: [],
    branch: null,
    userList: [],
    user: null,
    employeeList: [],
    employee: null,
    serviceList: [],
    service: null,
    customerList: [],
    customer: null,
    registryList: [],
    registry: null,
    reportResults: []
  }
}
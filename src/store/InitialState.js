export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeInfoSection: 0,
    errorMessage: ''
  },
  session: {
    productId: 2,
    authenticated: true,
    rolesPerUser: [{RoleId: 1, UserId: 1}],
    token: 'kbGDBcLCEPssvMURFcPNV7H/8JHAP7dzyyR6Vh/dXNMJmFxspc3U6L2w7O8cpWQf',
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
    company: null,
    branchList: [],
    branch: null,
    employeeList: [],
    employee: null,
    registryList: [],
    registry: null,
    reportResults: []
  }
}
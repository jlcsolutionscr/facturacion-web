export const INITIAL_STATE = {
  ui: {
    isLoaderActive: false,
    loaderText: '',
    activeProduct: 0,
    activeInfoSection: 0,
    errorMessage: ''
  },
  session: {
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
  }
}
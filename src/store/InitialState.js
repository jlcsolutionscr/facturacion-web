export const INITIAL_STATE = {
  ui: {
    isLoaderOpen: false,
    loaderText: '',
    activeSection: 0,
    cantonList: [],
    distritoList: [],
    barrioList: [],
    branchList: [],
    errorMessage: ''
  },
  session: {
    authenticated: false,
    companyId: null,
    companyName: '',
    companyIdentifier: '',
    permissions: [],
    token: null
  },
  customer: {
    customerList: []
  },
  company: {
    company: null,
    reportResults: [],
    reportSummary: null,
  },
  invoice: {
    customerId: null,
    productDetails: [],
    payment: null
  }
}
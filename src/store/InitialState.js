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
    customer: null,
    customerList: []
  },
  company: {
    company: null,
    reportResults: [],
    reportSummary: {
      startDate: '01/01/2000',
      endDate: '01/01/2000',
      taxes: 0,
      total: 0
    },
  },
  invoice: {
    customer: null,
    productDetails: [],
    payment: null
  }
}
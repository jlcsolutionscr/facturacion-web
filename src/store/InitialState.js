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
    userId: null,
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
    description: '',
    quantity: 1,
    price: 0,
    productDetails: [],
    paymentId: 1,
    branchId: 1,
    summary: {
      gravado: 0,
      exonerado: 0,
      excento: 0,
      subTotal: 0,
      impuesto: 0,
      total: 0,
    },
    successful: false
  },
  product: {
    product: null,
    productList: []
  }
}
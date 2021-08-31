export const INITIAL_STATE = {
  ui: {
    isLoaderOpen: false,
    loaderText: '',
    activeSection: 0,
    cantonList: [],
    distritoList: [],
    barrioList: [],
    rentTypeList: [],
    message: '',
    messageType: 'ERROR'
  },
  session: {
    authenticated: false,
    userId: null,
    userCode: '',
    companyId: null,
    company: null,
    device: null,
    branchList: [],
    branchId: 1,
    reportList: [],
    permissions: [],
    printer: null,
    token: null
  },
  customer: {
    customer: null,
    customerList: [],
    idTypeList: [],
    priceTypeList: [],
    exonerationTypeList: []
  },
  company: {
    company: null,
    reportResults: [],
    reportSummary: {
      startDate: '01/01/2000',
      endDate: '01/01/2000'
    },
  },
  invoice: {
    invoiceId: null,
    description: '',
    quantity: 1,
    price: 0,
    productDetails: [],
    paymentId: 1,
    summary: {
      gravado: 0,
      exonerado: 0,
      excento: 0,
      subTotal: 0,
      impuesto: 0,
      total: 0,
    },
    comment: '',
    successful: false,
    listPage: 1,
    listCount: 0,
    list: [],
    ticket: null
  },
  product: {
    product: null,
    productList: [],
    productTypeList: [],
    categoryList: [],
    providerList: []
  },
  document: {
    listPage: 1,
    listCount: 0,
    list: [],
    details: ''
  }
}
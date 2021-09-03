export const INITIAL_STATE = {
  ui: {
    isLoaderOpen: false,
    loaderText: '',
    activeSection: 0,
    cantonList: [],
    distritoList: [],
    barrioList: [],
    rentTypeList: [],
    idTypeList: [],
    exonerationTypeList: [],
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
  company: {
    company: null,
    reportResults: [],
    reportSummary: {
      startDate: '01/01/2000',
      endDate: '01/01/2000'
    }
  },
  customer: {
    customer: null,
    customerList: [],
    priceTypeList: []
  },
  product: {
    product: null,
    productList: [],
    productTypeList: [],
    categoryList: [],
    providerList: []
  },
  invoice: {
    invoiceId: 0,
    description: '',
    quantity: 1,
    price: 0,
    productDetails: [],
    paymentId: 1,
    orderId: 0,
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
    list: []
  },
  workingOrder: {
    workingOrderId: 0,
    status: 'on-progress',
    description: '',
    quantity: 1,
    price: 0,
    productDetails: [],
    summary: {
      gravado: 0,
      exonerado: 0,
      excento: 0,
      subTotal: 0,
      impuesto: 0,
      total: 0,
    },
    deliveryPhone: '',
    deliveryAddress: '',
    deliveryDescription: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryDetails: '',
    successful: false,
    listPage: 1,
    listCount: 0,
    list: []
  },
  receipt: {
    receiptId: 0,
    issuerIdType: '',
    issuerId: '',
    issuerName: '',
    issuerAddress: '',
    issuerPhone: '',
    issuerEmail: '',
    productCode: '',
    productDescription: '',
    productQuantity: 1,
    productTaxType: 8,
    productTaxRate: 0,
    productUnit: 'UND',
    productPrice: 0,
    productDetails: [],
    summary: {
      gravado: 0,
      exonerado: 0,
      excento: 0,
      subTotal: 0,
      impuesto: 0,
      total: 0,
    },
    exonerationType: 1,
    exonerationRef: '',
    exonerationIssuer: '',
    exonerationDate: '01/01/2000',
    exonerationPercentage: 0,
    successful: false
  },
  document: {
    listPage: 1,
    listCount: 0,
    list: [],
    details: ''
  }
}
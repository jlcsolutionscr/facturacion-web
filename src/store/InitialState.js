import { defaultSession, defaultInvoice, defaultWorkingOrder, defaultReceipt } from 'utils/defaults'

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
  session: defaultSession,
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
    providerList: [],
    clasificationList: []
  },
  invoice: { ...defaultInvoice, listPage: 1, listCount: 0, list: [] },
  workingOrder: { ...defaultWorkingOrder, listPage: 1, listCount: 0, list: [] },
  receipt: defaultReceipt,
  document: {
    listPage: 1,
    listCount: 0,
    list: [],
    details: ''
  }
}
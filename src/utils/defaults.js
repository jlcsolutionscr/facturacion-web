export const defaultCustomer = {
  IdCliente: 1,
  Nombre: 'CLIENTE DE CONTADO',
  IdTipoExoneracion: 1,
  ParametroExoneracion: {
    Descripcion: 'Compras autorizadas'
  },
  NumDocExoneracion: '',
  NombreInstExoneracion: '',
  FechaEmisionDoc: '01/01/2000',
  PorcentajeExoneracion: 0
}

export const defaultSession = {
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
}

export const defaultInvoice = {
  invoiceId: 0,
  description: '',
  quantity: 1,
  price: 0,
  detailsList: [],
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
  successful: false
}

export const defaultWorkingOrder = {
  workingOrderId: 0,
  invoiceId: 0,
  status: 'on-progress',
  description: '',
  quantity: 1,
  price: 0,
  detailsList: [],
  paymentId: 1,
  summary: {
    gravado: 0,
    exonerado: 0,
    excento: 0,
    subTotal: 0,
    impuesto: 0,
    total: 0,
  },
  delivery: {
    phone: '',
    address: '',
    description: '',
    date: '',
    time: '',
    details: ''
  }
}

export const defaultReceipt = {
  receiptId: 0,
  issuer: {
    idType: 0,
    id: '',
    name: '',
    comercialName: '',
    address: '',
    phone: '',
    email: ''
  },
  product: {
    code: '',
    description: '',
    quantity: 1,
    taxType: 8,
    unit: 'UND',
    price: 0
  },
  detailsList: [],
  summary: {
    gravado: 0,
    exonerado: 0,
    excento: 0,
    subTotal: 0,
    impuesto: 0,
    total: 0,
  },
  exoneration: {
    type: 1,
    ref: '',
    issuerName: '',
    date: '01/01/2000',
    percentage: 0
  },
  successful: false
}

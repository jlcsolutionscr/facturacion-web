import {
  CompanyType,
  CustomerDetailsType,
  CustomerType,
  InvoiceType,
  PaymentDetailsType,
  ProductDetailsType,
  ProductType,
  ProformaType,
  ReceiptType,
  WorkingOrderType,
} from "types/domain";

export const defaultCompany: CompanyType = {
  IdEmpresa: 0,
  IdTipoIdentificacion: 0,
  Identificacion: "",
  NombreEmpresa: "",
  NombreComercial: "",
  IdProvincia: 1,
  IdCanton: 1,
  IdDistrito: 1,
  IdBarrio: 1,
  Direccion: "",
  Telefono1: "",
  Telefono2: "",
  CorreoNotificacion: "",
  Modalidad: 1,
  TipoContrato: 1,
  IdTipoMoneda: 1,
  FechaVence: "",
  RegimenSimplificado: false,
  ActividadEconomicaEmpresa: [],
  PrecioVentaIncluyeIVA: false,
};

export const defaultCredentials = {
  UsuarioHacienda: "",
  ClaveHacienda: "",
  NombreCertificado: "",
  PinCertificado: "",
};

export const defaultCustomerDetails: CustomerDetailsType = {
  id: 1,
  name: "CLIENTE DE CONTADO",
  comercialName: "",
  email: "",
  phoneNumber: "",
  exonerationType: 1,
  exonerationRef: "",
  exoneratedBy: "",
  exonerationDate: "2000-01-01T23:59:59",
  exonerationPercentage: 0,
  priceTypeId: 1,
  differentiatedTaxRateApply: false,
  taxRate: 13,
};

export const defaultCustomer: CustomerType = {
  IdEmpresa: 0,
  IdCliente: 1,
  IdTipoIdentificacion: 1,
  Identificacion: "",
  Nombre: "",
  NombreComercial: "",
  Direccion: "",
  Telefono: "",
  Fax: "",
  CorreoElectronico: "",
  IdVendedor: 1,
  IdTipoPrecio: 1,
  AplicaTasaDiferenciada: false,
  IdImpuesto: 8,
  IdTipoExoneracion: 1,
  NombreInstExoneracion: "",
  NumDocExoneracion: "",
  FechaEmisionDoc: "2000-01-01T23:59:59",
  PorcentajeExoneracion: 0,
  PermiteCredito: false,
};

export const defaultPaymentDetails: PaymentDetailsType = {
  paymentId: 1,
  description: "EFECTIVO",
  amount: 0,
};

export const defaultProductDetails: ProductDetailsType = {
  id: "",
  code: "",
  description: "",
  quantity: 1,
  taxRate: 13,
  unit: "UND",
  price: 0,
  pricePlusTaxes: 0,
  costPrice: 0,
  disccountRate: 0,
};

export const defaultProduct: ProductType = {
  IdProducto: 0,
  IdEmpresa: 0,
  Tipo: 1,
  IdLinea: 0,
  Codigo: "",
  CodigoProveedor: "",
  CodigoClasificacion: "",
  Imagen: "",
  IdImpuesto: 8,
  IdProveedor: 0,
  Descripcion: "",
  PrecioCosto: 0,
  PrecioVenta1: 0,
  PrecioVenta2: 0,
  PrecioVenta3: 0,
  PrecioVenta4: 0,
  PrecioVenta5: 0,
  Observacion: "",
  Marca: "",
  Activo: true,
  PorcDescuento: 0,
  ModificaPrecio: false,
  IndExistencia: 0,
};

export const defaultInvoice: InvoiceType = {
  invoiceId: 0,
  consecutive: 0,
  reference: "",
  date: "",
  activityCode: 0,
  customerDetails: defaultCustomerDetails,
  productDetails: defaultProductDetails,
  productDetailsList: [],
  paymentDetailsList: [defaultPaymentDetails],
  vendorId: 0,
  summary: {
    taxed: 0,
    exonerated: 0,
    exempt: 0,
    subTotal: 0,
    taxes: 0,
    total: 0,
    totalCost: 0,
    cashAmount: 0,
  },
  comment: "",
  successful: false,
};

export const defaultWorkingOrder: WorkingOrderType = {
  id: 0,
  consecutive: 0,
  date: "",
  cashAdvance: 0,
  invoiceId: 0,
  status: "on-progress",
  activityCode: 0,
  customerDetails: defaultCustomerDetails,
  productDetails: defaultProductDetails,
  productDetailsList: [],
  paymentDetailsList: [],
  vendorId: 0,
  summary: {
    taxed: 0,
    exonerated: 0,
    exempt: 0,
    subTotal: 0,
    taxes: 0,
    total: 0,
    totalCost: 0,
    cashAmount: 0,
  },
  delivery: {
    phone: "",
    address: "",
    description: "",
    date: "",
    time: "",
    details: "",
  },
};

export const defaultReceipt: ReceiptType = {
  receiptId: 0,
  activityCode: 0,
  issuer: {
    typeId: 0,
    id: "",
    name: "",
    comercialName: "",
    address: "",
    phone: "",
    email: "",
  },
  productDetails: defaultProductDetails,
  productDetailsList: [],
  summary: {
    taxed: 0,
    exonerated: 0,
    exempt: 0,
    subTotal: 0,
    taxes: 0,
    total: 0,
    totalCost: 0,
    cashAmount: 0,
  },
  exoneration: {
    type: 1,
    ref: "",
    exoneratedBy: "",
    date: "2000-01-01T23:59:59",
    percentage: 0,
  },
  successful: false,
};

export const defaultProforma: ProformaType = {
  proformaId: 0,
  consecutive: 0,
  reference: "",
  date: "",
  customerDetails: defaultCustomerDetails,
  productDetails: defaultProductDetails,
  productDetailsList: [],
  vendorId: 0,
  summary: {
    taxed: 0,
    exonerated: 0,
    exempt: 0,
    subTotal: 0,
    taxes: 0,
    total: 0,
    totalCost: 0,
    cashAmount: 0,
  },
  comment: "",
  successful: false,
};

export type IdValueType = {
  Id: number;
  Valor: number;
};

export type PermissionType = {
  IdRole: number;
};

export type IdDescriptionType = {
  Id: number;
  Descripcion: string;
};

export type IdDescriptionValueType = {
  Id: number;
  Descripcion: string;
  Valor: number;
};

export type IdDescriptionTaxType = {
  Id: number;
  Descripcion: string;
  Impuesto: number;
};

export type CodeDescriptionType = {
  Id: number;
  Codigo: string;
  Descripcion: string;
};

export type EconomicActivityType = {
  IdEmpresa: number;
  CodigoActividad: number;
  Descripcion: string;
};

export type InvoiceEntityType = {
  Consecutivo: number;
  IdFactura: number;
  Fecha: string;
  NombreCliente: string;
  Impuesto: number;
  Total: number;
  Anulando: boolean;
};

export type DeviceType = {
  lineWidth: number;
};

export type CompanyType = {
  IdEmpresa: number;
  NombreEmpresa: string;
  NombreComercial: string;
  IdTipoIdentificacion: number;
  Identificacion: string;
  IdProvincia: number;
  IdCanton: number;
  IdDistrito: number;
  IdBarrio: number;
  IdTipoMoneda: number;
  Direccion: string;
  Telefono1: string;
  Telefono2: string;
  FechaVence: string;
  RegimenSimplificado: boolean;
  PrecioVentaIncluyeIVA: boolean;
  CorreoNotificacion: string;
  Modalidad: number;
  TipoContrato: number;
  ActividadEconomicaEmpresa: EconomicActivityType[];
};

export type CredentialType = {
  UsuarioHacienda: string;
  ClaveHacienda: string;
  NombreCertificado: string;
  PinCertificado: string;
};

export type ProductType = {
  IdEmpresa: number;
  IdProducto: number | null;
  Tipo: number;
  IdLinea: number;
  Codigo: string;
  CodigoProveedor: string;
  CodigoClasificacion: string;
  IdProveedor: number;
  Descripcion: string;
  PrecioCosto: number;
  PrecioVenta1: number;
  PrecioVenta2: number;
  PrecioVenta3: number;
  PrecioVenta4: number;
  PrecioVenta5: number;
  PorcDescuento: number;
  IdImpuesto: number;
  IndExistencia: number;
  Imagen: string;
  Marca: string;
  Observacion: string;
  ModificaPrecio: boolean;
  Activo: boolean;
};

export type CustomerType = {
  IdEmpresa: number;
  IdCliente: number;
  IdTipoIdentificacion: number;
  Identificacion: string;
  Direccion: string;
  Nombre: string;
  NombreComercial: string;
  Telefono: string;
  Fax: string;
  CorreoElectronico: string;
  IdVendedor: number;
  IdTipoPrecio: number;
  AplicaTasaDiferenciada: boolean;
  IdImpuesto: number;
  IdTipoExoneracion: number;
  NumDocExoneracion: string;
  NombreInstExoneracion: string;
  FechaEmisionDoc: string;
  PorcentajeExoneracion: number;
  PermiteCredito: boolean;
};

export type CustomerDetailsType = {
  id: number;
  name: string;
  comercialName: string;
  email: string;
  phoneNumber: string;
  exonerationType: number;
  exonerationRef: string;
  exoneratedBy: string;
  exonerationDate: string;
  exonerationPercentage: number;
};

export type ProductDetailsType = {
  id: string;
  quantity: number;
  code: string;
  description: string;
  taxRate: number;
  taxRateType: number;
  unit: string;
  price: number;
  costPrice?: number;
  instalationPrice?: number;
};

type PaymentDetailsType = {
  paymentId: number;
  description: string;
  amount: number;
};

export type SummaryType = {
  taxed: number;
  exonerated: number;
  exempt: number;
  subTotal: number;
  taxes: number;
  total: number;
  totalCost: number;
  cashAmount: number;
};

export type InvoiceType = {
  invoiceId: number | null;
  consecutive: number;
  reference: string;
  date: string;
  activityCode: number;
  customerDetails: CustomerDetailsType;
  productDetails: ProductDetailsType;
  productDetailsList: ProductDetailsType[];
  paymentDetailsList: PaymentDetailsType[];
  vendorId: number;
  summary: SummaryType;
  comment: string;
  successful: boolean;
};

export type WorkingOrderType = {
  id: number;
  consecutive: number;
  invoiceId: number;
  date: string;
  status: string;
  activityCode: number;
  customerDetails: CustomerDetailsType;
  productDetails: ProductDetailsType;
  productDetailsList: ProductDetailsType[];
  paymentDetailsList: PaymentDetailsType[];
  cashAdvance: number;
  vendorId: number;
  summary: SummaryType;
  delivery: {
    phone: string;
    address: string;
    description: string;
    date: string;
    time: string;
    details: string;
  };
};

export type ReceiptType = {
  receiptId: number | null;
  activityCode: number;
  issuer: {
    typeId: number;
    id: string;
    name: string;
    comercialName: string;
    address: string;
    phone: string;
    email: string;
  };
  productDetails: ProductDetailsType;
  productDetailsList: ProductDetailsType[];
  summary: SummaryType;
  exoneration: {
    type: number;
    ref: string;
    exoneratedBy: string;
    date: string;
    percentage: number;
  };
  successful: boolean;
};

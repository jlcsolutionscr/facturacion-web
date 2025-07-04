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
  Id: string;
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
  IdTipoMoneda: number;
  Direccion: string;
  Telefono1: string;
  Telefono2: string;
  TipoContrato: number;
  CantidadDisponible: number;
  FechaVence: string;
  LineasPorFactura: number;
  Contabiliza: boolean;
  AutoCompletaProducto: boolean;
  RegimenSimplificado: boolean;
  PermiteFacturar: boolean;
  RecepcionGastos: boolean;
  AsignaVendedorPorDefecto: boolean;
  IngresaPagoCliente: boolean;
  PrecioVentaIncluyeIVA: boolean;
  CorreoNotificacion: string;
  MontoRedondeoDescuento: number;
  LeyendaFactura: rstring;
  LeyendaProforma: string;
  LeyendaApartado: string;
  LeyendaOrdenServicio: string;
  Modalidad: number;
  ActividadEconomicaEmpresa: EconomicActivityType[];
  Usuario: { Token: string };
};

export type CredentialType = {
  UsuarioHacienda: string;
  ClaveHacienda: string;
  NombreCertificado: string;
  PinCertificado: string;
};

export type ProductType = {
  IdEmpresa: number;
  IdProducto: number;
  Tipo: number;
  IdLinea: number;
  Codigo: string;
  CodigoProveedor: string;
  CodigoClasificacion: string;
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

export type DetalleProductoType = {
  IdProducto: number;
  Codigo: string;
  Descripcion: string;
  PrecioCosto: number;
  PrecioVenta: number;
  Excento: boolean;
  PorcentajeIVA: number;
  PorcDescuento: number;
  Cantidad: number;
  Producto: {
    PrecioCosto: number;
  };
};

export type DetallePagoType = {
  IdConsecutivo: number;
  IdFactura: number;
  IdFormaPago: number;
  IdTipoMoneda: number;
  IdCuentaBanco: number;
  TipoTarjeta: string;
  NroMovimiento: string;
  MontoLocal: number;
  TipoDeCambio: number;
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
  Celular: string;
  Fax: string;
  CorreoElectronico: string;
  IdTipoPrecio: number;
  IdTipoExoneracion: number;
  NumDocExoneracion: string;
  ArticuloExoneracion: string;
  IncisoExoneracion: string;
  IdNombreInstExoneracion: number;
  FechaEmisionDoc: string;
  PorcentajeExoneracion: number;
  PermiteCredito: boolean;
  CodigoActividad: string;
};

export type CustomerDetailsType = {
  id: number;
  name: string;
  comercialName: string;
  email: string;
  phoneNumber: string;
  activityCode: string;
  exonerationType: number;
  exonerationRef: string;
  exonerationRef2: string;
  exonerationRef3: string;
  exoneratedById: number;
  exonerationDate: string;
  exonerationPercentage: number;
  priceTypeId: number;
};

export type ProductDetailsType = {
  id: string;
  quantity: number;
  code: string;
  description: string;
  taxRate: number;
  taxRateType?: number;
  unit: string;
  price: number;
  pricePlusTaxes: number;
  costPrice: number;
  disccountRate: number;
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

export type DeliveryType = {
  phone: string;
  address: string;
  description: string;
  date: string;
  time: string;
  details: string;
};

export type InvoiceType = {
  invoiceId: number | null;
  consecutive: number;
  date: string;
  activityCode: number;
  customerDetails: CustomerDetailsType;
  productDetails: ProductDetailsType;
  productDetailsList: ProductDetailsType[];
  paymentDetailsList: PaymentDetailsType[];
  vendorId: number;
  summary: SummaryType;
  comment: string;
  cashAdvance: number;
  currency: number;
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
  currency: number;
  summary: SummaryType;
  delivery: DeliveryType;
};

export type ReceiptType = {
  receiptId: number | null;
  activityCode: number;
  issuer: {
    typeId: number;
    id: string;
    name: string;
    comercialName: string;
    activityCode: string;
    reference: string;
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
    ref2: string;
    ref3: string;
    exoneratedById: number;
    date: string;
    percentage: number;
  };
  currency: number;
  successful: boolean;
};

export type ProformaType = {
  proformaId: number | null;
  consecutive: number;
  date: string;
  customerDetails: CustomerDetailsType;
  productDetails: ProductDetailsType;
  productDetailsList: ProductDetailsType[];
  vendorId: number;
  currency: number;
  summary: SummaryType;
  comment: string;
  successful: boolean;
};

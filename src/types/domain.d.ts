export type IdValueType = {
  id: number;
  value: number;
};

export type IdDescriptionType = {
  id: number;
  description: string;
};

export type EconomicActivityType = {
  companyId: number;
  code: string;
  description: string;
};

export type DeviceType = {
  lineWidth: number;
};

export type CompanyType = {
  id: number;
  mode: number;
  identifier: string;
  name: string;
  comercialName: string;
  address: string;
  phoneNumber: string;
  notificationEmail: string;
  currencyType: number;
  simplifyRegimen: boolean;
  economicActivityList: EconomicActivityType[];
  ivaTaxIncluded: boolean;
  idTypeList: IdDescriptionType[];
  taxTypeList: IdDescriptionType[];
  exonerationTypeList: IdDescriptionType[];
  priceTypeList: IdDescriptionType[];
  productTypeList: IdDescriptionType[];
};

export type CredentialType = {
  user: string;
  password: string;
  certificate: string;
  certificatePin: string;
};

export type ProductType = {
  id: number | null;
  companyId: number;
  type: number;
  category: number;
  code: string;
  providerCode: string;
  cabysCode: string;
  image: string;
  taxTypeId: number;
  taxRate: number;
  providerId: number;
  description: string;
  costPrice: number;
  untaxPrice1: number;
  taxPrice1: number;
  untaxPrice2: number;
  taxPrice2: number;
  untaxPrice3: number;
  taxPrice3: number;
  untaxPrice4: number;
  taxPrice4: number;
  untaxPrice5: number;
  taxPrice5: number;
  observation: string;
  brand: string;
  active: boolean;
  discountPercentage: number;
  priceChangeAllowed: boolean;
  minInventory: number;
};

export type CustomerType = {
  id?: number;
  typeId: number;
  identifier: string;
  name: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  faxNumber: string;
  email: string;
  vendorId: number;
  priceTypeId: number;
  differentiatedTaxRateApply: false;
  taxTypeId: number;
  exonerationType: number;
  exonerationRef: string;
  exoneratedBy: string;
  exonerationDate: string;
  exonerationPercentage: number;
  creditAllowed: boolean;
};

export type CustomerDetailsType = {
  id: number;
  name: string;
  phoneNumber: string;
  priceTypeId: number;
  differentiatedTaxRateApply: boolean;
  taxRate: number;
  exonerationType: number;
  exonerationRef: string;
  exoneratedBy: string;
  exonerationDate: string;
  exonerationPercentage: number;
};

export type ProductDetailsType = {
  id?: number;
  quantity: number;
  code: string;
  description: string;
  taxRate: number;
  taxRateType?: number;
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
  productDetailList: ProductDetailsType[];
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
  productDetailList: ProductDetailsType[];
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
  productDetailList: ProductDetailsType[];
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

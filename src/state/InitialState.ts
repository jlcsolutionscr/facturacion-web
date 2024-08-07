import {
  CodeDescriptionType,
  CompanyType,
  CredentialType,
  CustomerType,
  DeviceType,
  IdDescriptionTaxType,
  IdDescriptionType,
  IdDescriptionValueType,
  InvoiceEntityType,
  InvoiceType,
  PermissionType,
  ProductType,
  ProformaType,
  ReceiptType,
  WorkingOrderType,
} from "types/domain";

import {
  defaultCompany,
  defaultCredentials,
  defaultCustomer,
  defaultInvoice,
  defaultProduct,
  defaultProforma,
  defaultReceipt,
  defaultWorkingOrder,
} from "utils/defaults";

type UIStateType = {
  isLoaderOpen: boolean;
  loaderText: string;
  activeSection: number;
  cantonList: IdDescriptionType[];
  distritoList: IdDescriptionType[];
  barrioList: IdDescriptionType[];
  taxTypeList: IdDescriptionValueType[];
  idTypeList: IdDescriptionValueType[];
  exonerationTypeList: IdDescriptionValueType[];
  message: string;
  messageType: string;
};

type SessionStateType = {
  authenticated: boolean;
  userId: number;
  userCode: string;
  currencyType: number;
  companyId: number;
  company: CompanyType | null;
  device: DeviceType;
  branchList: IdDescriptionType[];
  branchId: number;
  terminalId: number;
  reportList: { IdReporte: number; NombreReporte: string }[];
  vendorList: IdDescriptionType[];
  permissions: PermissionType[];
  printer: string;
  token: string;
};

type CompanyStateType = {
  entity: CompanyType;
  availableEconomicActivityList: IdDescriptionType[];
  credentials: CredentialType;
  logo: string;
  newCredentials: boolean;
  credentialsChanged: boolean;
  reportResults: object[];
  reportSummary: {
    startDate: string;
    endDate: string;
  };
};

type CustomerStateType = {
  entity: CustomerType;
  listPage: number;
  listCount: number;
  list: IdDescriptionType[];
  priceTypeList: IdDescriptionValueType[];
  isDialogOpen: boolean;
};

type ProductStateType = {
  entity: ProductType;
  listPage: number;
  listCount: number;
  list: CodeDescriptionType[];
  productTypeList: IdDescriptionType[];
  categoryList: IdDescriptionType[];
  providerList: IdDescriptionType[];
  clasificationList: IdDescriptionTaxType[];
  isDialogOpen: boolean;
};

type InvoiceStateType = {
  entity: InvoiceType;
  listPage: number;
  listCount: number;
  list: InvoiceEntityType[];
};

type ReceiptStateType = {
  entity: ReceiptType;
};

type WorkingOrderStateType = {
  entity: WorkingOrderType;
  listPage: number;
  listCount: number;
  list: InvoiceEntityType[];
  servicePointList: IdDescriptionType[];
};

type ProformaStateType = {
  entity: ProformaType;
  listPage: number;
  listCount: number;
  list: InvoiceEntityType[];
};

type DocumentStateType = {
  listPage: number;
  listCount: number;
  list: {
    IdTipoDocumento: number;
    IdDocumento: number;
    Consecutivo: number;
    Fecha: string;
    EstadoEnvio: string;
    NombreReceptor: string;
    MontoTotal: number;
    CorreoNotificacion: string;
  }[];
  details: string | null;
};

export const uiInitialState: UIStateType = {
  isLoaderOpen: false,
  loaderText: "",
  activeSection: 0,
  cantonList: [],
  distritoList: [],
  barrioList: [],
  taxTypeList: [],
  idTypeList: [],
  exonerationTypeList: [],
  message: "",
  messageType: "ERROR",
};

export const sessionInitialState: SessionStateType = {
  authenticated: false,
  userId: 0,
  userCode: "",
  currencyType: 1,
  companyId: 0,
  company: null,
  device: { lineWidth: 80 },
  branchList: [],
  branchId: 1,
  terminalId: 1,
  reportList: [],
  vendorList: [],
  permissions: [],
  printer: "",
  token: "",
};

export const companyInitialState: CompanyStateType = {
  entity: defaultCompany,
  availableEconomicActivityList: [],
  credentials: defaultCredentials,
  logo: "",
  newCredentials: true,
  credentialsChanged: false,
  reportResults: [],
  reportSummary: {
    startDate: "2000-01-01T23:59:59",
    endDate: "2000-01-01T23:59:59",
  },
};

export const customerInitialState: CustomerStateType = {
  entity: defaultCustomer,
  listPage: 1,
  listCount: 0,
  list: [],
  priceTypeList: [],
  isDialogOpen: false,
};

export const productInitialState: ProductStateType = {
  entity: defaultProduct,
  listPage: 1,
  listCount: 0,
  list: [],
  productTypeList: [],
  categoryList: [],
  providerList: [],
  clasificationList: [],
  isDialogOpen: false,
};

export const invoiceInitialState: InvoiceStateType = {
  entity: defaultInvoice,
  listPage: 1,
  listCount: 0,
  list: [],
};

export const receiptInitialState: ReceiptStateType = {
  entity: defaultReceipt,
};

export const workingOrderInitialState: WorkingOrderStateType = {
  entity: defaultWorkingOrder,
  listPage: 1,
  listCount: 0,
  list: [],
  servicePointList: [],
};

export const proformaInitialState: ProformaStateType = {
  entity: defaultProforma,
  listPage: 1,
  listCount: 0,
  list: [],
};

export const documentInitialState: DocumentStateType = {
  listPage: 1,
  listCount: 0,
  list: [],
  details: null,
};

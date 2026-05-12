import {
  CashCloseType,
  CategoryType,
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
  LlaveDescriptionType,
  PermissionType,
  PrintingTicketType,
  ProductType,
  ProformaType,
  ReceiptType,
  WorkingOrderType,
} from "types/domain";

import { STORAGE_TICKET_PRINTER_SERVER_ADDRESS } from "utils/constants";
import {
  defaultCategory,
  defaultCompany,
  defaultCredentials,
  defaultCustomer,
  defaultInvoice,
  defaultProduct,
  defaultProforma,
  defaultReceipt,
  defaultWorkingOrder,
} from "utils/defaults";
import { readyKeyFromStorage } from "utils/utilities";

type UIStateType = {
  isLoaderOpen: boolean;
  loaderText: string;
  activeSection: number;
  cantonList: IdDescriptionType[];
  distritoList: IdDescriptionType[];
  taxTypeList: IdDescriptionValueType[];
  idTypeList: IdDescriptionValueType[];
  exonerationTypeList: IdDescriptionValueType[];
  exonerationNameList: IdDescriptionValueType[];
  message: string;
  messageType: string;
  printerServerAddress: string;
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
  roles: PermissionType[];
  printer: string;
  token: string;
  processingToken: { type: string; id: string };
  processingTokenMessage: string;
  cashCloseEntity: CashCloseType | null;
  isCashCloseSaved: boolean;
};

type CompanyStateType = {
  entity: CompanyType;
  availableEconomicActivityList: LlaveDescriptionType[];
  credentials: CredentialType;
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
  categoryEntity: CategoryType;
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
  servicePointList: IdDescriptionValueType[];
  printingTicketList: PrintingTicketType[];
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
    Reprocesado: boolean;
  }[];
  details: string | null;
};

export const uiInitialState: UIStateType = {
  isLoaderOpen: false,
  loaderText: "",
  activeSection: 0,
  cantonList: [],
  distritoList: [],
  taxTypeList: [],
  idTypeList: [],
  exonerationTypeList: [],
  exonerationNameList: [],
  message: "",
  messageType: "ERROR",
  printerServerAddress: readyKeyFromStorage(STORAGE_TICKET_PRINTER_SERVER_ADDRESS) ?? "",
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
  roles: [],
  printer: "",
  token: "",
  processingToken: { type: "reset", id: "" },
  processingTokenMessage: "",
  cashCloseEntity: null,
  isCashCloseSaved: false,
};

export const companyInitialState: CompanyStateType = {
  entity: defaultCompany,
  availableEconomicActivityList: [],
  credentials: defaultCredentials,
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
  categoryEntity: defaultCategory,
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
  printingTicketList: [],
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

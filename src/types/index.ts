// Core API Types
export interface BillbeeConfig {
  username: string
  apiPassword: string
  apiKey: string
  baseUrl?: string
}

export interface ApiResponse<T = any> {
  ErrorMessage: string
  ErrorCode: number
  Data: T
  Paging?: Paging
}

export interface PagedApiResponse<T = any> {
  ErrorMessage: string
  ErrorCode: number
  Data: T[]
  Paging: Paging
}

export interface Paging {
  Page: number
  TotalPages: number
  TotalRows: number
  PageSize: number
}

// Article/Product Types
export interface Article {
  Id: number
  EAN: string
  TaricNumber: string
  SKU: string
  Title: string
  Subtitle: string
  Description: string
  Unit: string
  Weight: number
  WeightNet: number
  Price: number
  CostPrice: number
  Vat1Rate: number
  Vat2Rate: number
  VatIndex: number
  StockDesired: number
  StockCurrent: number
  StockWarning: number
  StockCode: number
  StockReduceItemsPerSale: number
  Images: ArticleImage[]
  Category1: string
  Category2: string
  Category3: string
  Manufacturer: string
  EbayCategory: number
  Type: ArticleType
  IsDigital: boolean
  IsCustomizable: boolean
  DeliveryTime: number
  Recipient: string
  Occasion: string
  CountryOfOrigin: string
  ExciseAmount: number
  CustomFields: ArticleCustomField[]
  Sources: ArticleSource[]
  Tags: string[]
  SoldAmount: number
  SoldSumGross: number
  SoldSumNet: number
  UnitsPerItem: number
  BillOfMaterial: BillOfMaterialItem[]
}

export interface ArticleImage {
  Id: number
  Url: string
  ThumbUrl: string
  Position: number
  IsDefault: boolean
}

export interface ArticleCustomField {
  Id: number
  Name: string
  Value: string
  Type: CustomFieldType
}

export interface ArticleSource {
  Id: string
  Source: string
  SourceId: string
  ApiAccountId: number
  ExportedToSource: boolean
  UnitsPerItem: number
  StockSyncInactive: boolean
  StockSyncMin: number
  StockSyncMax: number
  UnitsPerItemEditable: boolean
  Tags: string[]
}

export interface BillOfMaterialItem {
  Id: number
  ArticleId: number
  Amount: number
}

// Order Types
export interface Order {
  Id: number
  OrderNumber: string
  State: OrderState
  VatMode: VatMode
  CreatedAt: string
  ShippedAt: string
  ConfirmedAt: string
  PayedAt: string
  SellerComment: string
  Comments: OrderComment[]
  InvoiceNumberPrefix: string
  InvoiceNumberPostfix: string
  InvoiceNumber: number
  InvoiceDate: string
  InvoiceAddress: Address
  ShippingAddress: Address
  PaymentMethod: PaymentMethod
  ShippingCost: number
  TotalCost: number
  AdjustmentCost: number
  AdjustmentReason: string
  OrderItems: OrderItem[]
  Currency: string
  Seller: Seller
  Buyer: Customer
  UpdatedAt: string
  TaxRate1: number
  TaxRate2: number
  VatId: string
  Tags: string[]
  ShipWeightKg: number
  Language: string
  PaidAmount: number
  ShippingProfileId: string
  ShippingProfileName: string
  ShippingProviderId: number
  ShippingProviderProductId: number
  ShippingProviderName: string
  ShippingProviderProductName: string
  ShippingIds: Shipment[]
  Payments: Payment[]
  History: OrderHistory[]
  CustomFields: OrderCustomField[]
  LastModifiedAt: string
  MerchantVatId: string
  CustomerVatId: string
  DeliverySourceCountryCode: string
  CustomInvoiceNote: string
  CustomerNumber: string
  DistributionCenter: string
  IsCancellationFor: number
  AcceptLossOfReturnRight: boolean
  DeliveryDate: string
  InvoiceMaturity: number
  InvoiceBonus: number
  InvoiceSkonto: number
  InvoiceSkontoDate: string
  CreatedBy: string
  AddressingType: AddressingType
  DeliveryNote: string
  RebateDifference: number
  Tags2: string
  InvoiceNote: string
  InvoiceText: string
  PaymentInstruction: string
  IsPrimeOrder: boolean
  PackagingWeightGr: number
  ShippingCostNet: number
  OrderStateId: number
  LastErrorMessage: string
}

export interface OrderItem {
  Id: number
  OrderId: number
  Product: Article
  Quantity: number
  TotalPrice: number
  TaxAmount: number
  TaxIndex: number
  Discount: number
  GetPriceFromArticleIfAny: boolean
  IsCancellation: boolean
  Attributes: OrderItemAttribute[]
  BillbeeId: number
  TransactionId: string
  DontAdjustStock: boolean
  UnrebatedTotalPrice: number
  SerialNumber: string
}

export interface OrderItemAttribute {
  Id: number
  Name: string
  Value: string
}

export interface Address {
  Id: number
  Company: string
  FirstName: string
  LastName: string
  NameAddition: string
  Street: string
  Zip: string
  City: string
  CountryCode: string
  CountryName: string
  CountryISO2: string
  State: string
  Phone: string
  Email: string
  AddressType: AddressType
  IsValidAddress: boolean
}

export interface Customer {
  Id: number
  Name: string
  Email: string
  Tel1: string
  Tel2: string
  Number: string
  PriceGroupId: number
  LanguageId: number
  VatId: string
  Type: CustomerType
  Addresses: Address[]
  MetaData: CustomerMetaData[]
}

export interface CustomerMetaData {
  Id: number
  Key: string
  Value: string
}

// Shipment Types
export interface Shipment {
  Id: number
  ShippingId: string
  ShippingProviderId: number
  ShippingProviderProductId: number
  ShippingProviderName: string
  ShippingProviderProductName: string
  ShippingDate: string
  TrackingUrl: string
  TrackingNumber: string
  LabelDataPdf: string
  ExportDocumentsPdf: string
  Dimension: ShipmentDimension
  WeightInGram: number
  AutomaticTrackingMailEnabled: boolean
  ShippingCost: number
  InsuredValue: number
  InsuredCurrency: string
  Services: ShipmentService[]
}

export interface ShipmentDimension {
  Length: number
  Width: number
  Height: number
}

export interface ShipmentService {
  Name: string
  Parameter: string
}

// Invoice Types
export interface Invoice {
  Id: number
  InvoiceNumber: string
  InvoiceDate: string
  IntroText: string
  OutroText: string
  InvoiceNoteText: string
  TotalGross: number
  TotalNet: number
  TotalTax: number
  Currency: string
  InvoiceAddress: Address
  Items: InvoiceItem[]
  Payments: Payment[]
  VatRates: VatRate[]
}

export interface InvoiceItem {
  Id: number
  SKU: string
  Name: string
  Quantity: number
  TotalGross: number
  TotalNet: number
  TaxAmount: number
  TaxRate: number
  Discount: number
}

export interface Payment {
  Id: number
  Date: string
  Amount: number
  PaymentType: PaymentMethod
  TransactionId: string
  Reference: string
  Name: string
  Purpose: string
}

export interface VatRate {
  VatRate: number
  TaxableAmount: number
  TaxAmount: number
}

// Event Types
export interface Event {
  Id: number
  Date: string
  TypeId: EventType
  TypeName: string
  Text: string
  OrderId: number
  OrderNumber: string
  ArticleId: number
  ArticleSKU: string
  EmployeeId: number
  EmployeeName: string
}

// Cloud Storage Types
export interface CloudStorage {
  Id: number
  Name: string
  Type: CloudStorageType
  UsedBytes: number
  MaxBytes: number
  IsActive: boolean
}

// Layout Template Types
export interface LayoutTemplate {
  Id: number
  Name: string
  TemplateText: string
  IsDefault: boolean
  Type: LayoutTemplateType
}

// Enum Types
export enum ArticleType {
  Product = 0,
  Service = 1,
  Assembly = 2,
  Discount = 3
}

export enum CustomFieldType {
  Text = 0,
  Number = 1,
  Date = 2,
  Boolean = 3,
  Selection = 4
}

export enum OrderState {
  Ordered = 1,
  Confirmed = 2,
  Paid = 3,
  Shipped = 4,
  Reclamation = 5,
  Deleted = 6,
  Closed = 7,
  Canceled = 8,
  Archived = 9,
  DemandNote1 = 11,
  DemandNote2 = 12,
  Packed = 13,
  Offered = 14,
  PaymentReminder = 15,
  Fulfilling = 16
}

export enum PaymentMethod {
  BankTransfer = 1,
  CashOnDelivery = 2,
  PayPal = 3,
  Cash = 4,
  Voucher = 6,
  SofortUeberweisung = 19,
  Other = 22,
  DirectDebit = 23,
  Klarna = 25,
  Invoice = 26,
  CreditCard = 31,
  Maestro = 32,
  AmazonPayments = 44,
  Prepayment = 59,
  AmazonMarketplace = 61,
  AmazonPaymentsAdvanced = 62,
  Stripe = 63,
  SumUp = 67,
  InstallmentPurchase = 73,
  EtsyPayments = 97,
  KlarnaNew = 98,
  Ebay = 104
}

export enum VatMode {
  Gross = 0,
  Net = 1
}

export enum AddressType {
  Invoice = 1,
  Delivery = 2
}

export enum CustomerType {
  Consumer = 0,
  Business = 1
}

export enum AddressingType {
  DuSie = 0,
  Sie = 1,
  Du = 2
}

export enum EventType {
  NewOrder = 1,
  OrderStateChanged = 2,
  OrderShipped = 3,
  OrderCanceled = 4,
  StockChanged = 5,
  ProductCreated = 6,
  ProductUpdated = 7,
  InvoiceCreated = 8,
  PaymentReceived = 9
}

export enum CloudStorageType {
  Dropbox = 1,
  GoogleDrive = 2,
  OneDrive = 3
}

export enum LayoutTemplateType {
  Invoice = 1,
  DeliveryNote = 2,
  CreditNote = 3,
  OrderConfirmation = 4
}

// Request/Response Types
export interface OrderComment {
  Id: number
  Text: string
  FromCustomer: boolean
  CreatedAt: string
  Name: string
}

export interface OrderHistory {
  Id: number
  CreatedAt: string
  EventTypeName: string
  Text: string
  EmployeeName: string
}

export interface OrderCustomField {
  Id: number
  Name: string
  Value: string
}

export interface Seller {
  Id: number
  Nick: string
  FirstName: string
  LastName: string
  FullName: string
  Email: string
}

// Update Models
export interface UpdateStockModel {
  SKU: string
  Stock: number
  UnfulfilledAmount?: number
  StockId?: number
}

export interface UpdateStockCodeModel {
  SKU: string
  StockCode: number
}

export interface OrderStateUpdate {
  NewStateId: number
  Comment?: string
}

export interface AddShipmentModel {
  OrderId: number
  ShippingId: string
  ShippingProviderId?: number
  ShippingProviderProductId?: number
  ShippingProviderName?: string
  ShippingProviderProductName?: string
  TrackingUrl?: string
  TrackingNumber?: string
  WeightInGram?: number
  LabelDataPdf?: string
  ExportDocumentsPdf?: string
  Dimension?: ShipmentDimension
  Services?: ShipmentService[]
}

// Batch Operation Types
export interface BatchRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  data?: any
}

export interface BatchResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  statusCode: number
}


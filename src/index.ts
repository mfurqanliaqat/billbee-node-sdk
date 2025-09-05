// Main exports
export { BillbeeClient, BillbeeClient as default } from './client'

// Type exports
export * from './types'

// Endpoint exports
export { ArticleEndpoint } from './endpoints/article'
export { OrderEndpoint } from './endpoints/order'
export { CustomerEndpoint } from './endpoints/customer'
export { CustomerAddressEndpoint } from './endpoints/customer-address'
export { EventEndpoint } from './endpoints/event'
export { EnumEndpoint } from './endpoints/enum'
export { CloudStorageEndpoint } from './endpoints/cloud-storage'
export { LayoutEndpoint } from './endpoints/layout'
export { AutomaticProvisioningEndpoint } from './endpoints/automatic-provisioning'

// HTTP client export (for advanced usage)
export { HttpClient } from './http/client'

// Re-export for convenience and PHP SDK compatibility
export { BillbeeClient as Client } from './client'

import { HttpClient } from './http/client'
import { BillbeeConfig } from './types'
import { ArticleEndpoint } from './endpoints/article'
import { OrderEndpoint } from './endpoints/order'
import { CustomerEndpoint } from './endpoints/customer'
import { CustomerAddressEndpoint } from './endpoints/customer-address'
import { EventEndpoint } from './endpoints/event'
import { EnumEndpoint } from './endpoints/enum'
import { CloudStorageEndpoint } from './endpoints/cloud-storage'
import { LayoutEndpoint } from './endpoints/layout'
import { AutomaticProvisioningEndpoint } from './endpoints/automatic-provisioning'

/**
 * Main Billbee API Client
 *
 * @example
 * ```typescript
 * import { BillbeeClient } from 'billbee-node-sdk'
 *
 * const client = new BillbeeClient({
 *   username: 'YOUR_BILLBEE_USERNAME',
 *   apiPassword: 'YOUR_API_PASSWORD',
 *   apiKey: 'YOUR_API_KEY'
 * })
 *
 * // Get products
 * const products = await client.articles().getList()
 *
 * // Enable batch mode
 * client.enableBatchMode()
 * client.articles().getList()
 * client.orders().getList()
 * const results = await client.executeBatch()
 * ```
 */
export class BillbeeClient {
  private httpClient: HttpClient
  private _articles: ArticleEndpoint
  private _orders: OrderEndpoint
  private _customers: CustomerEndpoint
  private _customerAddresses: CustomerAddressEndpoint
  private _events: EventEndpoint
  private _enums: EnumEndpoint
  private _cloudStorage: CloudStorageEndpoint
  private _layouts: LayoutEndpoint
  private _automaticProvisioning: AutomaticProvisioningEndpoint

  constructor(config: BillbeeConfig) {
    this.validateConfig(config)
    this.httpClient = new HttpClient(config)

    // Initialize all endpoints
    this._articles = new ArticleEndpoint(this.httpClient)
    this._orders = new OrderEndpoint(this.httpClient)
    this._customers = new CustomerEndpoint(this.httpClient)
    this._customerAddresses = new CustomerAddressEndpoint(this.httpClient)
    this._events = new EventEndpoint(this.httpClient)
    this._enums = new EnumEndpoint(this.httpClient)
    this._cloudStorage = new CloudStorageEndpoint(this.httpClient)
    this._layouts = new LayoutEndpoint(this.httpClient)
    this._automaticProvisioning = new AutomaticProvisioningEndpoint(this.httpClient)
  }

  /**
   * Access to Article/Product endpoints
   */
  articles(): ArticleEndpoint {
    return this._articles
  }

  /**
   * Access to Product endpoints (alias for articles() - PHP SDK compatibility)
   */
  products(): ArticleEndpoint {
    return this._articles
  }

  /**
   * Access to Order endpoints
   */
  orders(): OrderEndpoint {
    return this._orders
  }

  /**
   * Access to Customer endpoints
   */
  customers(): CustomerEndpoint {
    return this._customers
  }

  /**
   * Access to Customer Address endpoints
   */
  customerAddresses(): CustomerAddressEndpoint {
    return this._customerAddresses
  }

  /**
   * Access to Event endpoints
   */
  events(): EventEndpoint {
    return this._events
  }

  /**
   * Access to Enum endpoints (order states, payment types, etc.)
   */
  enums(): EnumEndpoint {
    return this._enums
  }

  /**
   * Access to Cloud Storage endpoints
   */
  cloudStorage(): CloudStorageEndpoint {
    return this._cloudStorage
  }

  /**
   * Access to Layout Template endpoints
   */
  layouts(): LayoutEndpoint {
    return this._layouts
  }

  /**
   * Access to Automatic Provisioning endpoints
   */
  automaticProvisioning(): AutomaticProvisioningEndpoint {
    return this._automaticProvisioning
  }

  /**
   * Enable batch mode - API calls will be queued instead of executed immediately
   * Use executeBatch() to execute all queued requests
   */
  enableBatchMode(): void {
    this.httpClient.enableBatchMode()
  }

  /**
   * Disable batch mode and return to normal operation
   */
  disableBatchMode(): void {
    this.httpClient.disableBatchMode()
  }

  /**
   * Execute all queued batch requests
   * Returns array of responses in the same order as requests were made
   */
  async executeBatch() {
    return await this.httpClient.executeBatch()
  }

  /**
   * Check if client is currently in batch mode
   */
  isBatchMode(): boolean {
    return this.httpClient.isBatchMode()
  }

  /**
   * Get number of queued batch requests
   */
  getBatchRequestCount(): number {
    return this.httpClient.getBatchRequestCount()
  }

  private validateConfig(config: BillbeeConfig): void {
    if (!config.username) {
      throw new Error('Username is required')
    }

    if (!config.apiPassword) {
      throw new Error('API password is required')
    }

    if (!config.apiKey) {
      throw new Error('API key is required')
    }
  }
}

// Export the client as default for convenience
export default BillbeeClient

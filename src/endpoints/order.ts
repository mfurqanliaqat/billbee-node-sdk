import { HttpClient } from '../http/client'
import {
  Order,
  ApiResponse,
  PagedApiResponse,
  OrderStateUpdate,
  AddShipmentModel,
  Invoice,
  Shipment
} from '../types'

export interface GetOrdersOptions {
  minOrderDate?: string
  maxOrderDate?: string
  page?: number
  pageSize?: number
  shopId?: number[]
  orderStateId?: number[]
  tag?: string[]
  minimumBillBeeOrderId?: number
  modifiedAtMin?: string
  modifiedAtMax?: string
  articleTitleSource?: 0 | 1 | 2 | 3
  excludeTags?: boolean
}

export interface GetInvoicesOptions {
  minInvoiceDate?: string
  maxInvoiceDate?: string
  page?: number
  pageSize?: number
  shopId?: number[]
  orderStateId?: number[]
  tag?: string[]
  minPayDate?: string
  maxPayDate?: string
  includePositions?: boolean
  excludeTags?: boolean
}

export interface CreateInvoiceOptions {
  includeInvoicePdf?: boolean
  templateId?: number
  sendToCloudId?: number
}

export interface CreateDeliveryNoteOptions {
  includePdf?: boolean
  sendToCloudId?: number
}

export interface SendMessageModel {
  Subject: string
  Body: string
  SendCopyToSeller?: boolean
}

export interface ParseTextContainer {
  Text: string
}

export interface TriggerEventContainer {
  Name: string
  DelayInMinutes?: number
}

export interface OrderTagCreate {
  Tags: string[]
}

/**
 * Order endpoint
 * Provides access to all order related operations
 */
export class OrderEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get a list of orders with optional filtering
   * @param options Filtering and pagination options
   */
  async getList(options: GetOrdersOptions = {}): Promise<PagedApiResponse<Order>> {
    const params = {
      page: options.page || 1,
      pageSize: Math.min(options.pageSize || 50, 250),
      ...(options.minOrderDate && { minOrderDate: options.minOrderDate }),
      ...(options.maxOrderDate && { maxOrderDate: options.maxOrderDate }),
      ...(options.shopId && { shopId: options.shopId }),
      ...(options.orderStateId && { orderStateId: options.orderStateId }),
      ...(options.tag && { tag: options.tag }),
      ...(options.minimumBillBeeOrderId && {
        minimumBillBeeOrderId: options.minimumBillBeeOrderId
      }),
      ...(options.modifiedAtMin && { modifiedAtMin: options.modifiedAtMin }),
      ...(options.modifiedAtMax && { modifiedAtMax: options.modifiedAtMax }),
      ...(options.articleTitleSource !== undefined && {
        articleTitleSource: options.articleTitleSource
      }),
      ...(options.excludeTags !== undefined && { excludeTags: options.excludeTags })
    }

    return await this.httpClient.get<PagedApiResponse<Order>>('/orders', params)
  }

  /**
   * Get a single order by id
   * @param id Order id
   * @param articleTitleSource Source for article titles (0=Order Position, 1=Article Title, 2=Article Invoice Text)
   */
  async get(id: number, articleTitleSource?: 0 | 1 | 2 | 3): Promise<ApiResponse<Order>> {
    const params = articleTitleSource !== undefined ? { articleTitleSource } : {}
    return await this.httpClient.get<ApiResponse<Order>>(`/orders/${id}`, params)
  }

  /**
   * Create a new order
   * @param order Order data to create
   * @param shopId Optional shop id
   */
  async create(order: Partial<Order>, shopId?: number): Promise<ApiResponse<Order>> {
    const url = shopId ? `/orders?shopId=${shopId}` : '/orders'
    return await this.httpClient.post<ApiResponse<Order>>(url, order)
  }

  /**
   * Update specific fields of an order
   * @param id Order id
   * @param orderData Partial order data to update
   */
  async patch(id: number, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return await this.httpClient.patch<ApiResponse<Order>>(`/orders/${id}`, orderData)
  }

  /**
   * Get list of patchable fields for orders
   */
  async getPatchableFields(): Promise<ApiResponse<string[]>> {
    return await this.httpClient.get<ApiResponse<string[]>>('/orders/PatchableFields')
  }

  /**
   * Find an order by external id and partner
   * @param id External order id
   * @param partner Partner/shop name
   */
  async findByExternalId(id: string, partner: string): Promise<ApiResponse<Order>> {
    const params = { id, partner }
    return await this.httpClient.get<ApiResponse<Order>>('/orders/find', params)
  }

  /**
   * Get order by external reference number
   * @param extRef External reference number
   */
  async getByExternalRef(extRef: string): Promise<ApiResponse<Order>> {
    return await this.httpClient.get<ApiResponse<Order>>(`/orders/findbyextref/${extRef}`)
  }

  /**
   * Update order state
   * @param id Order id
   * @param stateUpdate State update data
   */
  async updateState(id: number, stateUpdate: OrderStateUpdate): Promise<ApiResponse<void>> {
    return await this.httpClient.patch<ApiResponse<void>>(`/orders/${id}/orderstate`, stateUpdate)
  }

  /**
   * Add tags to an order
   * @param id Order id
   * @param tagData Tag data
   */
  async addTags(id: number, tagData: OrderTagCreate): Promise<ApiResponse<void>> {
    return await this.httpClient.post<ApiResponse<void>>(`/orders/${id}/tags`, tagData)
  }

  /**
   * Update/set tags for an order
   * @param id Order id
   * @param tagData Tag data
   */
  async updateTags(id: number, tagData: OrderTagCreate): Promise<ApiResponse<void>> {
    return await this.httpClient.put<ApiResponse<void>>(`/orders/${id}/tags`, tagData)
  }

  /**
   * Add a shipment to an order
   * @param id Order id
   * @param shipmentData Shipment data
   */
  async addShipment(id: number, shipmentData: AddShipmentModel): Promise<ApiResponse<Shipment>> {
    return await this.httpClient.post<ApiResponse<Shipment>>(`/orders/${id}/shipment`, shipmentData)
  }

  /**
   * Send a message to the buyer
   * @param id Order id
   * @param messageData Message data
   */
  async sendMessage(id: number, messageData: SendMessageModel): Promise<ApiResponse<void>> {
    return await this.httpClient.post<ApiResponse<void>>(`/orders/${id}/send-message`, messageData)
  }

  /**
   * Parse placeholders in text for an order
   * @param id Order id
   * @param textContainer Text with placeholders
   */
  async parsePlaceholders(
    id: number,
    textContainer: ParseTextContainer
  ): Promise<ApiResponse<string>> {
    return await this.httpClient.post<ApiResponse<string>>(
      `/orders/${id}/parse-placeholders`,
      textContainer
    )
  }

  /**
   * Trigger a rule event for an order
   * @param id Order id
   * @param eventContainer Event data
   */
  async triggerEvent(
    id: number,
    eventContainer: TriggerEventContainer
  ): Promise<ApiResponse<void>> {
    return await this.httpClient.post<ApiResponse<void>>(
      `/orders/${id}/trigger-event`,
      eventContainer
    )
  }

  /**
   * Create an invoice for an order
   * @param id Order id
   * @param options Invoice creation options
   */
  async createInvoice(
    id: number,
    options: CreateInvoiceOptions = {}
  ): Promise<ApiResponse<Invoice>> {
    const params = {
      ...(options.includeInvoicePdf !== undefined && {
        includeInvoicePdf: options.includeInvoicePdf
      }),
      ...(options.templateId && { templateId: options.templateId }),
      ...(options.sendToCloudId && { sendToCloudId: options.sendToCloudId })
    }

    const stringParams: Record<string, string> = {}
    Object.keys(params).forEach(key => {
      const value = (params as any)[key]
      if (value !== undefined) {
        stringParams[key] = String(value)
      }
    })
    const url = `/orders/${id}/createinvoice?${new URLSearchParams(stringParams).toString()}`
    return await this.httpClient.post<ApiResponse<Invoice>>(url, null)
  }

  /**
   * Create a delivery note for an order
   * @param id Order id
   * @param options Delivery note creation options
   */
  async createDeliveryNote(
    id: number,
    options: CreateDeliveryNoteOptions = {}
  ): Promise<ApiResponse<any>> {
    const params = {
      ...(options.includePdf !== undefined && { includePdf: options.includePdf }),
      ...(options.sendToCloudId && { sendToCloudId: options.sendToCloudId })
    }

    const stringParams: Record<string, string> = {}
    Object.keys(params).forEach(key => {
      const value = (params as any)[key]
      if (value !== undefined) {
        stringParams[key] = String(value)
      }
    })
    const url = `/orders/${id}/createdeliverynote?${new URLSearchParams(stringParams).toString()}`
    return await this.httpClient.post<ApiResponse<any>>(url, null)
  }

  /**
   * Get list of invoices with optional filtering
   * @param options Filtering and pagination options
   */
  async getInvoices(options: GetInvoicesOptions = {}): Promise<PagedApiResponse<Invoice>> {
    const params = {
      page: options.page || 1,
      pageSize: Math.min(options.pageSize || 50, 250),
      ...(options.minInvoiceDate && { minInvoiceDate: options.minInvoiceDate }),
      ...(options.maxInvoiceDate && { maxInvoiceDate: options.maxInvoiceDate }),
      ...(options.shopId && { shopId: options.shopId }),
      ...(options.orderStateId && { orderStateId: options.orderStateId }),
      ...(options.tag && { tag: options.tag }),
      ...(options.minPayDate && { minPayDate: options.minPayDate }),
      ...(options.maxPayDate && { maxPayDate: options.maxPayDate }),
      ...(options.includePositions !== undefined && { includePositions: options.includePositions }),
      ...(options.excludeTags !== undefined && { excludeTags: options.excludeTags })
    }

    return await this.httpClient.get<PagedApiResponse<Invoice>>('/orders/invoices', params)
  }

  // Convenience methods that mirror PHP SDK naming

  /**
   * Alias for getList() - mirrors PHP SDK method name
   */
  async getOrders(options: GetOrdersOptions = {}): Promise<PagedApiResponse<Order>> {
    return this.getList(options)
  }

  /**
   * Alias for get() - mirrors PHP SDK method name
   */
  async getOrder(id: number, articleTitleSource?: 0 | 1 | 2 | 3): Promise<ApiResponse<Order>> {
    return this.get(id, articleTitleSource)
  }

  /**
   * Alias for create() - mirrors PHP SDK method name
   */
  async postNewOrder(order: Partial<Order>, shopId?: number): Promise<ApiResponse<Order>> {
    return this.create(order, shopId)
  }

  /**
   * Alias for patch() - mirrors PHP SDK method name
   */
  async patchOrder(id: number, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.patch(id, orderData)
  }

  /**
   * Alias for addTags() - mirrors PHP SDK method name
   */
  async tagsCreate(id: number, tagData: OrderTagCreate): Promise<ApiResponse<void>> {
    return this.addTags(id, tagData)
  }

  /**
   * Alias for updateTags() - mirrors PHP SDK method name
   */
  async tagsUpdate(id: number, tagData: OrderTagCreate): Promise<ApiResponse<void>> {
    return this.updateTags(id, tagData)
  }

  /**
   * Alias for findByExternalId() - mirrors PHP SDK method name
   */
  async find(id: string, partner: string): Promise<ApiResponse<Order>> {
    return this.findByExternalId(id, partner)
  }
}

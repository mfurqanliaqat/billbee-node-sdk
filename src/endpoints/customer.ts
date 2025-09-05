import { HttpClient } from '../http/client'
import { Customer, ApiResponse, PagedApiResponse, Address, Order } from '../types'

export interface GetCustomersOptions {
  page?: number
  pageSize?: number
}

/**
 * Customer endpoint
 * Provides access to all customer related operations
 */
export class CustomerEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get a list of all customers
   * @param options Pagination options
   */
  async getList(options: GetCustomersOptions = {}): Promise<PagedApiResponse<Customer>> {
    const params = {
      page: options.page || 1,
      pageSize: Math.min(options.pageSize || 50, 250)
    }

    return await this.httpClient.get<PagedApiResponse<Customer>>('/customers', params)
  }

  /**
   * Get a single customer by id
   * @param id Customer id
   */
  async get(id: number): Promise<ApiResponse<Customer>> {
    return await this.httpClient.get<ApiResponse<Customer>>(`/customers/${id}`)
  }

  /**
   * Create a new customer
   * @param customer Customer data to create
   */
  async create(customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return await this.httpClient.post<ApiResponse<Customer>>('/customers', customer)
  }

  /**
   * Update a customer by id
   * @param id Customer id
   * @param customer Customer data to update
   */
  async update(id: number, customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return await this.httpClient.put<ApiResponse<Customer>>(`/customers/${id}`, customer)
  }

  /**
   * Get addresses for a customer
   * @param id Customer id
   * @param page Page number
   * @param pageSize Page size
   */
  async getAddresses(
    id: number,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PagedApiResponse<Address>> {
    const params = {
      page,
      pageSize: Math.min(pageSize, 250)
    }
    return await this.httpClient.get<PagedApiResponse<Address>>(
      `/customers/${id}/addresses`,
      params
    )
  }

  /**
   * Add an address to a customer
   * @param id Customer id
   * @param address Address data
   */
  async addAddress(id: number, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return await this.httpClient.post<ApiResponse<Address>>(`/customers/${id}/addresses`, address)
  }

  /**
   * Get orders for a customer
   * @param id Customer id
   * @param page Page number
   * @param pageSize Page size
   */
  async getOrders(
    id: number,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PagedApiResponse<Order>> {
    const params = {
      page,
      pageSize: Math.min(pageSize, 250)
    }
    return await this.httpClient.get<PagedApiResponse<Order>>(`/customers/${id}/orders`, params)
  }

  // Convenience methods that mirror PHP SDK naming

  /**
   * Alias for getList() - mirrors PHP SDK method name
   */
  async getAll(options: GetCustomersOptions = {}): Promise<PagedApiResponse<Customer>> {
    return this.getList(options)
  }

  /**
   * Alias for get() - mirrors PHP SDK method name
   */
  async getOne(id: number): Promise<ApiResponse<Customer>> {
    return this.get(id)
  }

  /**
   * Alias for getAddresses() - mirrors PHP SDK method name
   */
  async getCustomerAddresses(
    id: number,
    page?: number,
    pageSize?: number
  ): Promise<PagedApiResponse<Address>> {
    return this.getAddresses(id, page, pageSize)
  }

  /**
   * Alias for addAddress() - mirrors PHP SDK method name
   */
  async addCustomerAddress(id: number, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.addAddress(id, address)
  }

  /**
   * Alias for getOrders() - mirrors PHP SDK method name
   */
  async getCustomerOrders(
    id: number,
    page?: number,
    pageSize?: number
  ): Promise<PagedApiResponse<Order>> {
    return this.getOrders(id, page, pageSize)
  }
}

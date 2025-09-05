import { HttpClient } from '../http/client'
import { Address, ApiResponse, PagedApiResponse } from '../types'

export interface GetCustomerAddressesOptions {
  page?: number
  pageSize?: number
}

/**
 * Customer Address endpoint
 * Provides access to customer address operations
 */
export class CustomerAddressEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get a list of all customer addresses
   * @param options Pagination options
   */
  async getList(options: GetCustomerAddressesOptions = {}): Promise<PagedApiResponse<Address>> {
    const params = {
      page: options.page || 1,
      pageSize: Math.min(options.pageSize || 50, 250)
    }

    return await this.httpClient.get<PagedApiResponse<Address>>('/customer-addresses', params)
  }

  /**
   * Get a single customer address by id
   * @param id Address id
   */
  async get(id: number): Promise<ApiResponse<Address>> {
    return await this.httpClient.get<ApiResponse<Address>>(`/customer-addresses/${id}`)
  }

  /**
   * Create a new customer address
   * @param address Address data to create
   */
  async create(address: Partial<Address>): Promise<ApiResponse<Address>> {
    return await this.httpClient.post<ApiResponse<Address>>('/customer-addresses', address)
  }

  /**
   * Update a customer address by id
   * @param id Address id
   * @param address Address data to update
   */
  async update(id: number, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return await this.httpClient.put<ApiResponse<Address>>(`/customer-addresses/${id}`, address)
  }

  /**
   * Patch a customer address by id
   * @param id Address id
   * @param address Partial address data to update
   */
  async patch(id: number, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return await this.httpClient.patch<ApiResponse<Address>>(`/customer-addresses/${id}`, address)
  }

  // Convenience methods that mirror PHP SDK naming

  /**
   * Alias for getList() - mirrors PHP SDK method name
   */
  async getAll(options: GetCustomerAddressesOptions = {}): Promise<PagedApiResponse<Address>> {
    return this.getList(options)
  }

  /**
   * Alias for get() - mirrors PHP SDK method name
   */
  async getOne(id: number): Promise<ApiResponse<Address>> {
    return this.get(id)
  }

  /**
   * Alias for update() - mirrors PHP SDK method name
   */
  async updateAddress(id: number, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.update(id, address)
  }

  /**
   * Alias for patch() - mirrors PHP SDK method name
   */
  async patchAddress(id: number, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.patch(id, address)
  }
}


import { HttpClient } from '../http/client'
import { ApiResponse } from '../types'

export interface OrderStateEnum {
  Id: number
  Name: string
  Description: string
}

export interface PaymentTypeEnum {
  Id: number
  Name: string
  Description: string
}

export interface ShippingCarrierEnum {
  Id: number
  Name: string
  Description: string
}

/**
 * Enum endpoint
 * Provides access to system enumerations and reference data
 */
export class EnumEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get list of all order states
   */
  async getOrderStates(): Promise<ApiResponse<OrderStateEnum[]>> {
    return await this.httpClient.get<ApiResponse<OrderStateEnum[]>>('/enums/orderstates')
  }

  /**
   * Get list of all payment types
   */
  async getPaymentTypes(): Promise<ApiResponse<PaymentTypeEnum[]>> {
    return await this.httpClient.get<ApiResponse<PaymentTypeEnum[]>>('/enums/paymenttypes')
  }

  /**
   * Get list of all shipping carriers
   */
  async getShippingCarriers(): Promise<ApiResponse<ShippingCarrierEnum[]>> {
    return await this.httpClient.get<ApiResponse<ShippingCarrierEnum[]>>('/enums/shippingcarriers')
  }
}

import { HttpClient } from '../http/client'
import { LayoutTemplate, ApiResponse } from '../types'

/**
 * Layout endpoint
 * Provides access to layout templates for invoices, delivery notes, etc.
 */
export class LayoutEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get list of all layout templates
   */
  async getList(): Promise<ApiResponse<LayoutTemplate[]>> {
    return await this.httpClient.get<ApiResponse<LayoutTemplate[]>>('/layouts')
  }
}

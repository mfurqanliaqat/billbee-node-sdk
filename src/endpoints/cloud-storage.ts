import { HttpClient } from '../http/client'
import { CloudStorage, ApiResponse } from '../types'

/**
 * Cloud Storage endpoint
 * Provides access to connected cloud storage devices
 */
export class CloudStorageEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get list of all connected cloud storage devices
   */
  async getList(): Promise<ApiResponse<CloudStorage[]>> {
    return await this.httpClient.get<ApiResponse<CloudStorage[]>>('/cloudstorages')
  }
}

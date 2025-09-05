import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { BillbeeConfig, BatchRequest, BatchResponse } from '../types'

export class HttpClient {
  private client: AxiosInstance
  private batchMode: boolean = false
  private batchRequests: BatchRequest[] = []

  constructor(private config: BillbeeConfig) {
    const baseUrl = config.baseUrl || 'https://app.billbee.io/api/v1'

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Billbee-Api-Key': config.apiKey,
        'User-Agent': 'billbee-node-sdk/1.0.0'
      },
      auth: {
        username: config.username,
        password: config.apiPassword
      }
    })

    // Request interceptor for logging and rate limiting
    this.client.interceptors.request.use(
      config => {
        // Add timestamp for rate limiting tracking
        config.metadata = { startTime: new Date() }
        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor for error handling and rate limiting
    this.client.interceptors.response.use(
      response => {
        const endTime = new Date()
        const startTime = response.config.metadata?.startTime
        if (startTime) {
          const duration = endTime.getTime() - startTime.getTime()
          console.debug(
            `API call took ${duration}ms: ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`
          )
        }
        return response
      },
      error => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after']
          throw new Error(`Rate limit exceeded. Retry after ${retryAfter || 'unknown'} seconds`)
        }

        if (error.response?.status === 401) {
          throw new Error('Authentication failed. Check your API credentials.')
        }

        if (error.response?.status === 403) {
          throw new Error('Access forbidden. Check your API permissions.')
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Enable batch mode - requests will be queued instead of executed immediately
   */
  enableBatchMode(): void {
    this.batchMode = true
    this.batchRequests = []
  }

  /**
   * Disable batch mode and return to normal operation
   */
  disableBatchMode(): void {
    this.batchMode = false
    this.batchRequests = []
  }

  /**
   * Execute all queued batch requests
   */
  async executeBatch(): Promise<BatchResponse[]> {
    if (!this.batchMode || this.batchRequests.length === 0) {
      return []
    }

    const results: BatchResponse[] = []

    // Execute requests in parallel with concurrency limit
    const concurrencyLimit = 5
    const chunks = this.chunkArray(this.batchRequests, concurrencyLimit)

    for (const chunk of chunks) {
      const promises = chunk.map(async (request): Promise<BatchResponse> => {
        try {
          const response = await this.client.request({
            method: request.method,
            url: request.url,
            data: request.data
          })

          return {
            success: true,
            data: response.data,
            statusCode: response.status
          }
        } catch (error: any) {
          return {
            success: false,
            error: error.message || 'Request failed',
            statusCode: error.response?.status || 500
          }
        }
      })

      const chunkResults = await Promise.all(promises)
      results.push(...chunkResults)
    }

    // Clear batch requests after execution
    this.batchRequests = []

    return results
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, params?: any): Promise<T> {
    if (this.batchMode) {
      this.batchRequests.push({
        method: 'GET',
        url: this.buildUrl(url, params)
      })
      return null as any // In batch mode, return null immediately
    }

    const response: AxiosResponse<T> = await this.client.get(url, { params })
    return response.data
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    if (this.batchMode) {
      this.batchRequests.push({
        method: 'POST',
        url,
        data
      })
      return null as any // In batch mode, return null immediately
    }

    const response: AxiosResponse<T> = await this.client.post(url, data)
    return response.data
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    if (this.batchMode) {
      this.batchRequests.push({
        method: 'PUT',
        url,
        data
      })
      return null as any // In batch mode, return null immediately
    }

    const response: AxiosResponse<T> = await this.client.put(url, data)
    return response.data
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any): Promise<T> {
    if (this.batchMode) {
      this.batchRequests.push({
        method: 'PATCH',
        url,
        data
      })
      return null as any // In batch mode, return null immediately
    }

    const response: AxiosResponse<T> = await this.client.patch(url, data)
    return response.data
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string): Promise<T> {
    if (this.batchMode) {
      this.batchRequests.push({
        method: 'DELETE',
        url
      })
      return null as any // In batch mode, return null immediately
    }

    const response: AxiosResponse<T> = await this.client.delete(url)
    return response.data
  }

  /**
   * Check if currently in batch mode
   */
  isBatchMode(): boolean {
    return this.batchMode
  }

  /**
   * Get number of queued batch requests
   */
  getBatchRequestCount(): number {
    return this.batchRequests.length
  }

  private buildUrl(url: string, params?: any): string {
    if (!params) return url

    const searchParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key].toString())
      }
    })

    return `${url}?${searchParams.toString()}`
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date
    }
  }
}

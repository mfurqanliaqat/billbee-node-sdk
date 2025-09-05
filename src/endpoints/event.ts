import { HttpClient } from '../http/client'
import { Event, PagedApiResponse } from '../types'

export interface GetEventsOptions {
  minDate?: string
  maxDate?: string
  page?: number
  pageSize?: number
  typeId?: number[]
  orderId?: number
}

/**
 * Event endpoint
 * Provides access to system events and activity logs
 */
export class EventEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get a list of events with optional filtering
   * This request is extra throttled to 2 calls per page per hour
   * @param options Filtering and pagination options
   */
  async getList(options: GetEventsOptions = {}): Promise<PagedApiResponse<Event>> {
    const params = {
      page: options.page || 1,
      pageSize: Math.min(options.pageSize || 50, 250),
      ...(options.minDate && { minDate: options.minDate }),
      ...(options.maxDate && { maxDate: options.maxDate }),
      ...(options.typeId && { typeId: options.typeId }),
      ...(options.orderId && { orderId: options.orderId })
    }

    return await this.httpClient.get<PagedApiResponse<Event>>('/events', params)
  }

  // Convenience methods that mirror PHP SDK naming

  /**
   * Alias for getList() - mirrors PHP SDK method name
   */
  async getEvents(options: GetEventsOptions = {}): Promise<PagedApiResponse<Event>> {
    return this.getList(options)
  }
}

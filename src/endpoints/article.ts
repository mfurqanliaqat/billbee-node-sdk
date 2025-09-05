import { HttpClient } from '../http/client'
import {
  Article,
  ApiResponse,
  PagedApiResponse,
  UpdateStockModel,
  UpdateStockCodeModel,
  ArticleImage,
  ArticleCustomField
} from '../types'

export interface GetArticlesOptions {
  page?: number
  pageSize?: number
  minCreatedAt?: string
}

export interface GetReservedAmountOptions {
  lookupBy?: 'id' | 'sku' | 'ean'
  stockId?: number
}

export interface GetReservedAmountResponse {
  ReservedAmount: number
  Article: Article
}

export interface UpdateStockResponse {
  Message: string
  CurrentStock: number
  UnfulfilledAmount: number
  NewStock: number
}

export interface UpdateStockCodeResponse {
  Message: string
  CurrentStockCode: number
  NewStockCode: number
}

export interface DeletedImagesModel {
  DeletedImageIds: number[]
  NotFoundImageIds: number[]
}

/**
 * Article/Product endpoint
 * Provides access to all article/product related operations
 */
export class ArticleEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get a list of all products
   * @param options Pagination and filtering options
   */
  async getList(options: GetArticlesOptions = {}): Promise<PagedApiResponse<Article>> {
    const params = {
      page: options.page || 1,
      pageSize: Math.min(options.pageSize || 50, 250),
      ...(options.minCreatedAt && { minCreatedAt: options.minCreatedAt })
    }

    return await this.httpClient.get<PagedApiResponse<Article>>('/products', params)
  }

  /**
   * Get a single article by id, sku, or ean
   * @param id The id, sku, or ean of the article
   * @param lookupBy Specify whether id is 'id', 'sku', or 'ean'
   */
  async get(
    id: string | number,
    lookupBy: 'id' | 'sku' | 'ean' = 'id'
  ): Promise<ApiResponse<Article>> {
    const params = lookupBy !== 'id' ? { lookupBy } : {}
    return await this.httpClient.get<ApiResponse<Article>>(`/products/${id}`, params)
  }

  /**
   * Create a new article
   * @param article Article data to create
   */
  async create(article: Partial<Article>): Promise<ApiResponse<Article>> {
    return await this.httpClient.post<ApiResponse<Article>>('/products', article)
  }

  /**
   * Update an article by id
   * @param id Article id
   * @param article Partial article data to update
   */
  async patch(id: number, article: Partial<Article>): Promise<ApiResponse<Article>> {
    return await this.httpClient.patch<ApiResponse<Article>>(`/products/${id}`, article)
  }

  /**
   * Delete an article
   * @param id Article id to delete
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return await this.httpClient.delete<ApiResponse<void>>(`/products/${id}`)
  }

  /**
   * Get list of patchable fields for articles
   */
  async getPatchableFields(): Promise<ApiResponse<string[]>> {
    return await this.httpClient.get<ApiResponse<string[]>>('/products/PatchableFields')
  }

  /**
   * Get list of all article categories
   */
  async getCategories(): Promise<ApiResponse<any[]>> {
    return await this.httpClient.get<ApiResponse<any[]>>('/products/category')
  }

  /**
   * Get list of custom fields
   * @param page Page number
   * @param pageSize Page size
   */
  async getCustomFields(
    page: number = 1,
    pageSize: number = 50
  ): Promise<PagedApiResponse<ArticleCustomField>> {
    const params = { page, pageSize: Math.min(pageSize, 250) }
    return await this.httpClient.get<PagedApiResponse<ArticleCustomField>>(
      '/products/custom-fields',
      params
    )
  }

  /**
   * Get a single custom field by id
   * @param id Custom field id
   */
  async getCustomField(id: number): Promise<ApiResponse<ArticleCustomField>> {
    return await this.httpClient.get<ApiResponse<ArticleCustomField>>(
      `/products/custom-fields/${id}`
    )
  }

  /**
   * Get images for an article
   * @param articleId Article id
   */
  async getImages(articleId: number): Promise<ApiResponse<ArticleImage[]>> {
    return await this.httpClient.get<ApiResponse<ArticleImage[]>>(`/products/${articleId}/images`)
  }

  /**
   * Get a single image by id
   * @param imageId Image id
   */
  async getImage(imageId: number): Promise<ApiResponse<ArticleImage>> {
    return await this.httpClient.get<ApiResponse<ArticleImage>>(`/products/images/${imageId}`)
  }

  /**
   * Delete a single image
   * @param imageId Image id to delete
   */
  async deleteImage(imageId: number): Promise<ApiResponse<void>> {
    return await this.httpClient.delete<ApiResponse<void>>(`/products/images/${imageId}`)
  }

  /**
   * Delete multiple images
   * @param imageIds Array of image ids to delete
   */
  async deleteImages(imageIds: number[]): Promise<ApiResponse<DeletedImagesModel>> {
    return await this.httpClient.post<ApiResponse<DeletedImagesModel>>('/products/images/delete', {
      imageIds
    })
  }

  /**
   * Get reserved amount for an article
   * @param id Article id, sku, or ean
   * @param options Options for lookup and stock id
   */
  async getReservedAmount(
    id: string | number,
    options: GetReservedAmountOptions = {}
  ): Promise<ApiResponse<GetReservedAmountResponse>> {
    const params = {
      ...(options.lookupBy && { lookupBy: options.lookupBy }),
      ...(options.stockId && { stockId: options.stockId })
    }
    return await this.httpClient.get<ApiResponse<GetReservedAmountResponse>>(
      `/products/reservedamount/${id}`,
      params
    )
  }

  /**
   * Update stock for a single article
   * @param stockUpdate Stock update data
   */
  async updateStock(stockUpdate: UpdateStockModel): Promise<ApiResponse<UpdateStockResponse>> {
    return await this.httpClient.post<ApiResponse<UpdateStockResponse>>(
      '/products/updatestock',
      stockUpdate
    )
  }

  /**
   * Update stock for multiple articles
   * @param stockUpdates Array of stock update data
   */
  async updateStockMultiple(
    stockUpdates: UpdateStockModel[]
  ): Promise<ApiResponse<UpdateStockResponse>[]> {
    return await this.httpClient.post<ApiResponse<UpdateStockResponse>[]>(
      '/products/updatestockmultiple',
      stockUpdates
    )
  }

  /**
   * Update stock code for an article
   * @param stockCodeUpdate Stock code update data
   */
  async updateStockCode(
    stockCodeUpdate: UpdateStockCodeModel
  ): Promise<ApiResponse<UpdateStockCodeResponse>> {
    return await this.httpClient.post<ApiResponse<UpdateStockCodeResponse>>(
      '/products/updatestockcode',
      stockCodeUpdate
    )
  }

  /**
   * Upload an image for an article
   * @param articleId Article id
   * @param imageData Base64 encoded image data or Buffer
   * @param position Image position (optional)
   * @param isDefault Whether this is the default image (optional)
   */
  async uploadImage(
    articleId: number,
    imageData: string | Buffer,
    position?: number,
    isDefault?: boolean
  ): Promise<ApiResponse<ArticleImage>> {
    const data = {
      ArticleId: articleId,
      ImageData: Buffer.isBuffer(imageData) ? imageData.toString('base64') : imageData,
      ...(position !== undefined && { Position: position }),
      ...(isDefault !== undefined && { IsDefault: isDefault })
    }

    return await this.httpClient.post<ApiResponse<ArticleImage>>(
      `/products/${articleId}/images`,
      data
    )
  }

  /**
   * Update an image
   * @param imageId Image id
   * @param imageData Updated image data
   */
  async updateImage(
    imageId: number,
    imageData: Partial<ArticleImage>
  ): Promise<ApiResponse<ArticleImage>> {
    return await this.httpClient.patch<ApiResponse<ArticleImage>>(
      `/products/images/${imageId}`,
      imageData
    )
  }

  // Convenience methods that mirror PHP SDK naming

  /**
   * Alias for getList() - mirrors PHP SDK method name
   */
  async getProducts(
    page: number = 1,
    pageSize: number = 50,
    minCreatedAt?: string
  ): Promise<PagedApiResponse<Article>> {
    return this.getList({ page, pageSize, minCreatedAt })
  }

  /**
   * Alias for get() - mirrors PHP SDK method name
   */
  async getProduct(
    id: string | number,
    lookupBy: 'id' | 'sku' | 'ean' = 'id'
  ): Promise<ApiResponse<Article>> {
    return this.get(id, lookupBy)
  }

  /**
   * Alias for create() - mirrors PHP SDK method name
   */
  async createArticle(article: Partial<Article>): Promise<ApiResponse<Article>> {
    return this.create(article)
  }

  /**
   * Alias for patch() - mirrors PHP SDK method name
   */
  async patchArticle(id: number, article: Partial<Article>): Promise<ApiResponse<Article>> {
    return this.patch(id, article)
  }

  /**
   * Alias for delete() - mirrors PHP SDK method name
   */
  async deleteArticle(id: number): Promise<ApiResponse<void>> {
    return this.delete(id)
  }
}

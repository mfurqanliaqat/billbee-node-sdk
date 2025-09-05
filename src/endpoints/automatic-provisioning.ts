import { HttpClient } from '../http/client'
import { ApiResponse } from '../types'

export interface CreateAccountModel {
  EMail: string
  AcceptTerms?: boolean
  AffiliateCouponCode?: string
}

export interface TermsInfo {
  TermsUrl: string
  PrivacyPolicyUrl: string
  LastUpdated: string
}

/**
 * Automatic Provisioning endpoint
 * Provides access to account creation and terms information
 */
export class AutomaticProvisioningEndpoint {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create a new Billbee user account
   * @param accountData Account creation data
   */
  async createAccount(accountData: CreateAccountModel): Promise<ApiResponse<any>> {
    return await this.httpClient.post<ApiResponse<any>>(
      '/automaticprovisioning/CreateAccount',
      accountData
    )
  }

  /**
   * Get information about Billbee terms and conditions
   */
  async getTermsInfo(): Promise<ApiResponse<TermsInfo>> {
    return await this.httpClient.get<ApiResponse<TermsInfo>>('/automaticprovisioning/TermsInfo')
  }
}

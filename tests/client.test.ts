import { BillbeeClient } from '../src/client'
import { BillbeeConfig } from '../src/types'

describe('BillbeeClient', () => {
  const validConfig: BillbeeConfig = {
    username: 'test-user',
    apiPassword: 'test-password',
    apiKey: 'test-key'
  }

  describe('Constructor', () => {
    it('should create client with valid config', () => {
      const client = new BillbeeClient(validConfig)
      expect(client).toBeInstanceOf(BillbeeClient)
    })

    it('should throw error without username', () => {
      const invalidConfig = { ...validConfig, username: '' }
      expect(() => new BillbeeClient(invalidConfig)).toThrow('Username is required')
    })

    it('should throw error without apiPassword', () => {
      const invalidConfig = { ...validConfig, apiPassword: '' }
      expect(() => new BillbeeClient(invalidConfig)).toThrow('API password is required')
    })

    it('should throw error without apiKey', () => {
      const invalidConfig = { ...validConfig, apiKey: '' }
      expect(() => new BillbeeClient(invalidConfig)).toThrow('API key is required')
    })
  })

  describe('Endpoint Access', () => {
    let client: BillbeeClient

    beforeEach(() => {
      client = new BillbeeClient(validConfig)
    })

    it('should provide access to articles endpoint', () => {
      expect(client.articles()).toBeDefined()
    })

    it('should provide access to orders endpoint', () => {
      expect(client.orders()).toBeDefined()
    })

    it('should provide access to customers endpoint', () => {
      expect(client.customers()).toBeDefined()
    })

    it('should provide access to customerAddresses endpoint', () => {
      expect(client.customerAddresses()).toBeDefined()
    })

    it('should provide access to events endpoint', () => {
      expect(client.events()).toBeDefined()
    })

    it('should provide access to enums endpoint', () => {
      expect(client.enums()).toBeDefined()
    })

    it('should provide access to cloudStorage endpoint', () => {
      expect(client.cloudStorage()).toBeDefined()
    })

    it('should provide access to layouts endpoint', () => {
      expect(client.layouts()).toBeDefined()
    })

    it('should provide access to automaticProvisioning endpoint', () => {
      expect(client.automaticProvisioning()).toBeDefined()
    })
  })

  describe('Batch Mode', () => {
    let client: BillbeeClient

    beforeEach(() => {
      client = new BillbeeClient(validConfig)
    })

    it('should start in normal mode', () => {
      expect(client.isBatchMode()).toBe(false)
      expect(client.getBatchRequestCount()).toBe(0)
    })

    it('should enable batch mode', () => {
      client.enableBatchMode()
      expect(client.isBatchMode()).toBe(true)
    })

    it('should disable batch mode', () => {
      client.enableBatchMode()
      client.disableBatchMode()
      expect(client.isBatchMode()).toBe(false)
    })

    it('should return empty array when executing empty batch', async () => {
      client.enableBatchMode()
      const results = await client.executeBatch()
      expect(results).toEqual([])
    })
  })
})

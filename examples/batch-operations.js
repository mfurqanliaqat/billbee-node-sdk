const { BillbeeClient } = require('billbee-node-sdk')

const client = new BillbeeClient({
  username: 'YOUR_BILLBEE_USERNAME',
  apiPassword: 'YOUR_API_PASSWORD',
  apiKey: 'YOUR_API_KEY'
})

async function batchExample() {
  try {
    console.log('🚀 Billbee Batch Operations Example\n')

    console.log('📦 Enabling batch mode...')
    client.enableBatchMode()

    console.log('📋 Queuing multiple requests...')

    // These will be queued, not executed immediately
    const products = client.articles().getProducts(1, 10)
    const orders = client.orders().getOrders({ page: 1, pageSize: 10 })
    const customers = client.customers().getAll({ page: 1, pageSize: 10 })
    const events = client.events().getEvents({ page: 1, pageSize: 5 })

    console.log(`📊 Queued ${client.getBatchRequestCount()} requests`)

    console.log('⚡ Executing batch requests...')
    const startTime = Date.now()
    const results = await client.executeBatch()
    const endTime = Date.now()

    console.log(`✅ Batch completed in ${endTime - startTime}ms`)
    console.log(`📊 Results: ${results.length} responses\n`)

    // Process results
    results.forEach((result, index) => {
      const endpoints = ['products', 'orders', 'customers', 'events']
      console.log(`${index + 1}. ${endpoints[index]}:`)

      if (result.success) {
        const data = result.data?.Data || result.data
        const count = Array.isArray(data) ? data.length : 'N/A'
        console.log(`   ✅ Success - ${count} items`)
      } else {
        console.log(`   ❌ Failed - ${result.error}`)
      }
    })

    console.log('\n📦 Disabling batch mode...')
    client.disableBatchMode()

    console.log('✨ Batch example completed!')
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Run the example
batchExample()

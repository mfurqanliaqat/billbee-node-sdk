const { BillbeeClient } = require('billbee-node-sdk')

// Initialize client
const client = new BillbeeClient({
  username: 'YOUR_BILLBEE_USERNAME',
  apiPassword: 'YOUR_API_PASSWORD',
  apiKey: 'YOUR_API_KEY'
})

async function basicExample() {
  try {
    console.log('🚀 Billbee Node.js SDK Example\n')

    // Get products
    console.log('📦 Fetching products...')
    const productsResponse = await client.articles().getProducts(1, 5)

    if (productsResponse.ErrorCode === 0) {
      console.log(`✅ Found ${productsResponse.Data.length} products`)
      productsResponse.Data.forEach(product => {
        console.log(`   - ${product.Title} (SKU: ${product.SKU}) - €${product.Price}`)
      })
    } else {
      console.log(`❌ Error fetching products: ${productsResponse.ErrorMessage}`)
    }

    console.log('\n📋 Fetching orders...')
    const ordersResponse = await client.orders().getOrders({ page: 1, pageSize: 5 })

    if (ordersResponse.ErrorCode === 0) {
      console.log(`✅ Found ${ordersResponse.Data.length} orders`)
      ordersResponse.Data.forEach(order => {
        console.log(`   - Order #${order.OrderNumber} - €${order.TotalCost} (${order.State})`)
      })
    } else {
      console.log(`❌ Error fetching orders: ${ordersResponse.ErrorMessage}`)
    }

    console.log('\n👥 Fetching customers...')
    const customersResponse = await client.customers().getAll({ page: 1, pageSize: 5 })

    if (customersResponse.ErrorCode === 0) {
      console.log(`✅ Found ${customersResponse.Data.length} customers`)
      customersResponse.Data.forEach(customer => {
        console.log(`   - ${customer.Name} (${customer.Email})`)
      })
    } else {
      console.log(`❌ Error fetching customers: ${customersResponse.ErrorMessage}`)
    }
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Run the example
basicExample()

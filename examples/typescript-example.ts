import { BillbeeClient, Article, Order, Customer, OrderState, PaymentMethod } from '../src'

const client = new BillbeeClient({
  username: 'YOUR_BILLBEE_USERNAME',
  apiPassword: 'YOUR_API_PASSWORD',
  apiKey: 'YOUR_API_KEY'
})

async function typescriptExample(): Promise<void> {
  try {
    console.log('🚀 Billbee TypeScript Example\n')

    // Type-safe product creation
    console.log('📦 Creating a new product...')
    const newProductData: Partial<Article> = {
      Title: 'TypeScript Test Product',
      SKU: 'TS-001',
      Price: 49.99,
      StockCurrent: 25,
      VatIndex: 1,
      Type: 0, // Product type
      IsDigital: false,
      Description: 'A test product created with TypeScript'
    }

    const productResponse = await client.articles().createArticle(newProductData)

    if (productResponse.ErrorCode === 0) {
      const product: Article = productResponse.Data
      console.log(`✅ Created product: ${product.Title} (ID: ${product.Id})`)

      // Update stock with type safety
      await client.articles().updateStock({
        SKU: product.SKU,
        Stock: 50
      })
      console.log('📈 Updated stock to 50 units')
    } else {
      console.log(`❌ Failed to create product: ${productResponse.ErrorMessage}`)
    }

    // Type-safe order operations
    console.log('\n📋 Working with orders...')
    const ordersResponse = await client.orders().getOrders({
      page: 1,
      pageSize: 5,
      orderStateId: [OrderState.Ordered, OrderState.Confirmed, OrderState.Paid]
    })

    if (ordersResponse.ErrorCode === 0) {
      console.log(`✅ Found ${ordersResponse.Data.length} orders`)

      for (const order of ordersResponse.Data) {
        console.log(`   Order #${order.OrderNumber}:`)
        console.log(`     State: ${OrderState[order.State]}`)
        console.log(`     Total: €${order.TotalCost}`)
        console.log(`     Items: ${order.OrderItems.length}`)

        // Type-safe order item processing
        order.OrderItems.forEach((item, index) => {
          console.log(
            `       ${index + 1}. ${item.Product.Title} x${item.Quantity} = €${item.TotalPrice}`
          )
        })
      }
    }

    // Type-safe customer operations
    console.log('\n👥 Working with customers...')
    const customersResponse = await client.customers().getAll({ page: 1, pageSize: 3 })

    if (customersResponse.ErrorCode === 0) {
      const customers: Customer[] = customersResponse.Data

      for (const customer of customers) {
        console.log(`   Customer: ${customer.Name} (${customer.Email})`)

        // Get customer orders with full type safety
        const customerOrdersResponse = await client.customers().getCustomerOrders(customer.Id, 1, 5)

        if (customerOrdersResponse.ErrorCode === 0) {
          console.log(`     Orders: ${customerOrdersResponse.Data.length}`)
        }
      }
    }

    // Enum usage
    console.log('\n🔢 Using enums...')
    const orderStatesResponse = await client.enums().getOrderStates()

    if (orderStatesResponse.ErrorCode === 0) {
      console.log('📊 Available order states:')
      orderStatesResponse.Data.forEach(state => {
        console.log(`   ${state.Id}: ${state.Name}`)
      })
    }

    console.log('\n✨ TypeScript example completed!')
  } catch (error) {
    console.error('💥 Error:', error instanceof Error ? error.message : String(error))
  }
}

// Run the example
typescriptExample()

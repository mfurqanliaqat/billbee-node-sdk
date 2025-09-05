# Billbee Node.js SDK

🔌 **The comprehensive Billbee API SDK for Node.js** 💻

[![npm version](https://badge.fury.io/js/billbee-node-sdk.svg)](https://badge.fury.io/js/billbee-node-sdk)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript/Node.js SDK for the Billbee API, providing full access to all Billbee functionality with type safety and modern JavaScript features.

## 🚀 Features

- **Complete API Coverage** - All Billbee API endpoints supported
- **TypeScript First** - Full type safety with comprehensive type definitions
- **PHP SDK Compatible** - Method names and patterns match the official PHP SDK
- **Batch Operations** - Execute multiple API calls efficiently
- **Modern Async/Await** - Promise-based API with async/await support
- **Automatic Rate Limiting** - Built-in handling of API rate limits
- **Error Handling** - Comprehensive error handling and reporting
- **Extensible** - Easy to extend and customize

## 📦 Installation

```bash
npm install billbee-node-sdk
```

## 🔧 Prerequisites

- Node.js 16+
- A Billbee account with API access enabled
- API credentials (username, API password, and API key)

### Getting API Credentials

1. **Enable API Access**: Go to Settings → API in your Billbee account
2. **API Key**: Contact Billbee support (support@billbee.de) to get an API key
3. **API Password**: Generate an API password in your Billbee account settings

## 🚀 Quick Start

```typescript
import { BillbeeClient } from 'billbee-node-sdk'

const client = new BillbeeClient({
  username: 'YOUR_BILLBEE_USERNAME',
  apiPassword: 'YOUR_API_PASSWORD',
  apiKey: 'YOUR_API_KEY'
})

// Get products (PHP-compatible alias)
const products = await client.products().getProducts()
console.log(`Found ${products.Data.length} products`)

// Alternative: semantic method names
// const products = await client.articles().getList()

// Get orders
const orders = await client.orders().getOrders({ page: 1, pageSize: 10 })
console.log(`Found ${orders.Data.length} orders`)
```

## 📚 API Documentation

### Articles/Products

```typescript
// Get all products (PHP-compatible)
const products = await client.products().getProducts((page = 1), (pageSize = 50))
// Alternative: client.articles().getProducts() or client.articles().getList()

// Get single product (PHP-compatible)
const product = await client.products().getProduct(123) // by ID
const product = await client.products().getProduct('SKU-123', 'sku') // by SKU
const product = await client.products().getProduct('1234567890123', 'ean') // by EAN

// Create product (PHP-compatible)
const newProduct = await client.products().createArticle({
  Title: 'New Product',
  SKU: 'NEW-001',
  Price: 29.99,
  StockCurrent: 100,
  VatIndex: 1
})

// Update product (PHP-compatible)
await client.products().patchArticle(123, {
  Price: 34.99,
  StockCurrent: 75
})

// Update stock
await client.articles().updateStock({
  SKU: 'PRODUCT-001',
  Stock: 50
})

// Get product images
const images = await client.articles().getImages(123)

// Upload image
await client.articles().uploadImage(123, base64ImageData, 1, true)
```

### Orders

```typescript
// Get orders with filtering
const orders = await client.orders().getOrders({
  minOrderDate: '2023-01-01',
  maxOrderDate: '2023-12-31',
  orderStateId: [1, 2, 3], // ordered, confirmed, paid
  page: 1,
  pageSize: 50
})

// Get single order
const order = await client.orders().getOrder(12345)

// Create order
const newOrder = await client.orders().postNewOrder({
  OrderNumber: 'ORDER-001',
  Buyer: {
    Email: 'customer@example.com',
    FirstName: 'John',
    LastName: 'Doe'
  },
  OrderItems: [
    {
      Product: { Id: 123 },
      Quantity: 2,
      TotalPrice: 59.98
    }
  ]
})

// Update order state
await client.orders().updateState(12345, {
  NewStateId: 3, // paid
  Comment: 'Payment received'
})

// Add shipment
await client.orders().addShipment(12345, {
  ShippingId: 'TRACK123',
  ShippingProviderName: 'DHL',
  TrackingNumber: 'TRACK123'
})

// Create invoice
const invoice = await client.orders().createInvoice(12345, {
  includeInvoicePdf: true
})

// Send message to customer
await client.orders().sendMessage(12345, {
  Subject: 'Order Update',
  Body: 'Your order has been processed.'
})
```

### Customers

```typescript
// Get customers
const customers = await client.customers().getAll()

// Get single customer
const customer = await client.customers().getOne(123)

// Create customer
const newCustomer = await client.customers().create({
  Name: 'John Doe',
  Email: 'john@example.com',
  Type: 0 // Consumer
})

// Get customer addresses
const addresses = await client.customers().getCustomerAddresses(123)

// Get customer orders
const customerOrders = await client.customers().getCustomerOrders(123)
```

### Events

```typescript
// Get events (throttled to 2 calls per page per hour)
const events = await client.events().getEvents({
  minDate: '2023-01-01',
  maxDate: '2023-12-31',
  typeId: [1, 2, 3], // specific event types
  orderId: 12345
})
```

### Enums & Reference Data

```typescript
// Get order states
const orderStates = await client.enums().getOrderStates()

// Get payment types
const paymentTypes = await client.enums().getPaymentTypes()

// Get shipping carriers
const carriers = await client.enums().getShippingCarriers()
```

## 🔄 Batch Operations

Execute multiple API calls efficiently:

```typescript
// Enable batch mode
client.enableBatchMode()

// Queue multiple requests
client.articles().getProducts(1, 10) // Returns null in batch mode
client.orders().getOrders({ page: 1 }) // Returns null in batch mode
client.customers().getAll() // Returns null in batch mode

// Execute all queued requests
const results = await client.executeBatch()

// results[0] = products response
// results[1] = orders response
// results[2] = customers response

// Disable batch mode
client.disableBatchMode()
```

## 🔄 PHP SDK Compatibility

This SDK provides full compatibility with the [official PHP SDK](https://github.com/billbeeio/billbee-php-sdk) method names and patterns:

```typescript
// PHP SDK style
const client = new BillbeeClient(config)
const products = await client.products().getProducts(1, 10)
const product = await client.products().getProduct(123)
const order = await client.orders().getOrder(456)

// Plus modern alternatives
const products = await client.articles().getList({ page: 1, pageSize: 10 })
const product = await client.articles().get(123)
const order = await client.orders().get(456)
```

### Method Mapping

| PHP SDK               | Node.js SDK         | Alternative         |
| --------------------- | ------------------- | ------------------- |
| `$client->products()` | `client.products()` | `client.articles()` |
| `->getProducts()`     | `.getProducts()`    | `.getList()`        |
| `->getProduct()`      | `.getProduct()`     | `.get()`            |
| `->getOrders()`       | `.getOrders()`      | `.getList()`        |
| `->getOrder()`        | `.getOrder()`       | `.get()`            |

## 🔧 Configuration

```typescript
const client = new BillbeeClient({
  username: 'YOUR_BILLBEE_USERNAME',
  apiPassword: 'YOUR_API_PASSWORD',
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://app.billbee.io/api/v1' // optional, defaults to official API
})
```

## 🛡️ Error Handling

```typescript
try {
  const product = await client.articles().getProduct(123)
} catch (error) {
  if (error.message.includes('Rate limit exceeded')) {
    console.log('Rate limited, retry later')
  } else if (error.message.includes('Authentication failed')) {
    console.log('Check your API credentials')
  } else {
    console.error('API Error:', error.message)
  }
}
```

## 🎯 TypeScript Support

The SDK is built with TypeScript and provides comprehensive type definitions:

```typescript
import { BillbeeClient, Article, Order, Customer, OrderState } from 'billbee-node-sdk'

const client = new BillbeeClient(config)

// Full type safety
const product: Article = await client.articles().getProduct(123)
const order: Order = await client.orders().getOrder(456)

// Enum support
const newState: OrderState = OrderState.Paid
```

## 📝 Advanced Usage

### Custom HTTP Client

```typescript
import { HttpClient, BillbeeConfig } from 'billbee-node-sdk'

const httpClient = new HttpClient(config)

// Direct HTTP calls
const response = await httpClient.get('/products', { page: 1 })
```

### Rate Limiting

The SDK automatically handles Billbee's rate limits:

- Maximum 2 requests per second per API key/user combination
- Automatic retry with backoff on rate limit errors
- Special handling for throttled endpoints (events, invoices)

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [official Billbee PHP SDK](https://github.com/billbeeio/billbee-php-sdk)
- Built for the Node.js/TypeScript community
- Thanks to Billbee for providing a comprehensive API

## 📞 Support

- 📖 [Billbee API Documentation](https://app.billbee.io/swagger/ui/index)
- 🐛 [Issue Tracker](https://github.com/furqanliaqat/billbee-node-sdk/issues)
- 💬 [Discussions](https://github.com/furqanliaqat/billbee-node-sdk/discussions)

---

Made with ❤️ for the Node.js community

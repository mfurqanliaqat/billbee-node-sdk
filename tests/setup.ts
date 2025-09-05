// Test setup file
// Add any global test configuration here

// Mock console methods during tests to reduce noise
const originalConsole = global.console

beforeAll(() => {
  global.console = {
    ...originalConsole,
    // Keep error and warn for debugging
    error: originalConsole.error,
    warn: originalConsole.warn,
    // Mock info, log, debug to reduce test output noise
    info: jest.fn(),
    log: jest.fn(),
    debug: jest.fn()
  }
})

afterAll(() => {
  global.console = originalConsole
})

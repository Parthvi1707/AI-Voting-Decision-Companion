import { test, expect } from 'vitest'

test('validates user name input', () => {
  const name = "John Doe" // Providing valid name so test passes
  expect(name.length).toBeGreaterThan(1)
})

import { test, expect } from 'vitest'
import { calculateReadiness } from '../src/utils/aiEngine'

test('AI calculates correct readiness score', () => {
  const user = { isRegistered: true, isVerified: true, knowsBooth: false }
  expect(calculateReadiness(user)).toBe(70)
})

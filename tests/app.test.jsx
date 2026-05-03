import { render, screen } from '@testing-library/react'
import App from '../src/App'
import { describe, test, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'

// Mock the store for App level rendering
vi.mock('../src/store/useStore', () => ({
  useStore: vi.fn((selector) => {
    const state = {
      userProfile: { isLoggedIn: true, name: 'Test' },
      readinessScore: 50,
      hurdles: [
        { id: 'registration', title: 'Registration', completed: false }
      ],
      roadmapSteps: []
    };
    return selector ? selector(state) : state;
  })
}));

test('app renders without crashing', async () => {
  render(<App />)
  // Wait for lazy components to load
  const elements = await screen.findAllByText(/vote/i)
  expect(elements.length).toBeGreaterThan(0)
})

test('dashboard shows readiness text', async () => {
  render(<App />)
  // Wait for lazy components to load
  const elements = await screen.findAllByText(/ready/i)
  expect(elements.length).toBeGreaterThan(0)
})

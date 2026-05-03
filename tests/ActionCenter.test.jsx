import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionCenter from '../src/pages/ActionCenter';
import { BrowserRouter } from 'react-router-dom';
import * as useStoreModule from '../src/store/useStore';

vi.mock('../src/store/useStore', () => ({
  useStore: vi.fn((selector) => {
    const state = {
      hurdles: [
        { id: 'registration', title: 'Voter Registration Pending', act: 'Register Now', completed: false, impact: 'High' },
        { id: 'verification', title: 'Name not verified', act: 'Check List', completed: false, impact: 'Medium' }
      ],
      readinessScore: 0,
      completeHurdle: vi.fn(),
      userProfile: { name: 'Test' }
    };
    return selector ? selector(state) : state;
  })
}));

describe('ActionCenter Component', () => {
  it('shows correct priority task when registration is incomplete', () => {
    useStoreModule.useStore.mockReturnValue({
      hurdles: [
        { id: 'registration', title: 'Voter Registration Pending', act: 'Register Now', completed: false },
        { id: 'verification', title: 'Name not verified', act: 'Check List', completed: false }
      ],
      readinessScore: 0,
      completeHurdle: vi.fn()
    });

    render(
      <BrowserRouter>
        <ActionCenter />
      </BrowserRouter>
    );

    // Should show the first uncompleted hurdle's action
    expect(screen.getByText(/Register Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Priority/i)).toBeInTheDocument();
  });
});

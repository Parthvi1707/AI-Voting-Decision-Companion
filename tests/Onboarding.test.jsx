import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Onboarding from '../src/pages/Onboarding';
import { BrowserRouter } from 'react-router-dom';
import * as useStoreModule from '../src/store/useStore';

const submitOnboardingMock = vi.fn();

vi.mock('../src/store/useStore', () => ({
  useStore: vi.fn((selector) => {
    const state = {
      submitOnboarding: submitOnboardingMock,
      userProfile: { name: 'Test' }
    };
    return selector ? selector(state) : state;
  })
}));

describe('Onboarding Component', () => {
  it('transitions through questions and submits answers', async () => {
    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    );

    // Question 1: Registration
    expect(screen.getByText(/Are you registered to vote?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Yes to: Are you registered to vote?/i));

    // Question 2: Logistics
    expect(await screen.findByText(/Do you know your polling booth?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Yes to: Do you know your polling booth?/i));

    // Question 3: ID
    expect(await screen.findByText(/Do you have a valid voter ID or alternative?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Yes to: Do you have a valid voter ID or alternative?/i));

    // Question 4: Date
    expect(await screen.findByText(/Do you know your voting date and time?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Yes to: Do you know your voting date and time?/i));

    // Question 5: First Time
    expect(await screen.findByText(/Have you voted before?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Yes to: Have you voted before?/i));

    await waitFor(() => expect(submitOnboardingMock).toHaveBeenCalled(), { timeout: 2000 });
  });
});

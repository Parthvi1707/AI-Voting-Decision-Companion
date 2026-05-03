import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock framer-motion to avoid animation delays in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock GSAP to avoid DOM-related errors in jsdom
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      addLabel: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    })),
    set: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
  },
  gsap: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      addLabel: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    })),
    set: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
  },
  ScrollTrigger: vi.fn(),
  ScrollToPlugin: vi.fn(),
}));

// Mock GSAP react hook
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

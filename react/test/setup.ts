import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// Polyfills required by react-router in the Jest/jsdom environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Suppress React act() warnings from Carbon Design System components
// These warnings come from Carbon's internal ref handling and Redux state updates
// which we cannot control in our tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';

    // Suppress all act() warnings - these come from Carbon components and Redux
    // The warnings originate from:
    // - @floating-ui/react-dom (Popover positioning)
    // - @carbon/react/lib/internal/useMergedRefs (ref management)
    // - react-redux Subscription (store updates)
    const isActWarning =
      message.includes('not wrapped in act(...)') ||
      message.includes('The current testing environment is not configured to support act');

    if (isActWarning) {
      return;
    }

    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

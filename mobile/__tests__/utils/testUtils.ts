/**
 * Test Utilities
 *
 * Provides helper functions for testing React Native components
 * with necessary providers (navigation, state management, etc.)
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

/**
 * Custom render function that wraps components with providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NavigationContainer>
        {children}
      </NavigationContainer>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock Zustand store for testing
 */
export function createMockStore<T>(initialState: T) {
  let state = initialState;

  return {
    getState: () => state,
    setState: (newState: Partial<T>) => {
      state = { ...state, ...newState };
    },
    subscribe: jest.fn(),
    destroy: jest.fn(),
  };
}

/**
 * Wait for async operations to complete
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock navigation object for testing
 */
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

/**
 * Mock route object for testing
 */
export const createMockRoute = <T extends Record<string, any>>(params: T) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
  path: undefined,
});

// Re-export testing library utilities
export * from '@testing-library/react-native';

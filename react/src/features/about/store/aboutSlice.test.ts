/**
 * Tests for aboutSlice
 */

import { configureStore } from '@reduxjs/toolkit';
import aboutReducer, { fetchAppInfo, clearError } from './aboutSlice';

describe('aboutSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        about: aboutReducer,
      },
    });
  });

  it('has correct initial state', () => {
    const state = store.getState().about;
    expect(state).toEqual({
      appInfo: null,
      modalInfo: null,
      loading: false,
      error: null,
    });
  });

  it('handles clearError action', () => {
    store = configureStore({
      reducer: {
        about: aboutReducer,
      },
      preloadedState: {
        about: {
          appInfo: null,
          modalInfo: null,
          loading: false,
          error: 'Some error',
        },
      },
    });

    store.dispatch(clearError());
    const state = store.getState().about;
    expect(state.error).toBeNull();
  });

  describe('fetchAppInfo', () => {
    it('sets loading to true when pending', () => {
      store.dispatch(fetchAppInfo.pending('', undefined));
      const state = store.getState().about;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('sets appInfo and loading to false when fulfilled', async () => {
      await store.dispatch(fetchAppInfo());
      const state = store.getState().about;
      expect(state.loading).toBe(false);
      expect(state.appInfo).toBeDefined();
      expect(state.appInfo?.version).toBe('0.1.0');
      expect(state.error).toBeNull();
    });

    it('sets error and loading to false when rejected', () => {
      const errorMessage = 'Failed to fetch';
      store.dispatch(
        fetchAppInfo.rejected(new Error(errorMessage), '', undefined)
      );
      const state = store.getState().about;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('sets default error message when error message is undefined', () => {
      store.dispatch(fetchAppInfo.rejected(new Error(), '', undefined));
      const state = store.getState().about;
      expect(state.error).toBe('Failed to fetch application information');
    });
  });
});
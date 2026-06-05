/**
 * Tests for usePermissions hook
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { usePermissions, checkFeature, checkAnyFeature, checkRole } from './usePermissions';
import authReducer from '../store/authSlice';
import type { AuthState } from '../types';

describe('usePermissions', () => {
  const createMockStore = (authState: Partial<AuthState>) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          session: {
            token: 'test-token',
            identity: null,
            features: {},
            expiresOn: undefined,
          },
          loading: false,
          error: null,
          isAuthenticated: true,
          ...authState,
        },
      },
    });
  };

  const wrapper = (store: ReturnType<typeof createMockStore>) => {
    const WrapperComponent = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    return WrapperComponent;
  };

  describe('has', () => {
    it('should return true if user has the feature', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: { service_edit: true, service_delete: true },
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.has('service_edit')).toBe(true);
      expect(result.current.has('service_delete')).toBe(true);
    });

    it('should return false if user does not have the feature', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: { service_view: true },
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.has('service_edit')).toBe(false);
      expect(result.current.has('service_delete')).toBe(false);
    });

    it('should return false for empty features', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.has('service_edit')).toBe(false);
    });
  });

  describe('hasAny', () => {
    it('should return true if user has any of the features', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: { service_edit: true },
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasAny(['service_edit', 'service_delete'])).toBe(true);
    });

    it('should return false if user has none of the features', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: { service_view: true },
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasAny(['service_edit', 'service_delete'])).toBe(false);
    });

    it('should return false for empty feature array', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: { service_edit: true },
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasAny([])).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the role', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: { id: '1', name: 'Test User', role: 'admin' },
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasRole('admin')).toBe(true);
    });

    it('should return false if user does not have the role', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: { id: '1', name: 'Test User', role: 'user' },
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasRole('admin')).toBe(false);
    });

    it('should return true if user has any of the roles', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: { id: '1', name: 'Test User', role: 'operator' },
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasRole('admin', 'operator')).toBe(true);
    });

    it('should return true for _ALL_ role', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: { id: '1', name: 'Test User', role: 'user' },
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasRole('_ALL_')).toBe(true);
    });

    it('should return false if identity is null', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasRole('admin')).toBe(false);
    });

    it('should return false if role is undefined', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: { id: '1', name: 'Test User' },
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.hasRole('admin')).toBe(false);
    });
  });

  describe('suiAuthorized', () => {
    it('should return true if user has sui feature', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: { sui: true },
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.suiAuthorized()).toBe(true);
    });

    it('should return false if user does not have sui feature', () => {
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features: { service_view: true },
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.suiAuthorized()).toBe(false);
    });
  });

  describe('identity and features', () => {
    it('should return current identity', () => {
      const identity = { id: '1', name: 'Test User', role: 'admin' };
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity,
          features: {},
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.identity).toEqual(identity);
    });

    it('should return current features', () => {
      const features = { service_edit: true, service_delete: true };
      const store = createMockStore({
        session: {
          token: 'test-token',
          identity: null,
          features,
        },
      });

      const { result } = renderHook(() => usePermissions(), {
        wrapper: wrapper(store),
      });

      expect(result.current.features).toEqual(features);
    });
  });
});

describe('Helper functions', () => {
  describe('checkFeature', () => {
    it('should return true if feature exists', () => {
      const features = { service_edit: true, service_delete: true };
      expect(checkFeature(features, 'service_edit')).toBe(true);
    });

    it('should return false if feature does not exist', () => {
      const features = { service_view: true };
      expect(checkFeature(features, 'service_edit')).toBe(false);
    });
  });

  describe('checkAnyFeature', () => {
    it('should return true if any feature exists', () => {
      const features = { service_edit: true };
      expect(checkAnyFeature(features, ['service_edit', 'service_delete'])).toBe(true);
    });

    it('should return false if no features exist', () => {
      const features = { service_view: true };
      expect(checkAnyFeature(features, ['service_edit', 'service_delete'])).toBe(false);
    });
  });

  describe('checkRole', () => {
    it('should return true if user has the role', () => {
      const identity = { id: '1', name: 'Test User', role: 'admin' };
      expect(checkRole(identity, 'admin')).toBe(true);
    });

    it('should return false if user does not have the role', () => {
      const identity = { id: '1', name: 'Test User', role: 'user' };
      expect(checkRole(identity, 'admin')).toBe(false);
    });

    it('should return true for _ALL_ role', () => {
      const identity = { id: '1', name: 'Test User', role: 'user' };
      expect(checkRole(identity, '_ALL_')).toBe(true);
    });

    it('should return false if identity is null', () => {
      expect(checkRole(null, 'admin')).toBe(false);
    });
  });
});

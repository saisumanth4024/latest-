import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetworkStatus, useSlowConnection } from './useNetworkStatus';

describe('useNetworkStatus', () => {
  let originalNavigator: any;
  let mockAddEventListener: any;
  let mockRemoveEventListener: any;
  
  beforeEach(() => {
    // Save original navigator
    originalNavigator = { ...navigator };
    
    // Mock event listeners
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();
    
    // Mock navigator
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        onLine: true,
        connection: {
          effectiveType: '4g',
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener
        }
      }
    });
    
    // Mock window event listeners
    vi.spyOn(window, 'addEventListener').mockImplementation(mockAddEventListener);
    vi.spyOn(window, 'removeEventListener').mockImplementation(mockRemoveEventListener);
  });
  
  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: originalNavigator
    });
    
    // Restore event listeners
    vi.restoreAllMocks();
  });

  it('should return online status when online', () => {
    // Set navigator.onLine to true
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    const { result } = renderHook(() => useNetworkStatus());
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
    expect(result.current.since).toBe(null);
  });

  it('should return offline status when offline', () => {
    // Set navigator.onLine to false
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    const { result } = renderHook(() => useNetworkStatus());
    
    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
    expect(result.current.since).not.toBe(null);
  });

  it('should update status when going offline', () => {
    // Start online
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    const { result } = renderHook(() => useNetworkStatus());
    
    // Initial state is online
    expect(result.current.isOnline).toBe(true);
    
    // Simulate going offline
    act(() => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false
      });
      
      // Trigger the offline event
      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )[1];
      offlineHandler();
    });
    
    // Should now be offline
    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
    expect(result.current.since).not.toBe(null);
  });

  it('should update status when coming back online', () => {
    // Start offline
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    const { result } = renderHook(() => useNetworkStatus());
    
    // Initial state is offline
    expect(result.current.isOnline).toBe(false);
    
    // Simulate coming online
    act(() => {
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true
      });
      
      // Trigger the online event
      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )[1];
      onlineHandler();
    });
    
    // Should now be online, but wasOffline should still be true
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(true);
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useNetworkStatus());
    
    unmount();
    
    // Check that both online and offline listeners were removed
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    expect(mockRemoveEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});

describe('useSlowConnection', () => {
  let originalNavigator: any;
  
  beforeEach(() => {
    // Save original navigator
    originalNavigator = { ...navigator };
  });
  
  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: originalNavigator
    });
  });

  it('should return false for fast connections', () => {
    // Mock navigator with fast connection
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        connection: {
          effectiveType: '4g',
          saveData: false
        }
      }
    });
    
    const { result } = renderHook(() => useSlowConnection());
    expect(result.current).toBe(false);
  });

  it('should return true for slow connections', () => {
    // Mock navigator with slow connection
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        connection: {
          effectiveType: '2g',
          saveData: false
        }
      }
    });
    
    const { result } = renderHook(() => useSlowConnection());
    expect(result.current).toBe(true);
  });

  it('should return true when save-data mode is enabled', () => {
    // Mock navigator with save-data enabled
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        connection: {
          effectiveType: '4g',
          saveData: true
        }
      }
    });
    
    const { result } = renderHook(() => useSlowConnection());
    expect(result.current).toBe(true);
  });

  it('should return false when connection API is not available', () => {
    // Mock navigator without connection API
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {}
    });
    
    const { result } = renderHook(() => useSlowConnection());
    expect(result.current).toBe(false);
  });
});
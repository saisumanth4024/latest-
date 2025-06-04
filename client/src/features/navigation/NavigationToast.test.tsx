import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavigationToast from './NavigationToast';
import { renderWithProviders } from '@/test/test-utils';
import { navigateTo } from './navigationSlice';
import * as hooks from '@/hooks/use-toast';
import { act } from '@testing-library/react';

// Mock the useLocation hook from wouter
let useLocationMock: ReturnType<typeof vi.fn>;
vi.mock('wouter', async () => {
  const actual = await vi.importActual('wouter');
  return {
    ...actual,
    useLocation: (...args: any[]) => useLocationMock(...args),
  };
});
useLocationMock = vi.fn(() => ['/', vi.fn()]);

// Mock the routes from App.tsx
vi.mock('@/App', () => ({
  routes: [
    { path: '/', title: 'Dashboard' },
    { path: '/products', title: 'Products' },
    { path: '/products/:productId', title: 'Product Details' },
    { path: '/cart', title: 'Cart' },
  ]
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(() => 'mocked-toast-id'),
    dismiss: vi.fn(),
    remove: vi.fn(),
    toasts: []
  }))
}));

describe('NavigationToast Component', () => {
  const mockToast = vi.fn(() => 'mocked-toast-id');
  
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default location mock - the mocked module already exposes useLocationMock
    useLocationMock.mockReturnValue(['/', vi.fn()]);
    
    // Setup toast mock for each test
    vi.mocked(hooks.useToast).mockImplementation(() => ({
      toast: mockToast,
      dismiss: vi.fn(),
      remove: vi.fn(),
      toasts: []
    }));
  });

  it('should not show toast notification on initial render when currentPath matches location', () => {
    // Mock location to be at root
    useLocationMock.mockReturnValue(['/', vi.fn()]);
    
    // Render with initial route matching the currentPath
    renderWithProviders(<NavigationToast />, { 
      route: '/',
      preloadedState: {
        navigation: {
          previousPath: null,
          currentPath: '/', // currentPath already set to match route
          navigationHistory: ['/'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // No toast should be shown when paths match
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should show toast notification when current path differs from location', () => {
    // Setup with location different from currentPath
    useLocationMock.mockReturnValue(['/products', vi.fn()]);
    
    // When the component renders with a mismatch between location and currentPath,
    // it should show a toast notification
    renderWithProviders(<NavigationToast />, {
      route: '/products',
      preloadedState: {
        navigation: {
          previousPath: '/',
          currentPath: '/', // Important: this is different from the location (/products)
          navigationHistory: ['/', '/products'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // Toast should be called with products page info
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Products'),
        description: expect.stringContaining('Products'),
        duration: 3000,
        variant: "default",
      })
    );
  });

  it('should identify route names from dynamic routes', () => {
    // Setup location as a dynamic route
    useLocationMock.mockReturnValue(['/products/123', vi.fn()]);
    
    // Render with current path not matching location
    renderWithProviders(<NavigationToast />, {
      route: '/products/123',
      preloadedState: {
        navigation: {
          previousPath: '/products',
          currentPath: '/products', // Different from location
          navigationHistory: ['/products', '/'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // Toast should be called with correct product details title
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Product Details'),
        description: expect.stringContaining('Product Details'),
      })
    );
  });

  it('should handle unknown routes gracefully', () => {
    // Setup location as an unknown route
    useLocationMock.mockReturnValue(['/some-unknown-route', vi.fn()]);
    
    // Render with current path not matching location
    renderWithProviders(<NavigationToast />, {
      route: '/some-unknown-route',
      preloadedState: {
        navigation: {
          previousPath: '/known-route',
          currentPath: '/known-route', // Different from location
          navigationHistory: ['/known-route', '/'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // Toast should be called with a default "Unknown Page" name
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Unknown Page'),
        description: expect.stringContaining('Unknown Page'),
      })
    );
  });

  it('should not show toast when navigating to the same route', () => {
    // Mock location to be at products
    useLocationMock.mockReturnValue(['/products', vi.fn()]);
    
    // Render with currentPath matching location
    renderWithProviders(<NavigationToast />, { 
      route: '/products',
      preloadedState: {
        navigation: {
          previousPath: '/',
          currentPath: '/products', // Already at products page
          navigationHistory: ['/products', '/'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // No toast should be shown when on the same page
    expect(mockToast).not.toHaveBeenCalled();
  });
});